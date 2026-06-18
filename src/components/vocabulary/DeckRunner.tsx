import { ArrowLeft, PartyPopper } from "lucide-react";
import { useState } from "react";
import type { VocabularyWord } from "@/types";
import { recordAnswer } from "@/services/progressService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from "./Flashcard";

interface DeckRunnerProps {
  title: string;
  studentId: string;
  words: VocabularyWord[];
  onBack: () => void;
  emptyText?: string;
}

// Chạy 1 bộ flashcard: lật thẻ, "nhớ rồi" (đúng) / "cần ôn" (sai) -> recordAnswer (API).
export function DeckRunner({ title, studentId, words, onBack, emptyText }: DeckRunnerProps) {
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const answer = async (correct: boolean) => {
    const word = words[index];
    if (word) {
      // Ghi tiến độ; lỗi mạng không chặn việc học (vẫn đi tiếp).
      recordAnswer(studentId, word.id, correct).catch(() => {});
    }
    if (correct) setKnown((k) => k + 1);
    if (index + 1 >= words.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  const header = (
    <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
      <Button type="button" variant="ghost" className="-ml-3" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> Trang chủ
      </Button>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
    </header>
  );

  if (words.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
        {header}
        <Card><CardContent className="p-6 text-center text-muted-foreground">{emptyText ?? "Chưa có từ nào."}</CardContent></Card>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
        {header}
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <PartyPopper className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-black">Hoàn thành!</h2>
            <p className="text-muted-foreground">
              Con nhớ <span className="font-black text-primary">{known}</span>/{words.length} từ.
            </p>
            <Button type="button" size="lg" onClick={onBack}>Về trang chủ</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6">
      {header}
      <div className="flex items-center justify-between rounded-lg bg-white/75 px-4 py-3 text-sm font-semibold shadow-soft">
        <span>Thẻ {index + 1} / {words.length}</span>
        <span className="text-muted-foreground">Đã nhớ: {known}</span>
      </div>
      <Flashcard
        key={words[index].id}
        word={words[index]}
        onKnow={() => answer(true)}
        onReview={() => answer(false)}
      />
    </main>
  );
}
