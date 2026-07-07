import { ArrowRight, CheckCircle2, Headphones, Keyboard, Loader2, Mic, PartyPopper, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student, VocabularyWord } from "@/types";
import { speakTextWithSpeed } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { SpeakResult, SPEAK_PASS } from "@/components/speak/SpeakResult";

interface Props { student: Student; topicId: string; onBackHome: () => void; }

type Mode = "shadow" | "dictation";
type Phase = "listen" | "ready" | "recording" | "scoring" | "result" | "dictation" | "dict-result";

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const SPEEDS = [1.0, 1.15, 1.3];
const SPEED_LABELS = ["1×", "1.15×", "1.3×"];
const ITEMS_PER_ROUND = 6;

function pickPhrases(vocab: VocabularyWord[], count: number): VocabularyWord[] {
  // Ưu tiên phrases (multi-word), có phonetic
  const phrases = vocab.filter((w) => w.word.includes(" ") && w.phonetic);
  const pool = phrases.length >= count ? phrases : vocab.filter((w) => w.phonetic);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function ShadowingPage({ student, topicId, onBackHome }: Props) {
  const items = useMemo(() => {
    const byTopic = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId));
    return pickPhrases(byTopic.length >= 3 ? byTopic : SEED_VOCABULARY, ITEMS_PER_ROUND);
  }, [topicId]);

  const [mode, setMode] = useState<Mode>("shadow");
  const [n, setN] = useState(0);
  const [round, setRound] = useState(0); // 0=1x, 1=1.15x, 2=1.3x
  const [phase, setPhase] = useState<Phase>("listen");
  const [result, setResult] = useState<PronResult | null>(null);
  const [err, setErr] = useState("");
  const [scores, setScores] = useState<{ word: string; score: number; mode: string }[]>([]);
  const [done, setDone] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0); // bao nhiêu lần đọc lại từ này

  // Dictation
  const [dictInput, setDictInput] = useState("");
  const [dictCorrect, setDictCorrect] = useState<boolean | null>(null);

  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const word = items[n];
  const speed = SPEEDS[round] || 1.0;

  // Auto-play TTS khi phase = listen
  useEffect(() => {
    if (!word || phase !== "listen") return;
    let cancelled = false;
    speakTextWithSpeed(word.word, speed).then(() => {
      if (cancelled) return;
      // Đợi 0.8s sau khi TTS xong
      timerRef.current = setTimeout(() => {
        if (mode === "shadow") setPhase("ready");
        else { setPhase("dictation"); setDictInput(""); setDictCorrect(null); }
      }, 800);
    });
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [n, round, phase, word, speed, mode]);

  if (!word) return <Wrapper onBack={onBackHome}><Info text="Chưa có câu để luyện." /></Wrapper>;
  if (!CAN_MIC && mode === "shadow") return <Wrapper onBack={onBackHome}><Info text="Cần micro để Shadowing. Mở trên Chrome HTTPS." /></Wrapper>;

  // ── Done screen ──
  if (done) {
    const shadowScores = scores.filter((s) => s.mode === "shadow");
    const dictScores = scores.filter((s) => s.mode === "dictation");
    const avg = shadowScores.length > 0 ? Math.round(shadowScores.reduce((a, b) => a + b.score, 0) / shadowScores.length) : 0;
    const dictCorrectCount = dictScores.filter((s) => s.score === 100).length;
    return (
      <Wrapper onBack={onBackHome}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-success px-6 py-6 text-center text-white">
            <PartyPopper className="mx-auto h-10 w-10 mb-2" />
            <h2 className="text-2xl font-black">Hoàn thành!</h2>
            <p className="text-sm font-semibold opacity-90">
              {round > 0 ? `${SPEED_LABELS[round]} speed` : ""} · {items.length} câu
            </p>
          </div>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            {shadowScores.length > 0 && (
              <div className="flex items-center gap-4">
                <ScoreRing score={avg} size={80} />
                <div>
                  <p className="text-lg font-extrabold">Phát âm: {avg}%</p>
                  <p className="text-sm font-bold text-muted-foreground">
                    {shadowScores.filter((s) => s.score >= SPEAK_PASS).length}/{shadowScores.length} câu đạt
                  </p>
                </div>
              </div>
            )}
            {dictScores.length > 0 && (
              <p className="font-extrabold">Dictation: {dictCorrectCount}/{dictScores.length} câu đúng</p>
            )}
            {/* Per-item scores */}
            <div className="w-full space-y-1.5">
              {scores.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-1.5">
                  <span className="font-bold text-sm truncate flex-1">{s.word}</span>
                  <span className={cn("text-sm font-black ml-2", s.score >= SPEAK_PASS ? "text-success" : "text-red-600")}>
                    {s.mode === "dictation" ? (s.score === 100 ? "✓" : "✗") : `${s.score}%`}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex w-full gap-2">
              {round < SPEEDS.length - 1 && mode === "shadow" && (
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setRound((r) => r + 1); setN(0); setDone(false); setPhase("listen"); }}>
                  <Play className="h-4 w-4" /> Tăng tốc {SPEED_LABELS[round + 1]}
                </Button>
              )}
              <Button type="button" className="flex-1" onClick={onBackHome}>Xong</Button>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  const next = (score?: number, m?: string) => {
    if (score !== undefined) setScores((s) => [...s, { word: word.word, score, mode: m || mode }]);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setRepeatCount(0);
    if (n + 1 >= items.length) setDone(true);
    else { setN((x) => x + 1); setPhase("listen"); setResult(null); setErr(""); setDictInput(""); setDictCorrect(null); }
  };

  const replay = () => speakTextWithSpeed(word.word, speed);

  // ── Shadow: recording ──
  const startRec = async () => {
    setErr("");
    try {
      recRef.current = await startRecording();
      setPhase("recording");
      const dur = Math.max(2000, word.word.length * 200); // thời gian ghi tỷ lệ độ dài câu
      timerRef.current = setTimeout(() => stopAndScore(), dur);
    } catch { setErr("Không mở được micro."); }
  };

  const stopAndScore = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!recRef.current) return;
    setPhase("scoring");
    try {
      const wav = await recRef.current.stop();
      const r = await assessPronunciation(wav, word.phonetic || "");
      setResult(r);
      setPhase("result");
    } catch { setErr("Lỗi chấm phát âm."); setPhase("ready"); }
  };

  // ── Dictation: check ──
  const checkDictation = () => {
    const correct = dictInput.trim().toLowerCase().replace(/[?.!,]/g, "") === word.word.toLowerCase().replace(/[?.!,]/g, "");
    setDictCorrect(correct);
    setPhase("dict-result");
  };

  return (
    <Wrapper onBack={onBackHome} progress={Math.round((n / items.length) * 100)}>
      {/* Mode toggle + Speed */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-muted p-0.5">
          <button type="button" onClick={() => setMode("shadow")} className={cn("rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors", mode === "shadow" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
            <Mic className="inline h-3.5 w-3.5 mr-1" />Shadowing
          </button>
          <button type="button" onClick={() => { setMode("dictation"); setPhase("listen"); }} className={cn("rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors", mode === "dictation" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
            <Keyboard className="inline h-3.5 w-3.5 mr-1" />Dictation
          </button>
        </div>
        {mode === "shadow" && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{SPEED_LABELS[round]}</span>
        )}
      </div>

      <p className="mb-2 text-center text-sm font-extrabold text-muted-foreground">
        Câu {n + 1} / {items.length}{repeatCount > 0 ? ` · lần ${repeatCount + 1}` : ""}
      </p>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-5 text-center">
          {/* Meaning VN */}
          {word.meaning_vi && <p className="text-base font-extrabold text-primary">{word.meaning_vi}</p>}

          {/* Phase: Listen */}
          {phase === "listen" && (
            <div className="flex flex-col items-center gap-2 py-4">
              <Headphones className="h-12 w-12 animate-pulse text-primary" />
              <p className="text-sm font-bold text-muted-foreground">Đang nghe...</p>
            </div>
          )}

          {/* Phase: Ready (shadow mode) */}
          {phase === "ready" && (
            <>
              <p className="text-2xl font-black">{word.word}</p>
              {word.phonetic && <p className="text-sm font-semibold text-muted-foreground">{word.phonetic}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={replay} className="text-sm font-bold text-primary underline">
                  <Volume2 className="inline h-4 w-4" /> Nghe lại
                </button>
              </div>
              <button type="button" onClick={startRec}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all active:translate-y-[2px]">
                <Mic className="h-9 w-9" strokeWidth={2.5} />
              </button>
              <p className="text-sm font-bold text-muted-foreground">Bấm mic rồi đọc theo!</p>
            </>
          )}

          {/* Phase: Recording */}
          {phase === "recording" && (
            <>
              <p className="text-2xl font-black">{word.word}</p>
              <button type="button" onClick={stopAndScore}
                className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-card">
                <Square className="h-8 w-8" />
              </button>
              <p className="text-sm font-bold text-red-600">Đang ghi... đọc to theo mẫu!</p>
            </>
          )}

          {/* Phase: Scoring */}
          {phase === "scoring" && <Loader2 className="h-10 w-10 animate-spin text-primary" />}

          {/* Phase: Result (shadow) */}
          {phase === "result" && result && (
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-muted p-4">
              <p className="text-lg font-black">{word.word}</p>
              <SpeakResult
                result={result}
                ringSize={72}
                showHeard
                continueLabel={n + 1 >= items.length ? "Xong" : (<>Tiếp <ArrowRight className="h-4 w-4" /></>)}
                onRetry={() => { setResult(null); setPhase("listen"); setRepeatCount((c) => c + 1); }}
                onContinue={() => next(result.score, "shadow")}
                onSkip={() => next(result.score, "shadow")}
              />
            </div>
          )}

          {/* Phase: Dictation input */}
          {phase === "dictation" && (
            <>
              <p className="text-sm font-bold text-muted-foreground">Nghe xong → gõ lại câu vừa nghe</p>
              <button type="button" onClick={replay} className="text-sm font-bold text-primary underline">
                <Volume2 className="inline h-4 w-4" /> Nghe lại
              </button>
              <input
                className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-center text-lg font-bold outline-none focus:border-primary"
                value={dictInput}
                onChange={(e) => setDictInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && dictInput.trim() && checkDictation()}
                placeholder="Gõ câu bạn nghe được..."
                autoFocus
              />
              <Button type="button" onClick={checkDictation} disabled={!dictInput.trim()} className="w-full">
                <CheckCircle2 className="h-5 w-5" /> Kiểm tra
              </Button>
            </>
          )}

          {/* Phase: Dictation result */}
          {phase === "dict-result" && (
            <div className="flex w-full flex-col items-center gap-3">
              <p className={cn("text-xl font-black", dictCorrect ? "text-success" : "text-red-600")}>
                {dictCorrect ? "Chính xác! ✓" : "Chưa đúng ✗"}
              </p>
              <div className="w-full rounded-xl bg-muted p-3 text-left space-y-1">
                <p className="text-sm font-bold text-muted-foreground">Đáp án:</p>
                <p className="text-lg font-extrabold">{word.word}</p>
                {!dictCorrect && (
                  <>
                    <p className="text-sm font-bold text-muted-foreground mt-2">Bạn gõ:</p>
                    <p className="text-lg font-bold text-red-600">{dictInput}</p>
                  </>
                )}
              </div>
              <div className="flex w-full gap-2">
                {!dictCorrect && (
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setPhase("listen"); setDictInput(""); setDictCorrect(null); setRepeatCount((c) => c + 1); }}>
                    <RotateCcw className="h-4 w-4" /> Thử lại
                  </Button>
                )}
                <Button type="button" className="flex-1" onClick={() => next(dictCorrect ? 100 : 0, "dictation")}>
                  {n + 1 >= items.length ? "Xong" : (<>Tiếp <ArrowRight className="h-4 w-4" /></>)}
                </Button>
              </div>
            </div>
          )}

          {err && <p className="text-sm font-bold text-red-600">{err}</p>}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color = score >= SPEAK_PASS ? "text-success" : "text-red-600";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className={color}
          strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <span className={cn("text-xl font-black", color)}>{score}%</span>
      </div>
    </div>
  );
}

function Wrapper({ children, onBack, progress }: { children: React.ReactNode; onBack: () => void; progress?: number }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title="Shadowing" onClose={onBack} progress={progress} />
      {children}
    </main>
  );
}

function Info({ text }: { text: string }) {
  return <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">{text}</CardContent></Card>;
}
