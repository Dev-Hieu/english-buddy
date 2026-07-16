import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, StudentVocabularyProgress, VocabularyWord } from "@/types";
import { getRelearn } from "@/services/skillTestService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface ReviewPageProps {
  student: Student;
  onBackHome: () => void;
}

type Tab = "review" | "weak";

interface WeakEntry {
  vocab: VocabularyWord;
  progress: StudentVocabularyProgress;
}

export function ReviewPage({ student, onBackHome }: ReviewPageProps) {
  const [tab, setTab] = useState<Tab>("review");
  const [words, setWords] = useState<VocabularyWord[] | null>(null);
  const [weakWords, setWeakWords] = useState<WeakEntry[] | null>(null);
  const [mastering, setMastering] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    const byId = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));

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

    return () => { alive = false; };
  }, [student.id]);

  const handleMarkMastered = (wordId: string) => {
    setMastering((prev) => new Set(prev).add(wordId));
    recordAnswer(student.id, wordId, true).catch(() => {});
    setTimeout(() => {
      setWeakWords((prev) => prev ? prev.filter((w) => w.progress.wordId !== wordId) : prev);
    }, 400);
  };

  if (words === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  const hasWeak = weakWords && weakWords.length > 0;

  // No weak words — just show DeckRunner directly
  if (!hasWeak && tab === "review") {
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
    </div>
  );

  if (tab === "review") {
    return (
      <>
        {tabBar}
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

  // Tab: weak words list
  return (
    <>
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
