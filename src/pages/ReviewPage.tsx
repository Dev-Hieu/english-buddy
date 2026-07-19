import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, StudentVocabularyProgress, VocabularyWord } from "@/types";
import { getRelearn } from "@/services/skillTestService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";
import { apiRequest } from "@/services/api";
import { getWordBank, type BankWord } from "@/services/wordBankService";

interface ReviewPageProps {
  student: Student;
  onBackHome: () => void;
}

type Tab = "review" | "weak" | "smart";

interface WeakEntry {
  vocab: VocabularyWord;
  progress: StudentVocabularyProgress;
}

interface WordProgressSummary {
  total: number;
  mastered: number;
  learning: number;
  dueReview: number;
  avgMastery: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

interface DueWordProgress {
  wordId: string;
  skill: string;
  mastery: number;
  nextReview: string;
}

export function ReviewPage({ student, onBackHome }: ReviewPageProps) {
  const [tab, setTab] = useState<Tab>("review");
  const [words, setWords] = useState<VocabularyWord[] | null>(null);
  const [weakWords, setWeakWords] = useState<WeakEntry[] | null>(null);
  const [mastering, setMastering] = useState<Set<string>>(new Set());

  // Smart review state
  const [summary, setSummary] = useState<WordProgressSummary | null>(null);
  const [smartDue, setSmartDue] = useState<VocabularyWord[] | null>(null);
  const [smartIndex, setSmartIndex] = useState(0);
  const [smartDone, setSmartDone] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    getWordBank().then(setBankWords).catch(() => {});
  }, []);

  const vocabById = useMemo(() => {
    if (bankWords.length > 0) {
      return new Map(
        bankWords.map((bw) => [
          bw.id,
          {
            id: bw.id,
            word: bw.word,
            phonetic: bw.phonetic || "",
            meaning_vi: bw.meaning_vi,
            meaning_en: bw.meaning_en || "",
            topicIds: bw.categories,
            level: bw.level as VocabularyWord["level"],
            imageUrl: bw.image || "",
            source: "seed" as const,
            createdAt: 0,
          } satisfies VocabularyWord,
        ])
      );
    }
    return new Map(SEED_VOCABULARY.map((w) => [w.id, w]));
  }, [bankWords]);

  useEffect(() => {
    let alive = true;
    const byId = vocabById;

    getRelearn(student.id)
      .then(({ words: ids }) => {
        const due = ids.map((id) => byId.get(id)).filter((w): w is VocabularyWord => !!w);
        if (alive) setWords(due);
      })
      .catch(() => alive && setWords([]));

    getStudentProgress(student.id)
      .then((progress) => {
        if (!alive) return;
        const weak = progress
          .filter((p) => p.wrongCount > 0 || p.mastery < 3)
          .filter((p) => p.status !== "new")
          .sort((a, b) => b.wrongCount - a.wrongCount || a.mastery - b.mastery)
          .map((p) => ({ progress: p, vocab: byId.get(p.wordId)! }))
          .filter((w) => w.vocab);
        setWeakWords(weak);
      })
      .catch(() => alive && setWeakWords([]));

    // Fetch smart review summary
    apiRequest<WordProgressSummary>(`/api/students/${student.id}/word-progress/summary`)
      .then((s) => { if (alive) setSummary(s); })
      .catch(() => {});

    // Fetch due words for smart review
    apiRequest<DueWordProgress[]>(`/api/students/${student.id}/word-progress?due=true`)
      .then((due) => {
        if (!alive) return;
        const dueVocab = due
          .map((d) => byId.get(d.wordId))
          .filter((w): w is VocabularyWord => !!w);
        setSmartDue(dueVocab);
      })
      .catch(() => alive && setSmartDue([]));

    return () => { alive = false; };
  }, [student.id, vocabById]);

  const handleMarkMastered = (wordId: string) => {
    setMastering((prev) => new Set(prev).add(wordId));
    recordAnswer(student.id, wordId, true).catch(() => {});
    setTimeout(() => {
      setWeakWords((prev) => prev ? prev.filter((w) => w.progress.wordId !== wordId) : prev);
    }, 400);
  };

  const handleSmartAnswer = async (correct: boolean) => {
    if (!smartDue || smartIndex >= smartDue.length) return;
    const word = smartDue[smartIndex];
    setSmartLoading(true);
    try {
      await apiRequest(`/api/students/${student.id}/word-progress`, {
        method: "POST",
        body: { wordId: word.id, skill: "reading", correct, sourceType: "review" },
      });
    } catch {
      // best-effort
    }
    setSmartLoading(false);
    setSmartDone((prev) => prev + 1);
    setSmartIndex((prev) => prev + 1);
    setShowAnswer(false);
  };

  if (words === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  const hasWeak = weakWords && weakWords.length > 0;
  const smartDueCount = smartDue?.length ?? 0;

  // No weak words and smart has no due — just show DeckRunner directly (preserve original behavior)
  if (!hasWeak && tab === "review" && smartDueCount === 0 && summary === null) {
    return (
      <DeckRunner
        title="Cần ôn"
        studentId={student.id}
        words={words}
        onBack={onBackHome}
        emptyText="Tuyệt vời! Không có từ nào cần ôn. Học thêm từ mới nhé."
      />
    );
  }

  // Mastery dashboard
  const masteryDashboard = summary && (
    <div className="mx-auto w-full max-w-xl px-4 pt-3 pb-1">
      <div className="rounded-2xl bg-card border border-border/40 px-4 py-3 shadow-sm">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wide mb-2">Tiến độ học</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Từ đã học:</span>
          <span className="font-bold">{summary.total}</span>
          <span className="text-muted-foreground">Thành thạo:</span>
          <span className="font-bold text-emerald-600">{summary.mastered}</span>
          <span className="text-muted-foreground">Đang học:</span>
          <span className="font-bold text-amber-500">{summary.learning}</span>
          <span className="text-muted-foreground">Cần ôn hôm nay:</span>
          <span className="font-bold text-red-500">{summary.dueReview}</span>
        </div>
        {summary.avgMastery && (
          <div className="mt-2 pt-2 border-t border-border/30 flex gap-3 flex-wrap text-[10px]">
            <span><span className="text-muted-foreground">Nghe: </span><span className="font-bold">{Math.round(summary.avgMastery.listening * 100)}%</span></span>
            <span><span className="text-muted-foreground">Nói: </span><span className="font-bold">{Math.round(summary.avgMastery.speaking * 100)}%</span></span>
            <span><span className="text-muted-foreground">Đọc: </span><span className="font-bold">{Math.round(summary.avgMastery.reading * 100)}%</span></span>
            <span><span className="text-muted-foreground">Viết: </span><span className="font-bold">{Math.round(summary.avgMastery.writing * 100)}%</span></span>
          </div>
        )}
      </div>
    </div>
  );

  const tabBar = (
    <div className="mx-auto w-full max-w-xl flex border-b border-border/40 bg-background/85 backdrop-blur sticky top-0 z-40">
      <button type="button" onClick={() => setTab("review")}
        className={cn("flex-1 py-3 text-xs font-black text-center transition-colors", tab === "review" ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>
        Cần ôn ({words.length})
      </button>
      <button type="button" onClick={() => setTab("weak")}
        className={cn("flex-1 py-3 text-xs font-black text-center transition-colors", tab === "weak" ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>
        Từ yếu ({weakWords?.length ?? 0})
      </button>
      <button type="button" onClick={() => setTab("smart")}
        className={cn("flex-1 py-3 text-xs font-black text-center transition-colors", tab === "smart" ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>
        Smart ({smartDueCount})
      </button>
    </div>
  );

  if (tab === "review") {
    return (
      <>
        {masteryDashboard}
        {hasWeak && tabBar}
        <DeckRunner
          title="Cần ôn"
          studentId={student.id}
          words={words}
          onBack={onBackHome}
          emptyText="Tuyệt vời! Không có từ nào cần ôn. Học thêm từ mới nhé."
        />
      </>
    );
  }

  if (tab === "smart") {
    const currentWord = smartDue && smartIndex < smartDue.length ? smartDue[smartIndex] : null;
    const total = smartDue?.length ?? 0;

    return (
      <>
        {masteryDashboard}
        {tabBar}
        <main className="mx-auto w-full max-w-xl px-4">
          <SessionHeader title="Smart Review" onClose={onBackHome} />

          {smartDue === null ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : total === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Tuyệt vời! Không có từ nào cần ôn hôm nay.</p>
          ) : smartIndex >= total ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold">Hoàn thành!</p>
              <p className="text-xs text-muted-foreground mt-1">Đã ôn {smartDone}/{total} từ</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3 text-right">{smartDone}/{total} từ đã ôn</p>
              <div className="rounded-2xl bg-card border border-border/40 shadow-sm px-6 py-8 text-center">
                <p className="text-2xl font-black mb-2">{currentWord!.word}</p>
                {currentWord!.phonetic && (
                  <p className="text-xs text-muted-foreground mb-4">{currentWord!.phonetic}</p>
                )}

                {showAnswer ? (
                  <>
                    <p className="text-base font-bold text-primary mb-1">{currentWord!.meaning_vi}</p>
                    {currentWord!.example && (
                      <p className="text-xs text-muted-foreground italic mt-2">{currentWord!.example}</p>
                    )}
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        disabled={smartLoading}
                        onClick={() => handleSmartAnswer(false)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-600 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" /> Chưa thuộc
                      </button>
                      <button
                        type="button"
                        disabled={smartLoading}
                        onClick={() => handleSmartAnswer(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm font-bold text-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" /> Đã thuộc
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="mt-4 rounded-xl bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all active:scale-95"
                  >
                    Xem nghĩa
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </>
    );
  }

  // Tab: weak words list
  return (
    <>
      {masteryDashboard}
      {tabBar}
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Từ yếu" onClose={onBackHome} />
        <p className="text-xs text-muted-foreground mb-3">Sắp xếp theo số lần sai (nhiều nhất trước)</p>

        {weakWords && weakWords.length > 0 ? (
          <ul className="space-y-2">
            {weakWords.map((w) => {
              const isMastering = mastering.has(w.progress.wordId);
              return (
                <li key={w.progress.wordId}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-card border border-border/40 px-4 py-3 shadow-sm transition-all",
                    isMastering && "opacity-40 scale-95"
                  )}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{w.vocab.word}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{w.vocab.meaning_vi}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.progress.wrongCount > 0 && (
                      <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-100 text-[10px] font-black text-red-600 px-1.5">
                        {w.progress.wrongCount}
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-muted-foreground">M{w.progress.mastery}/5</span>
                    <button
                      type="button"
                      disabled={isMastering}
                      onClick={() => handleMarkMastered(w.progress.wordId)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle className="h-3 w-3" /> Đã thuộc
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">Không có từ yếu nào.</p>
        )}
      </main>
    </>
  );
}
