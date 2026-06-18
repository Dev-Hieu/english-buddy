import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
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

const GOAL = 8;        // số bước tới đích
const LIMIT = 8;       // giây mỗi câu
const shuffle = <T,>(s: T[]): T[] => s.slice().sort(() => Math.random() - 0.5);

interface Q { word: VocabularyWord; options: string[]; }

function makeQuestion(pool: VocabularyWord[]): Q {
  const s = shuffle(pool);
  const word = s[0];
  const distractors = s.filter((w) => w.word !== word.word).slice(0, 3).map((w) => w.word);
  return { word, options: shuffle([word.word, ...distractors]) };
}

function Lane({ emoji, pos, label, lead }: { emoji: string; pos: number; label: string; lead: boolean }) {
  const left = `${Math.min(pos / GOAL, 1) * 84}%`;
  return (
    <div>
      <p className="mb-1 flex items-center gap-1 text-xs font-extrabold text-muted-foreground">
        {label} {lead ? <span className="text-accent">• dẫn đầu</span> : null}
      </p>
      <div className="relative h-12 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">🏁</span>
        {/* scaleX(-1): emoji xe mặc định quay trái -> lật cho quay phải, chạy đúng chiều về đích */}
        <span className="absolute top-1/2 text-3xl transition-all duration-500" style={{ left, transform: "translateY(-50%) scaleX(-1)" }}>
          {emoji}
        </span>
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
  const [streak, setStreak] = useState(0);
  const [turbo, setTurbo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(LIMIT);

  // Đồng hồ đếm ngược cho mỗi câu (chỉ chạy khi đang chờ trả lời).
  useEffect(() => {
    if (!q || picked !== null || over) return;
    setTimeLeft(LIMIT);
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, +(t - 0.1).toFixed(1))), 100);
    return () => clearInterval(id);
  }, [q, picked, over]);

  // Hết giờ = trả lời sai.
  useEffect(() => {
    if (timeLeft <= 0 && picked === null && !over && q) resolve(false, "⏰");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function resolve(ok: boolean, label: string) {
    if (!q) return;
    setPicked(label);
    onRecord(q.word.id, ok);
    let np = player, nr = rival, ns = streak, boost = false;
    if (ok) {
      ns = streak + 1;
      boost = ns >= 3; // 3 câu đúng liên tiếp -> tăng tốc +2
      np = player + (boost ? 2 : 1);
    } else {
      ns = 0;
      nr = rival + 1; // sai/hết giờ -> xe máy vượt lên
    }
    setStreak(ns); setTurbo(boost); setPlayer(np); setRival(nr);
    setTimeout(() => {
      setTurbo(false);
      if (np >= GOAL || nr >= GOAL) setOver(true);
      else { setPicked(null); setQ(makeQuestion(pool)); }
    }, 800);
  }

  if (!q) {
    return (
      <>
        <SessionHeader title="Đua xe học từ" onClose={onClose} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa đủ từ để đua.</CardContent></Card>
      </>
    );
  }

  if (over) {
    const won = player >= GOAL;
    return (
      <>
        <SessionHeader title="Đua xe học từ" onClose={onClose} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="text-6xl">{won ? "🏆" : "🤖"}</span>
            <p className="text-2xl font-black text-primary">{won ? "Về nhất! 🎉" : "Xe máy thắng mất rồi!"}</p>
            <p className="font-bold text-muted-foreground">{won ? "Con phản xạ rất nhanh!" : "Trả lời nhanh & đúng hơn để thắng nhé."}</p>
            <Button type="button" size="lg" className="w-full" onClick={onClose}>Đua lại</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  const timePct = (timeLeft / LIMIT) * 100;
  const optClass = (opt: string) =>
    picked === null ? "" : opt === q.word.word ? "ring-4 ring-success bg-success text-white" : opt === picked ? "ring-4 ring-red-400" : "opacity-50";

  return (
    <>
      <SessionHeader title="Đua xe học từ" onClose={onClose} />

      <div className="mb-4 space-y-3">
        <Lane emoji="🏎️" pos={player} label={`Bé (${player}/${GOAL})`} lead={player > rival} />
        <Lane emoji="🚗" pos={rival} label={`Máy tính (${rival}/${GOAL})`} lead={rival > player} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          {/* thanh thời gian */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-[width] duration-100", timeLeft > 3 ? "bg-primary" : "bg-red-500")}
              style={{ width: `${timePct}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-center text-xl font-black">Từ nào nghĩa là “{q.word.meaning_vi}”?</h2>
            {streak >= 2 ? (
              <span className="flex items-center gap-0.5 rounded-full bg-accent/15 px-2 py-0.5 text-sm font-extrabold text-accent">
                <Flame className="h-4 w-4" />{streak}
              </span>
            ) : null}
          </div>

          {turbo ? <p className="text-center font-black text-accent">🔥 TĂNG TỐC! +2</p> : null}

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => picked === null && resolve(opt === q.word.word, opt)}
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
