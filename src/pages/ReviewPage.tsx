import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { getDueReviews } from "@/services/progressService";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";

interface ReviewPageProps {
  student: Student;
  onBackHome: () => void;
}

export function ReviewPage({ student, onBackHome }: ReviewPageProps) {
  const [words, setWords] = useState<VocabularyWord[] | null>(null);

  useEffect(() => {
    let alive = true;
    getDueReviews(student.id, Date.now())
      .then((rows) => {
        const byId = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));
        const due = rows.map((r) => byId.get(r.wordId)).filter((w): w is VocabularyWord => !!w);
        if (alive) setWords(due);
      })
      .catch(() => alive && setWords([]));
    return () => {
      alive = false;
    };
  }, [student.id]);

  if (words === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <DeckRunner
      title="Ôn tập hôm nay"
      studentId={student.id}
      words={words}
      onBack={onBackHome}
      emptyText="Tuyệt vời! Hôm nay không có từ nào cần ôn. Học thêm từ mới nhé."
    />
  );
}
