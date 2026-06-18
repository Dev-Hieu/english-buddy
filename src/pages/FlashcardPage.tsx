import { useMemo } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";

interface FlashcardPageProps {
  student: Student;
  topicId: string;
  level?: string;
  onBackHome: () => void;
}

export function FlashcardPage({ student, topicId, level = "all", onBackHome }: FlashcardPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const words = useMemo(
    () => SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && (level === "all" || w.level === level)),
    [topicId, level],
  );

  return (
    <DeckRunner
      title={`Flashcard · ${topic?.name ?? "Chủ đề"}`}
      studentId={student.id}
      words={words}
      onBack={onBackHome}
      emptyText="Chủ đề này chưa có từ."
    />
  );
}
