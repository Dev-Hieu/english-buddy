import { Volume2 } from "lucide-react";
import type { VocabularyWord } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WordPreviewCardProps {
  word: VocabularyWord;
}

export function WordPreviewCard({ word }: WordPreviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex h-32 items-center justify-center bg-secondary text-5xl font-black text-secondary-foreground">
        {word.word.slice(0, 1).toUpperCase()}
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-black capitalize">{word.word}</h3>
            <Button type="button" size="icon" variant="outline" aria-label={`Nghe từ ${word.word}`}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{word.phonetic}</p>
        </div>
        <p className="font-semibold text-primary">{word.meaning_vi}</p>
        <p className="text-sm text-muted-foreground">{word.example}</p>
      </CardContent>
    </Card>
  );
}
