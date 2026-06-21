import { ArrowRight, Loader2, Mic, PartyPopper, Square, ThumbsUp, Volume2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { speakText } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { ProgressRing } from "@/components/ui/progress";
import { VoicePicker } from "@/components/ui/VoicePicker";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { pickWords } from "@/components/games/wordRotation";

interface SpeakingPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

type Phase = "idle" | "recording" | "scoring" | "result";

// Chấm chi tiết cần: micro + ngữ cảnh bảo mật (HTTPS/localhost).
const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();

export function SpeakingPage({ topicId, onBackHome }: SpeakingPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const words = useMemo(() => {
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && !w.word.includes(" "));
    return pickWords(t.length >= 1 ? t : SEED_VOCABULARY, 8);
  }, [topicId]);

  const [n, setN] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<PronResult | null>(null);
  const [err, setErr] = useState("");
  const [good, setGood] = useState(0);
  const [done, setDone] = useState(false);
  const recRef = useRef<Recorder | null>(null);

  const word = words[n];
  const detailed = CAN_MIC && !!word?.phonetic;

  if (!word) {
    return (<main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Luyện nói" onClose={onBackHome} /><Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ để luyện.</CardContent></Card></main>);
  }

  if (done) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Luyện nói" onClose={onBackHome} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">{detailed ? `Đọc tốt ${good}/${words.length} từ! 🎉` : `Đã luyện ${words.length} từ! 🎉`}</p>
            <Button type="button" size="lg" className="w-full" onClick={onBackHome}>Xong</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const next = () => {
    if (n + 1 >= words.length) setDone(true);
    else { setN((x) => x + 1); setPhase("idle"); setResult(null); setErr(""); }
  };

  const start = async () => {
    setErr("");
    try {
      recRef.current = await startRecording();
      setPhase("recording");
    } catch {
      setErr("Không mở được micro — hãy cho phép quyền micro.");
    }
  };

  const stopAndScore = async () => {
    if (!recRef.current) return;
    setPhase("scoring");
    try {
      const wav = await recRef.current.stop();
      const r = await assessPronunciation(wav, word.phonetic || "");
      setResult(r);
      if (r.score >= 80) setGood((g) => g + 1);
      setPhase("result");
    } catch {
      setErr("Chưa chấm được — dịch vụ chấm phát âm (speech-eval) chưa chạy?");
      setPhase("idle");
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={`Luyện nói${topic ? " · " + topic.name : ""}`} onClose={onBackHome} progress={Math.round((n / words.length) * 100)} right={<VoicePicker />} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Từ {n + 1} / {words.length}</p>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="h-44 w-full overflow-hidden rounded-2xl bg-secondary">
            {word.imageUrl ? (
              <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-black text-secondary-foreground">{word.word[0]?.toUpperCase()}</div>
            )}
          </div>
          <h2 className="text-4xl font-black capitalize">{word.word}</h2>
          {word.phonetic ? <p className="font-bold text-muted-foreground">{word.phonetic}</p> : null}
          <Button type="button" variant="outline" onClick={() => speakText(word.word, word.audioUrl)}>
            <Volume2 className="h-5 w-5" /> Nghe mẫu
          </Button>

          {detailed ? (
            <>
              {phase === "idle" || phase === "recording" ? (
                <button
                  type="button"
                  onClick={phase === "recording" ? stopAndScore : start}
                  className={cn(
                    "mt-2 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-card transition-all active:translate-y-[2px]",
                    phase === "recording" ? "animate-pulse bg-red-500" : "bg-primary hover:brightness-105",
                  )}
                  aria-label={phase === "recording" ? "Dừng" : "Ghi âm"}
                >
                  {phase === "recording" ? <Square className="h-8 w-8" /> : <Mic className="h-9 w-9" strokeWidth={2.5} />}
                </button>
              ) : null}
              {phase === "scoring" ? <Loader2 className="mt-2 h-10 w-10 animate-spin text-primary" /> : null}
              <p className="text-sm font-bold text-muted-foreground">
                {phase === "recording" ? "Đang ghi... đọc to từ rồi bấm Dừng" : phase === "scoring" ? "Đang chấm phát âm..." : "Bấm micro, đọc to từ, rồi Dừng để chấm"}
              </p>

              {phase === "result" && result ? (
                <div className="w-full space-y-3 rounded-2xl bg-muted p-4">
                  <div className="flex items-center justify-center gap-4">
                    <ProgressRing value={result.score} max={100} size={72} stroke={9}>
                      <span className="text-lg font-black text-primary">{result.score}%</span>
                    </ProgressRing>
                    <p className={cn("text-lg font-black", result.score >= 80 ? "text-success" : result.score >= 50 ? "text-warning" : "text-red-500")}>
                      {result.score >= 80 ? "Phát âm tốt!" : result.score >= 50 ? "Khá rồi, luyện thêm nhé" : "Đọc lại nhé"}
                    </p>
                  </div>
                  {/* IPA từng âm: xanh = đúng, đỏ = cần sửa */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {result.phones.map((p, i) => (
                      <span key={i} className={cn("rounded-lg px-2 py-1 text-lg font-black", p.ok ? "bg-success/15 text-success" : "bg-red-100 text-red-600")}>
                        {p.ipa}
                      </span>
                    ))}
                  </div>
                  {result.heard ? <p className="text-xs font-semibold text-muted-foreground">Âm nghe được: {result.heard}</p> : null}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={start}><Mic className="h-5 w-5" /> Đọc lại</Button>
                    <Button type="button" className="flex-1" onClick={next}>{n + 1 >= words.length ? "Xong" : (<>Từ tiếp <ArrowRight className="h-5 w-5" /></>)}</Button>
                  </div>
                </div>
              ) : null}

              {err ? <p className="text-sm font-bold text-red-600">{err}</p> : null}
            </>
          ) : (
            // Fallback: máy không dùng được micro/chấm -> nghe & nhắc lại.
            <div className="w-full space-y-3">
              <p className="rounded-2xl bg-muted p-3 text-sm font-bold text-muted-foreground">🔊 Nghe mẫu rồi đọc to theo nhé.</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => speakText(word.word, word.audioUrl)}><Volume2 className="h-5 w-5" /> Nghe lại</Button>
                <Button type="button" className="flex-1" onClick={next}><ThumbsUp className="h-5 w-5" /> {n + 1 >= words.length ? "Xong" : "Con đọc được"}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!CAN_MIC ? (
        <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
          Để chấm phát âm chi tiết: mở trên <b>máy tính (Chrome, localhost)</b> hoặc bản <b>HTTPS</b>, và chạy dịch vụ <code>speech-eval</code>.
        </p>
      ) : null}
    </main>
  );
}
