import { ArrowRight, Ear, Headphones, Loader2, MessageCircle, Mic, PartyPopper, Square, ThumbsUp, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SEED_TOPICS, TOPIC_TO_CATEGORY } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { getVideoLesson } from "@/data/videoLessons";
import { getWordBank, type BankWord } from "@/services/wordBankService";
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

type SpeakingMode = "word" | "phrase" | "shadowing" | "minimal-pairs";
type Phase = "idle" | "recording" | "scoring" | "result";

const MODES: { key: SpeakingMode; icon: typeof Mic; label: string; desc: string; color: string }[] = [
  { key: "word", icon: Mic, label: "Phát âm từ", desc: "Luyện phát âm từng từ riêng lẻ", color: "bg-blue-100 text-blue-600" },
  { key: "phrase", icon: MessageCircle, label: "Phát âm cụm từ", desc: "Luyện phát âm cụm từ & câu thông dụng", color: "bg-green-100 text-green-600" },
  { key: "shadowing", icon: Headphones, label: "Shadowing", desc: "Nghe rồi đọc theo (nghe → nhắc lại)", color: "bg-purple-100 text-purple-600" },
  { key: "minimal-pairs", icon: Ear, label: "Minimal Pairs", desc: "Phân biệt cặp âm dễ nhầm cho người Việt", color: "bg-orange-100 text-orange-600" },
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
  { phrase: "I'm looking forward to it", meaning_vi: "Tôi rất mong chờ điều đó", level: "a2" },
  { phrase: "It depends on the situation", meaning_vi: "Tùy vào tình huống", level: "b1" },
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

// ── Minimal Pairs data (important for Vietnamese learners) ──
interface MinimalPair {
  word1: string;
  word2: string;
  ipa1: string;
  ipa2: string;
  soundFocus: string;
  level: string;
}

const MINIMAL_PAIRS: MinimalPair[] = [
  // /ɪ/ vs /iː/
  { word1: "ship", word2: "sheep", ipa1: "/ʃɪp/", ipa2: "/ʃiːp/", soundFocus: "/ɪ/ vs /iː/", level: "beginner" },
  { word1: "bit", word2: "beat", ipa1: "/bɪt/", ipa2: "/biːt/", soundFocus: "/ɪ/ vs /iː/", level: "beginner" },
  { word1: "sit", word2: "seat", ipa1: "/sɪt/", ipa2: "/siːt/", soundFocus: "/ɪ/ vs /iː/", level: "beginner" },
  { word1: "hit", word2: "heat", ipa1: "/hɪt/", ipa2: "/hiːt/", soundFocus: "/ɪ/ vs /iː/", level: "beginner" },
  { word1: "fill", word2: "feel", ipa1: "/fɪl/", ipa2: "/fiːl/", soundFocus: "/ɪ/ vs /iː/", level: "beginner" },
  { word1: "lip", word2: "leap", ipa1: "/lɪp/", ipa2: "/liːp/", soundFocus: "/ɪ/ vs /iː/", level: "intermediate" },
  // /e/ vs /æ/
  { word1: "bed", word2: "bad", ipa1: "/bed/", ipa2: "/bæd/", soundFocus: "/e/ vs /æ/", level: "beginner" },
  { word1: "pen", word2: "pan", ipa1: "/pen/", ipa2: "/pæn/", soundFocus: "/e/ vs /æ/", level: "beginner" },
  { word1: "set", word2: "sat", ipa1: "/set/", ipa2: "/sæt/", soundFocus: "/e/ vs /æ/", level: "beginner" },
  { word1: "men", word2: "man", ipa1: "/men/", ipa2: "/mæn/", soundFocus: "/e/ vs /æ/", level: "beginner" },
  { word1: "head", word2: "had", ipa1: "/hed/", ipa2: "/hæd/", soundFocus: "/e/ vs /æ/", level: "intermediate" },
  // /ɪ/ vs /e/
  { word1: "sit", word2: "set", ipa1: "/sɪt/", ipa2: "/set/", soundFocus: "/ɪ/ vs /e/", level: "intermediate" },
  { word1: "pin", word2: "pen", ipa1: "/pɪn/", ipa2: "/pen/", soundFocus: "/ɪ/ vs /e/", level: "intermediate" },
  { word1: "tin", word2: "ten", ipa1: "/tɪn/", ipa2: "/ten/", soundFocus: "/ɪ/ vs /e/", level: "intermediate" },
  { word1: "bill", word2: "bell", ipa1: "/bɪl/", ipa2: "/bel/", soundFocus: "/ɪ/ vs /e/", level: "intermediate" },
  // /ʌ/ vs /æ/
  { word1: "cut", word2: "cat", ipa1: "/kʌt/", ipa2: "/kæt/", soundFocus: "/ʌ/ vs /æ/", level: "beginner" },
  { word1: "but", word2: "bat", ipa1: "/bʌt/", ipa2: "/bæt/", soundFocus: "/ʌ/ vs /æ/", level: "beginner" },
  { word1: "hut", word2: "hat", ipa1: "/hʌt/", ipa2: "/hæt/", soundFocus: "/ʌ/ vs /æ/", level: "beginner" },
  { word1: "run", word2: "ran", ipa1: "/rʌn/", ipa2: "/ræn/", soundFocus: "/ʌ/ vs /æ/", level: "intermediate" },
  // /ʊ/ vs /uː/
  { word1: "pull", word2: "pool", ipa1: "/pʊl/", ipa2: "/puːl/", soundFocus: "/ʊ/ vs /uː/", level: "intermediate" },
  { word1: "full", word2: "fool", ipa1: "/fʊl/", ipa2: "/fuːl/", soundFocus: "/ʊ/ vs /uː/", level: "intermediate" },
  { word1: "look", word2: "Luke", ipa1: "/lʊk/", ipa2: "/luːk/", soundFocus: "/ʊ/ vs /uː/", level: "intermediate" },
  // /r/ vs /l/
  { word1: "rice", word2: "lice", ipa1: "/raɪs/", ipa2: "/laɪs/", soundFocus: "/r/ vs /l/", level: "beginner" },
  { word1: "right", word2: "light", ipa1: "/raɪt/", ipa2: "/laɪt/", soundFocus: "/r/ vs /l/", level: "beginner" },
  { word1: "red", word2: "led", ipa1: "/red/", ipa2: "/led/", soundFocus: "/r/ vs /l/", level: "beginner" },
  { word1: "rock", word2: "lock", ipa1: "/rɒk/", ipa2: "/lɒk/", soundFocus: "/r/ vs /l/", level: "beginner" },
  { word1: "pray", word2: "play", ipa1: "/preɪ/", ipa2: "/pleɪ/", soundFocus: "/r/ vs /l/", level: "intermediate" },
  { word1: "road", word2: "load", ipa1: "/roʊd/", ipa2: "/loʊd/", soundFocus: "/r/ vs /l/", level: "intermediate" },
  // /θ/ vs /t/
  { word1: "thin", word2: "tin", ipa1: "/θɪn/", ipa2: "/tɪn/", soundFocus: "/θ/ vs /t/", level: "beginner" },
  { word1: "three", word2: "tree", ipa1: "/θriː/", ipa2: "/triː/", soundFocus: "/θ/ vs /t/", level: "beginner" },
  { word1: "thank", word2: "tank", ipa1: "/θæŋk/", ipa2: "/tæŋk/", soundFocus: "/θ/ vs /t/", level: "intermediate" },
  { word1: "thought", word2: "taught", ipa1: "/θɔːt/", ipa2: "/tɔːt/", soundFocus: "/θ/ vs /t/", level: "intermediate" },
  { word1: "thick", word2: "tick", ipa1: "/θɪk/", ipa2: "/tɪk/", soundFocus: "/θ/ vs /t/", level: "beginner" },
  // /f/ vs /v/
  { word1: "fan", word2: "van", ipa1: "/fæn/", ipa2: "/væn/", soundFocus: "/f/ vs /v/", level: "beginner" },
  { word1: "fine", word2: "vine", ipa1: "/faɪn/", ipa2: "/vaɪn/", soundFocus: "/f/ vs /v/", level: "beginner" },
  { word1: "ferry", word2: "very", ipa1: "/ˈferi/", ipa2: "/ˈveri/", soundFocus: "/f/ vs /v/", level: "beginner" },
  { word1: "fast", word2: "vast", ipa1: "/fæst/", ipa2: "/væst/", soundFocus: "/f/ vs /v/", level: "intermediate" },
  // /n/ vs /ŋ/
  { word1: "sin", word2: "sing", ipa1: "/sɪn/", ipa2: "/sɪŋ/", soundFocus: "/n/ vs /ŋ/", level: "intermediate" },
  { word1: "win", word2: "wing", ipa1: "/wɪn/", ipa2: "/wɪŋ/", soundFocus: "/n/ vs /ŋ/", level: "intermediate" },
  { word1: "ran", word2: "rang", ipa1: "/ræn/", ipa2: "/ræŋ/", soundFocus: "/n/ vs /ŋ/", level: "intermediate" },
  { word1: "ban", word2: "bang", ipa1: "/bæn/", ipa2: "/bæŋ/", soundFocus: "/n/ vs /ŋ/", level: "intermediate" },
  // /s/ vs /ʃ/
  { word1: "see", word2: "she", ipa1: "/siː/", ipa2: "/ʃiː/", soundFocus: "/s/ vs /ʃ/", level: "beginner" },
  { word1: "so", word2: "show", ipa1: "/soʊ/", ipa2: "/ʃoʊ/", soundFocus: "/s/ vs /ʃ/", level: "beginner" },
  { word1: "suit", word2: "shoot", ipa1: "/suːt/", ipa2: "/ʃuːt/", soundFocus: "/s/ vs /ʃ/", level: "intermediate" },
  // /b/ vs /p/
  { word1: "bat", word2: "pat", ipa1: "/bæt/", ipa2: "/pæt/", soundFocus: "/b/ vs /p/", level: "beginner" },
  { word1: "buy", word2: "pie", ipa1: "/baɪ/", ipa2: "/paɪ/", soundFocus: "/b/ vs /p/", level: "beginner" },
  // /ð/ vs /d/
  { word1: "they", word2: "day", ipa1: "/ðeɪ/", ipa2: "/deɪ/", soundFocus: "/ð/ vs /d/", level: "intermediate" },
  { word1: "then", word2: "den", ipa1: "/ðen/", ipa2: "/den/", soundFocus: "/ð/ vs /d/", level: "intermediate" },
  // /ɒ/ vs /ʌ/
  { word1: "cot", word2: "cut", ipa1: "/kɒt/", ipa2: "/kʌt/", soundFocus: "/ɒ/ vs /ʌ/", level: "advanced" },
  { word1: "hot", word2: "hut", ipa1: "/hɒt/", ipa2: "/hʌt/", soundFocus: "/ɒ/ vs /ʌ/", level: "advanced" },
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
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
    return <PhraseMode topicId={topicId} level={level} onBack={() => setMode(null)} />;
  }

  if (mode === "minimal-pairs") {
    return <MinimalPairsMode onBack={() => setMode(null)} />;
  }

  // mode === "word" — original word pronunciation
  return <WordMode topicId={topicId} level={level} onBack={() => setMode(null)} onShadowing={onShadowing} />;
}

/* ───────────────────────── Word Mode (original functionality) ───────────────────────── */

function WordMode({ topicId, level, onBack, onShadowing }: { topicId: string; level: Level; onBack: () => void; onShadowing?: () => void }) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const videoLesson = useMemo(() => getVideoLesson(topicId), [topicId]);

  const categoryId = topicId?.startsWith("topic_") ? TOPIC_TO_CATEGORY[topicId] : topicId;
  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    if (!categoryId || videoLesson) return;
    getWordBank(level === "all" ? undefined : level, categoryId).then(setBankWords).catch(() => {});
  }, [categoryId, level, videoLesson]);

  const words = useMemo(() => {
    // Ưu tiên từ video lesson — chỉ lấy từ đơn (không phrase)
    if (videoLesson) {
      const vw = videoLesson.vocabulary
        .filter((w) => !w.word.includes(" ") && w.word.length > 1)
        .map((w, i) => ({ id: `vl_${topicId}_${i}`, word: w.word, phonetic: "", meaning_vi: w.meaning_vi, meaning_en: "", pos: w.pos, example: w.example, example_vi: "", topicIds: [topicId], level: "a1" as const, imageUrl: "", source: "seed" as const, createdAt: 0 }));
      return pickWords(vw.length >= 1 ? vw : SEED_VOCABULARY, 8);
    }
    if (bankWords.length > 0) {
      const bw = bankWords.filter((w) => !w.word.includes(" ")).map((bw, i) => ({
        id: bw.id, word: bw.word, phonetic: bw.phonetic || "",
        meaning_vi: bw.meaning_vi, meaning_en: bw.meaning_en || "",
        pos: bw.pos || "", example: bw.examples?.[0]?.en || "", example_vi: bw.examples?.[0]?.vi || "",
        topicIds: bw.categories, level: bw.level as any, imageUrl: bw.image || "",
        source: "seed" as const, createdAt: 0,
      }));
      return pickWords(bw.length >= 1 ? bw : SEED_VOCABULARY, 8);
    }
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && !w.word.includes(" ") && matchesLevel(w.level, level));
    const fallback = SEED_VOCABULARY.filter((w) => !w.word.includes(" ") && matchesLevel(w.level, level));
    return pickWords(t.length >= 1 ? t : fallback.length >= 1 ? fallback : SEED_VOCABULARY, 8);
  }, [topicId, level, videoLesson, bankWords]);

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
    return (<main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6"><SessionHeader title="Phát âm từ" onClose={onBack} /><Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ để luyện.</CardContent></Card></main>);
  }

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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

function PhraseMode({ topicId, level, onBack }: { topicId: string; level: Level; onBack: () => void }) {
  const videoLesson = useMemo(() => getVideoLesson(topicId), [topicId]);
  const phrases = useMemo(() => {
    // Ưu tiên video phrases
    if (videoLesson && videoLesson.phrases.length > 0) {
      const vp = videoLesson.phrases.map((p) => ({ phrase: p.en, meaning_vi: p.vi }));
      const shuffled = vp.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 8);
    }
    // Fallback: combine multi-word vocabulary entries + common phrases
    const vocabPhrases: { phrase: string; meaning_vi: string }[] = SEED_VOCABULARY
      .filter((w) => w.word.includes(" ") && matchesLevel(w.level, level) && (!topicId || w.topicIds.includes(topicId)))
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
  }, [topicId, level]);

  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  const phrase = phrases[n];

  if (!phrase || phrases.length === 0) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Phát âm cụm từ" onClose={onBack} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chưa có cụm từ cho trình độ này.</CardContent></Card>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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

/* ───────────────────────── Minimal Pairs Mode ───────────────────────── */

const PAIRS_PER_ROUND = 10;

function MinimalPairsMode({ onBack }: { onBack: () => void }) {
  const pairs = useMemo(() => {
    const shuffled = [...MINIMAL_PAIRS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, PAIRS_PER_ROUND);
  }, []);

  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<1 | 2 | null>(null);
  const [correctChoice, setCorrectChoice] = useState<1 | 2>(() => (Math.random() < 0.5 ? 1 : 2));
  const [done, setDone] = useState(false);

  const pair = pairs[n];

  const playTarget = useCallback(() => {
    if (!pair) return;
    const word = correctChoice === 1 ? pair.word1 : pair.word2;
    speakText(word);
  }, [pair, correctChoice]);

  const handlePick = (choice: 1 | 2) => {
    if (picked !== null) return; // already answered
    setPicked(choice);
    if (choice === correctChoice) setScore((s) => s + 1);
    // Play both words for comparison after a short delay
    const w1 = pair.word1;
    const w2 = pair.word2;
    setTimeout(() => speakText(w1), 400);
    setTimeout(() => speakText(w2), 1200);
  };

  const next = () => {
    if (n + 1 >= pairs.length) {
      setDone(true);
    } else {
      setN((x) => x + 1);
      setPicked(null);
      setCorrectChoice(Math.random() < 0.5 ? 1 : 2);
    }
  };

  if (done) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Minimal Pairs" onClose={onBack} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">
              {score}/{pairs.length} {score >= pairs.length * 0.8 ? "Xuất sắc!" : score >= pairs.length * 0.5 ? "Khá tốt!" : "Cần luyện thêm!"}
            </p>
            <p className="text-sm font-bold text-muted-foreground">
              Bạn nghe đúng {score} trên {pairs.length} cặp âm
            </p>
            <Button type="button" size="lg" className="w-full" onClick={onBack}>Xong</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!pair) return null;

  const isCorrect = picked !== null && picked === correctChoice;

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title="Minimal Pairs" onClose={onBack} progress={Math.round((n / pairs.length) * 100)} />
      <p className="mb-1 text-center text-sm font-extrabold text-muted-foreground">
        Câu {n + 1} / {pairs.length} · Điểm: {score}
      </p>

      {/* Sound focus label */}
      <p className="mb-3 text-center">
        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
          {pair.soundFocus}
        </span>
      </p>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-6">
          {/* Speaker button */}
          <button
            type="button"
            onClick={playTarget}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all active:translate-y-[2px] hover:brightness-105"
            aria-label="Nghe"
          >
            <Volume2 className="h-9 w-9" />
          </button>
          <p className="text-sm font-bold text-muted-foreground">
            {picked === null ? "Nghe rồi chọn từ bạn nghe được" : "Nghe so sánh 2 từ"}
          </p>

          {/* Two word cards */}
          <div className="flex w-full gap-3">
            {([1, 2] as const).map((choice) => {
              const word = choice === 1 ? pair.word1 : pair.word2;
              const ipa = choice === 1 ? pair.ipa1 : pair.ipa2;
              const isThis = picked === choice;
              const isAnswer = correctChoice === choice;

              let borderClass = "border-border/50";
              if (picked !== null) {
                if (isAnswer) borderClass = "border-green-500 bg-green-50";
                else if (isThis && !isAnswer) borderClass = "border-red-500 bg-red-50";
              }

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handlePick(choice)}
                  disabled={picked !== null}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all",
                    picked === null && "hover:border-primary/50 hover:shadow-md active:scale-[0.97]",
                    borderClass,
                  )}
                >
                  <span className="text-2xl font-black">{word}</span>
                  <span className="text-sm font-bold text-muted-foreground">{ipa}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {picked !== null && (
            <div className="flex w-full flex-col items-center gap-3">
              <p className={cn("text-lg font-black", isCorrect ? "text-green-600" : "text-red-600")}>
                {isCorrect ? "Chính xác!" : `Sai rồi! Đáp án: ${correctChoice === 1 ? pair.word1 : pair.word2}`}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={playTarget}>
                  <Volume2 className="h-4 w-4" /> Nghe lại
                </Button>
                <Button type="button" size="sm" onClick={next}>
                  {n + 1 >= pairs.length ? "Xem kết quả" : "Tiếp"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
