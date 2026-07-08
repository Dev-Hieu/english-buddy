import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GRAMMAR_TOPICS } from "@/data/grammar";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface GrammarListPageProps {
  student: Student;
  onBackHome: () => void;
  onPick: (topicId: string) => void;
}

export function GrammarListPage({ student, onBackHome, onPick }: GrammarListPageProps) {
  const start = LEVEL_ORDER.includes(student.level as Level) ? (student.level as Level) : "all";
  const [level, setLevel] = useState<Level | "all">(start);
  const topics = GRAMMAR_TOPICS.filter((t) => level === "all" || t.level === level);

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-6 pb-6">
      <SessionHeader title="Ngữ pháp" onClose={onBackHome} />

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

      {topics.length === 0 ? (
        <p className="rounded-3xl border border-border/70 bg-card p-8 text-center font-bold text-muted-foreground">
          Chưa có bài ngữ pháp cho cấp này.
        </p>
      ) : (
        <section className="space-y-3">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <BookOpen className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-lg font-extrabold">{t.title_vi}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-extrabold uppercase text-muted-foreground">{t.level}</span>
                </span>
                <span className="block truncate text-sm font-semibold text-muted-foreground">{t.title} · {t.exercises.length} bài tập</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
