import { ArrowRight, Headphones, Loader2, Mic, PartyPopper, RotateCcw, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { speakText } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { pickWords } from "@/components/games/wordRotation";
import { SpeakResult, SPEAK_PASS } from "@/components/speak/SpeakResult";

interface ShadowingPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

type Phase = "listen" | "ready" | "recording" | "scoring" | "result";

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const RECORD_DURATION = 3000; // 3 giây ghi âm tự động

export function ShadowingPage({ topicId, onBackHome }: ShadowingPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const words = useMemo(() => {
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && !w.word.includes(" "));
    return pickWords(t.length >= 1 ? t : SEED_VOCABULARY, 8);
  }, [topicId]);

  const [n, setN] = useState(0);
  const [phase, setPhase] = useState<Phase>("listen");
  const [result, setResult] = useState<PronResult | null>(null);
  const [err, setErr] = useState("");
  const [good, setGood] = useState(0);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const word = words[n];

  // Auto-play TTS khi hiện từ mới
  useEffect(() => {
    if (!word || phase !== "listen") return;
    speakText(word.word, word.audioUrl);
    // Sau 1.5s (TTS đọc xong) → chuyển sang ready
    const t = setTimeout(() => setPhase("ready"), 1500);
    return () => clearTimeout(t);
  }, [n, word, phase]);

  if (!word) {
    return (<main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBackHome} /><Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ.</CardContent></Card></main>);
  }

  if (!CAN_MIC) {
    return (<main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBackHome} /><Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Cần micro để luyện Shadowing. Mở trên Chrome HTTPS.</CardContent></Card></main>);
  }

  if (done) {
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Shadowing" onClose={onBackHome} />
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-success px-6 py-6 text-center text-white">
            <PartyPopper className="mx-auto h-10 w-10 mb-2" />
            <h2 className="text-2xl font-black">Hoàn thành Shadowing!</h2>
          </div>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="flex items-center gap-6">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className={avg >= 60 ? "text-success" : "text-red-600"}
                    strokeDasharray={`${avg * 2.64} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black">{avg}</span>
                  <span className="text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-extrabold">{good}/{words.length} từ đạt</p>
                <p className="text-sm font-bold text-muted-foreground">Trung bình {avg}%</p>
              </div>
            </div>
            {/* Per-word scores */}
            <div className="w-full space-y-1.5">
              {words.map((w, i) => {
                const s = scores[i];
                const pass = s !== undefined && s >= SPEAK_PASS;
                return (
                  <div key={w.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-1.5">
                    <span className="font-extrabold capitalize">{w.word}</span>
                    <span className={cn("text-sm font-black", s !== undefined ? (pass ? "text-success" : "text-red-600") : "text-muted-foreground")}>
                      {s !== undefined ? `${s}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <Button type="button" size="lg" className="w-full" onClick={onBackHome}>Xong</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const next = (score?: number) => {
    if (score !== undefined) setScores((s) => [...s, score]);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (n + 1 >= words.length) setDone(true);
    else { setN((x) => x + 1); setPhase("listen"); setResult(null); setErr(""); }
  };

  const startRec = async () => {
    setErr("");
    try {
      recRef.current = await startRecording();
      setPhase("recording");
      // Auto-stop sau 3 giây
      timerRef.current = setTimeout(() => stopAndScore(), RECORD_DURATION);
    } catch {
      setErr("Không mở được micro.");
    }
  };

  const stopAndScore = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!recRef.current) return;
    setPhase("scoring");
    try {
      const wav = await recRef.current.stop();
      const r = await assessPronunciation(wav, word.phonetic || "");
      setResult(r);
      if (r.score >= SPEAK_PASS) setGood((g) => g + 1);
      setPhase("result");
    } catch {
      setErr("Lỗi chấm phát âm.");
      setPhase("ready");
    }
  };

  const replay = () => {
    speakText(word.word, word.audioUrl);
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={`Shadowing${topic ? " · " + topic.name : ""}`} onClose={onBackHome} progress={Math.round((n / words.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Từ {n + 1} / {words.length}</p>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          {/* Ảnh + từ */}
          <div className="h-36 w-full overflow-hidden rounded-2xl bg-secondary">
            {word.imageUrl ? (
              <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-black text-secondary-foreground">{word.word[0]?.toUpperCase()}</div>
            )}
          </div>
          <h2 className="text-3xl font-black capitalize">{word.word}</h2>
          {word.meaning_vi && <p className="text-base font-extrabold text-primary">{word.meaning_vi}</p>}
          {word.phonetic && <p className="text-sm font-bold text-muted-foreground">{word.phonetic}</p>}

          {/* Phase: Listen */}
          {phase === "listen" && (
            <div className="flex flex-col items-center gap-2">
              <Headphones className="h-10 w-10 animate-pulse text-primary" />
              <p className="text-sm font-bold text-muted-foreground">Đang nghe mẫu...</p>
            </div>
          )}

          {/* Phase: Ready — bấm mic để bắt đầu đọc theo */}
          {phase === "ready" && (
            <>
              <button type="button" onClick={replay} className="text-sm font-bold text-primary underline">
                <Volume2 className="inline h-4 w-4" /> Nghe lại
              </button>
              <button
                type="button"
                onClick={startRec}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all active:translate-y-[2px] hover:brightness-105"
              >
                <Mic className="h-9 w-9" strokeWidth={2.5} />
              </button>
              <p className="text-sm font-bold text-muted-foreground">Bấm mic rồi đọc theo!</p>
            </>
          )}

          {/* Phase: Recording */}
          {phase === "recording" && (
            <>
              <button
                type="button"
                onClick={stopAndScore}
                className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-card"
              >
                <Square className="h-8 w-8" />
              </button>
              <p className="text-sm font-bold text-red-600">Đang ghi... đọc to theo mẫu!</p>
            </>
          )}

          {/* Phase: Scoring */}
          {phase === "scoring" && <Loader2 className="h-10 w-10 animate-spin text-primary" />}

          {/* Phase: Result */}
          {phase === "result" && result && (
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-muted p-4">
              <SpeakResult
                result={result}
                ringSize={72}
                showHeard
                continueLabel={n + 1 >= words.length ? "Xong" : (<>Từ tiếp <ArrowRight className="h-5 w-5" /></>)}
                onRetry={() => { setResult(null); setPhase("ready"); }}
                onContinue={() => next(result.score)}
                onSkip={() => next(result.score)}
              />
            </div>
          )}

          {err && <p className="text-sm font-bold text-red-600">{err}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
