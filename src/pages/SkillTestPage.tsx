import { GraduationCap, Loader2, Mic, PartyPopper, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Student } from "@/types";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import {
  startSkillTest, submitSkillTest,
  type Skill, type SkillAnswer, type SkillResult, type SkillTestItem, type SkillTestSession,
} from "@/services/skillTestService";
import { speakText } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { SpeakResult } from "@/components/speak/SpeakResult";

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
    for (const item of session.items) for (const skill of session.skills) {
      // Bỏ qua skill "speak" nếu từ không có phonetic (từ Oxford/phrases chưa có)
      if (skill === "speak" && !item.phonetic) continue;
      out.push({ item, skill });
    }
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
  if (results) return <Shell onBack={onBackHome}><ResultView data={results} answers={answers} onDone={onBackHome} /></Shell>;
  // Không có từ hợp lệ để thi (vd từ đã bị gỡ khỏi từ điển) -> báo nhẹ, KHÔNG để trắng trang.
  if (!tasks.length) return <Shell onBack={onBackHome}><Info text="Chưa có từ để thi lúc này. Hãy học thêm và bấm 'Thuộc' cho đủ từ nhé." /></Shell>;

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
  const [phase, setPhase] = useState<"idle" | "recording" | "scoring" | "result">("idle");
  const [result, setResult] = useState<PronResult | null>(null);
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
    try { const wav = await recRef.current.stop(); const r = await assessPronunciation(wav, item.phonetic || ""); setResult(r); setPhase("result"); }
    catch { onAnswer("skip"); }
  };

  // Hiện kết quả chấm (điểm + từng âm đúng/sai) TRƯỚC khi sang kỹ năng tiếp theo.
  if (phase === "result" && result) {
    return (
      <Card><CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <p className="text-2xl font-black">{item.word}</p>
        <SpeakResult
          result={result}
          onRetry={() => { setResult(null); setPhase("idle"); }}
          onContinue={() => onAnswer(result.score)}
          onSkip={() => onAnswer("skip")}
        />
      </CardContent></Card>
    );
  }

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

function ResultView({ data, answers, onDone }: { data: { results: SkillResult[]; totalDelta: number; score?: number }; answers?: SkillAnswer[]; onDone: () => void }) {
  const wordText = (id: string) => SEED_VOCABULARY.find((w) => w.id === id)?.word ?? id;
  const totalSkills = data.results.reduce((s, r) => s + r.passed.length + r.lost.length, 0);
  const passedSkills = data.results.reduce((s, r) => s + r.passed.length, 0);
  const score = data.score ?? (totalSkills > 0 ? Math.round((passedSkills / totalSkills) * 100) : 0);
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "F";
  const gradeColor = score >= 80 ? "text-success" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <Card className="overflow-hidden"><CardContent className="flex flex-col items-center gap-4 p-0">
      {/* Header gradient */}
      <div className="w-full bg-gradient-to-br from-primary to-success px-6 py-6 text-center text-white">
        <PartyPopper className="mx-auto h-10 w-10 mb-2" />
        <h2 className="text-2xl font-black">Hoàn thành bài thi!</h2>
      </div>

      <div className="flex items-center gap-6 px-6">
        {/* Score ring */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className={gradeColor}
              strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-black">{score}</span>
            <span className="text-xs font-bold text-muted-foreground">%</span>
          </div>
        </div>
        <div className="text-left">
          <p className={`text-4xl font-black ${gradeColor}`}>{grade}</p>
          <p className={`text-sm font-extrabold ${data.totalDelta >= 0 ? "text-success" : "text-red-600"}`}>
            {data.totalDelta >= 0 ? "+" : ""}{data.totalDelta} XP
          </p>
          <p className="text-sm font-bold text-muted-foreground">{passedSkills} kỹ năng đạt</p>
        </div>
      </div>

      {/* Per-word results */}
      <div className="w-full space-y-1.5 px-6">
        {data.results.map((r) => {
          const speakAns = answers?.find((a) => a.wordId === r.wordId && a.skill === "speak");
          const speakScore = typeof speakAns?.value === "number" ? speakAns.value : null;
          const skillLabel = (s: string) => s === "listen_word" ? "Nghe" : s === "speak" ? "Nói" : s === "write" ? "Viết" : s === "image_word" ? "Ảnh" : s;
          return (
            <div key={r.wordId} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2 text-left">
              <span className="font-extrabold">{wordText(r.wordId)}</span>
              <span className="flex items-center gap-1.5 text-sm font-bold">
                {r.passed.map((s) => (
                  <span key={s} className="rounded-md bg-success/15 px-1.5 py-0.5 text-[10px] font-extrabold text-success">
                    {skillLabel(s)}{s === "speak" && speakScore !== null ? ` ${speakScore}%` : ""}
                  </span>
                ))}
                {r.lost.map((s) => (
                  <span key={s} className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-extrabold text-red-600">
                    {skillLabel(s)}{s === "speak" && speakScore !== null ? ` ${speakScore}%` : ""}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full px-6 pb-6 space-y-2">
        <p className="text-xs font-bold text-muted-foreground text-center">Từ chưa đủ kỹ năng sẽ vào "Cần ôn" để học lại.</p>
        <Button type="button" size="lg" className="w-full" onClick={onDone}>Xong</Button>
      </div>
    </CardContent></Card>
  );
}

function Shell({ children, onBack, progress }: { children: React.ReactNode; onBack: () => void; progress?: number }) {
  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title="Thi từ vựng" onClose={onBack} progress={progress} icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-primary" />
      {children}
    </main>
  );
}
const Center = ({ children }: { children: React.ReactNode }) => <div className="flex justify-center py-16">{children}</div>;
const Info = ({ text }: { text: string }) => (
  <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">{text}</CardContent></Card>
);
