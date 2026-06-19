import { PartyPopper } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { deckComplete, recordAnswer } from "@/services/progressService";
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
  deckId?: string; // để thưởng hoàn thành bộ (1 lần/bộ/ngày)
}

export function DeckRunner({ title, studentId, words, onBack, emptyText, deckId }: DeckRunnerProps) {
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (correct: boolean) => {
    const word = words[index];
    if (word) recordAnswer(studentId, word.id, correct).catch(() => {});
    if (correct) setKnown((k) => k + 1);
    if (index + 1 >= words.length) {
      setDone(true);
      // Thưởng khuyến khích khi học xong cả bộ.
      deckComplete(studentId, deckId || title, words.length).catch(() => {});
    } else setIndex((i) => i + 1);
  };

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
            <Button type="button" size="lg" className="w-full" onClick={onBack}>Xong</Button>
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
