import { CheckCircle2, Ear, Headphones, Image, MessageSquare, Play, RotateCcw, Volume2, XCircle } from "lucide-react";
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

// ── Listening stories data ──
interface StoryQuestion { question: string; options: string[]; answer: number; }

interface StoryItem {
  id: string;
  title: string;
  titleVi: string;
  level: Level;
  text: string;
  questions: StoryQuestion[];
}

const LISTENING_STORIES: StoryItem[] = [
  // ─── A1 ───
  {
    id: "ls1", title: "My Morning", titleVi: "Buổi sáng của tôi", level: "a1",
    text: "I wake up at seven o'clock. I eat bread and drink milk for breakfast. Then I go to school. I like my morning.",
    questions: [
      { question: "What time does the speaker wake up?", options: ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"], answer: 1 },
      { question: "What does the speaker eat for breakfast?", options: ["Rice", "Bread", "Eggs", "Fruit"], answer: 1 },
      { question: "Where does the speaker go after breakfast?", options: ["To the park", "To school", "To work", "To the shop"], answer: 1 },
    ],
  },
  {
    id: "ls2", title: "My Dog", titleVi: "Con chó của tôi", level: "a1",
    text: "I have a dog. His name is Max. Max is brown and small. He likes to run in the park. I play with Max every day.",
    questions: [
      { question: "What is the dog's name?", options: ["Buddy", "Rex", "Max", "Sam"], answer: 2 },
      { question: "What color is the dog?", options: ["White", "Black", "Brown", "Gray"], answer: 2 },
      { question: "Where does the dog like to run?", options: ["In the house", "In the park", "At school", "In the garden"], answer: 1 },
    ],
  },
  // ─── A2 ───
  {
    id: "ls3", title: "The Weather Today", titleVi: "Thời tiết hôm nay", level: "a2",
    text: "Today the weather is very nice. The sun is shining and the sky is blue. It is warm outside. My friends and I go to the park after school. We play football and eat ice cream. It is a perfect day.",
    questions: [
      { question: "How is the weather today?", options: ["Rainy", "Cold", "Nice and warm", "Windy"], answer: 2 },
      { question: "What do they do after school?", options: ["Go home", "Go to the park", "Go shopping", "Study"], answer: 1 },
      { question: "What do they eat?", options: ["Cake", "Candy", "Ice cream", "Pizza"], answer: 2 },
    ],
  },
  {
    id: "ls4", title: "Shopping with Mom", titleVi: "Đi mua sắm với mẹ", level: "a2",
    text: "On Saturday, I go shopping with my mom. We go to the supermarket. We buy vegetables, fruit, and chicken. Mom also buys a new book for me. I am very happy. We carry the bags to the car and drive home.",
    questions: [
      { question: "When do they go shopping?", options: ["Monday", "Friday", "Saturday", "Sunday"], answer: 2 },
      { question: "What does Mom buy for the child?", options: ["A toy", "A book", "Clothes", "A phone"], answer: 1 },
      { question: "How do they go home?", options: ["By bus", "By car", "On foot", "By bike"], answer: 1 },
    ],
  },
  // ─── B1 ───
  {
    id: "ls5", title: "The New Neighbor", titleVi: "Người hàng xóm mới", level: "b1",
    text: "Last week, a new family moved into the house next to ours. They have two children, a boy and a girl. The boy is about my age, so we started talking. His name is David and he comes from Canada. He told me about his old school and his friends there. I invited him to play football with my friends. He was very happy and said yes. Now we are becoming good friends.",
    questions: [
      { question: "Where did the new family move to?", options: ["Across the street", "Next door", "Another city", "A nearby apartment"], answer: 1 },
      { question: "Where is David from?", options: ["Australia", "England", "Canada", "America"], answer: 2 },
      { question: "What did the speaker invite David to do?", options: ["Watch a movie", "Play football", "Go to school", "Have dinner"], answer: 1 },
      { question: "How many children does the new family have?", options: ["One", "Two", "Three", "Four"], answer: 1 },
    ],
  },
  {
    id: "ls6", title: "A Cooking Lesson", titleVi: "Bài học nấu ăn", level: "b1",
    text: "Yesterday, my grandmother taught me how to cook chicken soup. First, we washed the vegetables and cut them into small pieces. Then we boiled water in a big pot and added the chicken. After thirty minutes, we put in the vegetables and some salt. The soup smelled wonderful. When it was ready, the whole family sat down together to eat. Everyone said the soup was delicious. I felt very proud.",
    questions: [
      { question: "Who taught the speaker to cook?", options: ["Mother", "Father", "Grandmother", "A teacher"], answer: 2 },
      { question: "What did they cook?", options: ["Fried rice", "Chicken soup", "Pasta", "Fish"], answer: 1 },
      { question: "How long did they boil the chicken?", options: ["Ten minutes", "Twenty minutes", "Thirty minutes", "One hour"], answer: 2 },
      { question: "How did the speaker feel?", options: ["Tired", "Sad", "Proud", "Bored"], answer: 2 },
    ],
  },
  // ─── B2 ───
  {
    id: "ls7", title: "Working from Home", titleVi: "Làm việc tại nhà", level: "b2",
    text: "Since the pandemic, many companies have allowed their employees to work from home. This has changed the way people think about their daily routines. Some workers enjoy the flexibility of working from home because they save time on commuting and can spend more time with family. However, others find it difficult to separate work from personal life. They often end up working longer hours because there is no clear boundary. Experts suggest creating a dedicated workspace and setting strict working hours to maintain a healthy balance.",
    questions: [
      { question: "What caused many companies to allow working from home?", options: ["A new law", "The pandemic", "Employee requests", "Cost reduction"], answer: 1 },
      { question: "What do some workers enjoy about working from home?", options: ["Higher salary", "Flexibility and less commuting", "More meetings", "Better equipment"], answer: 1 },
      { question: "What problem do some workers face?", options: ["No internet", "Difficulty separating work and personal life", "Too many breaks", "Boredom"], answer: 1 },
      { question: "What do experts suggest?", options: ["Work at a cafe", "Create a dedicated workspace and set strict hours", "Work only part-time", "Change jobs"], answer: 1 },
    ],
  },
  {
    id: "ls8", title: "Protecting the Ocean", titleVi: "Bảo vệ đại dương", level: "b2",
    text: "The ocean covers more than seventy percent of the Earth's surface and is home to millions of species. Unfortunately, human activities such as plastic pollution, overfishing, and oil spills are causing serious damage to marine ecosystems. Scientists estimate that eight million tons of plastic enter the ocean every year. This plastic harms sea animals who mistake it for food. Many countries are now taking action by banning single-use plastics and creating marine protected areas. Individuals can also help by reducing plastic use, recycling properly, and supporting organizations that work to keep our oceans clean.",
    questions: [
      { question: "How much of the Earth's surface does the ocean cover?", options: ["Fifty percent", "Sixty percent", "Seventy percent", "Eighty percent"], answer: 2 },
      { question: "How much plastic enters the ocean each year?", options: ["One million tons", "Five million tons", "Eight million tons", "Ten million tons"], answer: 2 },
      { question: "Why does plastic harm sea animals?", options: ["It is too heavy", "They mistake it for food", "It is too hot", "It blocks sunlight"], answer: 1 },
      { question: "What are some countries doing to help?", options: ["Building more ships", "Banning single-use plastics", "Closing beaches", "Stopping fishing completely"], answer: 1 },
    ],
  },
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
// Mode 3: Nghe hiểu câu chuyện
// ════════════════════════════════════════════

type StoryScreen = "list" | "listening" | "quiz" | "result";

function StoriesView({ level, onClose }: { level: Level; onClose: () => void }) {
  const [screen, setScreen] = useState<StoryScreen>("list");
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const result = LISTENING_STORIES.filter((s) => matchesLevel(s.level, level));
    return result.length > 0 ? result : LISTENING_STORIES;
  }, [level]);

  const score = useMemo(() => {
    if (!activeStory) return 0;
    return answers.reduce<number>((acc, a, i) => acc + (a === activeStory.questions[i].answer ? 1 : 0), 0);
  }, [answers, activeStory]);

  function openStory(s: StoryItem) {
    setActiveStory(s);
    setScreen("listening");
    setAnswers(s.questions.map(() => null));
    setSubmitted(false);
  }

  function selectAnswer(qi: number, oi: number) {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  }

  function submitQuiz() { setSubmitted(true); setScreen("result"); }

  function backToList() { setScreen("list"); setActiveStory(null); }

  // ─── Story List ───
  if (screen === "list") {
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
                  <Headphones className="h-6 w-6" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold truncate">{s.title}</p>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                      {s.level === "kids" ? "Kids" : s.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">{s.titleVi}</p>
                  <div className="mt-2">
                    <Button type="button" size="sm" onClick={() => openStory(s)}>
                      <Headphones className="h-4 w-4" /> Nghe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!activeStory) return null;

  // ─── Listening Screen ───
  if (screen === "listening") {
    return (
      <>
        <SessionHeader title={activeStory.title} onClose={backToList} />
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-6">
            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
              {activeStory.level === "kids" ? "Kids" : activeStory.level.toUpperCase()}
            </span>
            <p className="text-center text-sm font-bold text-muted-foreground">{activeStory.titleVi}</p>

            <Button type="button" size="xl" className="w-full" onClick={() => speakText(activeStory.text)}>
              <Play className="h-7 w-7" /> Nghe câu chuyện
            </Button>

            <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => speakText(activeStory.text)}>
              <RotateCcw className="h-4 w-4" /> Nghe lại
            </Button>

            <Button type="button" size="lg" className="w-full" onClick={() => setScreen("quiz")}>
              Trả lời câu hỏi
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  // ─── Quiz Screen ───
  if (screen === "quiz") {
    return (
      <>
        <SessionHeader title={activeStory.title} onClose={backToList} />
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold">{activeStory.questions.length} câu hỏi</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => speakText(activeStory.text)}>
                <Volume2 className="h-4 w-4" /> Nghe lại
              </Button>
            </div>

            {activeStory.questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm font-bold">Câu {qi + 1}. {q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <button key={oi} type="button" onClick={() => selectAnswer(qi, oi)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-2.5 text-left text-sm font-bold transition-all active:translate-y-[1px]",
                        answers[qi] === oi ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                      )}>
                      <span className="flex-1">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button type="button" size="lg" className="w-full" onClick={submitQuiz}
              disabled={answers.some((a) => a === null)}>
              Nộp bài
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  // ─── Result Screen ───
  return (
    <>
      <SessionHeader title={activeStory.title} onClose={backToList} />
      <Card className="animate-pop">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className={cn("flex h-16 w-16 items-center justify-center rounded-full", score >= activeStory.questions.length * 0.8 ? "bg-success/20" : "bg-orange-100")}>
            {score >= activeStory.questions.length * 0.8
              ? <CheckCircle2 className="h-8 w-8 text-success" />
              : <RotateCcw className="h-8 w-8 text-orange-500" />}
          </span>
          <p className="text-3xl font-black text-primary">{score}/{activeStory.questions.length}</p>
          <p className={cn("text-sm font-extrabold", score >= activeStory.questions.length * 0.8 ? "text-success" : "text-orange-500")}>
            {score >= activeStory.questions.length * 0.8 ? "Xuất sắc!" : "Cố gắng hơn nhé!"}
          </p>
          <p className="text-xs text-muted-foreground">Đúng {Math.round((score / activeStory.questions.length) * 100)}% câu hỏi</p>
        </CardContent>
      </Card>

      {/* Answer review */}
      <div className="mt-4 space-y-3">
        {activeStory.questions.map((q, qi) => {
          const isCorrect = answers[qi] === q.answer;
          return (
            <Card key={qi}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                  <p className="text-sm font-bold">{q.question}</p>
                </div>
                {!isCorrect && answers[qi] !== null && (
                  <p className="ml-6 text-xs text-red-500">Bạn chọn: {q.options[answers[qi]!]}</p>
                )}
                <p className="ml-6 text-xs font-bold text-success">Đáp án: {q.options[q.answer]}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <Button type="button" size="lg" className="w-full" onClick={() => openStory(activeStory)}>
          <RotateCcw className="h-4 w-4" /> Nghe lại
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={backToList}>
          Danh sách
        </Button>
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
