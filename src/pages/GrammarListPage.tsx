import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { GRAMMAR_TOPICS } from "@/data/grammar";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student, type GrammarTopic } from "@/types";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";
import { getGrammarBank } from "@/services/grammarBankService";

interface GrammarListPageProps {
  student: Student;
  initialLevel?: Level | "all";
  onBackHome: () => void;
  onPick: (topicId: string) => void;
}

export function GrammarListPage({ student, initialLevel, onBackHome, onPick }: GrammarListPageProps) {
  const start = initialLevel && initialLevel !== "all" ? initialLevel : (LEVEL_ORDER.includes(student.level as Level) ? (student.level as Level) : "all");
  const [level, setLevel] = useState<Level | "all">(start);
  const [bankTopics, setBankTopics] = useState<GrammarTopic[]>([]);

  useEffect(() => {
    const lvl = level === "all" ? undefined : level;
    getGrammarBank(lvl)
      .then((data) => {
        const mapped: GrammarTopic[] = data.map((b) => ({
          id: b.id,
          level: b.level as Level,
          title: b.title,
          title_vi: b.title_vi,
          summary_vi: b.description_vi,
          points: b.rules.map((r) => `${r.rule} — ${r.example_en} (${r.example_vi})`),
          exercises: b.exercises,
        }));
        setBankTopics(mapped);
      })
      .catch(() => {
        // fallback to GRAMMAR_TOPICS — do nothing
      });
  }, [level]);

  const topicSource = bankTopics.length > 0 ? bankTopics : GRAMMAR_TOPICS;
  const topics = topicSource.filter((t) => level === "all" || t.level === level);

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-6 pb-6">
      <SessionHeader title="Ngữ pháp" onClose={onBackHome} icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-rose-500" />

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
