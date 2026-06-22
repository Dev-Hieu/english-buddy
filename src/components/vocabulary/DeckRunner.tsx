import { PartyPopper, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { recordAnswer } from "@/services/progressService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress";
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

  if (done) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title={title} onClose={onBack} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <h2 className="text-2xl font-black">Hoàn thành!</h2>
            <ProgressRing value={known} max={words.length} size={96} stroke={11}>
              <span className="text-2xl font-black">{known}</span>
              <span className="text-xs font-bold text-muted-foreground">/{words.length}</span>
            </ProgressRing>
            <p className="font-bold text-muted-foreground">Con nhớ {known}/{words.length} từ. Giỏi lắm!</p>
            <div className="flex w-full gap-3">
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={restart}>
                <RotateCcw className="h-5 w-5" /> Học lại
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={onBack}>Xong</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={title} onClose={onBack} progress={Math.round((index / words.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Thẻ {index + 1} / {words.length}</p>
      <Flashcard key={words[index].id} word={words[index]} onKnow={() => answer(true)} onReview={() => answer(false)} />
    </main>
  );
}
