import { PartyPopper, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { recordAnswer } from "@/services/progressService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Flashcard } from "./Flashcard";

interface DeckRunnerProps {
  title: string;
  studentId: string;
  words: VocabularyWord[];
  onBack: () => void;
  emptyText?: string;
}

export function DeckRunner({ title, studentId, words, onBack, emptyText }: DeckRunnerProps) {
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (correct: boolean) => {
    const word = words[index];
    if (word) recordAnswer(studentId, word.id, correct).catch(() => {});
    if (correct) setKnown((k) => k + 1);
    if (index + 1 >= words.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  const restart = () => { setIndex(0); setKnown(0); setDone(false); };

  if (words.length === 0) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title={title} onClose={onBack} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">{emptyText ?? "Chưa có từ nào."}</CardContent></Card>
      </main>
    );
  }

  const pct = Math.round(((done ? words.length : index) / words.length) * 100);
  const score = words.length > 0 ? Math.round((known / words.length) * 100) : 0;

  if (done) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title={title} onClose={onBack} />
        <Card className="overflow-hidden">
          {/* Gradient header */}
          <div className="bg-gradient-to-br from-primary to-success px-6 py-8 text-center text-white">
            <PartyPopper className="mx-auto h-12 w-12 mb-3" />
            <h2 className="text-3xl font-black">Hoàn thành!</h2>
          </div>
          <CardContent className="flex flex-col items-center gap-5 p-6">
            {/* Score ring */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                  strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black">{known}</span>
                <span className="text-sm font-bold text-muted-foreground">/{words.length}</span>
              </div>
            </div>
            <p className="font-bold text-muted-foreground">
              {score >= 80 ? "Xuất sắc! Con nhớ rất giỏi!" : score >= 50 ? "Tốt lắm! Cố gắng thêm nhé!" : "Ôn thêm để nhớ lâu hơn nhé!"}
            </p>
            <div className="flex w-full gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1 rounded-2xl" onClick={restart}>
                <RotateCcw className="h-5 w-5" /> Học lại
              </Button>
              <Button type="button" size="lg" className="flex-1 rounded-2xl" onClick={onBack}>Xong</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={title} onClose={onBack} progress={pct} />
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-extrabold text-muted-foreground">Thẻ {index + 1} / {words.length}</p>
        <p className="text-sm font-extrabold text-primary">{known} đã nhớ</p>
      </div>
      <Flashcard key={words[index].id} word={words[index]} onKnow={() => answer(true)} onReview={() => answer(false)} />
    </main>
  );
}
