import { CheckCircle2 } from "lucide-react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { ProgressBar } from "@/components/ui/progress";
import { topicEmoji } from "@/components/ui/emoji";

interface TopicListPageProps {
  student: Student;
  studiedWordIds: string[]; // từ DB trung tâm (đã học = mastery>0)
  onBackHome: () => void;
  onStartTopic: (topicId: string) => void;
}

export function TopicListPage({ student, studiedWordIds, onStartTopic }: TopicListPageProps) {
  const learned = new Set(studiedWordIds);
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6">
      <header className="mb-5">
        <p className="text-sm font-bold text-primary">{student.name}</p>
        <h1 className="text-3xl font-black tracking-tight">Chọn chủ đề học</h1>
      </header>

      <section className="space-y-3">
        {SEED_TOPICS.map((topic) => {
          const words = SEED_VOCABULARY.filter((word) => word.topicIds.includes(topic.id));
          const studied = words.filter((w) => learned.has(w.id)).length;
          const pct = words.length === 0 ? 0 : Math.round((studied / words.length) * 100);
          const complete = pct >= 100;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onStartTopic(topic.id)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
                {topicEmoji(topic.id)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-lg font-extrabold">{topic.name}</span>
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
