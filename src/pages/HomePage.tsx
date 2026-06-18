import { BookOpen, Gamepad2, GraduationCap, Search, Sparkles } from "lucide-react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordPreviewCard } from "@/components/vocabulary/WordPreviewCard";

const foodWords = SEED_VOCABULARY.filter((word) => word.topicIds.includes("topic_food"));
const firstLessonWords = foodWords.slice(0, 3);

const actions = [
  { label: "Học từ", icon: BookOpen },
  { label: "Tra từ", icon: Search },
  { label: "Ôn tập", icon: Sparkles },
  { label: "Game", icon: Gamepad2 },
  { label: "Test", icon: GraduationCap },
];

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-white/80 p-5 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">English Buddy</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Hôm nay học Food nhé</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Khung UI đầu tiên cho lát cắt dọc: chọn chủ đề, xem từ mẫu, rồi nối tiếp flashcard,
            game và test.
          </p>
        </div>
        <div className="rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
          <p className="text-sm font-semibold">Mục tiêu hôm nay</p>
          <p className="text-2xl font-black">10 từ</p>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-5">
        {actions.map((action) => (
          <Button key={action.label} type="button" variant="outline" size="lg" className="h-14 bg-white">
            <action.icon className="h-5 w-5 text-primary" />
            {action.label}
          </Button>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-4 sm:grid-cols-3">
          {firstLessonWords.map((word) => (
            <WordPreviewCard key={word.id} word={word} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>10 chủ đề MVP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SEED_TOPICS.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                <span className="font-semibold">{topic.name}</span>
                <span className="text-sm text-muted-foreground">{topic.name_vi}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
