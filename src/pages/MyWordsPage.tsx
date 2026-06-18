import { BookMarked, Loader2, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Student } from "@/types";
import { getMyWords, type SavedWord } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface MyWordsPageProps {
  student: Student;
  onBackHome: () => void;
}

export function MyWordsPage({ student, onBackHome }: MyWordsPageProps) {
  const [words, setWords] = useState<SavedWord[] | null>(null);

  useEffect(() => {
    let alive = true;
    getMyWords(student.id).then((w) => alive && setWords(w)).catch(() => alive && setWords([]));
    return () => { alive = false; };
  }, [student.id]);

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
        <div className="space-y-2">
          {words.map((w) => (
            <div key={w.query} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-card">
              <span className="flex-1 font-extrabold capitalize">{w.query}</span>
              {w.type === "sentence" ? <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">câu</span> : null}
              <Button type="button" size="icon" variant="outline" aria-label="Nghe" onClick={() => speakText(w.query)}>
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
