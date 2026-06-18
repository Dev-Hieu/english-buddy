import { CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
  word: VocabularyWord;
  onKnow: () => void;
  onReview: () => void;
}

export function Flashcard({ word, onKnow, onReview }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(word.word, word.audioUrl);
  };

  return (
    <div className="space-y-4">
      <Card
        className="min-h-[22rem] cursor-pointer select-none overflow-hidden animate-pop"
        onClick={() => setFlipped((f) => !f)}
      >
        {!flipped ? (
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="h-44 w-full overflow-hidden rounded-2xl bg-secondary">
              {word.imageUrl ? (
                <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-black text-secondary-foreground">
                  {word.word[0].toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-4xl font-black capitalize">{word.word}</h2>
            <Button type="button" variant="outline" onClick={speak}>
              <Volume2 className="h-5 w-5" /> Nghe
            </Button>
            <p className="text-sm font-bold text-muted-foreground">Bấm vào thẻ để xem nghĩa</p>
          </div>
        ) : (
          <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-4xl font-black text-primary">{word.meaning_vi}</p>
            {word.phonetic ? <p className="font-bold text-muted-foreground">{word.phonetic}</p> : null}
            {word.example ? (
              <div className="mt-2 rounded-2xl bg-muted p-3">
                <p className="font-bold">{word.example}</p>
                {word.example_vi ? <p className="mt-1 text-sm font-semibold text-muted-foreground">{word.example_vi}</p> : null}
              </div>
            ) : null}
            <p className="text-sm font-bold text-muted-foreground">Bấm thẻ để lật lại</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onReview}>
          <RotateCcw className="h-5 w-5" /> Cần ôn lại
        </Button>
        <Button type="button" size="lg" onClick={onKnow}>
          <CheckCircle2 className="h-5 w-5" /> Con nhớ rồi
        </Button>
      </div>
    </div>
  );
}
