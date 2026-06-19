import { CheckCircle2, Loader2, Mic, PartyPopper, Volume2, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Student } from "@/types";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import {
  startSkillTest, submitSkillTest,
  type Skill, type SkillAnswer, type SkillResult, type SkillTestItem, type SkillTestSession,
} from "@/services/skillTestService";
import { speakText } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress";
import { SessionHeader } from "@/components/layout/SessionHeader";

const SKILL_LABEL: Record<Skill, string> = {
  listen_word: "Nghe chọn chữ",
  image_word: "Nhìn hình đoán chữ",
  speak: "Nói",
  write: "Viết",
};
const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();

interface Props {
  student: Student;
  mode: "new" | "review";
  onBackHome: () => void;
}

export function SkillTestPage({ student, mode, onBackHome }: Props) {
  const [session, setSession] = useState<SkillTestSession | null>(null);
  const [error, setError] = useState("");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<SkillAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{ results: SkillResult[]; totalDelta: number } | null>(null);

  useEffect(() => {
    startSkillTest(student.id, mode)
      .then(setSession)
      .catch(() => setError("Chưa có từ để thi. Hãy học thêm và bấm \"Thuộc\" cho đủ 10 từ."));
  }, [student.id, mode]);

  // Danh sách nhiệm vụ phẳng: mỗi (từ × kỹ năng) là 1 bước.
  const tasks = useMemo(() => {
    if (!session) return [];
    const out: { item: SkillTestItem; skill: Skill }[] = [];
    for (const item of session.items) for (const skill of session.skills) out.push({ item, skill });
    return out;
  }, [session]);

  const finish = async (all: SkillAnswer[]) => {
    if (!session) return;
    setSubmitting(true);
    try { setResults(await submitSkillTest(student.id, session.sessionId, all)); }
    catch { setError("Nộp bài lỗi, thử lại sau."); }
    finally { setSubmitting(false); }
  };

  const record = (value: string | number) => {
    const t = tasks[idx];
    const next = [...answers, { wordId: t.item.wordId, skill: t.skill, value }];
    setAnswers(next);
    if (idx + 1 < tasks.length) setIdx(idx + 1);
    else finish(next);
  };

  if (error) return <Shell onBack={onBackHome}><Info text={error} /></Shell>;
  if (!session || submitting) return <Shell onBack={onBackHome}><Center><Loader2 className="h-8 w-8 animate-spin text-primary" /></Center></Shell>;
  if (results) return <Shell onBack={onBackHome}><ResultView data={results} onDone={onBackHome} /></Shell>;

  const task = tasks[idx];
  return (
    <Shell onBack={onBackHome} progress={Math.round((idx / tasks.length) * 100)}>
      <p className="mb-2 text-center text-sm font-extrabold text-muted-foreground">
        Câu {idx + 1}/{tasks.length} · {SKILL_LABEL[task.skill]}
      </p>
      <TaskView key={idx} item={task.item} skill={task.skill} onAnswer={record} />
    </Shell>
  );
}

function TaskView({ item, skill, onAnswer }: { item: SkillTestItem; skill: Skill; onAnswer: (v: string | number) => void }) {
  if (skill === "listen_word") return <ListenChoose item={item} onAnswer={onAnswer} />;
  if (skill === "image_word") return <ImageChoose item={item} onAnswer={onAnswer} />;
  if (skill === "write") return <WriteWord item={item} onAnswer={onAnswer} />;
  return <SpeakWord item={item} onAnswer={onAnswer} />;
}

function ListenChoose({ item, onAnswer }: { item: SkillTestItem; onAnswer: (v: string) => void }) {
  useEffect(() => { speakText(item.word, item.audioUrl); }, [item]);
  return (
    <Card><CardContent className="flex flex-col items-center gap-4 p-6">
      <Button type="button" size="lg" variant="accent" onClick={() => speakText(item.word, item.audioUrl)}>
        <Volume2 className="h-6 w-6" /> Nghe lại
      </Button>
      <p className="font-bold text-muted-foreground">Nghe và chọn đúng từ:</p>
      <Options options={item.options ?? []} onPick={onAnswer} />
    </CardContent></Card>
  );
}

function ImageChoose({ item, onAnswer }: { item: SkillTestItem; onAnswer: (v: string) => void }) {
  return (
    <Card><CardContent className="flex flex-col items-center gap-4 p-6">
      <div className="h-44 w-full overflow-hidden rounded-2xl bg-secondary">
        {item.imageUrl
          ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-6xl font-black text-secondary-foreground">{item.word[0]?.toUpperCase()}</div>}
      </div>
      <p className="font-bold text-muted-foreground">Nhìn hình và chọn đúng từ:</p>
      <Options options={item.options ?? []} onPick={onAnswer} />
    </CardContent></Card>
  );
}

function Options({ options, onPick }: { options: string[]; onPick: (v: string) => void }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {options.map((o) => (
        <Button key={o} type="button" variant="outline" size="lg" className="h-14 text-base" onClick={() => onPick(o)}>{o}</Button>
      ))}
    </div>
  );
}

function WriteWord({ item, onAnswer }: { item: SkillTestItem; onAnswer: (v: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <Card><CardContent className="flex flex-col items-center gap-4 p-6">
      <div className="h-36 w-full overflow-hidden rounded-2xl bg-secondary">
        {item.imageUrl
          ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-5xl font-black text-secondary-foreground">?</div>}
      </div>
      <p className="text-center text-lg font-black">{item.meaning_vi}</p>
      <p className="text-sm font-bold text-muted-foreground">Gõ lại từ tiếng Anh:</p>
      <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); if (val.trim()) onAnswer(val.trim()); }}>
        <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="từ tiếng Anh…"
          className="h-12 flex-1 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary" />
        <Button type="submit" size="lg" disabled={!val.trim()}>Kiểm tra</Button>
      </form>
    </CardContent></Card>
  );
}

function SpeakWord({ item, onAnswer }: { item: SkillTestItem; onAnswer: (v: string | number) => void }) {
  const [phase, setPhase] = useState<"idle" | "recording" | "scoring">("idle");
  const recRef = useRef<Recorder | null>(null);

  if (!CAN_MIC) {
    return (
      <Card><CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <p className="text-2xl font-black">{item.word}</p>
        <p className="text-sm font-bold text-muted-foreground">Thiết bị không có micro nên bỏ qua kỹ năng Nói.</p>
        <Button type="button" size="lg" className="w-full" onClick={() => onAnswer("skip")}>Tiếp tục</Button>
      </CardContent></Card>
    );
  }

  const start = async () => {
    try { recRef.current = await startRecording(); setPhase("recording"); }
    catch { onAnswer("skip"); }
  };
  const stop = async () => {
    if (!recRef.current) return;
    setPhase("scoring");
    try { const wav = await recRef.current.stop(); const r = await assessPronunciation(wav, item.phonetic || ""); onAnswer(r.score); }
    catch { onAnswer("skip"); }
  };

  return (
    <Card><CardContent className="flex flex-col items-center gap-4 p-6 text-center">
      <p className="text-3xl font-black">{item.word}</p>
      {item.phonetic ? <p className="font-bold text-muted-foreground">{item.phonetic}</p> : null}
      <Button type="button" variant="outline" onClick={() => speakText(item.word, item.audioUrl)}>
        <Volume2 className="h-5 w-5" /> Nghe mẫu
      </Button>
      {phase === "scoring"
        ? <Loader2 className="h-8 w-8 animate-spin text-primary" />
        : phase === "recording"
          ? <Button type="button" size="xl" variant="destructive" className="w-full" onClick={stop}><Mic className="h-6 w-6" /> Dừng & chấm</Button>
          : <Button type="button" size="xl" className="w-full" onClick={start}><Mic className="h-6 w-6" /> Đọc từ này</Button>}
      <button type="button" className="text-sm font-bold text-muted-foreground underline" onClick={() => onAnswer("skip")}>Bỏ qua</button>
    </CardContent></Card>
  );
}

function ResultView({ data, onDone }: { data: { results: SkillResult[]; totalDelta: number }; onDone: () => void }) {
  const wordText = (id: string) => SEED_VOCABULARY.find((w) => w.id === id)?.word ?? id;
  const gained = data.results.reduce((s, r) => s + r.passed.length, 0);
  return (
    <Card><CardContent className="flex flex-col items-center gap-4 p-6 text-center">
      <PartyPopper className="h-12 w-12 text-accent" />
      <h2 className="text-2xl font-black">Hoàn thành bài thi!</h2>
      <p className={`text-lg font-black ${data.totalDelta >= 0 ? "text-success" : "text-red-600"}`}>
        {data.totalDelta >= 0 ? "+" : ""}{data.totalDelta} điểm
      </p>
      <div className="w-full space-y-2">
        {data.results.map((r) => (
          <div key={r.wordId} className="flex items-center justify-between rounded-2xl border-2 border-border/60 bg-card px-4 py-2 text-left">
            <span className="font-extrabold">{wordText(r.wordId)}</span>
            <span className="flex items-center gap-1 text-sm font-bold">
              {r.points > 0 ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-red-500" />}
              {r.points} kỹ năng{r.lost.length ? ` · quên ${r.lost.length}` : ""}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm font-bold text-muted-foreground">Từ chưa đủ kỹ năng sẽ vào "Cần ôn" để học lại.</p>
      <Button type="button" size="lg" className="w-full" onClick={onDone}>Xong</Button>
    </CardContent></Card>
  );
}

function Shell({ children, onBack, progress }: { children: React.ReactNode; onBack: () => void; progress?: number }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title="Thi từ vựng" onClose={onBack} progress={progress} />
      {children}
    </main>
  );
}
const Center = ({ children }: { children: React.ReactNode }) => <div className="flex justify-center py-16">{children}</div>;
const Info = ({ text }: { text: string }) => (
  <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">{text}</CardContent></Card>
);
