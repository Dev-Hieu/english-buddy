import { ArrowLeft, Loader2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { QuizQuestion, Student } from "@/types";
import { generateQuiz, submitQuiz } from "@/services/quizService";
import { speakText } from "@/services/speechService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

const wordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));

export function TestPage({ student, topicId, onBackHome }: TestPageProps) {
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
    generateQuiz(topicId, 10)
      .then((qs) => alive && setQuestions(qs))
      .catch(() => alive && setQuestions([]));
  }, [topicId]);

  if (questions === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  const header = (
    <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
      <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
        <ArrowLeft className="h-4 w-4" /> Trang chủ
      </Button>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Bài test · {topic?.name}</h1>
    </header>
  );

  if (questions.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
        {header}
        <Card><CardContent className="p-6 text-center text-muted-foreground">Chủ đề này chưa đủ từ để tạo bài test.</CardContent></Card>
      </main>
    );
  }

  if (finished) {
    const total = questions.length;
    const score = Math.round((correctCount / total) * 100);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-6">
        {header}
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <p className="text-6xl font-black text-primary">{score}%</p>
            <p className="text-lg">Đúng {correctCount}/{total} câu</p>
            {wrongWordIds.length > 0 ? (
              <div className="rounded-md bg-muted p-3 text-left">
                <p className="font-bold">Cần ôn lại:</p>
                <p className="text-muted-foreground">
                  {wrongWordIds.map((id) => wordById.get(id)?.word ?? id).join(", ")}
                </p>
              </div>
            ) : (
              <p className="font-semibold text-primary">Tuyệt vời, đúng hết! 🎉</p>
            )}
            <Button type="button" size="lg" onClick={onBackHome}>Về trang chủ</Button>
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
          studentId: student.id,
          topicId,
          score: Math.round((correct / total) * 100),
          totalQuestions: total,
          correctAnswers: correct,
          wrongAnswers: total - correct,
          wrongWordIds: ok ? wrongWordIds : [...wrongWordIds, q.wordId],
          durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
          createdAt: Date.now(),
        }).catch(() => {});
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 700);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-6">
      {header}
      <div className="flex items-center justify-between rounded-lg bg-white/75 px-4 py-3 text-sm font-semibold shadow-soft">
        <span>Câu {index + 1} / {questions.length}</span>
        <span className="text-muted-foreground">Đúng: {correctCount}</span>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{q.question}</h2>
            {q.type === "listen_choose" && targetWord ? (
              <Button type="button" variant="outline" onClick={() => speakText(targetWord.word, targetWord.audioUrl)}>
                <Volume2 className="h-5 w-5" /> Nghe
              </Button>
            ) : null}
          </div>

          {q.type === "choose_picture" && q.imageOptions ? (
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => {
                const state = picked === null ? "" : opt === q.answer ? "ring-4 ring-green-500" : opt === picked ? "ring-4 ring-red-400" : "opacity-60";
                return (
                  <button key={opt} type="button" onClick={() => choose(opt)} className={cn("overflow-hidden rounded-md border border-border", state)}>
                    {q.imageOptions?.[i] ? <img src={q.imageOptions[i]} alt="" className="h-28 w-full object-cover" /> : <div className="flex h-28 items-center justify-center font-bold">{opt}</div>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {q.options.map((opt) => {
                const state = picked === null ? "outline" : opt === q.answer ? "default" : opt === picked ? "secondary" : "ghost";
                return (
                  <Button
                    key={opt}
                    type="button"
                    variant={state as "outline" | "default" | "secondary" | "ghost"}
                    size="lg"
                    className={cn("justify-start", picked !== null && opt === q.answer && "bg-green-600 text-white hover:bg-green-600")}
                    onClick={() => choose(opt)}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
