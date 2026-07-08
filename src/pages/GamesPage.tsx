import { Car, Ear, Grid3x3, Images, Link2, PartyPopper, Puzzle, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { SpeedTypeGame } from "@/components/games/SpeedTypeGame";
import { WordChainGame } from "@/components/games/WordChainGame";
import { pickWords } from "@/components/games/wordRotation";
import { topicWords } from "@/utils/levelFilter";

interface GamesPageProps {
  student: Student;
  topicId: string;
  level?: string;
  studiedWordIds: string[];
  onBackHome: () => void;
}

type Game = "menu" | "match" | "pick" | "listen" | "dictation" | "build" | "race" | "sudoku" | "wordsearch" | "speedtype" | "wordchain";

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function GamesPage({ student, topicId, level = "all", studiedWordIds, onBackHome }: GamesPageProps) {
  const [game, setGame] = useState<Game>("menu");
  const [hard, setHard] = useState(false);

  const base = useMemo(() => {
    const t = topicWords(SEED_VOCABULARY, topicId, level);
    return t.length >= 4 ? t : SEED_VOCABULARY;
  }, [topicId, level]);
  const reviewPool = useMemo(() => {
    const learned = new Set(studiedWordIds);
    const r = base.filter((w) => learned.has(w.id));
    return r.length >= 4 ? r : base;
  }, [base, studiedWordIds]);
  const learnedCount = useMemo(() => {
    const learned = new Set(studiedWordIds);
    return base.filter((w) => learned.has(w.id)).length;
  }, [base, studiedWordIds]);

  const record = (wordId: string, correct: boolean) => recordAnswer(student.id, wordId, correct).catch(() => {});
  const back = () => setGame("menu");

  if (game === "menu") {
    const games = [
      { id: "match" as const, name: "Ghép từ", desc: "Nối từ với nghĩa", emoji: "🔗" },
      { id: "pick" as const, name: "Chọn ảnh", desc: "Nhìn từ, chọn ảnh", emoji: "🖼️" },
      { id: "listen" as const, name: "Nghe & chọn", desc: "Nghe rồi chọn từ", emoji: "👂" },
      { id: "dictation" as const, name: "Nghe & gõ", desc: "Nghe rồi gõ lại từ (chính tả)", emoji: "⌨️" },
      { id: "build" as const, name: "Đuổi hình bắt chữ", desc: "Nhìn hình, ghép chữ", emoji: "🧩" },
      { id: "race" as const, name: "Đua xe học từ", desc: "Đáp đúng để về đích", emoji: "🏎️" },
      { id: "sudoku" as const, name: "Sudoku", desc: "Điền số 1-9 rèn tư duy", emoji: "🔢" },
      { id: "wordsearch" as const, name: "Tìm từ", desc: "Tìm từ ẩn trong lưới chữ", emoji: "🔍" },
      { id: "speedtype" as const, name: "Gõ nhanh", desc: "Gõ từ nhanh nhất có thể", emoji: "⚡" },
      { id: "wordchain" as const, name: "Nối từ", desc: "Nối từ vs 3 bot, 10s/lượt", emoji: "🔗" },
    ];
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Trò chơi" onClose={onBackHome} />

        {/* Độ khó (áp dụng cho game từ vựng; Sudoku có độ khó riêng) */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
          {[{ k: false, l: "Dễ" }, { k: true, l: "Khó" }].map((d) => (
            <button key={d.l} type="button" onClick={() => setHard(d.k)}
              className={cn("rounded-xl py-2 text-sm font-extrabold transition-colors", hard === d.k ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
              {d.l}
            </button>
          ))}
        </div>

        {learnedCount < 4 ? (
          <div className="mb-3 rounded-2xl bg-secondary p-3 text-sm font-bold text-secondary-foreground">
            💡 Học thêm từ ở mục Học để game ôn đúng từ của con nhé. (Đuổi hình bắt chữ vẫn chơi được với từ mới.)
          </div>
        ) : null}

        <div className="space-y-3">
          {games.map((g) => (
            <button key={g.id} type="button" onClick={() => setGame(g.id)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]">
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
      {game === "match" && <MatchGame pool={reviewPool} onRecord={record} onClose={back} hard={hard} />}
      {game === "pick" && <PickGame pool={reviewPool} onRecord={record} onClose={back} hard={hard} />}
      {game === "listen" && <ListenGame pool={reviewPool} onRecord={record} onClose={back} hard={hard} />}
      {game === "dictation" && <DictationGame pool={reviewPool} onRecord={record} onClose={back} hard={hard} />}
      {game === "build" && <PictureWordGame pool={base} onRecord={record} onClose={back} hard={hard} />}
      {game === "race" && <CarRaceGame pool={reviewPool} onRecord={record} onClose={back} hard={hard} />}
      {game === "sudoku" && <SudokuGame onClose={back} />}
      {game === "wordsearch" && <WordSearchGame words={reviewPool.map((w) => ({ word: w.word, meaning_vi: w.meaning_vi }))} onComplete={() => {}} onBack={back} />}
      {game === "speedtype" && <SpeedTypeGame words={reviewPool.map((w) => ({ word: w.word, meaning_vi: w.meaning_vi }))} onComplete={() => {}} onBack={back} />}
      {game === "wordchain" && <WordChainGame words={SEED_VOCABULARY.map((w) => ({ word: w.word }))} onComplete={() => {}} onBack={back} />}
    </main>
  );
}

interface GameProps {
  pool: VocabularyWord[];
  onRecord: (wordId: string, correct: boolean) => void;
  onClose: () => void;
  hard: boolean;
}

function Finished({ onClose, score }: { onClose: () => void; score?: string }) {
  return (
    <Card className="animate-pop">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <PartyPopper className="h-12 w-12 text-accent" />
        <p className="text-2xl font-black text-primary">{score ? score : "Hoàn thành! 🎉"}</p>
        <Button type="button" size="lg" className="w-full" onClick={onClose}>Chơi tiếp</Button>
      </CardContent>
    </Card>
  );
}

function MatchGame({ pool, onRecord, onClose, hard }: GameProps) {
  const [round] = useState(() => pickWords(pool, hard ? 6 : 4));
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

function PickGame({ pool, onRecord, onClose, hard }: GameProps) {
  const imgPool = useMemo(() => { const w = pool.filter((x) => x.imageUrl); return w.length >= 4 ? w : pool; }, [pool]);
  const [targets] = useState(() => pickWords(imgPool, hard ? 8 : 5));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const target = targets[Math.min(n, Math.max(0, targets.length - 1))];
  const opts = useMemo(() => {
    if (!target) return [];
    return shuffle([target, ...shuffle(imgPool.filter((w) => w.id !== target.id)).slice(0, 3)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, targets]);

  if (n >= targets.length || !target) return (<><SessionHeader title="Chọn ảnh" onClose={onClose} /><Finished onClose={onClose} /></>);

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(target.id, w.id === target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      <SessionHeader title="Chọn ảnh đúng" onClose={onClose} progress={Math.round((n / targets.length) * 100)} />
      <Card><CardContent className="space-y-4 p-6">
        <h2 className="text-center text-4xl font-black capitalize">{target.word}</h2>
        <div className="grid grid-cols-2 gap-3">
          {opts.map((w) => {
            const state = !picked ? "" : w.id === target.id ? "ring-4 ring-success" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
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

function ListenGame({ pool, onRecord, onClose, hard }: GameProps) {
  const [targets] = useState(() => pickWords(pool, hard ? 8 : 5));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const target = targets[Math.min(n, Math.max(0, targets.length - 1))];
  const opts = useMemo(() => {
    if (!target) return [];
    return shuffle([target, ...shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, targets]);

  if (n >= targets.length || !target) return (<><SessionHeader title="Nghe & chọn" onClose={onClose} /><Finished onClose={onClose} /></>);

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    onRecord(target.id, w.id === target.id);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 800);
  };

  return (
    <>
      <SessionHeader title="Nghe & chọn" onClose={onClose} progress={Math.round((n / targets.length) * 100)} />
      <Card><CardContent className="space-y-5 p-6 text-center">
        <Button type="button" size="xl" className="w-full" onClick={() => speakText(target.word, target.audioUrl)}>
          <Volume2 className="h-7 w-7" /> Nghe lại
        </Button>
        <div className="grid grid-cols-2 gap-3">
          {opts.map((w) => {
            const state = !picked ? "" : w.id === target.id ? "ring-4 ring-success bg-success text-white" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
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

// Nghe & gõ chính tả: nghe từ rồi gõ lại đúng chính tả.
function DictationGame({ pool, onRecord, onClose, hard }: GameProps) {
  const [targets] = useState(() => pickWords(pool, hard ? 8 : 5));
  const [n, setN] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const target = targets[Math.min(n, Math.max(0, targets.length - 1))];

  // Tự đọc từ khi sang câu mới (gợi ý nghe).
  useEffect(() => {
    if (target) speakText(target.word, target.audioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (n >= targets.length || !target) return (<><SessionHeader title="Nghe & gõ" onClose={onClose} /><Finished onClose={onClose} /></>);

  const submit = () => {
    if (checked !== null || !input.trim()) return;
    const ok = input.trim().toLowerCase() === target.word.toLowerCase();
    setChecked(ok);
    onRecord(target.id, ok);
  };
  const next = () => { setInput(""); setChecked(null); setN((x) => x + 1); };

  return (
    <>
      <SessionHeader title="Nghe & gõ" onClose={onClose} progress={Math.round((n / targets.length) * 100)} />
      <Card><CardContent className="space-y-5 p-6 text-center">
        <Button type="button" size="xl" className="w-full" onClick={() => speakText(target.word, target.audioUrl)}>
          <Volume2 className="h-7 w-7" /> Nghe lại
        </Button>
        <p className="text-sm font-bold text-muted-foreground">Nghĩa gợi ý: {target.meaning_vi}</p>
        <input
          autoFocus
          className={cn(
            "h-14 w-full rounded-2xl border-2 px-4 text-center text-2xl font-black lowercase outline-none",
            checked === null ? "border-border focus:border-primary" : checked ? "border-success bg-success/10" : "border-red-400 bg-red-50",
          )}
          placeholder="gõ từ con nghe được..."
          value={input}
          disabled={checked !== null}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {checked === null ? (
          <Button type="button" className="w-full" disabled={!input.trim()} onClick={submit}>Kiểm tra</Button>
        ) : (
          <div className="space-y-3">
            <p className={cn("text-lg font-extrabold", checked ? "text-success" : "text-red-600")}>
              {checked ? "Chính xác! 🎉" : `Đáp án đúng: ${target.word}`}
            </p>
            <Button type="button" className="w-full" onClick={next}>
              {n + 1 >= targets.length ? "Xong" : "Từ tiếp"}
            </Button>
          </div>
        )}
      </CardContent></Card>
    </>
  );
}
