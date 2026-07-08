import { Delete, PartyPopper, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { playCorrect, playWrong, playTap, playWin } from "@/services/soundService";
import { submitGameScore } from "@/services/gameService";
import type { VocabularyWord } from "@/types";
import { speakText } from "@/services/speechService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { pickWords } from "./wordRotation";

interface Props {
  pool: VocabularyWord[];
  onRecord: (wordId: string, correct: boolean) => void;
  onClose: () => void;
  hard: boolean;
  studentId?: string;
}

const shuffle = <T,>(s: T[]): T[] => s.slice().sort(() => Math.random() - 0.5);

function makeTray(word: string, hard: boolean): string[] {
  const letters = word.toLowerCase().split("");
  const baseExtra = word.length <= 6 ? 3 : word.length <= 8 ? 2 : 0;
  const extras = baseExtra + (hard ? 2 : 0); // Khó: thêm nhiều chữ nhiễu hơn
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  for (let i = 0; i < extras; i++) letters.push(alphabet[Math.floor(Math.random() * 26)]);
  return shuffle(letters);
}

export function PictureWordGame({ pool, onRecord, onClose, hard, studentId }: Props) {
  const eligible = useMemo(() => pool.filter((w) => w.imageUrl && !w.word.includes(" ")), [pool]);
  const [words] = useState(() => pickWords(eligible, hard ? 8 : 5));
  const [n, setN] = useState(0);
  const [tray, setTray] = useState<string[]>(() => (words[0] ? makeTray(words[0].word, hard) : []));
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<"playing" | "right" | "wrong">("playing");
  const [solved, setSolved] = useState(0);
  const [done, setDone] = useState(false);

  if (words.length === 0) {
    return (
      <>
        <SessionHeader title="Đuổi hình bắt chữ" onClose={onClose} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa đủ từ có ảnh.</CardContent></Card>
      </>
    );
  }

  if (done) {
    return (
      <>
        <SessionHeader title="Đuổi hình bắt chữ" onClose={onClose} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">Đúng {solved}/{words.length} từ! 🎉</p>
            <Button type="button" size="lg" className="w-full" onClick={onClose}>Chơi tiếp</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  const target = words[n];
  const built = placed.map((i) => tray[i]).join("");

  const advance = () => {
    const m = n + 1;
    if (m >= words.length) { setDone(true); playWin(); if (studentId) submitGameScore(studentId, "build", solved + 1).catch(() => {}); return; }
    setN(m); setPlaced([]); setStatus("playing"); setTray(makeTray(words[m].word, hard));
  };

  const tap = (i: number) => {
    if (status !== "playing" || placed.includes(i)) return;
    const next = [...placed, i];
    setPlaced(next);
    playTap();
    if (next.length === target.word.length) {
      const guess = next.map((k) => tray[k]).join("").toLowerCase();
      if (guess === target.word.toLowerCase()) {
        setStatus("right"); setSolved((s) => s + 1); onRecord(target.id, true);
        playCorrect();
        setTimeout(advance, 900);
      } else {
        setStatus("wrong"); onRecord(target.id, false);
        playWrong();
        setTimeout(() => { setPlaced([]); setStatus("playing"); }, 700);
      }
    }
  };

  const slots = Array.from({ length: target.word.length });

  return (
    <>
      <SessionHeader title="Đuổi hình bắt chữ" onClose={onClose} progress={Math.round((n / words.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Câu {n + 1} / {words.length}</p>

      <Card>
        <CardContent className="space-y-4 p-5">
          <img src={target.imageUrl} alt="" className="h-44 w-full rounded-2xl object-cover" />
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-lg font-extrabold text-primary">🇻🇳 {target.meaning_vi}</p>
            <Button type="button" size="icon" variant="outline" onClick={() => speakText(target.word, target.audioUrl)}>
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          {/* ô đáp án */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {slots.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "flex h-11 w-9 items-center justify-center rounded-xl border-2 text-xl font-black uppercase",
                  status === "right" ? "border-success bg-success/10 text-success"
                    : status === "wrong" ? "border-red-400 bg-red-50 text-red-600"
                    : built[i] ? "border-primary bg-secondary text-foreground" : "border-border bg-muted",
                )}
              >
                {built[i] ?? ""}
              </span>
            ))}
          </div>

          {/* khay chữ cái */}
          <div className="flex flex-wrap justify-center gap-2">
            {tray.map((ch, i) => (
              <button
                key={i}
                type="button"
                onClick={() => tap(i)}
                disabled={placed.includes(i) || status !== "playing"}
                className={cn(
                  "h-12 w-11 rounded-2xl border-2 border-border bg-card text-xl font-black uppercase shadow-card transition-all active:translate-y-[2px]",
                  placed.includes(i) && "opacity-30",
                )}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button type="button" variant="ghost" onClick={() => setPlaced((p) => p.slice(0, -1))} disabled={placed.length === 0 || status !== "playing"}>
              <Delete className="h-5 w-5" /> Xoá
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
