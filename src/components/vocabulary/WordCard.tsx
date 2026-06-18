import { CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import type { VocabularyWord } from "@/types";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

interface WordCardProps {
  word: VocabularyWord;
  compact?: boolean;
  studied?: boolean;
  onKnow?: () => void;
  onReview?: () => void;
}

export function WordCard({ word, compact = false, studied = false, onKnow, onReview }: WordCardProps) {
  return (
    <Card className={cn("overflow-hidden", studied && "ring-2 ring-primary/40")}>
      <div className={cn("relative flex items-center justify-center bg-secondary", compact ? "h-32" : "h-56")}>
        {word.imageUrl ? (
          <img src={word.imageUrl} alt={word.meaning_vi} className="h-full w-full object-cover" />
        ) : (
          <span className={cn("font-black text-secondary-foreground", compact ? "text-5xl" : "text-7xl")}>
            {word.word.slice(0, 1).toUpperCase()}
          </span>
        )}
        {studied ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-3 py-1 text-sm font-extrabold text-white shadow-card">
            <CheckCircle2 className="h-4 w-4" /> Đã xem
          </span>
        ) : null}
      </div>

      <div className={cn("space-y-4", compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={cn("font-black capitalize tracking-tight", compact ? "text-2xl" : "text-4xl")}>{word.word}</h2>
            <p className="mt-1 text-sm font-bold text-muted-foreground">{word.phonetic || "Listen and repeat"}</p>
          </div>
          <Button type="button" size="icon" variant="outline" aria-label={`Nghe ${word.word}`} onClick={() => speakText(word.word, word.audioUrl)}>
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        <div>
          <p className={cn("font-extrabold text-primary", compact ? "text-base" : "text-xl")}>{word.meaning_vi}</p>
          {word.meaning_en ? <p className="text-sm font-semibold text-muted-foreground">{word.meaning_en}</p> : null}
        </div>

        {word.example ? (
          <div className="rounded-2xl bg-muted p-3">
            <p className="font-bold">{word.example}</p>
            {word.example_vi ? <p className="mt-1 text-sm font-semibold text-muted-foreground">{word.example_vi}</p> : null}
          </div>
        ) : null}

        {onKnow || onReview ? (
          <div className="grid grid-cols-2 gap-3">
            {onReview ? (
              <Button type="button" variant="outline" onClick={onReview}>
                <RotateCcw className="h-4 w-4" /> Cần ôn lại
              </Button>
            ) : null}
            {onKnow ? (
              <Button type="button" onClick={onKnow}>
                <CheckCircle2 className="h-4 w-4" /> Con nhớ rồi
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
