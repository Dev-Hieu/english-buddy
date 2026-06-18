import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { ProgressBar } from "@/components/ui/progress";
import { topicEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";

interface TopicListPageProps {
  student: Student;
  studiedWordIds: string[]; // từ DB trung tâm (đã học = mastery>0)
  onBackHome: () => void;
  onStartTopic: (topicId: string, level: Level | "all") => void;
}

export function TopicListPage({ student, studiedWordIds, onStartTopic }: TopicListPageProps) {
  const learned = new Set(studiedWordIds);
  const [level, setLevel] = useState<Level | "all">((student.level as Level) ?? "all");
  // Lọc theo từ Ở CẤP đó (không theo level của chủ đề) -> "Trẻ em" vẫn hiện các chủ đề có từ kids.
  const wordsOf = (topicId: string) =>
    SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && (level === "all" || w.level === level));
  const topics = SEED_TOPICS.filter((t) => wordsOf(t.id).length > 0);

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

      <section className="space-y-3">
        {topics.map((topic) => {
          const words = wordsOf(topic.id);
          const studied = words.filter((w) => learned.has(w.id)).length;
          const pct = words.length === 0 ? 0 : Math.round((studied / words.length) * 100);
          const complete = pct >= 100 && words.length > 0;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onStartTopic(topic.id, level)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
                {topicEmoji(topic.id)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-lg font-extrabold">{topic.name}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-extrabold uppercase text-muted-foreground">{topic.level}</span>
                  {complete ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : null}
                </span>
                <span className="block text-sm font-semibold text-muted-foreground">{topic.name_vi}</span>
                <ProgressBar value={pct} className="mt-2 h-2" />
              </span>
              <span className="shrink-0 text-sm font-extrabold text-muted-foreground">{studied}/{words.length}</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
