import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/components/ui/cn";
import { getCategories, getWordBank, type Category, type BankWord } from "@/services/wordBankService";

const CATEGORY_EMOJI: Record<string, string> = {
  animals_and_nature: "🐾", clothes_and_accessories: "👔", colours_and_shapes: "🎨",
  communication_and_technology: "📱", daily_life: "☀️", education: "📚",
  entertainment_and_media: "🎬", environment: "🌍", family_and_friends: "👨‍👩‍👧",
  feelings_and_opinions: "😊", food_and_drink: "🍽️", health_and_body: "🏥",
  hobbies_and_leisure: "⚽", house_and_home: "🏠", measurements_and_numbers: "🔢",
  places: "🏛️", services: "🏪", shopping: "🛒",
  society_and_community: "🤝", sport: "🏆", science_and_research: "🔬",
  travel_and_transport: "✈️", weather_and_seasons: "🌤️", work_and_jobs: "💼",
};

const categoryEmoji = (id: string) => CATEGORY_EMOJI[id] ?? "📚";

interface TopicListPageProps {
  student: Student;
  studiedWordIds: string[]; // từ DB trung tâm (đã học = mastery>0)
  onBackHome: () => void;
  onStartTopic: (topicId: string, level: Level | "all") => void;
}

export function TopicListPage({ student, studiedWordIds, onStartTopic }: TopicListPageProps) {
  const learned = new Set(studiedWordIds);
  const [level, setLevel] = useState<Level | "all">(LEVEL_ORDER.includes(student.level as Level) ? (student.level as Level) : "all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [wordsByCat, setWordsByCat] = useState<Record<string, BankWord[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    setLoading(true);
    const lvParam = level === "all" ? undefined : level;
    Promise.all(
      categories.map((cat) =>
        getWordBank(lvParam, cat.id).then((words) => ({ id: cat.id, words }))
      )
    ).then((results) => {
      const map: Record<string, BankWord[]> = {};
      for (const r of results) map[r.id] = r.words;
      setWordsByCat(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [categories, level]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6">
      <header className="mb-4">
        <p className="text-sm font-bold text-primary">{student.name}</p>
        <h1 className="text-3xl font-black tracking-tight">Chọn chủ đề học</h1>
      </header>

      {/* Lọc theo cấp độ: trẻ em -> IELTS */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...LEVEL_ORDER] as const).map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevel(lv)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-extrabold transition-colors",
              level === lv ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {lv === "all" ? "Tất cả" : LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm font-semibold text-muted-foreground">Đang tải chủ đề…</p>
      ) : (
        <section className="space-y-3">
          {categories.filter((cat) => (wordsByCat[cat.id] ?? []).length > 0).map((cat) => {
            const words = wordsByCat[cat.id] ?? [];
            const studied = words.filter((w) => learned.has(w.id)).length;
            const pct = words.length === 0 ? 0 : Math.round((studied / words.length) * 100);
            const complete = pct >= 100 && words.length > 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onStartTopic(cat.id, level)}
                className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
                  {categoryEmoji(cat.id)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-lg font-extrabold">{cat.name}</span>
                    {complete ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : null}
                  </span>
                  <span className="block text-sm font-semibold text-muted-foreground">{cat.name_vi}</span>
                  <ProgressBar value={pct} className="mt-2 h-2" />
                </span>
                <span className="shrink-0 text-sm font-extrabold text-muted-foreground">{studied}/{words.length}</span>
              </button>
            );
          })}
        </section>
      )}
    </main>
  );
}
