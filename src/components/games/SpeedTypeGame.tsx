import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { playCorrect, playWrong, playWin, playStreak, playTick } from "@/services/soundService";

interface Props {
  words: { word: string; meaning_vi: string }[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

const ROUND_SECONDS = 30;

function getRank(wpm: number): string {
  if (wpm >= 40) return "S";
  if (wpm >= 30) return "A";
  if (wpm >= 20) return "B";
  if (wpm >= 10) return "C";
  return "D";
}

const rankColor: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-orange-400",
  D: "text-red-400",
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SpeedTypeGame({ words, onComplete, onBack }: Props) {
  const [queue, setQueue] = useState(() => shuffle(words));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [started, setStarted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const [shake, setShake] = useState(false);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentWord = queue[idx % queue.length];

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setOver(true);
    playWin();
  }, []);

  // Timer
  useEffect(() => {
    if (!started || over) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        const next = t - 1;
        if (next >= 1 && next <= 5) playTick();
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, over, endGame]);

  // Auto-focus
  useEffect(() => {
    if (!over) inputRef.current?.focus();
  }, [idx, over]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (over || !started) return;

    const trimmed = input.trim();
    setAttempts((a) => a + 1);

    if (trimmed.toLowerCase() === currentWord.word.toLowerCase()) {
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);
      if (nextCorrect % 5 === 0) {
        playStreak();
      } else {
        playCorrect();
      }
      setFlash("green");
      setInput("");
      // Reshuffle when we exhaust the queue
      if (idx + 1 >= queue.length) {
        setQueue(shuffle(words));
        setIdx(0);
      } else {
        setIdx((i) => i + 1);
      }
      setTimeout(() => setFlash(null), 300);
    } else {
      playWrong();
      setFlash("red");
      setShake(true);
      setTimeout(() => {
        setFlash(null);
        setShake(false);
      }, 400);
    }
  }

  function handleStart() {
    setStarted(true);
    inputRef.current?.focus();
  }

  function handlePlayAgain() {
    setQueue(shuffle(words));
    setIdx(0);
    setInput("");
    setTimeLeft(ROUND_SECONDS);
    setStarted(false);
    setCorrect(0);
    setAttempts(0);
    setFlash(null);
    setShake(false);
    setOver(false);
  }

  const wpm = Math.round((correct / ROUND_SECONDS) * 60);
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const rank = getRank(wpm);

  // End screen
  if (over) {
    onComplete(wpm);
    return (
      <Card className="animate-pop">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className={cn("text-8xl font-black", rankColor[rank])}>{rank}</span>
          <p className="text-2xl font-black text-primary">Hạng {rank}</p>
          <div className="grid w-full grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-black text-primary">{wpm}</p>
              <p className="text-sm font-bold text-muted-foreground">từ/phút</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{accuracy}%</p>
              <p className="text-sm font-bold text-muted-foreground">Độ chính xác</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{correct}</p>
              <p className="text-sm font-bold text-muted-foreground">Số từ</p>
            </div>
          </div>
          <div className="flex w-full gap-3">
            <Button type="button" size="lg" className="flex-1" onClick={handlePlayAgain}>
              Chơi lại
            </Button>
            <Button type="button" size="lg" variant="outline" className="flex-1" onClick={onBack}>
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const timePct = (timeLeft / ROUND_SECONDS) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          Quay lại
        </Button>
        <p className="text-sm font-bold text-muted-foreground">
          {correct} từ
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Timer bar */}
          {started && (
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-1000 ease-linear",
                  timeLeft > 10 ? "bg-primary" : timeLeft > 5 ? "bg-orange-400" : "bg-red-500",
                )}
                style={{ width: `${timePct}%` }}
              />
            </div>
          )}

          {/* Timer text */}
          <p
            className={cn(
              "text-center text-lg font-black",
              timeLeft <= 5 ? "text-red-500" : "text-muted-foreground",
            )}
          >
            {started ? `${timeLeft}s` : `${ROUND_SECONDS}s`}
          </p>

          {/* Current word */}
          <div
            className={cn(
              "rounded-2xl p-6 text-center transition-colors duration-200",
              flash === "green" && "bg-green-500/20",
              flash === "red" && "bg-red-500/20",
              !flash && "bg-muted/50",
            )}
          >
            <p
              className={cn(
                "text-4xl font-black tracking-wide text-primary",
                shake && "animate-[shake_0.3s_ease-in-out]",
              )}
            >
              {currentWord.word}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{currentWord.meaning_vi}</p>
          </div>

          {/* Input */}
          {!started ? (
            <Button type="button" size="lg" className="w-full text-lg" onClick={handleStart}>
              Bắt đầu
            </Button>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Gõ từ..."
                className={cn(
                  "w-full rounded-xl border-2 bg-background px-4 py-3 text-center text-xl font-bold outline-none transition-colors",
                  flash === "green" && "border-green-500",
                  flash === "red" && "border-red-500",
                  !flash && "border-border focus:border-primary",
                )}
              />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
