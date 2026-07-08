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
  // ─── A1 ─── (20-40 words, very simple sentences, common nouns/verbs)
  {
    id: "ls1", title: "My Morning", titleVi: "Buổi sáng của tôi", level: "a1",
    text: "I wake up at seven. I brush my teeth and wash my face. Then I eat bread and drink milk. After breakfast I walk to school. I like my morning.",
    questions: [
      { question: "What time does the speaker wake up?", options: ["Six", "Seven", "Eight", "Nine"], answer: 1 },
      { question: "What does the speaker eat?", options: ["Rice", "Bread", "Eggs", "Fruit"], answer: 1 },
      { question: "How does the speaker go to school?", options: ["By bus", "By car", "Walking", "By bike"], answer: 2 },
    ],
  },
  {
    id: "ls2", title: "My Dog Max", titleVi: "Con chó Max", level: "a1",
    text: "I've got a dog. His name's Max. He's small and brown. He likes to run in the park. I play with him every day. Max is my best friend.",
    questions: [
      { question: "What's the dog's name?", options: ["Buddy", "Rex", "Max", "Sam"], answer: 2 },
      { question: "What color is the dog?", options: ["White", "Black", "Brown", "Gray"], answer: 2 },
      { question: "Where does the dog like to run?", options: ["In the house", "In the park", "At school", "In the garden"], answer: 1 },
    ],
  },
  {
    id: "ls3", title: "My Family", titleVi: "Gia đình tôi", level: "a1",
    text: "There are four people in my family. My dad's a teacher. My mom works at a hospital. I've got one sister. She's five years old. We live in a small house. I love my family.",
    questions: [
      { question: "How many people are in the family?", options: ["Three", "Four", "Five", "Six"], answer: 1 },
      { question: "What does the dad do?", options: ["He's a doctor", "He's a teacher", "He's a cook", "He's a driver"], answer: 1 },
      { question: "How old is the sister?", options: ["Three", "Four", "Five", "Six"], answer: 2 },
    ],
  },
  // ─── A2 ─── (40-70 words, simple past/present, daily life, short dialogues)
  {
    id: "ls4", title: "A Day at the Beach", titleVi: "Một ngày ở biển", level: "a2",
    text: "Last Sunday my family went to the beach. It was sunny and warm. We swam in the sea and built a sandcastle. My sister found some pretty shells. At lunchtime we ate sandwiches and drank juice. In the afternoon we played volleyball. We didn't want to go home. It was a wonderful day.",
    questions: [
      { question: "When did they go to the beach?", options: ["Saturday", "Sunday", "Monday", "Friday"], answer: 1 },
      { question: "What did the sister find?", options: ["Stones", "Fish", "Shells", "Flowers"], answer: 2 },
      { question: "What did they eat for lunch?", options: ["Pizza", "Rice", "Sandwiches", "Burgers"], answer: 2 },
      { question: "What sport did they play?", options: ["Football", "Tennis", "Basketball", "Volleyball"], answer: 3 },
    ],
  },
  {
    id: "ls5", title: "Shopping with Mom", titleVi: "Đi mua sắm với mẹ", level: "a2",
    text: "On Saturday I went shopping with my mom. We drove to the supermarket. We bought vegetables, fruit, and some chicken. Mom also got a new book for me. I was really happy. Then we stopped at a cafe and had hot chocolate. It was a nice afternoon.",
    questions: [
      { question: "When did they go shopping?", options: ["Monday", "Friday", "Saturday", "Sunday"], answer: 2 },
      { question: "What did Mom buy for the child?", options: ["A toy", "A book", "Clothes", "A phone"], answer: 1 },
      { question: "Where did they stop after shopping?", options: ["A park", "A restaurant", "A cafe", "A library"], answer: 2 },
    ],
  },
  {
    id: "ls6", title: "My Hobby", titleVi: "Sở thích của tôi", level: "a2",
    text: "I really like drawing. Every evening after homework I sit at my desk and draw. I mostly draw animals and flowers. My favorite thing to draw is cats. Last month I won a drawing competition at school. My teacher said I'm very talented. I want to be an artist when I grow up.",
    questions: [
      { question: "What's the speaker's hobby?", options: ["Singing", "Drawing", "Dancing", "Reading"], answer: 1 },
      { question: "What does the speaker like to draw most?", options: ["Dogs", "Trees", "Cats", "Houses"], answer: 2 },
      { question: "What happened last month?", options: ["Started a new class", "Won a competition", "Got a new pet", "Had a birthday"], answer: 1 },
      { question: "What does the speaker want to be?", options: ["A teacher", "A doctor", "An artist", "A singer"], answer: 2 },
    ],
  },
  // ─── B1 ─── (70-120 words, varied tenses, social/work topics, opinions)
  {
    id: "ls7", title: "The New Neighbor", titleVi: "Người hàng xóm mới", level: "b1",
    text: "Last week a new family moved into the house next to ours. They've got two kids, a boy and a girl. The boy's about my age, so we started talking right away. His name's David and he's from Canada. He told me about his old school and how much he misses his friends there. I felt bad for him, so I invited him to play football with my group. He was so happy he said yes immediately. We've been hanging out every day since then. I think we're going to be really good friends.",
    questions: [
      { question: "Where did the new family move to?", options: ["Across the street", "Next door", "Another city", "A nearby apartment"], answer: 1 },
      { question: "Where's David from?", options: ["Australia", "England", "Canada", "America"], answer: 2 },
      { question: "Why did the speaker invite David to play?", options: ["David asked him", "He felt bad for David", "Their parents told them to", "They were in the same class"], answer: 1 },
      { question: "How many children does the new family have?", options: ["One", "Two", "Three", "Four"], answer: 1 },
    ],
  },
  {
    id: "ls8", title: "A Cooking Lesson", titleVi: "Bài học nấu ăn", level: "b1",
    text: "Yesterday my grandmother taught me how to make chicken soup. First we washed the vegetables and cut them into small pieces. Then we boiled water in a big pot and put the chicken in. After about thirty minutes we added the vegetables and a bit of salt. The kitchen smelled amazing. When it was ready the whole family sat down to eat together. Everyone said the soup was delicious, and my grandmother smiled at me. I felt really proud of myself. I can't wait to cook again next weekend.",
    questions: [
      { question: "Who taught the speaker to cook?", options: ["Mother", "Father", "Grandmother", "A teacher"], answer: 2 },
      { question: "What did they cook?", options: ["Fried rice", "Chicken soup", "Pasta", "Fish"], answer: 1 },
      { question: "How long did they cook the chicken?", options: ["Ten minutes", "Twenty minutes", "Thirty minutes", "One hour"], answer: 2 },
      { question: "How did the speaker feel at the end?", options: ["Tired", "Sad", "Proud", "Bored"], answer: 2 },
    ],
  },
  {
    id: "ls9", title: "A Trip to the Mountains", titleVi: "Chuyến đi lên núi", level: "b1",
    text: "During the summer holiday my family took a trip to the mountains. We stayed at a small hotel near a lake. Every morning we'd go hiking on different trails. The views were incredible. One day we saw some wild deer near the river. My dad took lots of photos. In the evenings we'd sit around a campfire and tell stories. I've never felt so relaxed in my life. The trip only lasted five days, but it gave me memories I'll never forget. I really hope we can go back next year.",
    questions: [
      { question: "Where did the family stay?", options: ["A tent", "A friend's house", "A small hotel", "A cabin"], answer: 2 },
      { question: "What did they do every morning?", options: ["Swimming", "Hiking", "Fishing", "Cycling"], answer: 1 },
      { question: "What animals did they see?", options: ["Bears", "Rabbits", "Deer", "Eagles"], answer: 2 },
      { question: "How long was the trip?", options: ["Three days", "Five days", "One week", "Two weeks"], answer: 1 },
    ],
  },
  // ─── B2 ─── (120-180 words, complex ideas, abstract topics, natural speech)
  {
    id: "ls10", title: "Working from Home", titleVi: "Làm việc tại nhà", level: "b2",
    text: "Since the pandemic a lot of companies have let their employees work from home, and honestly it's changed the way people think about their daily lives. Some workers love the flexibility because they don't have to commute anymore. They can spend that extra time with their families or on hobbies. But it's not all positive. Many people find it really hard to switch off when their office is also their living room. They end up working longer hours without even realizing it. There's also the social side. Working alone all day can feel pretty isolating, and some people really miss chatting with colleagues over coffee. Experts say the key is to set up a proper workspace at home and stick to a fixed schedule. That way you've got a clear line between work time and personal time. It takes discipline, but most people say it's worth it.",
    questions: [
      { question: "What's one benefit of working from home?", options: ["Higher salary", "No commuting", "More meetings", "Better equipment"], answer: 1 },
      { question: "What problem do some workers have?", options: ["No internet", "Difficulty stopping work", "Too many breaks", "Not enough work"], answer: 1 },
      { question: "Why do some people feel isolated?", options: ["They don't have phones", "They work alone all day", "They live far away", "They don't like their job"], answer: 1 },
      { question: "What do experts recommend?", options: ["Work at a cafe", "Set up a proper workspace and fixed schedule", "Work only part-time", "Change jobs"], answer: 1 },
    ],
  },
  {
    id: "ls11", title: "Protecting the Ocean", titleVi: "Bảo vệ đại dương", level: "b2",
    text: "The ocean covers more than seventy percent of our planet and it's home to millions of species. But unfortunately we're doing a lot of damage to it. Plastic pollution is probably the biggest problem right now. Scientists think about eight million tons of plastic end up in the ocean every single year. Sea animals like turtles and fish often mistake this plastic for food, which can kill them. Overfishing is another serious issue because it's disrupting the natural balance of marine life. The good news is that people are starting to pay attention. Many countries have banned single use plastics and they're creating protected areas in the ocean where fishing isn't allowed. But governments can't do it alone. We all need to do our part by using less plastic, recycling properly, and supporting organizations that protect marine life. Even small changes in our daily habits can make a real difference.",
    questions: [
      { question: "How much of the Earth's surface does the ocean cover?", options: ["Fifty percent", "Sixty percent", "More than seventy percent", "Eighty percent"], answer: 2 },
      { question: "How much plastic enters the ocean each year?", options: ["One million tons", "Five million tons", "About eight million tons", "Ten million tons"], answer: 2 },
      { question: "Why does plastic harm sea animals?", options: ["It's too heavy", "They mistake it for food", "It's too hot", "It blocks sunlight"], answer: 1 },
      { question: "What's the speaker's main message?", options: ["Stop eating fish", "Only governments can help", "Everyone needs to do their part", "The ocean is too damaged to save"], answer: 2 },
    ],
  },
  {
    id: "ls12", title: "The Future of Education", titleVi: "Tương lai của giáo dục", level: "b2",
    text: "Over the past few years technology has completely transformed the way we learn. Online courses and video lessons have made education accessible to people who couldn't attend traditional schools. You can now learn almost anything from coding to cooking just by watching videos on your phone. But there's an ongoing debate about whether this is actually better than classroom learning. Some educators argue that students need face to face interaction to develop social skills and stay motivated. Others believe that online learning gives students more freedom to study at their own pace. Personally I think the best approach is a mix of both. Students can watch lectures online and then come to class for discussions and group projects. This way they get the convenience of technology without losing the human connection. Whatever happens it's clear that education will keep evolving, and we need to be ready to adapt.",
    questions: [
      { question: "What has technology done to education?", options: ["Made it more expensive", "Transformed how we learn", "Replaced all teachers", "Made it less popular"], answer: 1 },
      { question: "What do some educators worry about?", options: ["Too many students", "Students losing social skills", "Technology being too expensive", "Not enough online courses"], answer: 1 },
      { question: "What approach does the speaker prefer?", options: ["Only online learning", "Only classroom learning", "A mix of both", "No technology at all"], answer: 2 },
      { question: "What does the speaker say about the future?", options: ["Nothing will change", "Education will keep evolving", "Schools will close", "Online learning will disappear"], answer: 1 },
    ],
  },
];

export function ListeningPage({ student, onBackHome }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<Level>(student.level);

  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
