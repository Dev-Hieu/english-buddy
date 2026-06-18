import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { WordCard } from "@/components/vocabulary/WordCard";

interface LessonPageProps {
  topicId?: string;
  onBackHome: () => void;
}

export function LessonPage({ topicId = "topic_food", onBackHome }: LessonPageProps) {
  const topic = SEED_TOPICS.find((item) => item.id === topicId);
  const words = useMemo(
    () => SEED_VOCABULARY.filter((word) => word.topicIds.includes(topicId)),
    [topicId],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedIds, setStudiedIds] = useState<Set<string>>(() => new Set());

  const currentWord = words[currentIndex];
  const studiedCount = studiedIds.size;
  const progress = words.length === 0 ? 0 : Math.round((studiedCount / words.length) * 100);

  const markCurrentStudied = () => {
    if (!currentWord) return;
    setStudiedIds((previous) => new Set(previous).add(currentWord.id));
  };

  const goNext = () => {
    markCurrentStudied();
    setCurrentIndex((index) => Math.min(index + 1, words.length - 1));
  };

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  if (!topic || !currentWord) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-8">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl font-black">Chưa có bài học</h1>
            <p className="text-muted-foreground">Chủ đề này chưa có từ vựng trong seed data.</p>
            <Button type="button" onClick={onBackHome}>Về trang chủ</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-white/85 p-5 shadow-soft backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Button>
          <div>
            <p className="text-sm font-semibold text-primary">Lesson</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              {topic.name}: {topic.name_vi}
            </h1>
          </div>
        </div>

        <div className="min-w-56 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold">Tiến độ</span>
            <span className="text-2xl font-black">{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/80">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-medium">
            {studiedCount}/{words.length} từ đã xem
          </p>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-white/75 px-4 py-3 text-sm font-semibold shadow-soft">
            <span>
              Từ {currentIndex + 1} / {words.length}
            </span>
            <span className="text-muted-foreground">Nghe, đọc ví dụ, rồi đánh dấu khi con nhớ.</span>
          </div>

          <WordCard
            word={currentWord}
            studied={studiedIds.has(currentWord.id)}
            onReview={markCurrentStudied}
            onKnow={goNext}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
              <ArrowLeft className="h-4 w-4" />
              Từ trước
            </Button>
            <Button
              type="button"
              onClick={currentIndex === words.length - 1 ? markCurrentStudied : goNext}
            >
              {currentIndex === words.length - 1 ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Hoàn thành bài Food
                </>
              ) : (
                <>
                  Từ tiếp theo
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2 font-black">
              <BookOpen className="h-5 w-5 text-primary" />
              Food words
            </div>
            <div className="space-y-2">
              {words.map((word, index) => {
                const active = index === currentIndex;
                const studied = studiedIds.has(word.id);
                return (
                  <button
                    key={word.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors",
                      active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary",
                    )}
                  >
                    <span className="capitalize">{word.word}</span>
                    {studied ? <CheckCircle2 className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
