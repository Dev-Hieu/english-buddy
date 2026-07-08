import { Loader2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { QuizQuestion, Student } from "@/types";
import { generateQuiz, submitQuiz } from "@/services/quizService";
import { speakText } from "@/services/speechService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface TestPageProps {
  student: Student;
  topicId: string;
  level?: string;
  onBackHome: () => void;
}

const wordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));

export function TestPage({ student, topicId, level = "all", onBackHome }: TestPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let alive = true;
    generateQuiz(topicId, 10, level).then((qs) => alive && setQuestions(qs)).catch(() => alive && setQuestions([]));
    return () => { alive = false; };
  }, [topicId, level]);

  const title = `Bài test · ${topic?.name ?? ""}`;

  if (questions === null) {
    return <main className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>;
  }

  if (questions.length === 0) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={title} onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa đủ từ để tạo bài test.</CardContent></Card>
      </main>
    );
  }

  if (finished) {
    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={title} onClose={onBackHome} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <ProgressRing value={correctCount} max={total} size={120} stroke={13}>
              <span className="text-3xl font-black text-primary">{score}%</span>
            </ProgressRing>
            <p className="text-lg font-extrabold">Đúng {correctCount}/{total} câu</p>
            {wrongWordIds.length > 0 ? (
              <div className="w-full rounded-2xl bg-muted p-3 text-left">
                <p className="font-extrabold">Cần ôn lại:</p>
                <p className="font-semibold text-muted-foreground">{wrongWordIds.map((id) => wordById.get(id)?.word ?? id).join(", ")}</p>
              </div>
            ) : (
              <p className="font-extrabold text-success">Tuyệt vời, đúng hết! 🎉</p>
            )}
            <Button type="button" size="lg" className="w-full" onClick={onBackHome}>Xong</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const q = questions[index];
  const targetWord = wordById.get(q.wordId);

  const choose = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    const ok = opt === q.answer;
    if (ok) setCorrectCount((c) => c + 1);
    else setWrongWordIds((w) => [...w, q.wordId]);
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        const total = questions.length;
        const correct = correctCount + (ok ? 1 : 0);
        submitQuiz({
          studentId: student.id, topicId,
          score: Math.round((correct / total) * 100), totalQuestions: total,
          correctAnswers: correct, wrongAnswers: total - correct,
          wrongWordIds: ok ? wrongWordIds : [...wrongWordIds, q.wordId],
          durationSeconds: Math.round((Date.now() - startedAt.current) / 1000), createdAt: Date.now(),
        }).catch(() => {});
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 700);
  };

  const optClass = (opt: string) =>
    picked === null ? "" : opt === q.answer ? "ring-4 ring-success" : opt === picked ? "ring-4 ring-red-400" : "opacity-50";

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={title} onClose={onBackHome} progress={Math.round((index / questions.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Câu {index + 1} / {questions.length}</p>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{q.question}</h2>
            {q.type === "listen_choose" && targetWord ? (
              <Button type="button" size="icon" variant="outline" onClick={() => speakText(targetWord.word, targetWord.audioUrl)}>
                <Volume2 className="h-5 w-5" />
              </Button>
            ) : null}
          </div>

          {q.type === "choose_picture" && q.imageOptions ? (
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={opt} type="button" onClick={() => choose(opt)} className={cn("overflow-hidden rounded-2xl border-2 border-border transition-all active:translate-y-[1px]", optClass(opt))}>
                  {q.imageOptions?.[i] ? <img src={q.imageOptions[i]} alt="" className="h-28 w-full object-cover" /> : <div className="flex h-28 items-center justify-center font-bold">{opt}</div>}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(opt)}
                  className={cn(
                    "rounded-2xl border-2 border-border bg-card px-5 py-4 text-left text-lg font-extrabold transition-all active:translate-y-[1px]",
                    optClass(opt),
                    picked !== null && opt === q.answer && "bg-success text-white",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
