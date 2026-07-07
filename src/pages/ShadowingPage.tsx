import { ArrowRight, CheckCircle2, Clock, Headphones, Keyboard, List, Loader2, Mic, PartyPopper, Pause, Play, RotateCcw, Square, Video, Volume2, X } from "lucide-react";
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

type PracticeMode = "shadow" | "dictation";
type Phase = "pick" | "listen" | "wait" | "ready" | "recording" | "scoring" | "result" | "dictation" | "dict-result";
type WaitMode = "off" | "3s" | "5s" | "manual";

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const SPEEDS = [1.0, 1.15, 1.3];
const SPEED_LABELS = ["1×", "1.15×", "1.3×"];
const WAIT_LABELS: Record<WaitMode, string> = { off: "Tắt", "3s": "+3s", "5s": "+5s", manual: "Bấm" };

const SUGGESTED_VIDEOS = [
  { id: "WgYcNtL7f7c", title: "What do you want?", level: "A1" },
  { id: "u0zqXffuN5Y", title: "Hello", level: "A1" },
  { id: "2iiuvBnW9kQ", title: "English Reading — Shopping", level: "A1" },
  { id: "fCEbDDfzaQg", title: "I am a tiger", level: "A1" },
  { id: "V7P83_fcE1A", title: "Who Likes Cake", level: "A1" },
  { id: "89s6rXPHowI", title: "Tim Helps a Sheep", level: "A1" },
  { id: "XWq58Abc7zk", title: "Supermarket Listening", level: "A1" },
  { id: "jp67tX4i54c", title: "Dance Monkey (Karaoke)", level: "A1" },
  { id: "XmoMKKlSZ1Y", title: "Improve English with Music", level: "A2" },
  { id: "aJ5iL8AVkBg", title: "Improve English by Talking to Yourself", level: "A2" },
  { id: "GoNQmdjAV9k", title: "Happy Christmas — Harry Potter", level: "A2" },
  { id: "l4Lk0JTD938", title: "Talking About Cooking Breakfast", level: "A2" },
  { id: "nXait2wHOQc", title: "Kung Fu Panda 2 — Baby Po", level: "A2" },
  { id: "NAcG64bOx8k", title: "Asking for Directions", level: "A2" },
  { id: "bngvFaB_qx0", title: "English Reading — Traveling", level: "A1" },
  { id: "bABomTRzZzc", title: "Master English Shadowing", level: "B1" },
  { id: "jYiGXxGb_nc", title: "Hermione vs Draco — Harry Potter", level: "B1" },
  { id: "cZ3V4O4j4OE", title: "Zootopia — Gondola", level: "B1" },
  { id: "z4K2F_OALPQ", title: "Harry Potter — Sorting Ceremony", level: "B1" },
  { id: "JRKyEfBcXFQ", title: "Harry Visits The Weasleys", level: "B1" },
];

function getPhrases(vocab: VocabularyWord[]): VocabularyWord[] {
  return vocab.filter((w) => w.phonetic).sort((a, b) => {
    const aPhrase = a.word.includes(" ") ? 0 : 1;
    const bPhrase = b.word.includes(" ") ? 0 : 1;
    return aPhrase - bPhrase || a.word.localeCompare(b.word);
  });
}

export function ShadowingPage({ student, topicId, onBackHome }: Props) {
  const allPhrases = useMemo(() => {
    const byTopic = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId));
    return getPhrases(byTopic.length >= 3 ? byTopic : SEED_VOCABULARY);
  }, [topicId]);

  // State
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("shadow");
  const [waitMode, setWaitMode] = useState<WaitMode>("3s");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<VocabularyWord[]>([]);
  const [n, setN] = useState(0);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick");
  const [result, setResult] = useState<PronResult | null>(null);
  const [err, setErr] = useState("");
  const [scores, setScores] = useState<{ word: string; score: number; mode: string }[]>([]);
  const [done, setDone] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [dictInput, setDictInput] = useState("");
  const [dictCorrect, setDictCorrect] = useState<boolean | null>(null);

  // YouTube
  const [ytUrl, setYtUrl] = useState("");
  const [showYt, setShowYt] = useState(false);

  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const word = items[n];
  const speed = SPEEDS[round] || 1.0;

  // Auto-play TTS + wait mode
  useEffect(() => {
    if (!word || phase !== "listen") return;
    let cancelled = false;
    speakTextWithSpeed(word.word, speed).then(() => {
      if (cancelled) return;
      if (waitMode === "off") {
        goAfterListen();
      } else if (waitMode === "manual") {
        setPhase("wait");
      } else {
        const ms = waitMode === "3s" ? 3000 : 5000;
        setPhase("wait");
        timerRef.current = setTimeout(() => { if (!cancelled) goAfterListen(); }, ms);
      }
    });
    return () => { cancelled = true; if (timerRef.current) clearTimeout(timerRef.current); };
  }, [n, round, phase, word, speed, waitMode]);

  function goAfterListen() {
    if (practiceMode === "shadow") setPhase("ready");
    else { setPhase("dictation"); setDictInput(""); setDictCorrect(null); }
  }

  // ── Phase: Pick sentences ──
  if (phase === "pick") {
    const toggle = (id: string) => setSelectedIds((s) => { const next = new Set(s); next.has(id) ? next.delete(id) : next.add(id); return next; });
    const selectAll = () => setSelectedIds(new Set(allPhrases.map((p) => p.id)));
    const selectRandom = (count: number) => {
      const shuffled = [...allPhrases].sort(() => Math.random() - 0.5);
      setSelectedIds(new Set(shuffled.slice(0, count).map((p) => p.id)));
    };
    const startPractice = () => {
      const sel = allPhrases.filter((p) => selectedIds.has(p.id));
      if (!sel.length) return;
      setItems(sel);
      setN(0);
      setPhase("listen");
    };

    return (
      <Wrapper onBack={onBackHome}>
        {/* YouTube input */}
        <Card className="mb-3">
          <CardContent className="p-3">
            <button type="button" onClick={() => setShowYt(!showYt)} className="flex w-full items-center gap-2 text-sm font-extrabold text-primary">
              <Video className="h-4 w-4" /> {showYt ? "Ẩn video" : "Dùng video YouTube"}
            </button>
            {showYt && (
              <div className="mt-2 space-y-2">
                <input
                  className="w-full rounded-xl border-2 border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
                  placeholder="Dán link YouTube..."
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                />
                {ytUrl && (() => {
                  const m = ytUrl.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
                  return m ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl">
                      <iframe src={`https://www.youtube.com/embed/${m[1]}`} className="h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    </div>
                  ) : <p className="text-xs font-bold text-red-600">Link không hợp lệ</p>;
                })()}
                <p className="text-xs font-semibold text-muted-foreground">Mở video để nghe → chọn câu bên dưới → luyện Shadowing/Dictation</p>
                {!ytUrl && (
                  <div className="mt-2">
                    <p className="text-xs font-extrabold text-muted-foreground mb-1.5">Video gợi ý:</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl bg-muted p-0.5">
            <ModeBtn active={practiceMode === "shadow"} onClick={() => setPracticeMode("shadow")}><Mic className="h-3.5 w-3.5" /> Shadowing</ModeBtn>
            <ModeBtn active={practiceMode === "dictation"} onClick={() => setPracticeMode("dictation")}><Keyboard className="h-3.5 w-3.5" /> Dictation</ModeBtn>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
              {(["off", "3s", "5s", "manual"] as WaitMode[]).map((w) => (
                <button key={w} type="button" onClick={() => setWaitMode(w)}
                  className={cn("rounded-md px-2 py-1 text-[10px] font-extrabold transition-colors", waitMode === w ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
                  {WAIT_LABELS[w]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick select */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => selectRandom(6)} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">Random 6</button>
          <button type="button" onClick={() => selectRandom(10)} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">Random 10</button>
          <button type="button" onClick={selectAll} className="rounded-full bg-muted px-2.5 py-1 text-xs font-extrabold text-muted-foreground">Chọn tất cả</button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="rounded-full bg-muted px-2.5 py-1 text-xs font-extrabold text-muted-foreground">Bỏ chọn</button>
          <span className="ml-auto text-xs font-extrabold text-primary">{selectedIds.size} câu</span>
        </div>

        {/* Sentence list */}
        <div className="max-h-[50vh] space-y-1 overflow-y-auto rounded-2xl border border-border p-2">
          {allPhrases.map((p) => (
            <button key={p.id} type="button" onClick={() => toggle(p.id)}
              className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors",
                selectedIds.has(p.id) ? "bg-primary/10 border border-primary/30" : "hover:bg-muted")}>
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-[10px]",
                selectedIds.has(p.id) ? "border-primary bg-primary text-white" : "border-border")}>
                {selectedIds.has(p.id) ? "✓" : ""}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-extrabold truncate">{p.word}</span>
                {p.meaning_vi && <span className="block text-xs font-semibold text-muted-foreground truncate">{p.meaning_vi}</span>}
              </span>
            </button>
          ))}
        </div>

        <Button type="button" size="lg" className="mt-3 w-full" disabled={selectedIds.size === 0} onClick={startPractice}>
          <Play className="h-5 w-5" /> Bắt đầu ({selectedIds.size} câu)
        </Button>
      </Wrapper>
    );
  }

  if (!word) return <Wrapper onBack={onBackHome}><Info text="Chưa có câu." /></Wrapper>;
  if (!CAN_MIC && practiceMode === "shadow") return <Wrapper onBack={onBackHome}><Info text="Cần micro. Mở Chrome HTTPS." /></Wrapper>;

  // ── Done ──
  if (done) {
    const shadowScores = scores.filter((s) => s.mode === "shadow");
    const dictScores = scores.filter((s) => s.mode === "dictation");
    const avg = shadowScores.length > 0 ? Math.round(shadowScores.reduce((a, b) => a + b.score, 0) / shadowScores.length) : 0;
    return (
      <Wrapper onBack={onBackHome}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-success px-6 py-5 text-center text-white">
            <PartyPopper className="mx-auto h-10 w-10 mb-2" />
            <h2 className="text-2xl font-black">Hoàn thành!</h2>
            {round > 0 && <p className="text-sm opacity-90">{SPEED_LABELS[round]}</p>}
          </div>
          <CardContent className="flex flex-col items-center gap-4 p-5">
            {shadowScores.length > 0 && (
              <div className="flex items-center gap-4">
                <ScoreRing score={avg} size={80} />
                <div>
                  <p className="font-extrabold">Phát âm: {avg}%</p>
                  <p className="text-sm font-bold text-muted-foreground">{shadowScores.filter((s) => s.score >= SPEAK_PASS).length}/{shadowScores.length} đạt</p>
                </div>
              </div>
            )}
            {dictScores.length > 0 && <p className="font-extrabold">Dictation: {dictScores.filter((s) => s.score === 100).length}/{dictScores.length} đúng</p>}
            <div className="w-full space-y-1">
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
              {round < SPEEDS.length - 1 && practiceMode === "shadow" && (
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setRound((r) => r + 1); setN(0); setDone(false); setScores([]); setPhase("listen"); }}>
                  Tăng tốc {SPEED_LABELS[round + 1]}
                </Button>
              )}
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setPhase("pick"); setDone(false); setScores([]); setRound(0); setN(0); }}>
                <List className="h-4 w-4" /> Chọn lại
              </Button>
              <Button type="button" className="flex-1" onClick={onBackHome}>Xong</Button>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  const next = (score?: number, m?: string) => {
    if (score !== undefined) setScores((s) => [...s, { word: word.word, score, mode: m || practiceMode }]);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setRepeatCount(0);
    if (n + 1 >= items.length) setDone(true);
    else { setN((x) => x + 1); setPhase("listen"); setResult(null); setErr(""); setDictInput(""); setDictCorrect(null); }
  };

  const replay = () => speakTextWithSpeed(word.word, speed);

  const startRec = async () => {
    setErr("");
    try {
      recRef.current = await startRecording();
      setPhase("recording");
      const dur = Math.max(2000, word.word.length * 200);
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
    } catch { setErr("Lỗi chấm."); setPhase("ready"); }
  };

  const checkDictation = () => {
    const correct = dictInput.trim().toLowerCase().replace(/[?.!,]/g, "") === word.word.toLowerCase().replace(/[?.!,]/g, "");
    setDictCorrect(correct);
    setPhase("dict-result");
  };

  // ── Sentence list (sidebar) ──
  const sentenceBar = (
    <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
      {items.map((item, i) => {
        const sc = scores.find((s) => s.word === item.word);
        return (
          <button key={item.id} type="button" onClick={() => { setN(i); setPhase("listen"); setResult(null); setErr(""); setRepeatCount(0); }}
            className={cn("shrink-0 rounded-lg px-2 py-1 text-[10px] font-extrabold transition-colors whitespace-nowrap",
              i === n ? "bg-primary text-white" : sc ? (sc.score >= SPEAK_PASS ? "bg-success/15 text-success" : "bg-red-100 text-red-600") : "bg-muted text-muted-foreground")}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    <Wrapper onBack={() => { setPhase("pick"); setDone(false); setScores([]); setRound(0); setN(0); }} progress={Math.round((n / items.length) * 100)}>
      {/* Settings bar */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-xl bg-muted p-0.5">
          <ModeBtn active={practiceMode === "shadow"} onClick={() => setPracticeMode("shadow")}><Mic className="h-3 w-3" /> Shadow</ModeBtn>
          <ModeBtn active={practiceMode === "dictation"} onClick={() => { setPracticeMode("dictation"); if (phase === "ready") setPhase("listen"); }}><Keyboard className="h-3 w-3" /> Dictation</ModeBtn>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            {(["off", "3s", "5s", "manual"] as WaitMode[]).map((w) => (
              <button key={w} type="button" onClick={() => setWaitMode(w)}
                className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", waitMode === w ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
                {WAIT_LABELS[w]}
              </button>
            ))}
          </div>
          {practiceMode === "shadow" && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">{SPEED_LABELS[round]}</span>}
        </div>
      </div>

      {/* Sentence navigation */}
      {sentenceBar}

      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
          {word.meaning_vi && <p className="text-sm font-extrabold text-primary">{word.meaning_vi}</p>}

          {/* Listen */}
          {phase === "listen" && (
            <div className="py-4"><Headphones className="mx-auto h-12 w-12 animate-pulse text-primary" /><p className="mt-2 text-sm font-bold text-muted-foreground">Đang nghe...</p></div>
          )}

          {/* Wait */}
          {phase === "wait" && (
            <div className="flex flex-col items-center gap-3 py-2">
              <p className="text-2xl font-black">{word.word}</p>
              {word.phonetic && <p className="text-sm font-semibold text-muted-foreground">{word.phonetic}</p>}
              <Pause className="h-8 w-8 text-muted-foreground animate-pulse" />
              <p className="text-sm font-bold text-muted-foreground">{waitMode === "manual" ? "Bấm để tiếp tục" : `Đợi ${waitMode}...`}</p>
              {waitMode === "manual" && (
                <Button type="button" onClick={goAfterListen}><Play className="h-4 w-4" /> Tiếp tục</Button>
              )}
              <button type="button" onClick={replay} className="text-xs font-bold text-primary underline"><Volume2 className="inline h-3 w-3" /> Nghe lại</button>
            </div>
          )}

          {/* Ready (shadow) */}
          {phase === "ready" && (
            <>
              <p className="text-2xl font-black">{word.word}</p>
              {word.phonetic && <p className="text-sm font-semibold text-muted-foreground">{word.phonetic}</p>}
              <button type="button" onClick={replay} className="text-sm font-bold text-primary underline"><Volume2 className="inline h-4 w-4" /> Nghe lại</button>
              <button type="button" onClick={startRec} className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all active:translate-y-[2px]">
                <Mic className="h-9 w-9" strokeWidth={2.5} />
              </button>
              <p className="text-sm font-bold text-muted-foreground">Đọc theo!</p>
            </>
          )}

          {/* Recording */}
          {phase === "recording" && (
            <>
              <p className="text-2xl font-black">{word.word}</p>
              <button type="button" onClick={stopAndScore} className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-card">
                <Square className="h-8 w-8" />
              </button>
              <p className="text-sm font-bold text-red-600">Đang ghi...</p>
            </>
          )}

          {phase === "scoring" && <Loader2 className="h-10 w-10 animate-spin text-primary" />}

          {/* Result */}
          {phase === "result" && result && (
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-muted p-4">
              <p className="text-lg font-black">{word.word}</p>
              <SpeakResult result={result} ringSize={72} showHeard
                continueLabel={n + 1 >= items.length ? "Xong" : (<>Tiếp <ArrowRight className="h-4 w-4" /></>)}
                onRetry={() => { setResult(null); setPhase("listen"); setRepeatCount((c) => c + 1); }}
                onContinue={() => next(result.score, "shadow")}
                onSkip={() => next(result.score, "shadow")} />
            </div>
          )}

          {/* Dictation */}
          {phase === "dictation" && (
            <>
              <button type="button" onClick={replay} className="text-sm font-bold text-primary underline"><Volume2 className="inline h-4 w-4" /> Nghe lại</button>
              <input className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-center text-lg font-bold outline-none focus:border-primary"
                value={dictInput} onChange={(e) => setDictInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && dictInput.trim() && checkDictation()}
                placeholder="Gõ câu bạn nghe..." autoFocus />
              <Button type="button" onClick={checkDictation} disabled={!dictInput.trim()} className="w-full"><CheckCircle2 className="h-5 w-5" /> Kiểm tra</Button>
            </>
          )}

          {/* Dict result */}
          {phase === "dict-result" && (
            <div className="flex w-full flex-col items-center gap-3">
              <p className={cn("text-xl font-black", dictCorrect ? "text-success" : "text-red-600")}>{dictCorrect ? "Chính xác! ✓" : "Chưa đúng ✗"}</p>
              <div className="w-full rounded-xl bg-muted p-3 text-left">
                <p className="text-sm font-bold text-muted-foreground">Đáp án:</p>
                <p className="text-lg font-extrabold">{word.word}</p>
                {!dictCorrect && (<><p className="text-sm font-bold text-muted-foreground mt-2">Bạn gõ:</p><p className="text-lg font-bold text-red-600">{dictInput}</p></>)}
              </div>
              <div className="flex w-full gap-2">
                {!dictCorrect && <Button type="button" variant="outline" className="flex-1" onClick={() => { setPhase("listen"); setDictInput(""); setDictCorrect(null); setRepeatCount((c) => c + 1); }}><RotateCcw className="h-4 w-4" /> Thử lại</Button>}
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

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition-colors", active ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>{children}</button>;
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color = score >= SPEAK_PASS ? "text-success" : "text-red-600";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className={color} strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
      </svg>
      <div className="absolute"><span className={cn("text-xl font-black", color)}>{score}%</span></div>
    </div>
  );
}

function Wrapper({ children, onBack, progress }: { children: React.ReactNode; onBack: () => void; progress?: number }) {
  return <main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBack} progress={progress} />{children}</main>;
}

function Info({ text }: { text: string }) {
  return <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">{text}</CardContent></Card>;
}
