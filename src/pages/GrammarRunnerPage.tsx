import { ArrowRight, BookOpen, Check, GraduationCap, PenLine, RotateCcw, Sparkles, X } from "lucide-react";
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

// Grammar in Use: phân tích point để render đẹp hơn
function GrammarPoint({ text }: { text: string }) {
  const isTip = text.startsWith("💡");
  const isPositive = text.startsWith("(+)");
  const isNegative = text.startsWith("(-)");
  const isQuestion = text.startsWith("(?)");

  // Tách ví dụ sau dấu → hoặc :
  const arrowIdx = text.indexOf("→");
  const hasExample = arrowIdx > 0;

  if (isTip) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
        <p className="text-sm font-bold text-amber-800">{text}</p>
      </div>
    );
  }

  const tagColor = isPositive ? "bg-emerald-500" : isNegative ? "bg-red-500" : isQuestion ? "bg-blue-500" : "";
  const tagLabel = isPositive ? "+" : isNegative ? "−" : isQuestion ? "?" : "";

  return (
    <div className="flex gap-2 items-start">
      {tagLabel ? (
        <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-black text-white", tagColor)}>
          {tagLabel}
        </span>
      ) : (
        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      )}
      <div className="flex-1 min-w-0">
        {hasExample ? (
          <>
            <p className="text-sm font-bold">{text.slice(0, arrowIdx).replace(/^\([+\-?]\)\s*/, "").trim()}</p>
            <p className="text-sm font-semibold text-primary italic">{text.slice(arrowIdx + 1).trim()}</p>
          </>
        ) : (
          <p className="text-sm font-bold">{text.replace(/^\([+\-?]\)\s*/, "").trim()}</p>
        )}
      </div>
    </div>
  );
}

export function GrammarRunnerPage({ topicId, studentId, onBackHome }: GrammarRunnerPageProps) {
  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">("learn");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  if (!topic) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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

  const hasSections = topic.sections && topic.sections.length > 0;

  // ── Màn học (Grammar in Use style) ──
  if (phase === "learn") {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={topic.title_vi} onClose={onBackHome} icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-rose-500" />

        {/* Header: tiêu đề + mô tả */}
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-black">{topic.title}</h2>
          </div>
          <p className="text-sm font-semibold opacity-90">{topic.summary_vi}</p>
        </div>

        {/* Sections (Grammar in Use: mỗi khối = 1 card riêng) */}
        {hasSections ? (
          <div className="space-y-3">
            {topic.sections!.map((sec, si) => (
              <Card key={si} className="overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border">
                  <h3 className="text-base font-black text-foreground">{sec.heading}</h3>
                </div>
                <CardContent className="p-4 space-y-2">
                  {sec.points.map((p, pi) => (
                    <GrammarPoint key={pi} text={p} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-2">
              {topic.points.map((p, i) => (
                <GrammarPoint key={i} text={p} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Nút làm bài tập */}
        <Button type="button" size="lg" className="mt-4 w-full" onClick={() => setPhase("quiz")}>
          <PenLine className="h-5 w-5" /> Làm {topic.exercises.length} bài tập
        </Button>
      </main>
    );
  }

  // ── Màn kết quả ──
  if (phase === "done") {
    const total = topic.exercises.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={topic.title_vi} onClose={onBackHome} />
        <Card><CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="text-6xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</span>
          <div>
            <p className="text-3xl font-black">{score}/{total}</p>
            <p className="text-lg font-bold text-muted-foreground">{pct}% đúng</p>
          </div>
          <p className="font-semibold text-muted-foreground">
            {pct >= 80 ? "Giỏi lắm! Con nắm vững rồi." : pct >= 50 ? "Khá rồi! Ôn thêm sẽ giỏi hơn." : "Cố gắng ôn lại nhé, con làm được!"}
          </p>
          <div className="flex w-full gap-3">
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
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={topic.title_vi} onClose={onBackHome} progress={Math.round(((index + 1) / topic.exercises.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Câu {index + 1} / {topic.exercises.length}</p>

      <Card><CardContent className="space-y-4 p-5">
        <p className="text-lg font-extrabold leading-relaxed">{ex.question}</p>

        {/* Choice */}
        {ex.type === "choice" && ex.options ? (
          <div className="grid gap-2">
            {ex.options.map((o) => {
              const isAns = o === ex.answer;
              const isWrong = checked && !isAns && o === input;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={checked}
                  onClick={() => { setInput(o); submit(o); }}
                  className={cn(
                    "rounded-2xl border-2 p-3.5 text-left font-bold transition-all",
                    checked && isAns ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : checked && isWrong ? "border-red-400 bg-red-50 text-red-600"
                      : checked ? "border-border opacity-50"
                      : "border-border hover:border-primary hover:bg-primary/5",
                  )}
                >
                  {o}
                  {checked && isAns && <Check className="inline ml-2 h-4 w-4" />}
                  {checked && isWrong && <X className="inline ml-2 h-4 w-4" />}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Fill */}
        {ex.type === "fill" ? (
          <div className="flex gap-2">
            <input
              className="h-12 flex-1 rounded-2xl border-2 border-border px-4 text-base font-bold outline-none focus:border-primary"
              placeholder="Nhập đáp án..."
              value={input}
              disabled={checked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && input.trim() && submit(input)}
              autoFocus
            />
            {!checked && <Button type="button" disabled={!input.trim()} onClick={() => submit(input)}>Kiểm tra</Button>}
          </div>
        ) : null}

        {/* Reorder */}
        {ex.type === "reorder" && ex.options ? (
          <div className="space-y-3">
            <div className="min-h-12 rounded-2xl border-2 border-dashed border-border p-3 text-base font-bold">
              {builtReorder || <span className="text-muted-foreground">Bấm các từ theo thứ tự...</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {ex.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={checked || picked.includes(i)}
                  onClick={() => setPicked((p) => [...p, i])}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-bold transition-all",
                    picked.includes(i) ? "bg-primary/20 text-primary/40" : "bg-secondary text-secondary-foreground hover:bg-primary/10",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
            {!checked && (
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPicked([])}><RotateCcw className="h-4 w-4" /> Xoá</Button>
                <Button type="button" className="flex-1" disabled={picked.length !== ex.options.length} onClick={() => submit(builtReorder)}>Kiểm tra</Button>
              </div>
            )}
          </div>
        ) : null}

        {/* Kết quả */}
        {checked && (
          <div className={cn("rounded-2xl p-4", correct ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200")}>
            <p className={cn("flex items-center gap-2 font-bold", correct ? "text-emerald-700" : "text-red-600")}>
              {correct ? <><Check className="h-5 w-5" /> Chính xác!</> : <><X className="h-5 w-5" /> Sai — Đáp án: <span className="text-foreground">{ex.answer}</span></>}
            </p>
            {ex.explain_vi && <p className="mt-1.5 text-sm font-semibold text-muted-foreground">{ex.explain_vi}</p>}
          </div>
        )}
      </CardContent></Card>

      {checked && (
        <Button type="button" size="lg" className="mt-4 w-full" onClick={next}>
          {index + 1 >= topic.exercises.length ? "Xem kết quả" : "Câu tiếp"} <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </main>
  );
}
