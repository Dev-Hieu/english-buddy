import { CheckCircle2, ImageIcon, RotateCcw, Volume2 } from "lucide-react";
import type { VocabularyWord } from "@/types";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

interface WordCardProps {
  word: VocabularyWord;
  compact?: boolean;
  studied?: boolean;
  onKnow?: () => void;
  onReview?: () => void;
}

export function WordCard({ word, compact = false, studied = false, onKnow, onReview }: WordCardProps) {
  const handleSpeak = () => speakText(word.word, word.audioUrl);

  return (
    <Card className={cn("overflow-hidden", studied && "border-primary/50 bg-primary/5")}>
      <div className={cn("relative flex items-center justify-center bg-secondary", compact ? "h-32" : "h-56")}>
        {word.imageUrl ? (
          <img src={word.imageUrl} alt={word.meaning_vi} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-secondary-foreground">
            <ImageIcon className="h-8 w-8 opacity-70" />
            <span className={cn("font-black uppercase", compact ? "text-5xl" : "text-7xl")}>
              {word.word.slice(0, 1)}
            </span>
          </div>
        )}
        {studied ? (
          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-primary shadow-soft">
            <CheckCircle2 className="mr-1 inline h-4 w-4" />
            Đã xem
          </div>
        ) : null}
      </div>

      <CardContent className={cn("space-y-4", compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={cn("font-black capitalize tracking-tight", compact ? "text-2xl" : "text-4xl")}>
              {word.word}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{word.phonetic || "Listen and repeat"}</p>
          </div>
          <Button type="button" size="icon" variant="outline" aria-label={`Nghe từ ${word.word}`} onClick={handleSpeak}>
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className={cn("font-bold text-primary", compact ? "text-base" : "text-xl")}>{word.meaning_vi}</p>
          {word.meaning_en ? <p className="text-sm text-muted-foreground">{word.meaning_en}</p> : null}
        </div>

        {word.example ? (
          <div className="rounded-md bg-muted p-3">
            <p className="font-semibold">{word.example}</p>
            {word.example_vi ? <p className="mt-1 text-sm text-muted-foreground">{word.example_vi}</p> : null}
          </div>
        ) : null}

        {onKnow || onReview ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {onReview ? (
              <Button type="button" variant="outline" onClick={onReview}>
                <RotateCcw className="h-4 w-4" />
                Cần ôn lại
              </Button>
            ) : null}
            {onKnow ? (
              <Button type="button" onClick={onKnow}>
                <CheckCircle2 className="h-4 w-4" />
                Con nhớ rồi
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
