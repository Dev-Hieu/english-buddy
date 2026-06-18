import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LessonProgress = Record<string, string[]>;

interface TopicListPageProps {
  student: Student;
  lessonProgress: LessonProgress;
  onBackHome: () => void;
  onStartTopic: (topicId: string) => void;
}

function progressKey(studentId: string, topicId: string) {
  return `${studentId}:${topicId}`;
}

export function TopicListPage({ student, lessonProgress, onBackHome, onStartTopic }: TopicListPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-white/85 p-5 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Button>
          <div>
            <p className="text-sm font-semibold text-primary">{student.name}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Chọn chủ đề học</h1>
          </div>
        </div>
        <div className="rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
          <p className="text-sm font-bold">Mục tiêu mỗi ngày</p>
          <p className="text-2xl font-black">{student.dailyGoal} từ</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SEED_TOPICS.map((topic) => {
          const words = SEED_VOCABULARY.filter((word) => word.topicIds.includes(topic.id));
          const studied = lessonProgress[progressKey(student.id, topic.id)]?.length ?? 0;
          const progress = words.length === 0 ? 0 : Math.round((studied / words.length) * 100);
          const complete = progress >= 100;
          const enabled = topic.id === "topic_food";

          return (
            <Card key={topic.id} className={enabled ? "" : "opacity-75"}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">#{topic.order}</p>
                    <h2 className="mt-1 text-2xl font-black">{topic.name}</h2>
                    <p className="text-muted-foreground">{topic.name_vi}</p>
                  </div>
                  {complete ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <BookOpen className="h-6 w-6 text-muted-foreground" />}
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{studied}/{words.length} từ</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <Button
                  type="button"
                  variant={enabled ? "default" : "outline"}
                  className="w-full"
                  disabled={!enabled}
                  onClick={() => onStartTopic(topic.id)}
                >
                  {enabled ? "Học chủ đề này" : "Sắp mở"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
