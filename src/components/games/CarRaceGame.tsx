import { useMemo, useState } from "react";
import type { VocabularyWord } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface Props {
  pool: VocabularyWord[];
  onRecord: (wordId: string, correct: boolean) => void;
  onClose: () => void;
}

const GOAL = 8; // số bước tới đích
const shuffle = <T,>(s: T[]): T[] => s.slice().sort(() => Math.random() - 0.5);

interface Q {
  word: VocabularyWord;
  options: string[];
}

function makeQuestion(pool: VocabularyWord[]): Q {
  const s = shuffle(pool);
  const word = s[0];
  const distractors = s.filter((w) => w.word !== word.word).slice(0, 3).map((w) => w.word);
  return { word, options: shuffle([word.word, ...distractors]) };
}

function Lane({ emoji, pos, label }: { emoji: string; pos: number; label: string }) {
  const left = `${Math.min(pos / GOAL, 1) * 84}%`;
  return (
    <div>
      <p className="mb-1 text-xs font-extrabold text-muted-foreground">{label}</p>
      <div className="relative h-12 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">🏁</span>
        <span className="absolute top-1/2 -translate-y-1/2 text-3xl transition-all duration-500" style={{ left }}>{emoji}</span>
      </div>
    </div>
  );
}

export function CarRaceGame({ pool, onRecord, onClose }: Props) {
  const [q, setQ] = useState<Q | null>(() => (pool.length >= 4 ? makeQuestion(pool) : null));
  const [player, setPlayer] = useState(0);
  const [rival, setRival] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const playerWon = useMemo(() => player >= GOAL, [player]);

  if (!q) {
    return (
      <>
        <SessionHeader title="Đua xe học từ" onClose={onClose} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa đủ từ để đua.</CardContent></Card>
      </>
    );
  }

  if (over) {
    return (
      <>
        <SessionHeader title="Đua xe học từ" onClose={onClose} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="text-6xl">{playerWon ? "🏆" : "🤖"}</span>
            <p className="text-2xl font-black text-primary">{playerWon ? "Về nhất! 🎉" : "Xe máy thắng mất rồi!"}</p>
            <p className="font-bold text-muted-foreground">{playerWon ? "Con trả lời rất nhanh và đúng." : "Trả lời đúng nhiều hơn để thắng nhé."}</p>
            <Button type="button" size="lg" className="w-full" onClick={onClose}>Đua lại</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  const choose = (opt: string) => {
    if (picked !== null) return;
    const ok = opt === q.word.word;
    setPicked(opt);
    onRecord(q.word.id, ok);
    const np = player + (ok ? 1 : 0);
    const nr = rival + (ok ? 0 : 1);
    setPlayer(np);
    setRival(nr);
    setTimeout(() => {
      if (np >= GOAL || nr >= GOAL) setOver(true);
      else { setPicked(null); setQ(makeQuestion(pool)); }
    }, 750);
  };

  const optClass = (opt: string) =>
    picked === null ? "" : opt === q.word.word ? "ring-4 ring-success bg-success text-white" : opt === picked ? "ring-4 ring-red-400" : "opacity-50";

  return (
    <>
      <SessionHeader title="Đua xe học từ" onClose={onClose} />
      <div className="mb-4 space-y-3">
        <Lane emoji="🏎️" pos={player} label={`Bé (${player}/${GOAL})`} />
        <Lane emoji="🚗" pos={rival} label={`Máy tính (${rival}/${GOAL})`} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-center text-xl font-black">Từ nào nghĩa là “{q.word.meaning_vi}”?</h2>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                className={cn("rounded-2xl border-2 border-border bg-card px-4 py-4 text-lg font-extrabold capitalize transition-all active:translate-y-[1px]", optClass(opt))}
              >
                {opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
