import { useEffect, useMemo, useState } from "react";
import { SEED_TOPICS, TOPIC_TO_CATEGORY } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";
import { topicWords } from "@/utils/levelFilter";
import { getWordBank, type BankWord } from "@/services/wordBankService";

interface FlashcardPageProps {
  student: Student;
  topicId: string;
  level?: string;
  onBackHome: () => void;
}

export function FlashcardPage({ student, topicId, level = "all", onBackHome }: FlashcardPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const categoryId = topicId.startsWith("topic_") ? TOPIC_TO_CATEGORY[topicId] : topicId;

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    const lvl = level === "all" ? undefined : level;
    getWordBank(lvl, categoryId).then(setBankWords).catch(() => {});
  }, [categoryId, level]);

  const words = useMemo((): VocabularyWord[] => {
    if (bankWords.length > 0) {
      return bankWords.map((bw) => ({
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
      }));
    }
    return topicWords(SEED_VOCABULARY, topicId, level);
  }, [bankWords, topicId, level]);

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
