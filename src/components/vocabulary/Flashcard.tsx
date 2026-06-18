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
        className="cursor-pointer select-none overflow-hidden"
        onClick={() => setFlipped((f) => !f)}
        title="Bấm để lật thẻ"
      >
        {!flipped ? (
          <div className="flex flex-col items-center gap-4 p-6">
            <div className="h-48 w-full overflow-hidden rounded-md bg-secondary">
              {word.imageUrl ? (
                <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl font-black text-secondary-foreground">
                  {word.word[0].toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-4xl font-black capitalize">{word.word}</h2>
            <Button type="button" variant="outline" onClick={speak} aria-label="Nghe">
              <Volume2 className="h-5 w-5" /> Nghe
            </Button>
            <p className="text-sm text-muted-foreground">Bấm vào thẻ để xem nghĩa</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-3xl font-black text-primary">{word.meaning_vi}</p>
            {word.phonetic ? <p className="text-muted-foreground">{word.phonetic}</p> : null}
            {word.example ? (
              <div className="rounded-md bg-muted p-3">
                <p className="font-semibold">{word.example}</p>
                {word.example_vi ? <p className="mt-1 text-sm text-muted-foreground">{word.example_vi}</p> : null}
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">Bấm thẻ để lật lại</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" onClick={onReview}>
          <RotateCcw className="h-4 w-4" /> Cần ôn lại
        </Button>
        <Button type="button" onClick={onKnow}>
          <CheckCircle2 className="h-4 w-4" /> Con nhớ rồi
        </Button>
      </div>
    </div>
  );
}
