import { ArrowRight, Headphones, Loader2, MessageCircle, Mic, PartyPopper, Square, ThumbsUp, Volume2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { speakText } from "@/services/speechService";
import { micAvailable, startRecording, type Recorder } from "@/services/audioRecorder";
import { assessPronunciation, type PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { VoicePicker } from "@/components/ui/VoicePicker";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { pickWords } from "@/components/games/wordRotation";
import { SpeakResult, SPEAK_PASS } from "@/components/speak/SpeakResult";
import { matchesLevel } from "@/utils/levelFilter";

interface SpeakingPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
  onShadowing?: () => void;
}

type SpeakingMode = "word" | "phrase" | "shadowing";
type Phase = "idle" | "recording" | "scoring" | "result";

const MODES: { key: SpeakingMode; icon: typeof Mic; label: string; desc: string; color: string }[] = [
  { key: "word", icon: Mic, label: "Phát âm từ", desc: "Luyện phát âm từng từ riêng lẻ", color: "bg-blue-100 text-blue-600" },
  { key: "phrase", icon: MessageCircle, label: "Phát âm cụm từ", desc: "Luyện phát âm cụm từ & câu thông dụng", color: "bg-green-100 text-green-600" },
  { key: "shadowing", icon: Headphones, label: "Shadowing", desc: "Nghe rồi đọc theo (nghe → nhắc lại)", color: "bg-purple-100 text-purple-600" },
];

// Common phrases grouped by level for "Phát âm cụm từ" mode
const COMMON_PHRASES: { phrase: string; meaning_vi: string; level: Level }[] = [
  { phrase: "How are you?", meaning_vi: "Bạn khỏe không?", level: "kids" },
  { phrase: "Thank you very much", meaning_vi: "Cảm ơn rất nhiều", level: "kids" },
  { phrase: "Nice to meet you", meaning_vi: "Rất vui được gặp bạn", level: "kids" },
  { phrase: "Good morning", meaning_vi: "Chào buổi sáng", level: "kids" },
  { phrase: "See you later", meaning_vi: "Hẹn gặp lại", level: "kids" },
  { phrase: "What is your name?", meaning_vi: "Bạn tên gì?", level: "kids" },
  { phrase: "I like this", meaning_vi: "Tôi thích cái này", level: "kids" },
  { phrase: "Can I help you?", meaning_vi: "Tôi giúp được gì?", level: "a1" },
  { phrase: "Where is the bathroom?", meaning_vi: "Nhà vệ sinh ở đâu?", level: "a1" },
  { phrase: "I don't understand", meaning_vi: "Tôi không hiểu", level: "a1" },
  { phrase: "How much does it cost?", meaning_vi: "Cái này giá bao nhiêu?", level: "a1" },
  { phrase: "Could you repeat that?", meaning_vi: "Bạn nói lại được không?", level: "a1" },
  { phrase: "What do you think?", meaning_vi: "Bạn nghĩ sao?", level: "a2" },
  { phrase: "I'm looking forward to it", meaning_vi: "Tôi rất mong chờ", level: "a2" },
  { phrase: "It depends on the situation", meaning_vi: "Tùy vào tình huống", level: "a2" },
  { phrase: "Let me think about it", meaning_vi: "Để tôi suy nghĩ đã", level: "a2" },
  { phrase: "That makes sense", meaning_vi: "Điều đó hợp lý", level: "b1" },
  { phrase: "I couldn't agree more", meaning_vi: "Tôi hoàn toàn đồng ý", level: "b1" },
  { phrase: "As far as I know", meaning_vi: "Theo như tôi biết", level: "b1" },
  { phrase: "On the other hand", meaning_vi: "Mặt khác", level: "b1" },
  { phrase: "It's worth considering", meaning_vi: "Điều đó đáng cân nhắc", level: "b2" },
  { phrase: "To be perfectly honest", meaning_vi: "Thành thật mà nói", level: "b2" },
  { phrase: "From my perspective", meaning_vi: "Theo quan điểm của tôi", level: "b2" },
  { phrase: "That's beside the point", meaning_vi: "Đó không phải vấn đề chính", level: "c1" },
  { phrase: "For what it's worth", meaning_vi: "Nếu có ích thì...", level: "c1" },
];

// Chấm chi tiết cần: micro + ngữ cảnh bảo mật (HTTPS/localhost).
const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();

export function SpeakingPage({ student, topicId, onBackHome, onShadowing }: SpeakingPageProps) {
  const [mode, setMode] = useState<SpeakingMode | null>(null);
  const [level, setLevel] = useState<Level>(student.level);

  // When "Shadowing" is clicked, navigate directly
  const handleModeSelect = (m: SpeakingMode) => {
    if (m === "shadowing") {
      onShadowing?.();
      return;
    }
    setMode(m);
  };

  // Mode selector screen
  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Luyện nói" onClose={onBackHome} icon={<Mic className="h-4 w-4" />} iconBg="bg-teal-500" />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVEL_ORDER.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MODES.map((m) => (
            <button key={m.key} type="button" onClick={() => handleModeSelect(m.key)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md text-left">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", m.color)}>
                <m.icon className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          Trình độ: {LEVEL_LABELS[level]} · {student.name}
        </p>
      </main>
    );
  }

  if (mode === "phrase") {
    return <PhraseMode level={level} onBack={() => setMode(null)} />;
  }

  // mode === "word" — original word pronunciation
  return <WordMode topicId={topicId} level={level} onBack={() => setMode(null)} onShadowing={onShadowing} />;
}

/* ───────────────────────── Word Mode (original functionality) ───────────────────────── */

function WordMode({ topicId, level, onBack, onShadowing }: { topicId: string; level: Level; onBack: () => void; onShadowing?: () => void }) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const words = useMemo(() => {
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && !w.word.includes(" ") && matchesLevel(w.level, level));
    const fallback = SEED_VOCABULARY.filter((w) => !w.word.includes(" ") && matchesLevel(w.level, level));
    return pickWords(t.length >= 1 ? t : fallback.length >= 1 ? fallback : SEED_VOCABULARY, 8);
  }, [topicId, level]);

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
    return (<main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6"><SessionHeader title="Phát âm từ" onClose={onBack} /><Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ để luyện.</CardContent></Card></main>);
  }

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Phát âm từ" onClose={onBack} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">{detailed ? `Đọc tốt ${good}/${words.length} từ! 🎉` : `Đã luyện ${words.length} từ! 🎉`}</p>
            <Button type="button" size="lg" className="w-full" onClick={onBack}>Xong</Button>
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
      if (r.score >= SPEAK_PASS) setGood((g) => g + 1);
      setPhase("result");
    } catch {
      setErr("Chưa chấm được — dịch vụ chấm phát âm (speech-eval) chưa chạy?");
      setPhase("idle");
    }
  };

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={`Phát âm từ${topic ? " · " + topic.name : ""}`} onClose={onBack} progress={Math.round((n / words.length) * 100)} right={<VoicePicker />} />
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
          {word.meaning_vi ? <p className="text-lg font-extrabold text-primary">{word.meaning_vi}</p> : null}
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
                <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-muted p-4">
                  <SpeakResult
                    result={result}
                    ringSize={72}
                    showHeard
                    continueLabel={n + 1 >= words.length ? "Xong" : (<>Từ tiếp <ArrowRight className="h-5 w-5" /></>)}
                    onRetry={start}
                    onContinue={next}
                    onSkip={next}
                  />
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

/* ───────────────────────── Phrase Mode ───────────────────────── */

function PhraseMode({ level, onBack }: { level: Level; onBack: () => void }) {
  const phrases = useMemo(() => {
    // Combine multi-word vocabulary entries + common phrases for the selected level
    const vocabPhrases: { phrase: string; meaning_vi: string }[] = SEED_VOCABULARY
      .filter((w) => w.word.includes(" ") && matchesLevel(w.level, level))
      .map((w) => ({ phrase: w.word, meaning_vi: w.meaning_vi }));

    const commonForLevel = COMMON_PHRASES
      .filter((p) => matchesLevel(p.level, level))
      .map((p) => ({ phrase: p.phrase, meaning_vi: p.meaning_vi }));

    const all = [...vocabPhrases, ...commonForLevel];
    // Deduplicate by phrase
    const seen = new Set<string>();
    const unique = all.filter((p) => {
      const key = p.phrase.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Shuffle and take up to 8
    const shuffled = unique.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [level]);

  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  const phrase = phrases[n];

  if (!phrase || phrases.length === 0) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Phát âm cụm từ" onClose={onBack} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chưa có cụm từ cho trình độ này.</CardContent></Card>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Phát âm cụm từ" onClose={onBack} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">Đã luyện {phrases.length} cụm từ! 🎉</p>
            <Button type="button" size="lg" className="w-full" onClick={onBack}>Xong</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const next = () => {
    if (n + 1 >= phrases.length) setDone(true);
    else setN((x) => x + 1);
  };

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title="Phát âm cụm từ" onClose={onBack} progress={Math.round((n / phrases.length) * 100)} right={<VoicePicker />} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Cụm từ {n + 1} / {phrases.length}</p>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-secondary">
            <MessageCircle className="h-16 w-16 text-green-500/40" />
          </div>
          <h2 className="text-2xl font-black">{phrase.phrase}</h2>
          <p className="text-lg font-extrabold text-primary">{phrase.meaning_vi}</p>
          <Button type="button" variant="outline" onClick={() => speakText(phrase.phrase)}>
            <Volume2 className="h-5 w-5" /> Nghe mẫu
          </Button>

          <div className="w-full space-y-3">
            <p className="rounded-2xl bg-muted p-3 text-sm font-bold text-muted-foreground">🔊 Nghe mẫu rồi đọc to theo nhé.</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => speakText(phrase.phrase)}><Volume2 className="h-5 w-5" /> Nghe lại</Button>
              <Button type="button" className="flex-1" onClick={next}><ThumbsUp className="h-5 w-5" /> {n + 1 >= phrases.length ? "Xong" : "Đọc được rồi"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
