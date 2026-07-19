import { AlertTriangle, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getStudentProgress } from "@/services/progressService";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { StudentVocabularyProgress, VocabularyWord } from "@/types";
import { getWordBank, type BankWord } from "@/services/wordBankService";

interface SmartReviewProps {
  studentId: string;
  onNavigate: (view: string) => void;
}

interface WeakWord {
  progress: StudentVocabularyProgress;
  vocab: VocabularyWord;
}

export function SmartReview({ studentId, onNavigate }: SmartReviewProps) {
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const [loading, setLoading] = useState(true);

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    getWordBank().then(setBankWords).catch(() => {});
  }, []);

  const vocabMap = useMemo(() => {
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
    getStudentProgress(studentId)
      .then((progress) => {
        if (!alive) return;
        const weak = progress
          .filter((p) => p.wrongCount > 0 || p.mastery < 3)
          .filter((p) => p.status !== "new")
          .sort((a, b) => b.wrongCount - a.wrongCount || a.mastery - b.mastery)
          .slice(0, 5)
          .map((p) => ({ progress: p, vocab: vocabMap.get(p.wordId)! }))
          .filter((w) => w.vocab);
        setWeakWords(weak);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [studentId, vocabMap]);

  if (loading || weakWords.length === 0) return null;

  return (
    <section className="rounded-[1rem] bg-card border border-border/40 shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h3 className="text-xs font-black flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
          Từ yếu tuần này
        </h3>
        <button
          type="button"
          onClick={() => onNavigate("review")}
          className="text-[10px] font-bold text-primary flex items-center gap-0.5"
        >
          Ôn tất cả <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <ul className="divide-y divide-border/30">
        {weakWords.map((w) => (
          <li key={w.progress.wordId} className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{w.vocab.word}</p>
              <p className="text-[10px] text-muted-foreground truncate">{w.vocab.meaning_vi}</p>
            </div>
            {w.progress.wrongCount > 0 && (
              <span className="shrink-0 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-100 text-[10px] font-black text-red-600 px-1.5">
                {w.progress.wrongCount}
              </span>
            )}
            <button
              type="button"
              onClick={() => onNavigate("review")}
              className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary transition-all active:scale-95"
            >
              Ôn ngay
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
