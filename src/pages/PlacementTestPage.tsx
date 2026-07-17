import { useState } from "react";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { GraduationCap, CheckCircle, XCircle, Trophy } from "lucide-react";

// ── Types ──

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface Question {
  level: CEFRLevel;
  type: "vocabulary" | "grammar" | "listening" | "reading";
  question: string;
  options: [string, string, string, string];
  answer: number; // 0-based index
}

interface Props {
  student: Student;
  onComplete: (level: string) => void;
  onBack: () => void;
}

// ── Question bank: 5 per level = 30 total ──

const QUESTION_BANK: Question[] = [
  // ── A1 ──
  { level: "A1", type: "vocabulary", question: "What is this? (picture of an apple)", options: ["apple", "cat", "dog", "car"], answer: 0 },
  { level: "A1", type: "grammar", question: "I ___ a student.", options: ["am", "is", "are", "be"], answer: 0 },
  { level: "A1", type: "vocabulary", question: "What color is the sky?", options: ["blue", "red", "green", "yellow"], answer: 0 },
  { level: "A1", type: "grammar", question: "This is ___ book.", options: ["a", "an", "the some", "much"], answer: 0 },
  { level: "A1", type: "reading", question: "\"My name is Tom. I am 10.\" How old is Tom?", options: ["10", "12", "8", "11"], answer: 0 },

  // ── A2 ──
  { level: "A2", type: "grammar", question: "She ___ to school every day.", options: ["go", "goes", "going", "went"], answer: 1 },
  { level: "A2", type: "vocabulary", question: "The opposite of \"hot\" is ___.", options: ["warm", "cool", "cold", "wet"], answer: 2 },
  { level: "A2", type: "grammar", question: "They ___ watching TV now.", options: ["is", "am", "are", "was"], answer: 2 },
  { level: "A2", type: "reading", question: "\"I like pizza but I don't like pasta.\" What does the person dislike?", options: ["pizza", "salad", "pasta", "bread"], answer: 2 },
  { level: "A2", type: "vocabulary", question: "A place where you buy medicine is a ___.", options: ["library", "pharmacy", "bakery", "market"], answer: 1 },

  // ── B1 ──
  { level: "B1", type: "grammar", question: "If I had more time, I ___ learn piano.", options: ["will", "would", "can", "should"], answer: 1 },
  { level: "B1", type: "vocabulary", question: "To \"postpone\" means to ___.", options: ["cancel", "delay", "forget", "repeat"], answer: 1 },
  { level: "B1", type: "grammar", question: "She asked me where I ___.", options: ["live", "lived", "living", "lives"], answer: 1 },
  { level: "B1", type: "reading", question: "\"Despite the rain, they continued the match.\" What happened?", options: ["They stopped", "They played on", "They went home", "They waited"], answer: 1 },
  { level: "B1", type: "grammar", question: "I wish I ___ taller.", options: ["am", "were", "was being", "will be"], answer: 1 },

  // ── B2 ──
  { level: "B2", type: "grammar", question: "The project was completed ___ schedule.", options: ["ahead of", "in front of", "before of", "prior"], answer: 0 },
  { level: "B2", type: "vocabulary", question: "\"Ubiquitous\" means ___.", options: ["rare", "found everywhere", "expensive", "ancient"], answer: 1 },
  { level: "B2", type: "grammar", question: "Had I known earlier, I ___ differently.", options: ["will act", "would have acted", "acted", "would act"], answer: 1 },
  { level: "B2", type: "reading", question: "\"The findings corroborate previous research.\" \"Corroborate\" means ___.", options: ["contradict", "ignore", "support", "replace"], answer: 2 },
  { level: "B2", type: "vocabulary", question: "A \"dilemma\" is a situation involving ___.", options: ["a difficult choice", "a celebration", "a discovery", "an agreement"], answer: 0 },

  // ── C1 ──
  { level: "C1", type: "grammar", question: "Not until the results ___ published did we realize the error.", options: ["were", "was", "had been", "being"], answer: 0 },
  { level: "C1", type: "vocabulary", question: "\"Pragmatic\" most nearly means ___.", options: ["idealistic", "practical", "theoretical", "pessimistic"], answer: 1 },
  { level: "C1", type: "grammar", question: "Scarcely ___ the door when the phone rang.", options: ["I had closed", "had I closed", "I closed", "did I close"], answer: 1 },
  { level: "C1", type: "reading", question: "\"The policy was met with ambivalence.\" This means people felt ___.", options: ["enthusiastic", "angry", "mixed feelings", "indifferent"], answer: 2 },
  { level: "C1", type: "vocabulary", question: "To \"exacerbate\" a problem means to ___.", options: ["solve it", "make it worse", "ignore it", "study it"], answer: 1 },

  // ── C2 ──
  { level: "C2", type: "grammar", question: "The committee ___ to have reached a consensus.", options: ["is reported", "reports", "reporting", "report"], answer: 0 },
  { level: "C2", type: "vocabulary", question: "\"Epiphenomenal\" describes something that is ___.", options: ["fundamental", "a secondary byproduct", "universal", "permanent"], answer: 1 },
  { level: "C2", type: "grammar", question: "So ___ was his argument that even critics conceded.", options: ["compelling", "compelled", "compellingly", "to compel"], answer: 0 },
  { level: "C2", type: "reading", question: "\"The author's prose oscillates between lucidity and opacity.\" This means the writing is ___.", options: ["consistently clear", "always confusing", "sometimes clear, sometimes not", "very poetic"], answer: 2 },
  { level: "C2", type: "vocabulary", question: "\"Verisimilitude\" refers to the appearance of ___.", options: ["beauty", "truth or reality", "complexity", "simplicity"], answer: 1 },
];

// ── Helpers ──

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getQuestionsForLevel(level: CEFRLevel): Question[] {
  return QUESTION_BANK.filter((q) => q.level === level);
}

/** Pick next question adaptively based on current level */
function pickNextQuestion(currentLevel: CEFRLevel, usedIndices: Set<number>): number | null {
  // Try current level first
  for (let i = 0; i < QUESTION_BANK.length; i++) {
    if (!usedIndices.has(i) && QUESTION_BANK[i].level === currentLevel) return i;
  }
  // If exhausted, try adjacent levels
  const idx = LEVELS.indexOf(currentLevel);
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    const adj = idx + delta;
    if (adj < 0 || adj >= LEVELS.length) continue;
    for (let i = 0; i < QUESTION_BANK.length; i++) {
      if (!usedIndices.has(i) && QUESTION_BANK[i].level === LEVELS[adj]) return i;
    }
  }
  return null;
}

/** Adapt level: correct → harder, wrong → easier */
function adaptLevel(current: CEFRLevel, correct: boolean): CEFRLevel {
  const idx = LEVELS.indexOf(current);
  if (correct && idx < LEVELS.length - 1) return LEVELS[idx + 1];
  if (!correct && idx > 0) return LEVELS[idx - 1];
  return current;
}

/** Calculate final CEFR from answer history */
function calculateCEFR(answers: { level: CEFRLevel; correct: boolean }[]): CEFRLevel {
  const stats: Record<CEFRLevel, { correct: number; total: number }> = {
    A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 }, C2: { correct: 0, total: 0 },
  };
  for (const a of answers) {
    stats[a.level].total++;
    if (a.correct) stats[a.level].correct++;
  }
  // Highest level where accuracy >= 60% (with at least 1 question attempted)
  let result: CEFRLevel = "A1";
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
    A1: "a1", A2: "a2", B1: "b1", B2: "b2", C1: "c1", C2: "c1",
  };
  return map[cefr];
}

const LEVEL_DESC: Record<CEFRLevel, string> = {
  A1: "Bạn có thể hiểu và sử dụng các câu đơn giản hàng ngày.",
  A2: "Bạn có thể giao tiếp trong các tình huống quen thuộc.",
  B1: "Bạn có thể xử lý hầu hết các tình huống khi đi du lịch.",
  B2: "Bạn có thể tương tác với người bản ngữ một cách tự nhiên.",
  C1: "Bạn có thể sử dụng tiếng Anh linh hoạt và hiệu quả.",
  C2: "Bạn có thể hiểu hầu hết mọi thứ nghe hoặc đọc được.",
};

const LEVEL_DESC_VI: Record<CEFRLevel, string> = {
  A1: "Cơ bản - Hiểu và dùng các câu đơn giản, giới thiệu bản thân.",
  A2: "Sơ cấp - Giao tiếp trong tình huống quen thuộc hàng ngày.",
  B1: "Trung cấp - Tự tin xử lý các tình huống khi đi du lịch.",
  B2: "Trung cao - Tương tác tự nhiên với người bản ngữ.",
  C1: "Nâng cao - Sử dụng tiếng Anh linh hoạt và hiệu quả.",
  C2: "Thành thạo - Hiểu mọi thứ nghe và đọc được.",
};

const TOTAL_QUESTIONS = 30;

// ── Component ──

type Phase = "intro" | "testing" | "result";

export function PlacementTestPage({ student, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>("A2");
  const [questionIdx, setQuestionIdx] = useState<number | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<{ level: CEFRLevel; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resultLevel, setResultLevel] = useState<CEFRLevel>("A1");

  const questionNum = answers.length + 1;
  const progressPct = (answers.length / TOTAL_QUESTIONS) * 100;

  // Start test
  const startTest = () => {
    const idx = pickNextQuestion("A2", new Set());
    setQuestionIdx(idx);
    if (idx !== null) setUsedIndices(new Set([idx]));
    setPhase("testing");
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

      if (newAnswers.length >= TOTAL_QUESTIONS) {
        // Done
        const finalLevel = calculateCEFR(newAnswers);
        setResultLevel(finalLevel);
        setPhase("result");
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
        // No more questions available
        const finalLevel = calculateCEFR(newAnswers);
        setResultLevel(finalLevel);
        setPhase("result");
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
        <SessionHeader title="Kiểm tra xếp lớp" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Bài kiểm tra xếp lớp</h2>
          <Card className="w-full">
            <CardContent className="space-y-3 p-5 text-left text-sm text-muted-foreground">
              <p>Bài kiểm tra này sẽ đánh giá trình độ tiếng Anh của bạn theo khung CEFR (A1 - C2).</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>30 câu hỏi trắc nghiệm</li>
                <li>Khoảng 2 - 5 phút</li>
                <li>Độ khó tự động điều chỉnh</li>
                <li>Kết quả: xếp lớp theo trình độ CEFR</li>
              </ul>
              <p className="font-medium text-foreground">Hãy trả lời thật tốt nhé, {student.name}!</p>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={startTest}>
            Bắt đầu làm bài
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
        <SessionHeader title="Kết quả xếp lớp" icon={<Trophy className="h-4 w-4" />} iconBg="bg-amber-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg">
            <span className="text-3xl font-black text-white">{resultLevel}</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Trình độ của bạn: {resultLevel}</h2>
          <p className="text-sm text-muted-foreground">{LEVEL_DESC_VI[resultLevel]}</p>
          <Card className="w-full">
            <CardContent className="space-y-2 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đúng</span>
                <span className="font-bold text-green-600">{correctCount}/{answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Độ chính xác</span>
                <span className="font-bold">{Math.round((correctCount / answers.length) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Xếp lớp</span>
                <span className="font-bold text-indigo-600">{resultLevel}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={handleComplete}>
            Bắt đầu học
          </Button>
        </div>
      </main>
    );
  }

  // ── Testing screen ──
  const q = questionIdx !== null ? QUESTION_BANK[questionIdx] : null;
  if (!q) return null;

  const typeLabel: Record<Question["type"], string> = {
    vocabulary: "Từ vựng",
    grammar: "Ngữ pháp",
    listening: "Nghe",
    reading: "Đọc hiểu",
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <SessionHeader
        title={`Câu ${questionNum}/${TOTAL_QUESTIONS}`}
        icon={<GraduationCap className="h-4 w-4" />}
        iconBg="bg-indigo-500"
        onClose={onBack}
        progress={progressPct}
      />
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-bold text-indigo-700">{q.level}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">{typeLabel[q.type]}</span>
        </div>
        <Card>
          <CardContent className="p-5">
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
