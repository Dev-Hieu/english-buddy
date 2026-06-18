import { ArrowLeft, Ear, Images, Link2, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { recordAnswer } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GamesPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

type Game = "menu" | "match" | "pick" | "listen";

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

  const header = (title: string, onBack: () => void) => (
    <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
      <Button type="button" variant="ghost" className="-ml-3" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" /> {onBack === onBackHome ? "Trang chủ" : "Chọn game"}
      </Button>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
    </header>
  );

  if (game === "menu") {
    const games = [
      { id: "match" as const, name: "Ghép từ", desc: "Nối từ tiếng Anh với nghĩa", icon: Link2 },
      { id: "pick" as const, name: "Chọn ảnh đúng", desc: "Nhìn từ, chọn ảnh", icon: Images },
      { id: "listen" as const, name: "Nghe và chọn", desc: "Nghe phát âm, chọn từ", icon: Ear },
    ];
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6">
        {header("Trò chơi", onBackHome)}
        <div className="grid gap-4 sm:grid-cols-3">
          {games.map((g) => (
            <Card key={g.id} className="cursor-pointer hover:border-primary/60" onClick={() => setGame(g.id)}>
              <CardContent className="space-y-2 p-5 text-center">
                <g.icon className="mx-auto h-10 w-10 text-primary" />
                <h2 className="text-xl font-black">{g.name}</h2>
                <p className="text-sm text-muted-foreground">{g.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6">
      {game === "match" && <MatchGame pool={pool} onRecord={record} header={header("Ghép từ", back)} />}
      {game === "pick" && <PickGame pool={pool} onRecord={record} header={header("Chọn ảnh đúng", back)} />}
      {game === "listen" && <ListenGame pool={pool} onRecord={record} header={header("Nghe và chọn", back)} />}
    </main>
  );
}

interface GameProps {
  pool: VocabularyWord[];
  onRecord: (wordId: string, correct: boolean) => void;
  header: React.ReactNode;
}

function MatchGame({ pool, onRecord, header }: GameProps) {
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
      {header}
      {done ? (
        <Card><CardContent className="p-8 text-center"><p className="text-2xl font-black text-primary">Ghép đúng hết! 🎉</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            {round.map((w) => (
              <Button key={w.id} type="button" variant={left === w.id ? "default" : "outline"} size="lg"
                className={cn("w-full justify-start capitalize", matched.has(w.id) && "opacity-40")}
                disabled={matched.has(w.id)} onClick={() => setLeft(w.id)}>
                {w.word}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            {vis.map((w) => (
              <Button key={w.id} type="button" variant="secondary" size="lg"
                className={cn("w-full justify-start", matched.has(w.id) && "opacity-40", wrong === w.id && "ring-2 ring-red-400")}
                disabled={matched.has(w.id)} onClick={() => pickRight(w)}>
                {w.meaning_vi}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PickGame({ pool, onRecord, header }: GameProps) {
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

  if (n >= rounds) {
    return <>{header}<Card><CardContent className="p-8 text-center"><p className="text-2xl font-black text-primary">Hoàn thành! 🎉</p></CardContent></Card></>;
  }

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(set.target.id, w.id === set.target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      {header}
      <Card><CardContent className="space-y-4 p-6">
        <p className="text-center text-sm font-semibold text-muted-foreground">Vòng {n + 1}/{rounds}</p>
        <h2 className="text-center text-4xl font-black capitalize">{set.target.word}</h2>
        <div className="grid grid-cols-2 gap-3">
          {set.opts.map((w) => {
            const state = !picked ? "" : w.id === set.target.id ? "ring-4 ring-green-500" : w.id === picked ? "ring-4 ring-red-400" : "opacity-60";
            return (
              <button key={w.id} type="button" onClick={() => choose(w)} className={cn("overflow-hidden rounded-md border border-border", state)}>
                <img src={w.imageUrl} alt="" className="h-32 w-full object-cover" />
              </button>
            );
          })}
        </div>
      </CardContent></Card>
    </>
  );
}

function ListenGame({ pool, onRecord, header }: GameProps) {
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const rounds = 5;
  const set = useMemo(() => {
    const shuffled = shuffle(pool);
    const target = shuffled[0];
    const opts = shuffle([target, ...shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3)]);
    return { target, opts };
  }, [n, pool]);

  if (n >= rounds) {
    return <>{header}<Card><CardContent className="p-8 text-center"><p className="text-2xl font-black text-primary">Hoàn thành! 🎉</p></CardContent></Card></>;
  }

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(set.target.id, w.id === set.target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      {header}
      <Card><CardContent className="space-y-4 p-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground">Vòng {n + 1}/{rounds}</p>
        <Button type="button" size="lg" onClick={() => speakText(set.target.word, set.target.audioUrl)}>
          <Volume2 className="h-6 w-6" /> Nghe lại
        </Button>
        <div className="grid grid-cols-2 gap-3">
          {set.opts.map((w) => {
            const state = !picked ? "outline" : w.id === set.target.id ? "default" : w.id === picked ? "secondary" : "ghost";
            return (
              <Button key={w.id} type="button" variant={state as "outline" | "default" | "secondary" | "ghost"} size="lg"
                className={cn("capitalize", picked && w.id === set.target.id && "bg-green-600 text-white hover:bg-green-600")}
                onClick={() => choose(w)}>
                {w.word}
              </Button>
            );
          })}
        </div>
      </CardContent></Card>
    </>
  );
}
