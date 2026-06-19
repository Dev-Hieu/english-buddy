import { BookMarked, GraduationCap, Loader2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Level, Student, VocabularyWord } from "@/types";
import { getMyWords, type SavedWord } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { DeckRunner } from "@/components/vocabulary/DeckRunner";

interface MyWordsPageProps {
  student: Student;
  onBackHome: () => void;
}

// Saved word -> VocabularyWord để học bằng flashcard.
function toVocab(w: SavedWord, level: Level): VocabularyWord {
  return {
    id: `lookup_${w.query}`,
    word: w.query,
    phonetic: w.phonetic,
    meaning_vi: w.meaning ?? "",
    topicIds: [],
    level,
    imageUrl: w.imageUrl ?? "",
    source: "dictionary_api",
    createdAt: w.createdAt,
  };
}

export function MyWordsPage({ student, onBackHome }: MyWordsPageProps) {
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const [studying, setStudying] = useState(false);

  useEffect(() => {
    let alive = true;
    getMyWords(student.id).then((w) => alive && setWords(w)).catch(() => alive && setWords([]));
    return () => { alive = false; };
  }, [student.id]);

  const level = (student.level as Level) ?? "a1";
  // Chỉ từ đơn (không phải câu) mới đưa vào bộ học flashcard.
  const deck = useMemo(
    () => (words ?? []).filter((w) => w.type === "word").map((w) => toVocab(w, level)),
    [words, level],
  );

  if (studying) {
    return (
      <DeckRunner
        title="Học · My Words"
        studentId={student.id}
        words={deck}
        onBack={() => setStudying(false)}
        emptyText="Chưa có từ đơn nào để học."
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title="My Words — từ đã lưu" onClose={onBackHome} />

      {words === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : words.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
          <BookMarked className="h-10 w-10" />
          <p className="font-bold">Chưa có từ nào được lưu.</p>
          <p className="text-sm">Vào <b>Tra từ</b>, tra một từ rồi bấm <b>Lưu vào My Words</b> nhé.</p>
        </CardContent></Card>
      ) : (
        <>
          {deck.length > 0 ? (
            <Button type="button" className="mb-4 w-full" onClick={() => setStudying(true)}>
              <GraduationCap className="h-5 w-5" /> Học các từ này ({deck.length})
            </Button>
          ) : null}

          <ul className="space-y-2">
            {words.map((w) => (
              <li key={w.query} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-card">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  {w.imageUrl ? (
                    <img src={w.imageUrl} alt={w.meaning ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-secondary-foreground">{w.query.slice(0, 1).toUpperCase()}</span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-lg font-extrabold capitalize">{w.query}</span>
                    {w.type === "sentence" ? <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">câu</span> : null}
                  </span>
                  {w.phonetic ? <span className="block text-xs font-bold text-muted-foreground">{w.phonetic}</span> : null}
                  {w.meaning ? <span className="block truncate text-sm font-semibold text-primary">{w.meaning}</span> : null}
                </span>

                <button
                  type="button"
                  aria-label={`Nghe ${w.query}`}
                  onClick={() => speakText(w.query)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted-foreground transition-colors active:bg-muted"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
