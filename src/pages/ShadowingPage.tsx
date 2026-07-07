import { ArrowRight, CheckCircle2, Clock, Headphones, Keyboard, Loader2, Mic, Pause, Play, RotateCcw, Square, Video, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Student } from "@/types";
import { apiRequest } from "@/services/api";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { SpeakResult, SPEAK_PASS } from "@/components/speak/SpeakResult";

interface Props { student: Student; topicId: string; onBackHome: () => void; }

type PracticeMode = "shadow" | "dictation";
type Phase = "idle" | "playing" | "wait" | "recording" | "scoring" | "result" | "dictation" | "dict-result";
type WaitMode = "off" | "3s" | "5s" | "manual";

interface Sentence { start: number; end: number; text: string; }

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const WAIT_LABELS: Record<WaitMode, string> = { off: "Tắt", "3s": "+3s", "5s": "+5s", manual: "Bấm" };

const SUGGESTED_VIDEOS = [
  { id: "u0zqXffuN5Y", title: "Hello", level: "A1" },
  { id: "WgYcNtL7f7c", title: "What do you want?", level: "A1" },
  { id: "2iiuvBnW9kQ", title: "English Reading — Shopping", level: "A1" },
  { id: "fCEbDDfzaQg", title: "I am a tiger", level: "A1" },
  { id: "V7P83_fcE1A", title: "Who Likes Cake", level: "A1" },
  { id: "89s6rXPHowI", title: "Tim Helps a Sheep", level: "A1" },
  { id: "XWq58Abc7zk", title: "Supermarket Listening", level: "A1" },
  { id: "XmoMKKlSZ1Y", title: "Improve English with Music", level: "A2" },
  { id: "aJ5iL8AVkBg", title: "Improve by Talking to Yourself", level: "A2" },
  { id: "GoNQmdjAV9k", title: "Happy Christmas — Harry Potter", level: "A2" },
  { id: "l4Lk0JTD938", title: "Talking About Cooking", level: "A2" },
  { id: "nXait2wHOQc", title: "Kung Fu Panda 2 — Baby Po", level: "A2" },
  { id: "NAcG64bOx8k", title: "Asking for Directions", level: "A2" },
  { id: "bngvFaB_qx0", title: "English Reading — Traveling", level: "A1" },
  { id: "bABomTRzZzc", title: "Master English Shadowing", level: "B1" },
  { id: "cZ3V4O4j4OE", title: "Zootopia — Gondola", level: "B1" },
  { id: "z4K2F_OALPQ", title: "Sorting Ceremony — Harry Potter", level: "B1" },
  { id: "JRKyEfBcXFQ", title: "Harry Visits The Weasleys", level: "B1" },
];

export function ShadowingPage({ onBackHome }: Props) {
  // Video state
  const [ytUrl, setYtUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Practice state
  const [activeIdx, setActiveIdx] = useState(-1); // -1 = chưa chọn câu
  const [phase, setPhase] = useState<Phase>("idle");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("shadow");
  const [waitMode, setWaitMode] = useState<WaitMode>("3s");
  const [result, setResult] = useState<PronResult | null>(null);
  const [dictInput, setDictInput] = useState("");
  const [dictCorrect, setDictCorrect] = useState<boolean | null>(null);
  const [scores, setScores] = useState<Record<number, { score: number; mode: string }>>({});

  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Extract video ID from URL
  const extractVideoId = (url: string) => {
    const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : "";
  };

  // Load captions
  const loadCaptions = async (vid: string) => {
    setLoading(true); setError("");
    try {
      const data = await apiRequest<{ sentences: Sentence[]; count: number }>(`/api/youtube-captions?v=${vid}`, { auth: false });
      if (data.sentences.length > 0) {
        setSentences(data.sentences);
        setVideoId(vid);
      } else {
        setError("Chưa có subtitle cho video này.");
        setPasteMode(true);
      }
    } catch { setError("Lỗi tải subtitle."); setPasteMode(true); }
    finally { setLoading(false); }
  };

  const applyPaste = (vid: string) => {
    const lines = pasteText.split("\n").map((l) => l.trim()).filter((l) => l && !l.match(/^\d+$/) && !l.match(/^\d{2}:\d{2}/));
    if (!lines.length) { setError("Không có câu nào"); return; }
    const sents = lines.map((text, i) => ({ start: i * 5, end: (i + 1) * 5, text }));
    setSentences(sents);
    setVideoId(vid);
    apiRequest("/api/youtube-captions", { method: "POST", body: { videoId: vid, sentences: sents }, auth: false }).catch(() => {});
  };

  // Auto-scroll transcript to active sentence
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  // Shadowing: after selecting sentence
  const startSentence = (idx: number) => {
    setActiveIdx(idx);
    setPhase("playing");
    setResult(null);
    setDictInput("");
    setDictCorrect(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // After video plays the sentence → wait → ready for practice
  const onSentencePlayed = () => {
    if (waitMode === "off") goToPractice();
    else if (waitMode === "manual") setPhase("wait");
    else {
      setPhase("wait");
      const ms = waitMode === "3s" ? 3000 : 5000;
      timerRef.current = setTimeout(goToPractice, ms);
    }
  };

  const goToPractice = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (practiceMode === "shadow") setPhase("recording"); // auto-start recording
    else { setPhase("dictation"); setDictInput(""); setDictCorrect(null); }
  };

  // Auto-start recording when phase = recording
  useEffect(() => {
    if (phase !== "recording") return;
    if (!CAN_MIC) return;
    let cancelled = false;
    (async () => {
      try {
        recRef.current = await startRecording();
        const sent = sentences[activeIdx];
        const dur = Math.max(2000, (sent?.text.length || 10) * 150);
        timerRef.current = setTimeout(() => { if (!cancelled) stopAndScore(); }, dur);
      } catch { setPhase("idle"); }
    })();
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, activeIdx]);

  const stopAndScore = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!recRef.current) return;
    setPhase("scoring");
    try {
      const wav = await recRef.current.stop();
      const sent = sentences[activeIdx];
      // Use text as pseudo-phonetic for phrase-level scoring
      const r = await assessPronunciation(wav, sent?.text || "");
      setResult(r);
      setScores((s) => ({ ...s, [activeIdx]: { score: r.score, mode: "shadow" } }));
      setPhase("result");
    } catch { setPhase("idle"); }
  };

  const checkDictation = () => {
    const sent = sentences[activeIdx];
    const correct = dictInput.trim().toLowerCase().replace(/[?.!,'"]/g, "") === sent.text.toLowerCase().replace(/[?.!,'"]/g, "");
    setDictCorrect(correct);
    setScores((s) => ({ ...s, [activeIdx]: { score: correct ? 100 : 0, mode: "dictation" } }));
    setPhase("dict-result");
  };

  const nextSentence = () => {
    if (activeIdx + 1 < sentences.length) startSentence(activeIdx + 1);
    else { setActiveIdx(-1); setPhase("idle"); }
  };

  // ── RENDER ──

  // Phase 1: No video selected
  if (!videoId) {
    const vid = extractVideoId(ytUrl);
    return (
      <Wrapper onBack={onBackHome}>
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Shadowing</h2>
            <p className="text-sm font-semibold text-muted-foreground">Chọn video YouTube để luyện nghe & đọc theo</p>

            <input
              className="w-full rounded-xl border-2 border-border px-3 py-2.5 text-sm font-bold outline-none focus:border-primary"
              placeholder="Dán link YouTube..."
              value={ytUrl}
              onChange={(e) => { setYtUrl(e.target.value); setError(""); setPasteMode(false); }}
            />

            {vid && (
              <>
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                  <iframe src={`https://www.youtube.com/embed/${vid}`} className="h-full w-full" allowFullScreen />
                </div>
                {!loading && !pasteMode && (
                  <Button type="button" onClick={() => loadCaptions(vid)} className="w-full">
                    <Play className="h-4 w-4" /> Lấy subtitle
                  </Button>
                )}
                {loading && <p className="text-center text-sm font-bold text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Đang tải...</p>}
                {error && <p className="text-xs font-bold text-red-600">{error}</p>}
                {pasteMode && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Mở video trên YouTube → ⋮ → Open transcript → copy paste:</p>
                    <textarea
                      className="w-full rounded-xl border-2 border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary h-28 resize-none"
                      placeholder={"Hello, my name is Dee Dee.\nWhat is your name?\nI am Pete."}
                      value={pasteText} onChange={(e) => setPasteText(e.target.value)}
                    />
                    <Button type="button" onClick={() => applyPaste(vid)} disabled={!pasteText.trim()} className="w-full">
                      <CheckCircle2 className="h-4 w-4" /> Dùng subtitle này
                    </Button>
                  </div>
                )}
                {!loading && !pasteMode && (
                  <button type="button" onClick={() => setPasteMode(true)} className="w-full text-center text-xs font-bold text-primary underline">
                    Dán subtitle thủ công
                  </button>
                )}
              </>
            )}

            {!ytUrl && (
              <div>
                <p className="text-xs font-extrabold text-muted-foreground mb-1.5">Video gợi ý:</p>
                <div className="space-y-1 max-h-[45vh] overflow-y-auto">
                  {SUGGESTED_VIDEOS.map((v) => (
                    <button key={v.id} type="button" onClick={() => setYtUrl(`https://youtube.com/watch?v=${v.id}`)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted transition-colors">
                      <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold",
                        v.level === "A1" ? "bg-green-100 text-green-700" : v.level === "A2" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
                        {v.level}
                      </span>
                      <span className="text-xs font-bold truncate">{v.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // Phase 2: Video + transcript loaded → practice inline
  const activeSent = activeIdx >= 0 ? sentences[activeIdx] : null;

  return (
    <Wrapper onBack={() => { setVideoId(""); setSentences([]); setActiveIdx(-1); setPhase("idle"); setScores({}); }}>
      {/* Video player */}
      <div className="aspect-video w-full overflow-hidden rounded-xl mb-3">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?start=${activeSent ? Math.floor(activeSent.start) : 0}&autoplay=${activeIdx >= 0 ? 1 : 0}&enablejsapi=1`}
          className="h-full w-full" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-muted p-0.5">
          <ModeBtn active={practiceMode === "shadow"} onClick={() => setPracticeMode("shadow")}><Mic className="h-3 w-3" /> Shadow</ModeBtn>
          <ModeBtn active={practiceMode === "dictation"} onClick={() => setPracticeMode("dictation")}><Keyboard className="h-3 w-3" /> Dictation</ModeBtn>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {(["off", "3s", "5s", "manual"] as WaitMode[]).map((w) => (
            <button key={w} type="button" onClick={() => setWaitMode(w)}
              className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", waitMode === w ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
              {WAIT_LABELS[w]}
            </button>
          ))}
        </div>
      </div>

      {/* Practice area (inline, above transcript) */}
      {activeIdx >= 0 && phase !== "idle" && phase !== "playing" && (
        <Card className="mb-2">
          <CardContent className="p-4 space-y-3">
            {/* Wait */}
            {phase === "wait" && (
              <div className="flex flex-col items-center gap-2 text-center">
                <Pause className="h-6 w-6 text-muted-foreground animate-pulse" />
                <p className="text-sm font-bold text-muted-foreground">{waitMode === "manual" ? "Bấm để bắt đầu" : `Đợi ${waitMode}...`}</p>
                {waitMode === "manual" && <Button type="button" size="sm" onClick={goToPractice}><Play className="h-4 w-4" /> Bắt đầu</Button>}
              </div>
            )}

            {/* Recording */}
            {phase === "recording" && (
              <div className="flex flex-col items-center gap-2 text-center">
                <button type="button" onClick={stopAndScore}
                  className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-card">
                  <Square className="h-6 w-6" />
                </button>
                <p className="text-sm font-bold text-red-600">Đang ghi... đọc theo!</p>
              </div>
            )}

            {/* Scoring */}
            {phase === "scoring" && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

            {/* Result */}
            {phase === "result" && result && (
              <div className="flex flex-col items-center gap-2">
                <SpeakResult result={result} ringSize={64} showHeard
                  continueLabel={<>Tiếp <ArrowRight className="h-4 w-4" /></>}
                  onRetry={() => startSentence(activeIdx)}
                  onContinue={nextSentence}
                  onSkip={nextSentence} />
              </div>
            )}

            {/* Dictation input */}
            {phase === "dictation" && (
              <div className="space-y-2">
                <input className="w-full rounded-xl border-2 border-border px-3 py-2 text-center text-base font-bold outline-none focus:border-primary"
                  value={dictInput} onChange={(e) => setDictInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && dictInput.trim() && checkDictation()}
                  placeholder="Gõ câu bạn nghe..." autoFocus />
                <Button type="button" onClick={checkDictation} disabled={!dictInput.trim()} className="w-full" size="sm">
                  <CheckCircle2 className="h-4 w-4" /> Kiểm tra
                </Button>
              </div>
            )}

            {/* Dictation result */}
            {phase === "dict-result" && (
              <div className="space-y-2 text-center">
                <p className={cn("text-lg font-black", dictCorrect ? "text-success" : "text-red-600")}>{dictCorrect ? "Chính xác! ✓" : "Chưa đúng ✗"}</p>
                <p className="text-sm font-extrabold">{activeSent?.text}</p>
                {!dictCorrect && <p className="text-sm font-bold text-red-600 line-through">{dictInput}</p>}
                <div className="flex gap-2">
                  {!dictCorrect && <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => startSentence(activeIdx)}><RotateCcw className="h-3 w-3" /> Thử lại</Button>}
                  <Button type="button" size="sm" className="flex-1" onClick={nextSentence}>Tiếp <ArrowRight className="h-3 w-3" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transcript — sentence list with highlight */}
      <div ref={listRef} className="space-y-0.5 rounded-2xl border border-border p-1.5 max-h-[40vh] overflow-y-auto">
        {sentences.map((s, i) => {
          const isActive = i === activeIdx;
          const sc = scores[i];
          const scoreColor = sc ? (sc.score >= SPEAK_PASS ? "text-success" : "text-red-600") : "";
          return (
            <button key={i} type="button"
              onClick={() => { startSentence(i); onSentencePlayed(); }}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-all",
                isActive ? "bg-primary/15 border border-primary/40 scale-[1.01]" : "hover:bg-muted",
              )}>
              <span className="text-[10px] font-bold text-muted-foreground shrink-0 w-8">
                {Math.floor(s.start / 60)}:{String(Math.floor(s.start % 60)).padStart(2, "0")}
              </span>
              <span className={cn("flex-1 text-sm font-bold", isActive ? "text-primary" : "")}>
                {s.text}
              </span>
              {sc && (
                <span className={cn("shrink-0 text-xs font-black", scoreColor)}>
                  {sc.mode === "dictation" ? (sc.score === 100 ? "✓" : "✗") : `${sc.score}%`}
                </span>
              )}
              {isActive && phase === "playing" && <Volume2 className="h-4 w-4 text-primary animate-pulse shrink-0" />}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">{sentences.length} câu · Bấm câu để luyện</p>
    </Wrapper>
  );
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition-colors", active ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>{children}</button>;
}

function Wrapper({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return <main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBack} />{children}</main>;
}
