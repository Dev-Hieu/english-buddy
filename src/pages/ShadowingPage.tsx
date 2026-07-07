import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock, Keyboard, Loader2, Mic, Pause, Play, RotateCcw, Square, Video, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
type WaitMode = "off" | "3s" | "5s" | "manual";
type PracticePhase = "idle" | "wait" | "recording" | "scoring" | "result" | "dictation" | "dict-result";

interface Sentence { start: number; end: number; text: string; }

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const WAIT_LABELS: Record<WaitMode, string> = { off: "Tắt", "3s": "+3s", "5s": "+5s", manual: "Bấm" };
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

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

// ── YouTube iframe API helper ──
let ytApiLoaded = false;
function loadYtApi(): Promise<void> {
  if (ytApiLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if ((window as any).YT?.Player) { ytApiLoaded = true; resolve(); return; }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => { ytApiLoaded = true; resolve(); };
  });
}

export function ShadowingPage({ onBackHome }: Props) {
  // Video select
  const [ytUrl, setYtUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Player
  const playerRef = useRef<any>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [speed, setSpeed] = useState(1);

  // Practice
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("shadow");
  const [waitMode, setWaitMode] = useState<WaitMode>("3s");
  const [practicePhase, setPracticePhase] = useState<PracticePhase>("idle");
  const [result, setResult] = useState<PronResult | null>(null);
  const [dictInput, setDictInput] = useState("");
  const [dictCorrect, setDictCorrect] = useState<boolean | null>(null);
  const [scores, setScores] = useState<Record<number, { score: number; mode: string }>>({});

  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const extractVideoId = (url: string) => {
    const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : "";
  };

  const loadCaptions = async (vid: string) => {
    setLoading(true); setError("");
    try {
      const data = await apiRequest<{ sentences: Sentence[]; count: number }>(`/api/youtube-captions?v=${vid}`, { auth: false });
      if (data.sentences.length > 0) { setSentences(data.sentences); setVideoId(vid); }
      else { setError("Chưa có subtitle."); setPasteMode(true); }
    } catch { setError("Lỗi."); setPasteMode(true); }
    finally { setLoading(false); }
  };

  const applyPaste = (vid: string) => {
    const lines = pasteText.split("\n").map((l) => l.trim()).filter((l) => l && !l.match(/^\d+$/) && !l.match(/^\d{2}:\d{2}/));
    if (!lines.length) return;
    const sents = lines.map((text, i) => ({ start: i * 5, end: (i + 1) * 5, text }));
    setSentences(sents); setVideoId(vid);
    apiRequest("/api/youtube-captions", { method: "POST", body: { videoId: vid, sentences: sents }, auth: false }).catch(() => {});
  };

  // ── Init YouTube Player ──
  useEffect(() => {
    if (!videoId || !playerDivRef.current) return;
    let destroyed = false;
    loadYtApi().then(() => {
      if (destroyed) return;
      playerRef.current = new (window as any).YT.Player(playerDivRef.current, {
        videoId,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => { playerRef.current?.setPlaybackRate?.(speed); },
          onStateChange: (e: any) => {
            setIsPlaying(e.data === 1); // 1 = playing
          },
        },
      });
    });
    return () => { destroyed = true; playerRef.current?.destroy?.(); playerRef.current = null; };
  }, [videoId]);

  // ── Poll current time → highlight sentence + auto-pause ──
  const findSentenceIdx = useCallback((time: number) => {
    for (let i = 0; i < sentences.length; i++) {
      if (time >= sentences[i].start && time < sentences[i].end) return i;
    }
    // Between sentences — find next
    for (let i = 0; i < sentences.length; i++) {
      if (time < sentences[i].start) return i - 1;
    }
    return sentences.length - 1;
  }, [sentences]);

  useEffect(() => {
    if (!isPlaying || !sentences.length) {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }
    pollRef.current = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() || 0;
      const idx = findSentenceIdx(t);
      setCurrentIdx(idx);

      // Auto-pause at end of sentence (if wait mode != off and practice phase is idle)
      if (idx >= 0 && practicePhase === "idle" && waitMode !== "off") {
        const sent = sentences[idx];
        if (t >= sent.end - 0.1) {
          playerRef.current?.pauseVideo?.();
          setIsPlaying(false);
          startPractice(idx);
        }
      }
    }, 200);
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  }, [isPlaying, sentences, practicePhase, waitMode, findSentenceIdx]);

  // Auto-scroll transcript
  useEffect(() => {
    if (currentIdx >= 0 && listRef.current) {
      const el = listRef.current.children[currentIdx] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentIdx]);

  // ── Practice flow ──
  const startPractice = (idx: number) => {
    setCurrentIdx(idx);
    setResult(null); setDictInput(""); setDictCorrect(null);
    if (waitMode === "manual") { setPracticePhase("wait"); }
    else if (waitMode === "off") { setPracticePhase("idle"); return; }
    else {
      setPracticePhase("wait");
      const ms = waitMode === "3s" ? 3000 : 5000;
      timerRef.current = setTimeout(() => goRecord(idx), ms);
    }
  };

  const goRecord = (idx: number) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (practiceMode === "dictation") { setPracticePhase("dictation"); return; }
    if (!CAN_MIC) { resumePlay(idx); return; }
    setPracticePhase("recording");
  };

  // Auto-start mic
  useEffect(() => {
    if (practicePhase !== "recording" || currentIdx < 0) return;
    let cancelled = false;
    (async () => {
      try {
        recRef.current = await startRecording();
        const dur = Math.max(2000, (sentences[currentIdx]?.text.length || 10) * 150);
        timerRef.current = setTimeout(() => { if (!cancelled) stopAndScore(); }, dur);
      } catch { setPracticePhase("idle"); }
    })();
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [practicePhase, currentIdx]);

  const stopAndScore = async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!recRef.current) return;
    setPracticePhase("scoring");
    try {
      const wav = await recRef.current.stop();
      const r = await assessPronunciation(wav, sentences[currentIdx]?.text || "");
      setResult(r);
      setScores((s) => ({ ...s, [currentIdx]: { score: r.score, mode: "shadow" } }));
      setPracticePhase("result");
    } catch { setPracticePhase("idle"); }
  };

  const checkDictation = () => {
    const sent = sentences[currentIdx];
    const ok = dictInput.trim().toLowerCase().replace(/[?.!,'"]/g, "") === sent.text.toLowerCase().replace(/[?.!,'"]/g, "");
    setDictCorrect(ok);
    setScores((s) => ({ ...s, [currentIdx]: { score: ok ? 100 : 0, mode: "dictation" } }));
    setPracticePhase("dict-result");
  };

  const resumePlay = (fromIdx?: number) => {
    setPracticePhase("idle");
    const idx = fromIdx ?? currentIdx;
    if (idx + 1 < sentences.length) {
      playerRef.current?.seekTo?.(sentences[idx + 1].start, true);
      playerRef.current?.playVideo?.();
    }
  };

  const seekToSentence = (idx: number) => {
    setCurrentIdx(idx);
    setPracticePhase("idle");
    playerRef.current?.seekTo?.(sentences[idx].start, true);
    playerRef.current?.playVideo?.();
  };

  const togglePlay = () => {
    if (isPlaying) playerRef.current?.pauseVideo?.();
    else playerRef.current?.playVideo?.();
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    playerRef.current?.setPlaybackRate?.(s);
  };

  // ── RENDER: Video select ──
  if (!videoId) {
    const vid = extractVideoId(ytUrl);
    return (
      <Wrapper onBack={onBackHome}>
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Shadowing</h2>
            <p className="text-sm font-semibold text-muted-foreground">Chọn video YouTube để luyện nghe & đọc theo</p>
            <input className="w-full rounded-xl border-2 border-border px-3 py-2.5 text-sm font-bold outline-none focus:border-primary"
              placeholder="Dán link YouTube..." value={ytUrl}
              onChange={(e) => { setYtUrl(e.target.value); setError(""); setPasteMode(false); }} />
            {vid && (
              <>
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                  <iframe src={`https://www.youtube.com/embed/${vid}`} className="h-full w-full" allowFullScreen />
                </div>
                {!loading && !pasteMode && <Button type="button" onClick={() => loadCaptions(vid)} className="w-full"><Play className="h-4 w-4" /> Lấy subtitle</Button>}
                {loading && <p className="text-center text-sm font-bold text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Đang tải...</p>}
                {error && <p className="text-xs font-bold text-red-600">{error}</p>}
                {pasteMode && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">YouTube → ⋮ → Open transcript → copy paste:</p>
                    <textarea className="w-full rounded-xl border-2 border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary h-28 resize-none"
                      placeholder={"Hello, my name is Dee Dee.\nWhat is your name?"} value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
                    <Button type="button" onClick={() => applyPaste(vid)} disabled={!pasteText.trim()} className="w-full"><CheckCircle2 className="h-4 w-4" /> Dùng subtitle này</Button>
                  </div>
                )}
                {!loading && !pasteMode && <button type="button" onClick={() => setPasteMode(true)} className="w-full text-center text-xs font-bold text-primary underline">Dán subtitle thủ công</button>}
              </>
            )}
            {!ytUrl && (
              <div className="space-y-1 max-h-[45vh] overflow-y-auto">
                <p className="text-xs font-extrabold text-muted-foreground mb-1">Video gợi ý:</p>
                {SUGGESTED_VIDEOS.map((v) => (
                  <button key={v.id} type="button" onClick={() => setYtUrl(`https://youtube.com/watch?v=${v.id}`)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted transition-colors">
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold",
                      v.level === "A1" ? "bg-green-100 text-green-700" : v.level === "A2" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>{v.level}</span>
                    <span className="text-xs font-bold truncate">{v.title}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // ── RENDER: Practice screen ──
  const activeSent = currentIdx >= 0 ? sentences[currentIdx] : null;

  return (
    <Wrapper onBack={() => { setVideoId(""); setSentences([]); setCurrentIdx(-1); setPracticePhase("idle"); setScores({}); playerRef.current?.destroy?.(); playerRef.current = null; }}>
      {/* YouTube Player (iframe API) */}
      <div className="aspect-video w-full overflow-hidden rounded-xl mb-2">
        <div ref={playerDivRef} className="h-full w-full" />
      </div>

      {/* Player controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => currentIdx > 0 && seekToSentence(currentIdx - 1)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={togglePlay} className="rounded-full bg-primary p-2 text-white shadow-sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => currentIdx < sentences.length - 1 && seekToSentence(currentIdx + 1)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          <span className="text-xs font-extrabold text-muted-foreground ml-1">{currentIdx + 1}/{sentences.length}</span>
        </div>

        {/* Speed */}
        <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
          {SPEEDS.map((s) => (
            <button key={s} type="button" onClick={() => changeSpeed(s)}
              className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", speed === s ? "bg-primary text-white" : "text-muted-foreground")}>{s}×</button>
          ))}
        </div>
      </div>

      {/* Mode + Wait */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-muted p-0.5">
          <ModeBtn active={practiceMode === "shadow"} onClick={() => setPracticeMode("shadow")}><Mic className="h-3 w-3" /> Shadow</ModeBtn>
          <ModeBtn active={practiceMode === "dictation"} onClick={() => setPracticeMode("dictation")}><Keyboard className="h-3 w-3" /> Dictation</ModeBtn>
        </div>
        <div className="flex items-center gap-0.5">
          <Clock className="h-3 w-3 text-muted-foreground mr-0.5" />
          {(["off", "3s", "5s", "manual"] as WaitMode[]).map((w) => (
            <button key={w} type="button" onClick={() => setWaitMode(w)}
              className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", waitMode === w ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{WAIT_LABELS[w]}</button>
          ))}
        </div>
      </div>

      {/* Current sentence display */}
      {activeSent && (
        <div className={cn("mb-2 rounded-xl px-4 py-3 text-center transition-all", practicePhase !== "idle" ? "bg-primary/10 border border-primary/30" : "bg-muted")}>
          <p className="text-lg font-black">{activeSent.text}</p>
        </div>
      )}

      {/* Practice area (inline) */}
      {practicePhase !== "idle" && (
        <Card className="mb-2">
          <CardContent className="p-3 space-y-2">
            {practicePhase === "wait" && (
              <div className="flex items-center justify-center gap-3">
                <Pause className="h-5 w-5 text-muted-foreground animate-pulse" />
                <span className="text-sm font-bold text-muted-foreground">{waitMode === "manual" ? "Bấm để bắt đầu" : `Đợi ${waitMode}...`}</span>
                {waitMode === "manual" && <Button type="button" size="sm" onClick={() => goRecord(currentIdx)}><Play className="h-3 w-3" /> Bắt đầu</Button>}
              </div>
            )}
            {practicePhase === "recording" && (
              <div className="flex items-center justify-center gap-3">
                <button type="button" onClick={stopAndScore} className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-red-500 text-white"><Square className="h-5 w-5" /></button>
                <span className="text-sm font-bold text-red-600">Đọc theo...</span>
              </div>
            )}
            {practicePhase === "scoring" && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
            {practicePhase === "result" && result && (
              <SpeakResult result={result} ringSize={56}
                continueLabel={<>Tiếp <ArrowRight className="h-3 w-3" /></>}
                onRetry={() => { setPracticePhase("idle"); seekToSentence(currentIdx); }}
                onContinue={() => resumePlay()}
                onSkip={() => resumePlay()} />
            )}
            {practicePhase === "dictation" && (
              <div className="flex gap-2">
                <input className="flex-1 rounded-lg border-2 border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
                  value={dictInput} onChange={(e) => setDictInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && dictInput.trim() && checkDictation()}
                  placeholder="Gõ câu vừa nghe..." autoFocus />
                <Button type="button" size="sm" onClick={checkDictation} disabled={!dictInput.trim()}><CheckCircle2 className="h-4 w-4" /></Button>
              </div>
            )}
            {practicePhase === "dict-result" && (
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-black", dictCorrect ? "text-success" : "text-red-600")}>{dictCorrect ? "Đúng ✓" : "Sai ✗"}</span>
                {!dictCorrect && <span className="text-xs font-bold text-red-600 line-through">{dictInput}</span>}
                <div className="flex gap-1">
                  {!dictCorrect && <Button type="button" variant="outline" size="sm" onClick={() => { setPracticePhase("idle"); seekToSentence(currentIdx); }}><RotateCcw className="h-3 w-3" /></Button>}
                  <Button type="button" size="sm" onClick={() => resumePlay()}>Tiếp</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transcript */}
      <div ref={listRef} className="space-y-0.5 rounded-2xl border border-border p-1 max-h-[35vh] overflow-y-auto">
        {sentences.map((s, i) => {
          const isActive = i === currentIdx;
          const sc = scores[i];
          return (
            <button key={i} type="button" onClick={() => seekToSentence(i)}
              className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-all",
                isActive ? "bg-primary/15 border border-primary/30" : "hover:bg-muted")}>
              <span className="text-[10px] font-bold text-muted-foreground shrink-0 w-8">
                {Math.floor(s.start / 60)}:{String(Math.floor(s.start % 60)).padStart(2, "0")}
              </span>
              <span className={cn("flex-1 text-sm", isActive ? "font-black text-primary" : "font-bold")}>{s.text}</span>
              {sc && <span className={cn("shrink-0 text-xs font-black", sc.score >= SPEAK_PASS ? "text-success" : "text-red-600")}>
                {sc.mode === "dictation" ? (sc.score === 100 ? "✓" : "✗") : `${sc.score}%`}
              </span>}
              {isActive && isPlaying && <Volume2 className="h-3 w-3 text-primary animate-pulse shrink-0" />}
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold transition-colors", active ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>{children}</button>;
}

function Wrapper({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return <main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBack} />{children}</main>;
}
