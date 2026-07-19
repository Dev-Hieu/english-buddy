import { GraduationCap, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { getWordBank, type BankWord } from "@/services/wordBankService";
import { buildQuiz } from "@/utils/quizGenerator";
import { matchesLevel } from "@/utils/levelFilter";
import { recordAnswer } from "@/services/progressService";
import { submitQuiz } from "@/services/quizService";
import { speakText } from "@/services/speechService";
import { LEVEL_LABELS, type Level, type Student } from "@/types";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface ExamPageProps {
  student: Student;
  level?: string;
  onBackHome: () => void;
}

const seedWordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));
const EXAM_SIZE = 20;

export function ExamPage({ student, level = "all", onBackHome }: ExamPageProps) {
  const lv = level;

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    getWordBank(lv === "all" ? undefined : lv).then(setBankWords).catch(() => {});
  }, [lv]);

  const questions = useMemo(() => {
    if (bankWords.length > 0) {
      const words = bankWords.filter((bw) => matchesLevel(bw.level, lv)).map((bw) => ({
        id: bw.id, word: bw.word, phonetic: bw.phonetic || "",
        meaning_vi: bw.meaning_vi, meaning_en: bw.meaning_en || "",
        pos: bw.pos || "", example: bw.examples?.[0]?.en || "",
        example_vi: bw.examples?.[0]?.vi || "",
        topicIds: bw.categories, level: bw.level as any,
        imageUrl: bw.image || "", source: "seed" as const, createdAt: 0,
      }));
      if (words.length > 0) return buildQuiz(words, EXAM_SIZE);
    }
    const words = SEED_VOCABULARY.filter((w) => matchesLevel(w.level, lv)); // kế thừa: ≤ cấp
    return buildQuiz(words, EXAM_SIZE);
  }, [bankWords, lv]);

  const wordById = useMemo(() => {
    if (bankWords.length === 0) return seedWordById;
    const map = new Map(seedWordById);
    for (const bw of bankWords) {
      if (!map.has(bw.id)) {
        map.set(bw.id, {
          id: bw.id, word: bw.word, phonetic: bw.phonetic || "",
          meaning_vi: bw.meaning_vi, meaning_en: bw.meaning_en || "",
          pos: bw.pos || "", example: bw.examples?.[0]?.en || "",
          example_vi: bw.examples?.[0]?.vi || "",
          topicIds: bw.categories, level: bw.level as any,
          imageUrl: bw.image || "", source: "seed" as const, createdAt: 0,
        });
      }
    }
    return map;
  }, [bankWords]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const startedAt = useRef(Date.now());

  const levelName = LEVEL_LABELS[lv as Level] ?? "Tất cả";
  const title = `Làm đề · ${levelName}`;
  const q = questions[index];

  // Câu nghe: tự đọc từ khi sang câu mới.
  useEffect(() => {
    const cur = questions[index];
    if (cur && cur.type === "listen_choose") speakText(cur.answer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const choose = (opt: string) => {
    if (picked || !q) return;
    setPicked(opt);
    const ok = opt === q.answer;
    if (ok) setCorrect((c) => c + 1);
    else setWrongIds((w) => [...w, q.wordId]);
    recordAnswer(student.id, q.wordId, ok).catch(() => {});

    if (ok) {
      // Đúng: tự chuyển sau 800ms
      setTimeout(() => advance(), 800);
    } else {
      // Sai: hiện feedback, chờ người dùng bấm tiếp
      setShowFeedback(true);
    }
  };

  const advance = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      const score = Math.round((correct / questions.length) * 100);
      submitQuiz({
        studentId: student.id, topicId: "exam", score,
        totalQuestions: questions.length, correctAnswers: correct,
        wrongAnswers: questions.length - correct,
        wrongWordIds: wrongIds,
        durationSeconds: Math.round((Date.now() - startedAt.current) / 1000), createdAt: Date.now(),
      }).catch(() => {});
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setShowFeedback(false);
    }
  };

  if (questions.length === 0) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={title} onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chưa đủ từ ở cấp này để tạo đề.</CardContent></Card>
      </main>
    );
  }

  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    const wrongWords = wrongIds.map((id) => wordById.get(id)).filter(Boolean);
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={title} onClose={onBackHome} />
        <Card><CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <ProgressRing value={correct} max={questions.length} size={100} stroke={11}>
            <span className="text-2xl font-black">{score}%</span>
          </ProgressRing>
          <p className="text-xl font-black">{correct}/{questions.length} câu đúng</p>
          <p className="font-semibold text-muted-foreground">{score >= 80 ? "Xuất sắc!" : score >= 50 ? "Khá rồi, ôn thêm nhé" : "Cần ôn lại nhiều hơn"}</p>
        </CardContent></Card>

        {wrongWords.length ? (
          <section className="mt-5">
            <h2 className="mb-2 text-lg font-extrabold">Phân tích lỗi — {wrongWords.length} từ cần ôn</h2>
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Các từ này đã được đưa vào hàng đợi ôn tập của con.</p>
            <ul className="space-y-2">
              {wrongWords.map((w) => (
                <li key={w!.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-card">
                  <span className="min-w-0 flex-1">
                    <span className="text-lg font-extrabold capitalize">{w!.word}</span>
                    {w!.phonetic ? <span className="ml-2 text-xs font-bold text-muted-foreground">{w!.phonetic}</span> : null}
                    <span className="block text-sm font-semibold text-primary">{w!.meaning_vi}</span>
                  </span>
                  <button type="button" aria-label="Nghe" onClick={() => speakText(w!.word, w!.audioUrl)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted-foreground">
                    <Volume2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="mt-5 text-center font-bold text-success">Không sai câu nào — tuyệt vời!</p>
        )}

        <Button type="button" size="lg" className="mt-5 w-full" onClick={onBackHome}>Xong</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={title} onClose={onBackHome} progress={Math.round((index / questions.length) * 100)} icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-emerald-500" />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Câu {index + 1}/{questions.length}</p>
      <Card><CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-center gap-3">
          <p className="text-center text-xl font-extrabold whitespace-pre-line">{q.question}</p>
          {q.type === "listen_choose" ? (
            <Button type="button" size="icon" variant="outline" aria-label="Nghe" onClick={() => speakText(q.answer)}>
              <Volume2 className="h-5 w-5" />
            </Button>
          ) : null}
        </div>

        {q.type === "choose_picture" && q.imageOptions ? (
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((o, i) => {
              const state = !picked ? "" : o === q.answer ? "ring-4 ring-success" : o === picked ? "ring-4 ring-red-400" : "opacity-50";
              return (
                <button key={o} type="button" disabled={!!picked} onClick={() => choose(o)}
                  className={cn("overflow-hidden rounded-2xl border-2 border-border transition-all", state)}>
                  {q.imageOptions?.[i] ? <img src={q.imageOptions[i]} alt="" className="h-28 w-full object-cover" /> : <div className="flex h-28 items-center justify-center px-2 text-center font-bold">{o}</div>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-2">
            {q.options.map((o) => {
              const state = !picked ? "" : o === q.answer ? "ring-4 ring-success bg-success/10" : o === picked ? "ring-4 ring-red-400 bg-red-50" : "opacity-50";
              return (
                <button key={o} type="button" disabled={!!picked} onClick={() => choose(o)}
                  className={cn("rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-lg font-bold transition-all", state)}>
                  {o}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback khi trả lời sai */}
        {showFeedback && picked && picked !== q.answer && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="mb-1 text-sm font-extrabold text-red-600 dark:text-red-400">Sai rồi!</p>
            <p className="text-sm font-bold">
              Đáp án đúng: <span className="text-success font-extrabold">{q.answer}</span>
            </p>
            {q.explanation && (
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{q.explanation}</p>
            )}
            <Button type="button" size="sm" variant="outline" className="mt-3" onClick={() => advance()}>
              Câu tiếp theo
            </Button>
          </div>
        )}

        {/* Feedback khi trả lời đúng */}
        {picked && picked === q.answer && (
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
            <p className="text-sm font-extrabold text-success">Đúng rồi!</p>
          </div>
        )}
      </CardContent></Card>
    </main>
  );
}
