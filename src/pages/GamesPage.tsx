import { Car, Ear, Grid3x3, Images, Link2, PartyPopper, Puzzle, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { recordAnswer } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { SudokuGame } from "@/components/games/SudokuGame";
import { PictureWordGame } from "@/components/games/PictureWordGame";
import { CarRaceGame } from "@/components/games/CarRaceGame";

interface GamesPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

type Game = "menu" | "match" | "pick" | "listen" | "build" | "race" | "sudoku";

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function GamesPage({ student, topicId, onBackHome }: GamesPageProps) {
  const [game, setGame] = useState<Game>("menu");
  const pool = useMemo(() => {
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId));
    return t.length >= 4 ? t : SEED_VOCABULARY;
  }, [topicId]);

  const record = (wordId: string, correct: boolean) => recordAnswer(student.id, wordId, correct).catch(() => {});
  const back = () => setGame("menu");

  if (game === "menu") {
    const games = [
      { id: "match" as const, name: "Ghép từ", desc: "Nối từ với nghĩa", icon: Link2, emoji: "🔗" },
      { id: "pick" as const, name: "Chọn ảnh", desc: "Nhìn từ, chọn ảnh", icon: Images, emoji: "🖼️" },
      { id: "listen" as const, name: "Nghe & chọn", desc: "Nghe rồi chọn từ", icon: Ear, emoji: "👂" },
      { id: "build" as const, name: "Đuổi hình bắt chữ", desc: "Nhìn hình, ghép chữ", icon: Puzzle, emoji: "🧩" },
      { id: "race" as const, name: "Đua xe học từ", desc: "Đáp đúng để về đích", icon: Car, emoji: "🏎️" },
      { id: "sudoku" as const, name: "Sudoku", desc: "Điền số 1-9 rèn tư duy", icon: Grid3x3, emoji: "🔢" },
    ];
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Trò chơi" onClose={onBackHome} />
        <div className="space-y-3">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGame(g.id)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">{g.emoji}</span>
              <span className="flex-1">
                <span className="block text-lg font-extrabold">{g.name}</span>
                <span className="block text-sm font-semibold text-muted-foreground">{g.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      {game === "match" && <MatchGame pool={pool} onRecord={record} onClose={back} />}
      {game === "pick" && <PickGame pool={pool} onRecord={record} onClose={back} />}
      {game === "listen" && <ListenGame pool={pool} onRecord={record} onClose={back} />}
      {game === "build" && <PictureWordGame pool={pool} onRecord={record} onClose={back} />}
      {game === "race" && <CarRaceGame pool={pool} onRecord={record} onClose={back} />}
      {game === "sudoku" && <SudokuGame onClose={back} />}
    </main>
  );
}

interface GameProps {
  pool: VocabularyWord[];
  onRecord: (wordId: string, correct: boolean) => void;
  onClose: () => void;
}

function Finished({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <PartyPopper className="h-12 w-12 text-accent" />
        <p className="text-2xl font-black text-primary">Hoàn thành! 🎉</p>
        <Button type="button" size="lg" className="w-full" onClick={onClose}>Chơi tiếp</Button>
      </CardContent>
    </Card>
  );
}

function MatchGame({ pool, onRecord, onClose }: GameProps) {
  const [round] = useState(() => shuffle(pool).slice(0, 5));
  const [vis] = useState(() => shuffle(round));
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  const pickRight = (w: VocabularyWord) => {
    if (!left || matched.has(w.id)) return;
    if (w.id === left) {
      onRecord(w.id, true);
      setMatched((m) => new Set(m).add(w.id));
      setLeft(null);
    } else {
      onRecord(left, false);
      setWrong(w.id);
      setTimeout(() => setWrong(null), 500);
      setLeft(null);
    }
  };

  const done = matched.size === round.length;
  return (
    <>
      <SessionHeader title="Ghép từ" onClose={onClose} />
      {done ? <Finished onClose={onClose} /> : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            {round.map((w) => (
              <Button key={w.id} type="button" variant={left === w.id ? "default" : "outline"} size="lg"
                className={cn("w-full justify-start capitalize", matched.has(w.id) && "opacity-40")}
                disabled={matched.has(w.id)} onClick={() => setLeft(w.id)}>{w.word}</Button>
            ))}
          </div>
          <div className="space-y-2">
            {vis.map((w) => (
              <Button key={w.id} type="button" variant="secondary" size="lg"
                className={cn("w-full justify-start", matched.has(w.id) && "opacity-40", wrong === w.id && "ring-4 ring-red-400")}
                disabled={matched.has(w.id)} onClick={() => pickRight(w)}>{w.meaning_vi}</Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PickGame({ pool, onRecord, onClose }: GameProps) {
  const withImg = useMemo(() => pool.filter((w) => w.imageUrl), [pool]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const rounds = 5;
  const set = useMemo(() => {
    const base = withImg.length >= 4 ? withImg : pool;
    const shuffled = shuffle(base);
    const target = shuffled[0];
    const opts = shuffle([target, ...shuffle(base.filter((w) => w.id !== target.id)).slice(0, 3)]);
    return { target, opts };
  }, [n, withImg, pool]);

  if (n >= rounds) return (<><SessionHeader title="Chọn ảnh" onClose={onClose} /><Finished onClose={onClose} /></>);

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(set.target.id, w.id === set.target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      <SessionHeader title="Chọn ảnh đúng" onClose={onClose} progress={Math.round((n / rounds) * 100)} />
      <Card><CardContent className="space-y-4 p-6">
        <h2 className="text-center text-4xl font-black capitalize">{set.target.word}</h2>
        <div className="grid grid-cols-2 gap-3">
          {set.opts.map((w) => {
            const state = !picked ? "" : w.id === set.target.id ? "ring-4 ring-success" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
            return (
              <button key={w.id} type="button" onClick={() => choose(w)} className={cn("overflow-hidden rounded-2xl border-2 border-border transition-all active:translate-y-[1px]", state)}>
                <img src={w.imageUrl} alt="" className="h-32 w-full object-cover" />
              </button>
            );
          })}
        </div>
      </CardContent></Card>
    </>
  );
}

function ListenGame({ pool, onRecord, onClose }: GameProps) {
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const rounds = 5;
  const set = useMemo(() => {
    const shuffled = shuffle(pool);
    const target = shuffled[0];
    const opts = shuffle([target, ...shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3)]);
    return { target, opts };
  }, [n, pool]);

  if (n >= rounds) return (<><SessionHeader title="Nghe & chọn" onClose={onClose} /><Finished onClose={onClose} /></>);

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(set.target.id, w.id === set.target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      <SessionHeader title="Nghe & chọn" onClose={onClose} progress={Math.round((n / rounds) * 100)} />
      <Card><CardContent className="space-y-5 p-6 text-center">
        <Button type="button" size="xl" className="w-full" onClick={() => speakText(set.target.word, set.target.audioUrl)}>
          <Volume2 className="h-7 w-7" /> Nghe lại
        </Button>
        <div className="grid grid-cols-2 gap-3">
          {set.opts.map((w) => {
            const state = !picked ? "" : w.id === set.target.id ? "ring-4 ring-success bg-success text-white" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
            return (
              <button key={w.id} type="button" onClick={() => choose(w)}
                className={cn("rounded-2xl border-2 border-border bg-card px-4 py-4 text-lg font-extrabold capitalize transition-all active:translate-y-[1px]", state)}>
                {w.word}
              </button>
            );
          })}
        </div>
      </CardContent></Card>
    </>
  );
}
