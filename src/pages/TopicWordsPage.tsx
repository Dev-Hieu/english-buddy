import { BookOpen, CheckCircle2, Volume2 } from "lucide-react";
import { useMemo } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { speakText } from "@/services/speechService";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { topicEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";
import { topicWords } from "@/utils/levelFilter";

interface TopicWordsPageProps {
  topicId: string;
  level?: string;
  studiedWordIds: string[];
  onBack: () => void;
}

// Màn duyệt toàn bộ từ của chủ đề (để ôn lại) — tách khỏi luồng học tuần tự.
export function TopicWordsPage({ topicId, level = "all", studiedWordIds, onBack }: TopicWordsPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const studied = useMemo(() => new Set(studiedWordIds), [studiedWordIds]);
  const words = useMemo(() => topicWords(SEED_VOCABULARY, topicId, level), [topicId, level]);
  const doneCount = words.filter((w) => studied.has(w.id)).length;

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={`${topicEmoji(topicId)} ${topic?.name ?? "Chủ đề"}`} onClose={onBack} icon={<BookOpen className="h-4 w-4" />} iconBg="bg-primary" />
      <p className="mb-4 text-center text-sm font-extrabold text-muted-foreground">
        {words.length} từ · đã học {doneCount}
      </p>

      <ul className="space-y-2">
        {words.map((w) => {
          const done = studied.has(w.id);
          return (
            <li
              key={w.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-card",
                done && "ring-1 ring-primary/40",
              )}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                {w.imageUrl ? (
                  <img src={w.imageUrl} alt={w.meaning_vi} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-secondary-foreground">{w.word.slice(0, 1).toUpperCase()}</span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-lg font-extrabold capitalize">{w.word}</span>
                  {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : null}
                </span>
                {w.phonetic ? <span className="block text-xs font-bold text-muted-foreground">{w.phonetic}</span> : null}
                <span className="block truncate text-sm font-semibold text-primary">{w.meaning_vi}</span>
              </span>

              <button
                type="button"
                aria-label={`Nghe ${w.word}`}
                onClick={() => speakText(w.word, w.audioUrl)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted-foreground transition-colors active:bg-muted"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
