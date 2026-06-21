import { ArrowRight, Check, RotateCcw, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { GRAMMAR_TOPICS } from "@/data/grammar";
import { checkGrammar } from "@/utils/grammarCheck";
import { submitQuiz } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface GrammarRunnerPageProps {
  topicId: string;
  studentId: string;
  onBackHome: () => void;
}

export function GrammarRunnerPage({ topicId, studentId, onBackHome }: GrammarRunnerPageProps) {
  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">("learn");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number[]>([]); // reorder: thứ tự index đã chọn
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  if (!topic) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Ngữ pháp" onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Không tìm thấy bài.</CardContent></Card>
      </main>
    );
  }

  const ex = topic.exercises[index];
  const builtReorder = picked.map((i) => ex?.options?.[i] ?? "").join(" ");

  const resetQ = () => { setInput(""); setPicked([]); setChecked(false); setCorrect(false); };

  const submit = (answer: string) => {
    if (checked || !ex) return;
    const ok = checkGrammar(ex, answer);
    setChecked(true);
    setCorrect(ok);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= topic.exercises.length) {
      setPhase("done");
      // Thưởng XP theo số câu đúng (+5/câu) — tích hợp gamification như Test/Làm đề.
      submitQuiz({
        studentId, topicId: `grammar_${topic.id}`, score: Math.round((score / topic.exercises.length) * 100),
        totalQuestions: topic.exercises.length, correctAnswers: score,
        wrongAnswers: topic.exercises.length - score, wrongWordIds: [], durationSeconds: 0, createdAt: Date.now(),
      }).catch(() => {});
      return;
    }
    setIndex((i) => i + 1);
    resetQ();
  };

  // ── Màn học ──
  if (phase === "learn") {
    const hasSections = topic.sections && topic.sections.length > 0;
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title={topic.title_vi} onClose={onBackHome} />
        <Card>
          <CardContent className="space-y-3 p-5">
            <div>
              <h2 className="text-2xl font-black">{topic.title}</h2>
              <p className="mt-1 text-base font-semibold text-muted-foreground">{topic.summary_vi}</p>
            </div>
          </CardContent>
        </Card>

        {hasSections ? (
          <div className="mt-3 space-y-3">
            {topic.sections!.map((sec, si) => (
              <Card key={si}>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-black text-primary">{sec.heading}</h3>
                  <ul className="space-y-1.5">
                    {sec.points.map((p, pi) => {
                      const isTip = p.startsWith("💡");
                      return (
                        <li key={pi} className={cn(
                          "rounded-xl px-3 py-2 text-sm font-semibold",
                          isTip ? "bg-accent/10 text-accent" : "bg-muted"
                        )}>
                          {p}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-3">
            <CardContent className="space-y-2 p-4">
              {topic.points.map((p, i) => {
                const isTip = p.startsWith("💡");
                return (
                  <div key={i} className={cn(
                    "flex gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                    isTip ? "bg-accent/10 text-accent" : "bg-muted"
                  )}>
                    {!isTip && <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                    <span>{p}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Button type="button" size="lg" className="mt-4 w-full" onClick={() => setPhase("quiz")}>
          Làm {topic.exercises.length} bài tập <ArrowRight className="h-5 w-5" />
        </Button>
      </main>
    );
  }

  // ── Màn kết quả ──
  if (phase === "done") {
    const total = topic.exercises.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title={topic.title_vi} onClose={onBackHome} />
        <Card><CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="text-6xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</span>
          <p className="text-2xl font-black">{score}/{total} đúng ({pct}%)</p>
          <p className="font-semibold text-muted-foreground">{pct >= 80 ? "Giỏi lắm!" : "Ôn lại rồi thử tiếp nhé."}</p>
          <div className="mt-2 flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIndex(0); setScore(0); resetQ(); setPhase("learn"); }}>
              <RotateCcw className="h-4 w-4" /> Học lại
            </Button>
            <Button type="button" className="flex-1" onClick={onBackHome}>Xong</Button>
          </div>
        </CardContent></Card>
      </main>
    );
  }

  // ── Màn bài tập ──
  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={topic.title_vi} onClose={onBackHome} progress={Math.round((index / topic.exercises.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Câu {index + 1}/{topic.exercises.length}</p>

      <Card><CardContent className="space-y-4 p-5">
        <p className="text-lg font-extrabold">{ex.question}</p>

        {ex.type === "choice" && ex.options ? (
          <div className="grid gap-2">
            {ex.options.map((o) => {
              const isAns = o === ex.answer;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={checked}
                  onClick={() => submit(o)}
                  className={cn(
                    "rounded-2xl border-2 p-3 text-left font-bold transition-colors",
                    checked && isAns ? "border-success bg-success/10 text-success"
                      : checked ? "border-border opacity-60"
                      : "border-border hover:border-primary",
                  )}
                >
                  {o}
                </button>
              );
            })}
          </div>
        ) : null}

        {ex.type === "fill" ? (
          <div className="flex gap-2">
            <input
              className="h-12 flex-1 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary"
              placeholder="Nhập đáp án..."
              value={input}
              disabled={checked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && input.trim() && submit(input)}
            />
            {!checked ? <Button type="button" disabled={!input.trim()} onClick={() => submit(input)}>Kiểm tra</Button> : null}
          </div>
        ) : null}

        {ex.type === "reorder" && ex.options ? (
          <div className="space-y-3">
            <div className="min-h-12 rounded-2xl border-2 border-dashed border-border p-3 font-bold">{builtReorder || <span className="text-muted-foreground">Bấm các từ theo thứ tự...</span>}</div>
            <div className="flex flex-wrap gap-2">
              {ex.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={checked || picked.includes(i)}
                  onClick={() => setPicked((p) => [...p, i])}
                  className={cn("rounded-full px-3 py-1.5 text-sm font-bold", picked.includes(i) ? "bg-muted text-muted-foreground opacity-40" : "bg-secondary text-secondary-foreground")}
                >
                  {o}
                </button>
              ))}
            </div>
            {!checked ? (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setPicked([])}><RotateCcw className="h-4 w-4" /> Xoá</Button>
                <Button type="button" className="flex-1" disabled={picked.length !== ex.options.length} onClick={() => submit(builtReorder)}>Kiểm tra</Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {checked ? (
          <div className={cn("rounded-2xl p-3 font-bold", correct ? "bg-success/10 text-success" : "bg-red-50 text-red-600")}>
            <p className="flex items-center gap-2">{correct ? <><Check className="h-5 w-5" /> Chính xác!</> : <><X className="h-5 w-5" /> Đáp án: {ex.answer}</>}</p>
            {ex.explain_vi ? <p className="mt-1 text-sm font-semibold opacity-90">{ex.explain_vi}</p> : null}
          </div>
        ) : null}
      </CardContent></Card>

      {checked ? (
        <Button type="button" size="lg" className="mt-4 w-full" onClick={next}>
          {index + 1 >= topic.exercises.length ? "Xem kết quả" : "Câu tiếp"} <ArrowRight className="h-5 w-5" />
        </Button>
      ) : null}
    </main>
  );
}
