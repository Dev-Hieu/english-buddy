import { BarChart3, BookOpen, Gamepad2, GraduationCap, LogOut, Search, Sparkles, UserRound } from "lucide-react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordCard } from "@/components/vocabulary/WordCard";

type Nav = (view: string, topicId?: string) => void;

const foodWords = SEED_VOCABULARY.filter((word) => word.topicIds.includes("topic_food"));
const firstLessonWords = foodWords.slice(0, 3);

interface HomePageProps {
  student: Student;
  onChangeStudent: () => void;
  onLogout: () => void;
  onNavigate: Nav;
}

export function HomePage({ student, onChangeStudent, onLogout, onNavigate }: HomePageProps) {
  const actions: { label: string; icon: typeof BookOpen; go: () => void; primary?: boolean }[] = [
    { label: "Học từ", icon: BookOpen, go: () => onNavigate("topics"), primary: true },
    { label: "Tra từ", icon: Search, go: () => onNavigate("lookup") },
    { label: "Ôn tập", icon: Sparkles, go: () => onNavigate("review") },
    { label: "Game", icon: Gamepad2, go: () => onNavigate("games", "topic_food") },
    { label: "Test", icon: GraduationCap, go: () => onNavigate("test", "topic_food") },
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-white/80 p-5 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">English Buddy · {student.name}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Hôm nay học gì nào?</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Chọn chủ đề để học từ mới, ôn lại từ cũ, chơi game hoặc làm bài test.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
          <div>
            <p className="text-sm font-semibold">Mục tiêu hôm nay</p>
            <p className="text-2xl font-black">{student.dailyGoal} từ</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={onChangeStudent}>
              <UserRound className="h-4 w-4" /> Đổi bé
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Thoát
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-5">
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={action.primary ? "default" : "outline"}
            size="lg"
            className={action.primary ? "h-14" : "h-14 bg-white"}
            onClick={action.go}
          >
            <action.icon className={action.primary ? "h-5 w-5" : "h-5 w-5 text-primary"} />
            {action.label}
          </Button>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-xl font-black">Bắt đầu nhanh</h2>
          <p className="text-muted-foreground">Chọn một chủ đề bên dưới để vào học ngay.</p>
        </div>
        <Button type="button" variant="secondary" size="lg" onClick={() => onNavigate("dashboard")}>
          <BarChart3 className="h-5 w-5" /> Bảng theo dõi (phụ huynh)
        </Button>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-4 sm:grid-cols-3">
          {firstLessonWords.map((word) => (
            <WordCard key={word.id} word={word} compact />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>10 chủ đề</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SEED_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-left transition-colors hover:bg-secondary"
                onClick={() => onNavigate("lesson", topic.id)}
              >
                <span className="font-semibold">{topic.name}</span>
                <span className="text-sm text-muted-foreground">{topic.name_vi}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
