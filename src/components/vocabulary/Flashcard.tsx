import { CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";

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

  const flip = () => setFlipped((f) => !f);

  return (
    <div className="space-y-4">
      {/* Card container với perspective cho 3D flip */}
      <div className="[perspective:1000px]" onClick={flip}>
        <div
          className="relative min-h-[24rem] cursor-pointer select-none transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}
        >
          {/* ── Mặt trước ── */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl [backface-visibility:hidden]">
            {/* Ảnh nền */}
            <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary">
              {word.imageUrl ? (
                <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-8xl font-black text-white/30">
                  {word.word[0].toUpperCase()}
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Nút nghe góc phải */}
              <button
                type="button"
                onClick={speak}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            {/* Nội dung */}
            <div className="flex flex-col items-center gap-2 px-6 py-5">
              <h2 className="text-4xl font-black capitalize tracking-tight">{word.word}</h2>
              {word.phonetic && (
                <p className="text-base font-semibold text-muted-foreground">{word.phonetic}</p>
              )}
              {word.pos && (
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">{word.pos}</span>
              )}
              <p className="mt-2 text-sm font-bold text-muted-foreground/70">Bấm để xem nghĩa</p>
            </div>
          </div>

          {/* ── Mặt sau ── */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 p-6 text-center">
              {/* Nghĩa chính */}
              <div className="rounded-2xl bg-primary/10 px-6 py-3">
                <p className="text-3xl font-black text-primary">{word.meaning_vi}</p>
              </div>

              {/* Từ + phiên âm */}
              <div>
                <p className="text-xl font-extrabold capitalize">{word.word}</p>
                {word.phonetic && <p className="text-sm font-semibold text-muted-foreground">{word.phonetic}</p>}
              </div>

              {/* Ví dụ */}
              {word.example && (
                <div className="w-full rounded-2xl bg-muted/70 p-4 text-left">
                  <p className="text-sm font-bold italic text-foreground">"{word.example}"</p>
                  {word.example_vi && (
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">→ {word.example_vi}</p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={speak}
                className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Volume2 className="h-4 w-4" /> Nghe phát âm
              </button>

              <p className="text-xs font-bold text-muted-foreground/50">Bấm để lật lại</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nút đánh giá */}
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onReview} className="rounded-2xl border-2 py-6 text-base">
          <RotateCcw className="h-5 w-5" /> Cần ôn lại
        </Button>
        <Button type="button" size="lg" onClick={onKnow} className="rounded-2xl py-6 text-base">
          <CheckCircle2 className="h-5 w-5" /> Con nhớ rồi
        </Button>
      </div>
    </div>
  );
}
