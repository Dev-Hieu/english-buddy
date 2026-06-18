import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { WordCard } from "@/components/vocabulary/WordCard";
import { topicEmoji } from "@/components/ui/emoji";

interface LessonPageProps {
  topicId?: string;
  student: Student;
  studiedWordIds: string[];
  onMarkWordStudied: (wordId: string) => void;
  onBackHome: () => void;
  onPracticeFlashcard?: () => void;
  onStartTest?: () => void;
}

export function LessonPage({
  topicId = "topic_food",
  student,
  studiedWordIds,
  onMarkWordStudied,
  onBackHome,
  onPracticeFlashcard,
  onStartTest,
}: LessonPageProps) {
  const topic = SEED_TOPICS.find((item) => item.id === topicId);
  const words = useMemo(() => SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId)), [topicId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const studiedIds = useMemo(() => new Set(studiedWordIds), [studiedWordIds]);

  const currentWord = words[currentIndex];
  const progress = words.length === 0 ? 0 : Math.round((studiedIds.size / words.length) * 100);

  const markCurrentStudied = () => currentWord && onMarkWordStudied(currentWord.id);
  const goNext = () => {
    markCurrentStudied();
    setCurrentIndex((i) => Math.min(i + 1, words.length - 1));
  };
  const goPrevious = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const finishLesson = () => {
    markCurrentStudied();
    onBackHome();
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
        onReview={markCurrentStudied}
        onKnow={isLast ? finishLesson : goNext}
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4" /> Trước
        </Button>
        <Button type="button" onClick={isLast ? finishLesson : goNext}>
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

      <div className="mt-5 flex flex-wrap gap-2">
        {words.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "flex h-9 items-center gap-1 rounded-full px-3 text-sm font-bold transition-colors",
              i === currentIndex ? "bg-primary text-primary-foreground" : studiedIds.has(w.id) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {studiedIds.has(w.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
            {w.word}
          </button>
        ))}
      </div>
    </main>
  );
}
