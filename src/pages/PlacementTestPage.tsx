import { useState } from "react";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { GraduationCap, CheckCircle, XCircle, Trophy, Award, Printer } from "lucide-react";

// ── Types ──

type CEFRLevel = "pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface Question {
  level: CEFRLevel;
  type: "vocabulary" | "grammar" | "listening" | "reading";
  question: string;
  instruction?: string; // Vietnamese instruction for the question
  options: [string, string, string, string];
  answer: number; // 0-based index
}

interface Props {
  student: Student;
  onComplete: (level: string) => void;
  onBack: () => void;
}

// ── Question bank: 7 levels x 6 questions = 42 total ──

const QUESTION_BANK: Question[] = [
  // ── Pre-A1 (Mam non — Kindergarten, 3-5 tuoi) ──
  // Picture/audio based, no reading required, Vietnamese instructions
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe va chon dap an dung",
    question: "Listen: 'Cat'. Which one is a cat?",
    options: ["\uD83D\uDC31 Cat", "\uD83D\uDC36 Dog", "\uD83D\uDC1F Fish", "\uD83D\uDC26 Bird"], answer: 0,
  },
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe va chon mau sac dung",
    question: "Listen: 'Red'. Which color is red?",
    options: ["\uD83D\uDFE2 Green", "\uD83D\uDD35 Blue", "\uD83D\uDD34 Red", "\uD83D\uDFE1 Yellow"], answer: 2,
  },
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Dem va chon so dung",
    question: "How many apples? \uD83C\uDF4E\uD83C\uDF4E\uD83C\uDF4E",
    options: ["1", "2", "3", "4"], answer: 2,
  },
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe va chon con vat dung",
    question: "Listen: 'Dog'. Which one is a dog?",
    options: ["\uD83D\uDC31 Cat", "\uD83D\uDC36 Dog", "\uD83D\uDC18 Elephant", "\uD83D\uDC20 Fish"], answer: 1,
  },
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Chon bo phan co the dung",
    question: "Where is your nose? Point to the right picture.",
    options: ["\uD83D\uDC42 Ear", "\uD83D\uDC41\uFE0F Eye", "\uD83D\uDC43 Nose", "\uD83D\uDC44 Mouth"], answer: 2,
  },
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe va chon so dung",
    question: "Listen: 'Five'. Which number is five?",
    options: ["2", "3", "4", "5"], answer: 3,
  },

  // ── A1 (Tieu hoc — Primary, 6-11 tuoi) ──
  // Basic words, simple sentences
  {
    level: "A1", type: "vocabulary",
    question: "What is this? (picture of an apple)",
    options: ["Apple", "Car", "Book", "Pen"], answer: 0,
  },
  {
    level: "A1", type: "grammar",
    question: "I ___ a student.",
    options: ["am", "is", "are", "be"], answer: 0,
  },
  {
    level: "A1", type: "reading",
    question: "\"My name is Tom. I am 7.\" How old is Tom?",
    options: ["5", "6", "7", "8"], answer: 2,
  },
  {
    level: "A1", type: "vocabulary",
    question: "What color is the sky?",
    options: ["Blue", "Red", "Green", "Yellow"], answer: 0,
  },
  {
    level: "A1", type: "grammar",
    question: "She ___ a teacher.",
    options: ["am", "is", "are", "be"], answer: 1,
  },
  {
    level: "A1", type: "listening",
    question: "Someone says: \"Hello, how are you?\" What do you say?",
    options: ["I am fine, thank you.", "I am a book.", "Goodbye.", "My name is cat."], answer: 0,
  },

  // ── A2 (Trung hoc — Secondary, 12-15 tuoi) ──
  // Daily life, past tense, comparatives
  {
    level: "A2", type: "grammar",
    question: "She ___ to school yesterday.",
    options: ["go", "goes", "went", "going"], answer: 2,
  },
  {
    level: "A2", type: "grammar",
    question: "This house is ___ than that one.",
    options: ["big", "bigger", "biggest", "more big"], answer: 1,
  },
  {
    level: "A2", type: "vocabulary",
    question: "A place where you buy medicine is a ___.",
    options: ["library", "pharmacy", "bakery", "market"], answer: 1,
  },
  {
    level: "A2", type: "reading",
    question: "\"Dear Tom, The meeting is at 3pm on Friday in Room 12.\" When is the meeting?",
    options: ["Monday at 12pm", "Friday at 3pm", "Wednesday at 3pm", "Friday at 12pm"], answer: 1,
  },
  {
    level: "A2", type: "grammar",
    question: "They ___ watching TV right now.",
    options: ["is", "am", "are", "was"], answer: 2,
  },
  {
    level: "A2", type: "vocabulary",
    question: "The opposite of \"hot\" is ___.",
    options: ["warm", "cool", "cold", "wet"], answer: 2,
  },

  // ── B1 (Pho thong — High school, 15-18 tuoi) ──
  // Present perfect, first conditional, opinions
  {
    level: "B1", type: "grammar",
    question: "I have already ___ this book.",
    options: ["read", "reading", "reads", "readed"], answer: 0,
  },
  {
    level: "B1", type: "grammar",
    question: "If it rains tomorrow, I ___ stay home.",
    options: ["would", "will", "can", "might have"], answer: 1,
  },
  {
    level: "B1", type: "vocabulary",
    question: "To \"postpone\" means to ___.",
    options: ["cancel", "delay", "forget", "repeat"], answer: 1,
  },
  {
    level: "B1", type: "reading",
    question: "\"Despite the rain, they continued the match.\" What happened?",
    options: ["They stopped playing", "They kept playing", "They went home", "They waited for sun"], answer: 1,
  },
  {
    level: "B1", type: "grammar",
    question: "She asked me where I ___.",
    options: ["live", "lived", "living", "lives"], answer: 1,
  },
  {
    level: "B1", type: "vocabulary",
    question: "\"In my opinion, this plan is not practical.\" The speaker is expressing ___.",
    options: ["agreement", "a personal view", "happiness", "a question"], answer: 1,
  },

  // ── B2 (Dai hoc — University) ──
  // Passive voice, second conditional, complex grammar
  {
    level: "B2", type: "grammar",
    question: "The report was ___ by the entire team.",
    options: ["written", "wrote", "write", "writing"], answer: 0,
  },
  {
    level: "B2", type: "grammar",
    question: "If I were rich, I ___ travel the world.",
    options: ["will", "would", "can", "shall"], answer: 1,
  },
  {
    level: "B2", type: "vocabulary",
    question: "\"Ubiquitous\" means ___.",
    options: ["rare", "found everywhere", "expensive", "ancient"], answer: 1,
  },
  {
    level: "B2", type: "reading",
    question: "\"The findings corroborate previous research.\" \"Corroborate\" means ___.",
    options: ["contradict", "ignore", "support", "replace"], answer: 2,
  },
  {
    level: "B2", type: "grammar",
    question: "The project was completed ahead ___ schedule.",
    options: ["of", "in", "on", "by"], answer: 0,
  },
  {
    level: "B2", type: "vocabulary",
    question: "A \"dilemma\" is a situation involving ___.",
    options: ["a difficult choice", "a celebration", "a discovery", "an agreement"], answer: 0,
  },

  // ── C1 (Cao hoc — Masters) ──
  // Mixed conditionals, inversion, academic vocabulary
  {
    level: "C1", type: "grammar",
    question: "Had I known about the delay, I ___ have come earlier.",
    options: ["would", "will", "should", "might"], answer: 0,
  },
  {
    level: "C1", type: "grammar",
    question: "Scarcely ___ the door when the phone rang.",
    options: ["I had closed", "had I closed", "I closed", "did I close"], answer: 1,
  },
  {
    level: "C1", type: "vocabulary",
    question: "\"Pragmatic\" most nearly means ___.",
    options: ["idealistic", "practical", "theoretical", "pessimistic"], answer: 1,
  },
  {
    level: "C1", type: "reading",
    question: "\"The policy was met with ambivalence.\" This means people felt ___.",
    options: ["enthusiastic", "angry", "mixed feelings", "indifferent"], answer: 2,
  },
  {
    level: "C1", type: "vocabulary",
    question: "To \"exacerbate\" a problem means to ___.",
    options: ["solve it", "make it worse", "ignore it", "study it"], answer: 1,
  },
  {
    level: "C1", type: "grammar",
    question: "Not until the results ___ published did we realize the magnitude of the error.",
    options: ["were", "was", "had been", "being"], answer: 0,
  },

  // ── C2 (Tien si — PhD level) ──
  // Subjunctive, nuanced grammar, near-native idioms
  {
    level: "C2", type: "grammar",
    question: "The committee insists that he ___ present at the hearing.",
    options: ["be", "is", "was", "being"], answer: 0,
  },
  {
    level: "C2", type: "vocabulary",
    question: "\"Verisimilitude\" refers to the appearance of ___.",
    options: ["beauty", "truth or reality", "complexity", "simplicity"], answer: 1,
  },
  {
    level: "C2", type: "grammar",
    question: "So ___ was his argument that even the harshest critics conceded the point.",
    options: ["compelling", "compelled", "compellingly", "to compel"], answer: 0,
  },
  {
    level: "C2", type: "reading",
    question: "\"The author's prose oscillates between lucidity and opacity.\" This means the writing is ___.",
    options: ["consistently clear", "always confusing", "sometimes clear, sometimes not", "very poetic"], answer: 2,
  },
  {
    level: "C2", type: "vocabulary",
    question: "\"Epiphenomenal\" describes something that is ___.",
    options: ["fundamental", "a secondary byproduct", "universal", "permanent"], answer: 1,
  },
  {
    level: "C2", type: "grammar",
    question: "It is imperative that the data ___ verified before publication.",
    options: ["be", "is", "are", "was"], answer: 0,
  },
];

// ── Helpers ──

const LEVELS: CEFRLevel[] = ["pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];

const MAX_ANSWERS = 30;

/** Pick next unused question at the given level, or null if exhausted */
function pickNextQuestion(level: CEFRLevel, usedIndices: Set<number>): number | null {
  for (let i = 0; i < QUESTION_BANK.length; i++) {
    if (!usedIndices.has(i) && QUESTION_BANK[i].level === level) return i;
  }
  // Try adjacent levels if current exhausted
  const idx = LEVELS.indexOf(level);
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    const adj = idx + delta;
    if (adj < 0 || adj >= LEVELS.length) continue;
    for (let i = 0; i < QUESTION_BANK.length; i++) {
      if (!usedIndices.has(i) && QUESTION_BANK[i].level === LEVELS[adj]) return i;
    }
  }
  return null;
}

/**
 * Adaptive algorithm:
 * - Correct → jump up 2 levels
 * - Wrong → go down 1 level (or stay at pre-A1)
 */
function adaptLevel(current: CEFRLevel, correct: boolean): CEFRLevel {
  const idx = LEVELS.indexOf(current);
  if (correct) {
    return LEVELS[Math.min(idx + 2, LEVELS.length - 1)];
  }
  return LEVELS[Math.max(idx - 1, 0)];
}

/**
 * Determine if the test should stop early.
 * Stops if the learner has answered 3 consecutive wrong answers at the same level.
 */
function shouldStopEarly(answers: { level: CEFRLevel; correct: boolean }[]): boolean {
  if (answers.length < 3) return false;
  const last3 = answers.slice(-3);
  const sameLevel = last3.every((a) => a.level === last3[0].level);
  const allWrong = last3.every((a) => !a.correct);
  return sameLevel && allWrong;
}

/** Calculate final CEFR from answer history.
 *  Highest level where accuracy >= 60% (with at least 1 question attempted).
 */
function calculateCEFR(answers: { level: CEFRLevel; correct: boolean }[]): CEFRLevel {
  const stats: Record<CEFRLevel, { correct: number; total: number }> = {
    "pre-A1": { correct: 0, total: 0 },
    A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 }, C2: { correct: 0, total: 0 },
  };
  for (const a of answers) {
    stats[a.level].total++;
    if (a.correct) stats[a.level].correct++;
  }
  let result: CEFRLevel = "pre-A1";
  for (const lv of LEVELS) {
    if (stats[lv].total > 0 && stats[lv].correct / stats[lv].total >= 0.6) {
      result = lv;
    }
  }
  return result;
}

/** Map CEFR string to the app's Level type */
function cefrToAppLevel(cefr: CEFRLevel): string {
  const map: Record<CEFRLevel, string> = {
    "pre-A1": "kids",
    A1: "a1", A2: "a2", B1: "b1", B2: "b2", C1: "c1", C2: "c1",
  };
  return map[cefr];
}

const LEVEL_LABEL: Record<CEFRLevel, string> = {
  "pre-A1": "Pre-A1",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
};

const LEVEL_DESC_VI: Record<CEFRLevel, string> = {
  "pre-A1": "M\u1EA7m non \u2014 B\u1EA1n \u0111ang b\u1EAFt \u0111\u1EA7u h\u00E0nh tr\u00ECnh h\u1ECDc ti\u1EBFng Anh!",
  A1: "Ti\u1EC3u h\u1ECDc \u2014 B\u1EA1n bi\u1EBFt c\u00E1c t\u1EEB v\u00E0 c\u00E2u c\u01A1 b\u1EA3n.",
  A2: "Trung h\u1ECDc \u2014 B\u1EA1n giao ti\u1EBFp \u0111\u01B0\u1EE3c trong t\u00ECnh hu\u1ED1ng \u0111\u01A1n gi\u1EA3n.",
  B1: "Ph\u1ED5 th\u00F4ng \u2014 B\u1EA1n di\u1EC5n \u0111\u1EA1t \u0111\u01B0\u1EE3c \u00FD ki\u1EBFn v\u00E0 kinh nghi\u1EC7m.",
  B2: "\u0110\u1EA1i h\u1ECDc \u2014 B\u1EA1n s\u1EED d\u1EE5ng ti\u1EBFng Anh th\u00E0nh th\u1EA1o trong nhi\u1EC1u t\u00ECnh hu\u1ED1ng.",
  C1: "Cao h\u1ECDc \u2014 B\u1EA1n s\u1EED d\u1EE5ng ti\u1EBFng Anh \u1EDF tr\u00ECnh \u0111\u1ED9 h\u1ECDc thu\u1EADt.",
  C2: "Ti\u1EBFn s\u0129 \u2014 Tr\u00ECnh \u0111\u1ED9 g\u1EA7n nh\u01B0 ng\u01B0\u1EDDi b\u1EA3n x\u1EE9.",
};

// ── Component ──

type Phase = "intro" | "testing" | "result" | "certificate";

export function PlacementTestPage({ student, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>("pre-A1");
  const [questionIdx, setQuestionIdx] = useState<number | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<{ level: CEFRLevel; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resultLevel, setResultLevel] = useState<CEFRLevel>("pre-A1");

  const questionNum = answers.length + 1;
  const progressPct = (answers.length / MAX_ANSWERS) * 100;

  // Start test — always at Pre-A1
  const startTest = () => {
    const idx = pickNextQuestion("pre-A1", new Set());
    setQuestionIdx(idx);
    if (idx !== null) setUsedIndices(new Set([idx]));
    setCurrentLevel("pre-A1");
    setPhase("testing");
  };

  // Finish and calculate result
  const finishTest = (finalAnswers: { level: CEFRLevel; correct: boolean }[]) => {
    const finalLevel = calculateCEFR(finalAnswers);
    setResultLevel(finalLevel);
    setPhase("result");
  };

  // Handle answer selection
  const handleSelect = (optionIdx: number) => {
    if (showFeedback || questionIdx === null) return;
    setSelected(optionIdx);
    setShowFeedback(true);

    const q = QUESTION_BANK[questionIdx];
    const correct = optionIdx === q.answer;
    const newAnswers = [...answers, { level: q.level, correct }];

    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      setShowFeedback(false);

      // Check stop conditions
      if (newAnswers.length >= MAX_ANSWERS || shouldStopEarly(newAnswers)) {
        finishTest(newAnswers);
        return;
      }

      // Adapt and pick next
      const nextLevel = adaptLevel(currentLevel, correct);
      setCurrentLevel(nextLevel);
      const newUsed = new Set(usedIndices);
      const nextIdx = pickNextQuestion(nextLevel, newUsed);
      if (nextIdx !== null) {
        newUsed.add(nextIdx);
        setUsedIndices(newUsed);
        setQuestionIdx(nextIdx);
      } else {
        finishTest(newAnswers);
      }
    }, 800);
  };

  const handleComplete = () => {
    onComplete(cefrToAppLevel(resultLevel));
  };

  // ── Intro screen ──
  if (phase === "intro") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="Ki\u1EC3m tra x\u1EBFp l\u1EDBp" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">B\u00E0i ki\u1EC3m tra x\u1EBFp l\u1EDBp</h2>
          <Card className="w-full">
            <CardContent className="space-y-3 p-5 text-left text-sm text-muted-foreground">
              <p>B\u00E0i ki\u1EC3m tra n\u00E0y s\u1EBD \u0111\u00E1nh gi\u00E1 tr\u00ECnh \u0111\u1ED9 ti\u1EBFng Anh c\u1EE7a b\u1EA1n theo khung CEFR (Pre-A1 \u2013 C2).</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>T\u1EEB 10 \u0111\u1EBFn 30 c\u00E2u h\u1ECFi tr\u1EAFc nghi\u1EC7m</li>
                <li>Kho\u1EA3ng 2 \u2013 5 ph\u00FAt</li>
                <li>\u0110\u1ED9 kh\u00F3 t\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1u ch\u1EC9nh</li>
                <li>Ph\u00F9 h\u1EE3p m\u1ECDi l\u1EE9a tu\u1ED5i: t\u1EEB m\u1EA7m non \u0111\u1EBFn ti\u1EBFn s\u0129</li>
                <li>K\u1EBFt qu\u1EA3: x\u1EBFp l\u1EDBp theo tr\u00ECnh \u0111\u1ED9 CEFR</li>
              </ul>
              <p className="font-medium text-foreground">H\u00E3y tr\u1EA3 l\u1EDDi th\u1EADt t\u1ED1t nh\u00E9, {student.name}!</p>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={startTest}>
            B\u1EAFt \u0111\u1EA7u l\u00E0m b\u00E0i
          </Button>
        </div>
      </main>
    );
  }

  // ── Result screen ──
  if (phase === "result") {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="K\u1EBFt qu\u1EA3 x\u1EBFp l\u1EDBp" icon={<Trophy className="h-4 w-4" />} iconBg="bg-amber-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg">
            <span className="text-3xl font-black text-white">{LEVEL_LABEL[resultLevel]}</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Tr\u00ECnh \u0111\u1ED9 c\u1EE7a b\u1EA1n: {LEVEL_LABEL[resultLevel]}</h2>
          <p className="text-sm text-muted-foreground">{LEVEL_DESC_VI[resultLevel]}</p>
          <Card className="w-full">
            <CardContent className="space-y-2 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">\u0110\u00FAng</span>
                <span className="font-bold text-green-600">{correctCount}/{answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">\u0110\u1ED9 ch\u00EDnh x\u00E1c</span>
                <span className="font-bold">{Math.round((correctCount / answers.length) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">X\u1EBFp l\u1EDBp</span>
                <span className="font-bold text-indigo-600">{LEVEL_LABEL[resultLevel]}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={() => setPhase("certificate")}>
            Xem ch\u1EE9ng ch\u1EC9 \u0111\u1EA7u v\u00E0o
          </Button>
        </div>
      </main>
    );
  }

  // ── Certificate screen ──
  if (phase === "certificate") {
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / answers.length) * 100);
    const dateStr = new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="Ch\u1EE9ng ch\u1EC9 x\u1EBFp l\u1EDBp" icon={<Award className="h-4 w-4" />} iconBg="bg-amber-500" onClose={() => setPhase("result")} />

        {/* Print button */}
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-[0.97]"
          >
            <Printer className="h-4 w-4" /> In ch\u1EE9ng ch\u1EC9
          </button>
        </div>

        {/* Certificate */}
        <div className="cert-print mx-auto max-w-lg rounded-2xl border-4 border-double border-amber-400 bg-white p-8 shadow-xl dark:bg-white">
          <div className="rounded-xl border-2 border-amber-200 p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-black tracking-wider text-gray-800 uppercase">CH\u1EE8NG CH\u1EC8 X\u1EBEP L\u1EDBP</h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Placement Test Certificate</p>
            </div>

            <div className="mx-auto mb-5 h-px w-32 bg-amber-300" />

            <p className="text-xs text-gray-500 mb-2">Ch\u1EE9ng nh\u1EADn h\u1ECDc sinh</p>
            <h2 className="text-2xl font-black text-gray-800 mb-2">{student.name}</h2>

            <p className="text-xs text-gray-500 mb-4">\u0111\u00E3 ho\u00E0n th\u00E0nh b\u00E0i ki\u1EC3m tra x\u1EBFp l\u1EDBp \u0111\u1EA7u v\u00E0o</p>

            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 shadow-md">
              <span className="text-2xl font-black text-white">{LEVEL_LABEL[resultLevel]}</span>
              <span className="text-xs font-bold text-white/90">{LEVEL_DESC_VI[resultLevel]}</span>
            </div>

            <p className="text-xs text-gray-500 mb-1">Tr\u00ECnh \u0111\u1ED9 CEFR</p>
            <p className="text-sm font-bold text-gray-700 mb-4">\u0110i\u1EC3m: {correctCount}/{answers.length} ({pct}%)</p>

            <div className="mx-auto mb-4 h-px w-32 bg-amber-300" />

            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <div className="text-left">
                <p>Ng\u00E0y c\u1EA5p: {dateStr}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-600">English Buddy</p>
                <p>N\u1EC1n t\u1EA3ng h\u1ECDc ti\u1EBFng Anh</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full text-base font-extrabold" size="lg" onClick={handleComplete}>
            B\u1EAFt \u0111\u1EA7u h\u1ECDc
          </Button>
        </div>

        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .cert-print, .cert-print * { visibility: visible !important; }
            .cert-print {
              position: fixed !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 700px !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </main>
    );
  }

  // ── Testing screen ──
  const q = questionIdx !== null ? QUESTION_BANK[questionIdx] : null;
  if (!q) return null;

  const typeLabel: Record<Question["type"], string> = {
    vocabulary: "T\u1EEB v\u1EF1ng",
    grammar: "Ng\u1EEF ph\u00E1p",
    listening: "Nghe",
    reading: "\u0110\u1ECDc hi\u1EC3u",
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <SessionHeader
        title={`C\u00E2u ${questionNum}/${MAX_ANSWERS}`}
        icon={<GraduationCap className="h-4 w-4" />}
        iconBg="bg-indigo-500"
        onClose={onBack}
        progress={progressPct}
      />
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-bold text-indigo-700">{LEVEL_LABEL[q.level]}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">{typeLabel[q.type]}</span>
        </div>
        <Card>
          <CardContent className="p-5">
            {q.instruction && (
              <p className="mb-2 text-xs font-medium text-muted-foreground italic">{q.instruction}</p>
            )}
            <p className="text-base font-bold leading-relaxed">{q.question}</p>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            let cls = "w-full justify-start text-left text-sm font-medium border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all";
            if (showFeedback && i === q.answer) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-green-500 bg-green-50 text-green-800";
            } else if (showFeedback && i === selected && i !== q.answer) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-red-400 bg-red-50 text-red-700";
            } else if (selected === i) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-primary bg-primary/10";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelect(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 ${cls}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {showFeedback && i === q.answer && <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />}
                {showFeedback && i === selected && i !== q.answer && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
