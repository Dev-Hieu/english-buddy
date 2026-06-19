import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { getRelearn } from "@/services/skillTestService";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";

interface ReviewPageProps {
  student: Student;
  onBackHome: () => void;
}

export function ReviewPage({ student, onBackHome }: ReviewPageProps) {
  const [words, setWords] = useState<VocabularyWord[] | null>(null);

  useEffect(() => {
    let alive = true;
    getRelearn(student.id)
      .then(({ words: ids }) => {
        const byId = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));
        const due = ids.map((id) => byId.get(id)).filter((w): w is VocabularyWord => !!w);
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
      title="Cần ôn"
      studentId={student.id}
      words={words}
      onBack={onBackHome}
      emptyText="Tuyệt vời! Không có từ nào cần ôn. Học thêm từ mới nhé."
    />
  );
}
