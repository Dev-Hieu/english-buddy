import { BookOpen, CheckCircle2, Clock, Ear, Headphones, Image, MessageSquare, RotateCcw, Volume2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Student, VocabularyWord } from "@/types";
import type { Level } from "@/types/student";
import { LEVEL_LABELS, LEVEL_ORDER } from "@/types/student";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { speakText } from "@/services/speechService";
import { matchesLevel } from "@/utils/levelFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; onBackHome: () => void; }

type Mode = "word-image" | "sentence" | "stories";

const MODES: { key: Mode; icon: typeof Ear; label: string; desc: string; color: string }[] = [
  { key: "word-image", icon: Image, label: "Nghe từ chọn ảnh", desc: "Nghe phát âm → chọn hình đúng", color: "bg-blue-100 text-blue-600" },
  { key: "sentence", icon: MessageSquare, label: "Nghe câu chọn đáp án", desc: "Nghe câu → chọn câu trả lời đúng", color: "bg-green-100 text-green-600" },
  { key: "stories", icon: Headphones, label: "Nghe hiểu câu chuyện", desc: "Nghe audio stories → trả lời câu hỏi", color: "bg-purple-100 text-purple-600" },
];

const ROUND_SIZE = 10;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function pickN(pool: VocabularyWord[], n: number): VocabularyWord[] {
  return shuffle(pool).slice(0, n);
}

// ── Stories placeholder data ──
interface StoryItem {
  id: string;
  title: string;
  titleVi: string;
  level: Level;
  description: string;
  duration: string;
}

const STORIES: StoryItem[] = [
  { id: "s1", title: "The Red Ball", titleVi: "Quả bóng đỏ", level: "kids", description: "A little boy finds a red ball in the park.", duration: "2 min" },
  { id: "s2", title: "My Family", titleVi: "Gia đình của con", level: "a1", description: "A girl talks about her family members.", duration: "3 min" },
  { id: "s3", title: "A Day at School", titleVi: "Một ngày ở trường", level: "a1", description: "Tom tells us about his school day.", duration: "3 min" },
  { id: "s4", title: "The Pet Shop", titleVi: "Cửa hàng thú cưng", level: "a2", description: "Anna visits a pet shop and sees many animals.", duration: "4 min" },
  { id: "s5", title: "A Trip to the Beach", titleVi: "Chuyến đi biển", level: "a2", description: "A family goes on a trip to the beach.", duration: "4 min" },
  { id: "s6", title: "The Lost Key", titleVi: "Chiếc chìa khóa bị mất", level: "b1", description: "A mystery story about a lost key in an old house.", duration: "5 min" },
  { id: "s7", title: "The Science Fair", titleVi: "Hội chợ khoa học", level: "b1", description: "Students prepare their projects for the science fair.", duration: "5 min" },
  { id: "s8", title: "The Exchange Student", titleVi: "Học sinh trao đổi", level: "b2", description: "An exchange student adapts to life in a new country.", duration: "6 min" },
  { id: "s9", title: "The Debate", titleVi: "Cuộc tranh luận", level: "b2", description: "Two teams debate about technology in education.", duration: "7 min" },
  { id: "s10", title: "The Startup", titleVi: "Công ty khởi nghiệp", level: "c1", description: "A young entrepreneur shares the story of building a tech company.", duration: "8 min" },
];

export function ListeningPage({ student, onBackHome }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<Level>(student.level);

  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Nghe" onClose={onBackHome} />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVEL_ORDER.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l === "kids" ? "Kids" : l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MODES.map((m) => (
            <button key={m.key} type="button" onClick={() => setMode(m.key)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md text-left">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", m.color)}>
                <m.icon className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          Trình độ: {level === "kids" ? "Kids" : level.toUpperCase()} · {student.name}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      {mode === "word-image" && <WordImageGame level={level} onClose={() => setMode(null)} />}
      {mode === "sentence" && <SentenceGame level={level} onClose={() => setMode(null)} />}
      {mode === "stories" && <StoriesView level={level} onClose={() => setMode(null)} />}
    </main>
  );
}

// ════════════════════════════════════════════
// Mode 1: Nghe từ chọn ảnh
// ════════════════════════════════════════════

function WordImageGame({ level, onClose }: { level: Level; onClose: () => void }) {
  const pool = useMemo(() => {
    const filtered = SEED_VOCABULARY.filter((w) => w.imageUrl && matchesLevel(w.level, level));
    return filtered.length >= 4 ? filtered : SEED_VOCABULARY.filter((w) => w.imageUrl);
  }, [level]);

  const [targets] = useState(() => pickN(pool, ROUND_SIZE));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const target = n < targets.length ? targets[n] : null;

  const opts = useMemo(() => {
    if (!target) return [];
    const others = shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3);
    return shuffle([target, ...others]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, targets]);

  // Auto-play TTS when question changes
  useEffect(() => {
    if (target) speakText(target.word, target.audioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!target) {
    return (
      <>
        <SessionHeader title="Nghe từ chọn ảnh" onClose={onClose} />
        <ScoreCard score={score} total={targets.length} onClose={onClose} />
      </>
    );
  }

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    if (w.id === target.id) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 900);
  };

  return (
    <>
      <SessionHeader title="Nghe từ chọn ảnh" onClose={onClose} progress={Math.round((n / targets.length) * 100)} />
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-center text-xs font-bold text-muted-foreground">Câu {n + 1}/{targets.length}</p>

          <Button type="button" size="xl" className="w-full" onClick={() => speakText(target.word, target.audioUrl)}>
            <Volume2 className="h-7 w-7" /> Nghe lại
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {opts.map((w) => {
              const isCorrect = w.id === target.id;
              const state = !picked ? "" : isCorrect ? "ring-4 ring-success" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
              return (
                <button key={w.id} type="button" onClick={() => choose(w)}
                  className={cn("overflow-hidden rounded-2xl border-2 border-border transition-all active:translate-y-[1px]", state)}>
                  <img src={w.imageUrl} alt="" className="h-28 w-full object-cover" loading="lazy" />
                  {picked && isCorrect && (
                    <p className="bg-success/10 py-1 text-center text-xs font-extrabold text-success capitalize">{w.word}</p>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ════════════════════════════════════════════
// Mode 2: Nghe câu chọn đáp án
// ════════════════════════════════════════════

interface SentenceQuestion {
  word: VocabularyWord;
  sentence: string;
  correctVi: string;
  options: string[];
}

function buildSentenceQuestion(target: VocabularyWord, pool: VocabularyWord[]): SentenceQuestion {
  const sentence = target.example || `I have a ${target.word}.`;
  const correctVi = target.example_vi || target.meaning_vi;

  // Pick 3 wrong Vietnamese translations from other words
  const wrongPool = shuffle(pool.filter((w) => w.id !== target.id));
  const wrongs: string[] = [];
  const usedVi = new Set<string>([correctVi]);
  for (const w of wrongPool) {
    const vi = w.example_vi || w.meaning_vi;
    if (!usedVi.has(vi)) { wrongs.push(vi); usedVi.add(vi); }
    if (wrongs.length >= 3) break;
  }

  return {
    word: target,
    sentence,
    correctVi,
    options: shuffle([correctVi, ...wrongs]),
  };
}

function SentenceGame({ level, onClose }: { level: Level; onClose: () => void }) {
  const pool = useMemo(() => {
    const filtered = SEED_VOCABULARY.filter((w) => matchesLevel(w.level, level));
    return filtered.length >= 4 ? filtered : SEED_VOCABULARY;
  }, [level]);

  const [questions] = useState(() => {
    const targets = pickN(pool, ROUND_SIZE);
    return targets.map((t) => buildSentenceQuestion(t, pool));
  });
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = n < questions.length ? questions[n] : null;

  // Auto-play TTS
  useEffect(() => {
    if (q) speakText(q.sentence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!q) {
    return (
      <>
        <SessionHeader title="Nghe câu chọn đáp án" onClose={onClose} />
        <ScoreCard score={score} total={questions.length} onClose={onClose} />
      </>
    );
  }

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correctVi) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 900);
  };

  return (
    <>
      <SessionHeader title="Nghe câu chọn đáp án" onClose={onClose} progress={Math.round((n / questions.length) * 100)} />
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-center text-xs font-bold text-muted-foreground">Câu {n + 1}/{questions.length}</p>

          <Button type="button" size="xl" className="w-full" onClick={() => speakText(q.sentence)}>
            <Volume2 className="h-7 w-7" /> Nghe lại
          </Button>

          <div className="space-y-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctVi;
              const state = !picked
                ? "border-border hover:border-primary/50"
                : isCorrect
                  ? "border-success bg-success/10 text-success"
                  : opt === picked
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-border opacity-50";
              return (
                <button key={opt} type="button" onClick={() => choose(opt)}
                  className={cn("flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-all active:translate-y-[1px]", state)}>
                  {picked && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                  {picked && opt === picked && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ════════════════════════════════════════════
// Mode 3: Audio stories (placeholder)
// ════════════════════════════════════════════

function StoriesView({ level, onClose }: { level: Level; onClose: () => void }) {
  const filtered = useMemo(() => {
    const result = STORIES.filter((s) => matchesLevel(s.level, level));
    return result.length > 0 ? result : STORIES;
  }, [level]);

  return (
    <>
      <SessionHeader title="Nghe hiểu câu chuyện" onClose={onClose} />

      <p className="mb-4 text-center text-sm font-bold text-muted-foreground">
        {LEVEL_LABELS[level] ?? level.toUpperCase()} · {filtered.length} câu chuyện
      </p>

      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <CardContent className="flex items-start gap-4 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <BookOpen className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold truncate">{s.title}</p>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                    {s.level === "kids" ? "Kids" : s.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-bold text-muted-foreground">{s.titleVi}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </span>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-extrabold text-accent-foreground">
                    Sắp ra mắt
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

// ════════════════════════════════════════════
// Shared: Score card
// ════════════════════════════════════════════

function ScoreCard({ score, total, onClose }: { score: number; total: number; onClose: () => void }) {
  const pct = Math.round((score / total) * 100);
  const great = pct >= 80;

  return (
    <Card className="animate-pop">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <span className={cn("flex h-16 w-16 items-center justify-center rounded-full", great ? "bg-success/20" : "bg-orange-100")}>
          {great
            ? <CheckCircle2 className="h-8 w-8 text-success" />
            : <RotateCcw className="h-8 w-8 text-orange-500" />}
        </span>
        <p className="text-3xl font-black text-primary">{score}/{total}</p>
        <p className={cn("text-sm font-extrabold", great ? "text-success" : "text-orange-500")}>
          {great ? "Xuất sắc!" : "Cố gắng hơn nhé!"}
        </p>
        <p className="text-xs text-muted-foreground">Đúng {pct}% câu hỏi</p>
        <Button type="button" size="lg" className="w-full" onClick={onClose}>
          <RotateCcw className="h-4 w-4" /> Chơi lại
        </Button>
      </CardContent>
    </Card>
  );
}
