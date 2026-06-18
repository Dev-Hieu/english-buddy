import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Layers, List } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { WordCard } from "@/components/vocabulary/WordCard";
import { topicEmoji } from "@/components/ui/emoji";
import { topicWords } from "@/utils/levelFilter";

interface LessonPageProps {
  topicId?: string;
  level?: string;
  student: Student;
  studiedWordIds: string[];
  onAnswerWord: (wordId: string, correct: boolean) => void;
  onBackHome: () => void;
  onPracticeFlashcard?: () => void;
  onStartTest?: () => void;
  onViewWordList?: () => void;
}

export function LessonPage({
  topicId = "topic_food",
  level = "all",
  student,
  studiedWordIds,
  onAnswerWord,
  onBackHome,
  onPracticeFlashcard,
  onStartTest,
  onViewWordList,
}: LessonPageProps) {
  const topic = SEED_TOPICS.find((item) => item.id === topicId);
  const words = useMemo(() => topicWords(SEED_VOCABULARY, topicId, level), [topicId, level]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const studiedIds = useMemo(() => new Set(studiedWordIds), [studiedWordIds]);

  const currentWord = words[currentIndex];
  // chỉ đếm từ ĐÃ học THUỘC chủ đề này (tránh >100%)
  const studiedInTopic = words.filter((w) => studiedIds.has(w.id)).length;
  const progress = words.length === 0 ? 0 : Math.round((studiedInTopic / words.length) * 100);

  const goPrevious = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, words.length - 1));

  // Trả lời 1 từ rồi sang từ tiếp (hoặc về nhà nếu là từ cuối).
  const answer = (correct: boolean) => {
    if (!currentWord) return;
    onAnswerWord(currentWord.id, correct);
    if (currentIndex >= words.length - 1) onBackHome();
    else goNext();
  };

  if (!topic || !currentWord) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Bài học" onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ vựng.</CardContent></Card>
      </main>
    );
  }

  const isLast = currentIndex === words.length - 1;

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={`${topicEmoji(topic.id)} ${topic.name} · ${topic.name_vi}`} onClose={onBackHome} progress={progress} />

      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Từ {currentIndex + 1} / {words.length}</p>

      <WordCard
        word={currentWord}
        studied={studiedIds.has(currentWord.id)}
        onReview={() => answer(false)}
        onKnow={() => answer(true)}
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4" /> Trước
        </Button>
        <Button type="button" variant="outline" onClick={isLast ? onBackHome : goNext}>
          {isLast ? (<><CheckCircle2 className="h-4 w-4" /> Hoàn thành</>) : (<>Tiếp <ArrowRight className="h-4 w-4" /></>)}
        </Button>
      </div>

      {(onPracticeFlashcard || onStartTest) ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {onPracticeFlashcard ? (
            <Button type="button" variant="secondary" onClick={onPracticeFlashcard}>
              <Layers className="h-4 w-4" /> Flashcard
            </Button>
          ) : null}
          {onStartTest ? (
            <Button type="button" variant="secondary" onClick={onStartTest}>
              <GraduationCap className="h-4 w-4" /> Làm test
            </Button>
          ) : null}
        </div>
      ) : null}

      {onViewWordList ? (
        <Button type="button" variant="ghost" className="mt-3 w-full" onClick={onViewWordList}>
          <List className="h-4 w-4" /> Xem danh sách từ chủ đề
        </Button>
      ) : null}
    </main>
  );
}
