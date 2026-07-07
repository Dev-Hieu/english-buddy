import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock, Keyboard, Loader2, Mic, PartyPopper, Pause, Play, Repeat, RotateCcw, Square, Trophy, Video, Volume2, VolumeX } from "lucide-react";
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

type PracticeMode = "shadow" | "dictation" | "dubbing";
type WaitMode = "off" | "3s" | "5s" | "manual";
type PracticePhase = "idle" | "wait" | "recording" | "scoring" | "result" | "dictation" | "dict-result" | "done";

interface Sentence { start: number; end: number; text: string; }

const CAN_MIC = typeof window !== "undefined" && window.isSecureContext && micAvailable();
const WAIT_LABELS: Record<WaitMode, string> = { off: "Tắt", "3s": "+3s", "5s": "+5s", manual: "Bấm" };
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

type VideoLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type VideoTopic = "General" | "Education" | "Film" | "Music" | "Entertainment" | "Science" | "News" | "People";
interface SuggestedVideo { id: string; title: string; level: VideoLevel; topic: VideoTopic; }

const SUGGESTED_VIDEOS: SuggestedVideo[] = [
  // A1
  { id: "u0zqXffuN5Y", title: "Hello", level: "A1", topic: "General" },
  { id: "WgYcNtL7f7c", title: "What do you want?", level: "A1", topic: "General" },
  { id: "2iiuvBnW9kQ", title: "English Reading — Shopping", level: "A1", topic: "General" },
  { id: "fCEbDDfzaQg", title: "I am a tiger", level: "A1", topic: "General" },
  { id: "V7P83_fcE1A", title: "Who Likes Cake", level: "A1", topic: "General" },
  { id: "89s6rXPHowI", title: "Tim Helps a Sheep", level: "A1", topic: "People" },
  { id: "XWq58Abc7zk", title: "Supermarket Listening", level: "A1", topic: "Education" },
  { id: "bngvFaB_qx0", title: "English Reading — Traveling", level: "A1", topic: "General" },
  { id: "cVMtYAbE8pQ", title: "Grade 4 - Unit 1 - Lesson 3", level: "A1", topic: "Education" },
  { id: "AB7-J-JVLTc", title: "I'm in a hurry", level: "A1", topic: "General" },
  { id: "NtDd-jPvQM8", title: "Peppa Pig — Mummy at Work", level: "A1", topic: "Film" },
  { id: "6VVEIH81jCo", title: "100 Sight Word Poems", level: "A1", topic: "Entertainment" },
  { id: "MDQFir7hU5Y", title: "What Do You Like", level: "A1", topic: "Entertainment" },
  // A2
  { id: "XmoMKKlSZ1Y", title: "Improve English with Music", level: "A2", topic: "General" },
  { id: "aJ5iL8AVkBg", title: "Improve by Talking to Yourself", level: "A2", topic: "General" },
  { id: "GoNQmdjAV9k", title: "Happy Christmas — Harry Potter", level: "A2", topic: "Film" },
  { id: "nXait2wHOQc", title: "Kung Fu Panda 2 — Baby Po", level: "A2", topic: "Film" },
  { id: "NAcG64bOx8k", title: "Asking for Directions", level: "A2", topic: "Education" },
  { id: "l4Lk0JTD938", title: "Talking About Cooking", level: "A2", topic: "General" },
  { id: "Zt5ch6AzpAQ", title: "I Don't Want To Work Today", level: "A2", topic: "General" },
  { id: "lPIuAgZ3I2I", title: "Weekend With Friends", level: "A2", topic: "General" },
  { id: "3MSsTK2bHVo", title: "My Weekend", level: "A2", topic: "General" },
  { id: "7PP-4eFXaqo", title: "My Favorite Hobby", level: "A2", topic: "Education" },
  { id: "6se1U6HwuCI", title: "Traveling Speaking Practice", level: "A2", topic: "Education" },
  // B1
  { id: "bABomTRzZzc", title: "Master English Shadowing", level: "B1", topic: "Education" },
  { id: "erf3dnG3AG8", title: "Daily English Practice", level: "B1", topic: "General" },
  { id: "cZ3V4O4j4OE", title: "Zootopia — Gondola", level: "B1", topic: "Film" },
  { id: "z4K2F_OALPQ", title: "Sorting Ceremony — Harry Potter", level: "B1", topic: "Film" },
  { id: "JRKyEfBcXFQ", title: "Harry Visits The Weasleys", level: "B1", topic: "Film" },
  { id: "re5veV2F7eY", title: "Mean Girls — Meeting the Plastics", level: "B1", topic: "Film" },
  { id: "dDaBjcM8z8s", title: "Relationships", level: "B1", topic: "General" },
  { id: "1gRIqFqjiBQ", title: "Listen to Your Heart — Muniba", level: "B1", topic: "General" },
  { id: "z0PJnc8BFTk", title: "Friends: Ross Music Skills", level: "B1", topic: "Entertainment" },
  { id: "1gbppiPa_c0", title: "What's in My Bag — Kendall Jenner", level: "B1", topic: "Entertainment" },
  { id: "rHvQakk1zMA", title: "From The Start (Lyrics)", level: "B1", topic: "Music" },
  // B2
  { id: "2hOp408Ib5w", title: "Obama on Education", level: "B2", topic: "News" },
  { id: "W1qtu-pF99o", title: "Region Famous For — IELTS", level: "B2", topic: "Education" },
  { id: "GSvyRVw366k", title: "Taylor Swift on 60 Minutes", level: "B2", topic: "Entertainment" },
  { id: "okxZDUOSAfU", title: "Legally Blonde — Graduation", level: "B2", topic: "Film" },
  { id: "xpyrefzvTpI", title: "DiCaprio Best Actor — Oscars", level: "B2", topic: "Entertainment" },
  { id: "AoUCuBdDNNw", title: "Biodiversity", level: "B2", topic: "Science" },
  { id: "E20Ljm5D7yU", title: "Why Mangosteen Is So Expensive", level: "B2", topic: "News" },
  // C1
  { id: "N2FOxjtv5ns", title: "What is El Niño?", level: "C1", topic: "Science" },
  { id: "HffWFd_6bJ0", title: "Social Media Changes Your Brain", level: "C1", topic: "Science" },
  { id: "20p5o6QaQfg", title: "How to Build Self Confidence", level: "C1", topic: "Education" },
  // C2
  { id: "gkjW9PZBRfk", title: "Emma Watson — HeForShe", level: "C2", topic: "People" },
  { id: "c_wOnJJEfxE", title: "What is Cultural Humility?", level: "C2", topic: "Science" },
  { id: "4h7pcrSg0k8", title: "What Happens After a Stroke", level: "C2", topic: "Science" },
];

const LEVELS: VideoLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const TOPICS: VideoTopic[] = ["General", "Education", "Film", "Music", "Entertainment", "Science", "News", "People"];

// IPA cho function words phổ biến (không có trong vocabulary DB)
const COMMON_IPA: Record<string, string> = {
  "i": "aɪ", "i'm": "aɪm", "i'll": "aɪl", "i've": "aɪv", "i'd": "aɪd",
  "you": "juː", "you're": "jʊr", "you'll": "juːl", "you've": "juːv", "your": "jʊr", "yours": "jʊrz", "yourself": "jʊrˈself",
  "he": "hiː", "he's": "hiːz", "him": "hɪm", "his": "hɪz", "himself": "hɪmˈself",
  "she": "ʃiː", "she's": "ʃiːz", "her": "hɜːr", "hers": "hɜːrz", "herself": "hɜːrˈself",
  "it": "ɪt", "it's": "ɪts", "its": "ɪts", "itself": "ɪtˈself",
  "we": "wiː", "we're": "wɪr", "we'll": "wiːl", "we've": "wiːv", "us": "ʌs", "our": "aʊr", "ours": "aʊrz", "ourselves": "aʊrˈselvz",
  "they": "ðeɪ", "they're": "ðer", "they'll": "ðeɪl", "they've": "ðeɪv", "them": "ðem", "their": "ðer", "theirs": "ðerz", "themselves": "ðemˈselvz",
  "me": "miː", "my": "maɪ", "mine": "maɪn", "myself": "maɪˈself",
  "the": "ðə", "a": "ə", "an": "ən",
  "is": "ɪz", "are": "ɑːr", "am": "æm", "was": "wɒz", "were": "wɜːr", "be": "biː", "been": "biːn", "being": "ˈbiːɪŋ",
  "do": "duː", "does": "dʌz", "did": "dɪd", "don't": "doʊnt", "doesn't": "ˈdʌz.ənt", "didn't": "ˈdɪd.ənt", "doing": "ˈduːɪŋ", "done": "dʌn",
  "have": "hæv", "has": "hæz", "had": "hæd", "haven't": "ˈhæv.ənt", "hasn't": "ˈhæz.ənt", "having": "ˈhæv.ɪŋ",
  "will": "wɪl", "won't": "woʊnt", "would": "wʊd", "wouldn't": "ˈwʊd.ənt",
  "can": "kæn", "can't": "kænt", "cannot": "ˈkæn.ɒt", "could": "kʊd", "couldn't": "ˈkʊd.ənt",
  "shall": "ʃæl", "should": "ʃʊd", "shouldn't": "ˈʃʊd.ənt",
  "may": "meɪ", "might": "maɪt", "must": "mʌst", "mustn't": "ˈmʌs.ənt",
  "not": "nɒt", "no": "noʊ", "yes": "jes", "yeah": "jeə",
  "this": "ðɪs", "that": "ðæt", "that's": "ðæts", "these": "ðiːz", "those": "ðoʊz",
  "here": "hɪr", "there": "ðer", "there's": "ðerz", "where": "wer", "where's": "werz",
  "what": "wɒt", "what's": "wɒts", "when": "wen", "how": "haʊ", "why": "waɪ", "who": "huː", "who's": "huːz", "which": "wɪtʃ",
  "and": "ænd", "or": "ɔːr", "but": "bʌt", "so": "soʊ", "if": "ɪf", "because": "bɪˈkɒz",
  "in": "ɪn", "on": "ɒn", "at": "æt", "to": "tuː", "for": "fɔːr", "of": "ɒv", "with": "wɪð", "from": "frɒm",
  "by": "baɪ", "up": "ʌp", "out": "aʊt", "about": "əˈbaʊt", "into": "ˈɪn.tuː", "over": "ˈoʊ.vər", "after": "ˈæf.tər", "before": "bɪˈfɔːr",
  "then": "ðen", "than": "ðæn", "just": "dʒʌst", "also": "ˈɔːl.soʊ", "very": "ˈver.i", "too": "tuː",
  "all": "ɔːl", "some": "sʌm", "any": "ˈen.i", "every": "ˈev.ri", "each": "iːtʃ",
  "more": "mɔːr", "most": "moʊst", "much": "mʌtʃ", "many": "ˈmen.i",
  "other": "ˈʌð.ər", "another": "əˈnʌð.ər", "same": "seɪm",
  "now": "naʊ", "still": "stɪl", "already": "ɔːlˈred.i", "again": "əˈɡen",
  "let": "let", "let's": "lets", "please": "pliːz", "thank": "θæŋk", "thanks": "θæŋks",
  "hello": "həˈloʊ", "hi": "haɪ", "hey": "heɪ", "bye": "baɪ", "goodbye": "ɡʊdˈbaɪ",
  "ok": "ˌoʊˈkeɪ", "okay": "ˌoʊˈkeɪ", "well": "wel", "oh": "oʊ", "wow": "waʊ",
};

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
  const [ytUrl, setYtUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [filterLevel, setFilterLevel] = useState<VideoLevel | "">("");
  const [filterTopic, setFilterTopic] = useState<VideoTopic | "">("");
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const playerRef = useRef<any>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [speed, setSpeed] = useState(1);

  const [practiceMode, setPracticeMode] = useState<PracticeMode>("shadow");
  const [waitMode, setWaitMode] = useState<WaitMode>("3s");
  const [practicePhase, setPracticePhase] = useState<PracticePhase>("idle");
  const [result, setResult] = useState<PronResult | null>(null);
  const [dictInput, setDictInput] = useState("");
  const [dictCorrect, setDictCorrect] = useState<boolean | null>(null);
  const [scores, setScores] = useState<Record<number, { score: number; mode: string }>>({});
  const [showIpa, setShowIpa] = useState(false);
  const [ipaMap, setIpaMap] = useState<Record<string, string>>({});

  // Repeat count
  const [repeatTarget, setRepeatTarget] = useState(1);
  const [repeatDone, setRepeatDone] = useState(0);

  // Dubbing: muted sentences
  const [mutedSentences, setMutedSentences] = useState<Set<number>>(new Set());

  // Full lesson tracking
  const [completedCount, setCompletedCount] = useState(0);

  const recRef = useRef<Recorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load IPA map khi bật toggle (1 lần)
  useEffect(() => {
    if (!showIpa || Object.keys(ipaMap).length > 0) return;
    apiRequest<any[]>("/api/vocabulary", { auth: false }).then((words) => {
      const map: Record<string, string> = {};
      for (const w of words) if (w.phonetic && w.word) map[w.word.toLowerCase()] = w.phonetic;
      setIpaMap(map);
    }).catch(() => {});
  }, [showIpa]);

  const extractVideoId = (url: string) => url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || "";

  const lookupWordFn = async (word: string) => {
    const clean = word.toLowerCase().replace(/[^a-z'-]/g, "");
    if (!clean || clean.length < 2) return;
    setLookupWord(clean);
    setLookupResult(null);
    setLookupLoading(true);
    try {
      // 1. Tra nhanh từ vocabulary DB (4220 từ, miễn phí)
      const vocabResp = await fetch(`/api/word-meaning?word=${encodeURIComponent(clean)}`);
      if (vocabResp.ok) {
        const v = await vocabResp.json();
        setLookupResult({
          vi: (v.meaning_vi || "").split(/[;；]/).map((s: string) => s.trim()).filter(Boolean),
          phonetic: v.phonetic,
          example: v.example,
          example_vi: v.example_vi,
          meaning_en: v.meaning_en,
        });
        return;
      }
      // 2. Try word-detail API (DeepSeek cache)
      const detailResp = await fetch(`/api/word-detail?word=${encodeURIComponent(clean)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("eb_token") || ""}` }
      });
      if (detailResp.ok) { setLookupResult(await detailResp.json()); return; }
      // 3. Fallback: Free Dictionary API (tiếng Anh)
      const dictResp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`).catch(() => null);
      if (dictResp?.ok) {
        const entries = await dictResp.json();
        const meanings = entries?.[0]?.meanings?.map((m: any) => `(${m.partOfSpeech}) ${m.definitions?.[0]?.definition || ""}`).filter(Boolean);
        const phonetic = entries?.[0]?.phonetic || "";
        if (meanings?.length) { setLookupResult({ vi: meanings, phonetic }); return; }
      }
      setLookupResult(null);
    } catch { setLookupResult(null); }
    finally { setLookupLoading(false); }
  };

  const filteredVideos = SUGGESTED_VIDEOS.filter((v) =>
    (!filterLevel || v.level === filterLevel) && (!filterTopic || v.topic === filterTopic)
  );

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

  // Init player
  useEffect(() => {
    if (!videoId || !playerDivRef.current) return;
    let destroyed = false;
    loadYtApi().then(() => {
      if (destroyed) return;
      playerRef.current = new (window as any).YT.Player(playerDivRef.current, {
        videoId, playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => playerRef.current?.setPlaybackRate?.(speed),
          onStateChange: (e: any) => {
            setIsPlaying(e.data === 1);
            if (e.data === 0) checkCompletion(); // video ended
          },
        },
      });
    });
    return () => { destroyed = true; playerRef.current?.destroy?.(); playerRef.current = null; };
  }, [videoId]);

  // Poll time → highlight + auto-pause
  const findSentenceIdx = useCallback((time: number) => {
    for (let i = 0; i < sentences.length; i++) if (time >= sentences[i].start && time < sentences[i].end) return i;
    for (let i = 0; i < sentences.length; i++) if (time < sentences[i].start) return i - 1;
    return sentences.length - 1;
  }, [sentences]);

  useEffect(() => {
    if (!isPlaying || !sentences.length) { if (pollRef.current) clearInterval(pollRef.current); return; }
    pollRef.current = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() || 0;
      const idx = findSentenceIdx(t);
      setCurrentIdx(idx);

      if (idx >= 0 && practicePhase === "idle") {
        const sent = sentences[idx];

        // Dubbing: mute/unmute
        if (practiceMode === "dubbing") {
          const shouldMute = mutedSentences.has(idx);
          const vol = playerRef.current?.getVolume?.() || 100;
          if (shouldMute && vol > 0) playerRef.current?.setVolume?.(0);
          else if (!shouldMute && vol === 0) playerRef.current?.setVolume?.(100);
        }

        // Auto-pause at sentence end (shadow/dictation modes, wait != off)
        if (practiceMode !== "dubbing" && waitMode !== "off" && t >= sent.end - 0.15) {
          playerRef.current?.pauseVideo?.();
          setIsPlaying(false);
          startPractice(idx);
        }
      }
    }, 150);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [isPlaying, sentences, practicePhase, waitMode, practiceMode, mutedSentences, findSentenceIdx]);

  // Auto-scroll
  useEffect(() => {
    if (currentIdx >= 0 && listRef.current) {
      (listRef.current.children[currentIdx] as HTMLElement)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentIdx]);

  // Practice
  const startPractice = (idx: number) => {
    setCurrentIdx(idx); setResult(null); setDictInput(""); setDictCorrect(null); setRepeatDone(0);
    if (waitMode === "manual") setPracticePhase("wait");
    else { setPracticePhase("wait"); timerRef.current = setTimeout(() => goRecord(idx), waitMode === "3s" ? 3000 : 5000); }
  };

  const goRecord = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (practiceMode === "dictation") { setPracticePhase("dictation"); return; }
    if (!CAN_MIC) { finishSentence(idx); return; }
    setPracticePhase("recording");
  };

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
    if (timerRef.current) clearTimeout(timerRef.current);
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

  const finishSentence = (fromIdx?: number) => {
    const idx = fromIdx ?? currentIdx;
    const newRepeat = repeatDone + 1;
    if (newRepeat < repeatTarget) {
      // Repeat: play same sentence again
      setRepeatDone(newRepeat);
      setPracticePhase("idle");
      playerRef.current?.seekTo?.(sentences[idx].start, true);
      playerRef.current?.playVideo?.();
    } else {
      // Move to next
      setRepeatDone(0);
      setCompletedCount((c) => c + 1);
      setPracticePhase("idle");
      if (idx + 1 < sentences.length) {
        playerRef.current?.seekTo?.(sentences[idx + 1].start, true);
        playerRef.current?.playVideo?.();
      } else {
        checkCompletion();
      }
    }
  };

  const checkCompletion = () => {
    const scored = Object.keys(scores).length;
    if (scored >= sentences.length && scored > 0) setPracticePhase("done");
  };

  const seekToSentence = (idx: number) => {
    setCurrentIdx(idx); setPracticePhase("idle"); setRepeatDone(0);
    playerRef.current?.seekTo?.(sentences[idx].start, true);
    playerRef.current?.playVideo?.();
  };

  const togglePlay = () => { isPlaying ? playerRef.current?.pauseVideo?.() : playerRef.current?.playVideo?.(); };
  const changeSpeed = (s: number) => { setSpeed(s); playerRef.current?.setPlaybackRate?.(s); };
  const toggleMute = (idx: number) => setMutedSentences((s) => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  // ── Video select screen ──
  if (!videoId) {
    const vid = extractVideoId(ytUrl);
    return (
      <Wrapper onBack={onBackHome}>
        <Card><CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-black flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Shadowing</h2>
          <p className="text-sm font-semibold text-muted-foreground">Chọn video để luyện nghe & đọc theo</p>
          <input className="w-full rounded-xl border-2 border-border px-3 py-2.5 text-sm font-bold outline-none focus:border-primary"
            placeholder="Dán link YouTube..." value={ytUrl} onChange={(e) => { setYtUrl(e.target.value); setError(""); setPasteMode(false); }} />
          {vid && (<>
            <div className="aspect-video w-full overflow-hidden rounded-xl"><iframe src={`https://www.youtube.com/embed/${vid}`} className="h-full w-full" allowFullScreen /></div>
            {!loading && !pasteMode && <Button type="button" onClick={() => loadCaptions(vid)} className="w-full"><Play className="h-4 w-4" /> Lấy subtitle</Button>}
            {loading && <p className="text-center text-sm font-bold text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Đang tải...</p>}
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            {pasteMode && (<div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">YouTube → ⋮ → Open transcript → copy paste:</p>
              <textarea className="w-full rounded-xl border-2 border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary h-28 resize-none"
                placeholder={"Hello, my name is Dee Dee.\nWhat is your name?"} value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
              <Button type="button" onClick={() => applyPaste(vid)} disabled={!pasteText.trim()} className="w-full"><CheckCircle2 className="h-4 w-4" /> Dùng subtitle</Button>
            </div>)}
            {!loading && !pasteMode && <button type="button" onClick={() => setPasteMode(true)} className="w-full text-center text-xs font-bold text-primary underline">Dán subtitle thủ công</button>}
          </>)}
          {/* Danh sách video — luôn hiện */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              <button type="button" onClick={() => setFilterLevel("")} className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", !filterLevel ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Tất cả</button>
              {LEVELS.map((l) => <button key={l} type="button" onClick={() => setFilterLevel(l)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", filterLevel === l ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{l}</button>)}
            </div>
            <div className="flex flex-wrap gap-1">
              <button type="button" onClick={() => setFilterTopic("")} className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", !filterTopic ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>Tất cả</button>
              {TOPICS.map((t) => <button key={t} type="button" onClick={() => setFilterTopic(t)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", filterTopic === t ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{t}</button>)}
            </div>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto">
              <p className="text-[10px] font-bold text-muted-foreground">{filteredVideos.length} video</p>
              {filteredVideos.map((v) => (
                <button key={v.id} type="button" onClick={() => setYtUrl(`https://youtube.com/watch?v=${v.id}`)}
                  className={cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                    extractVideoId(ytUrl) === v.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted")}>
                  <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold",
                    v.level === "A1" ? "bg-green-100 text-green-700" : v.level === "A2" ? "bg-blue-100 text-blue-700" :
                    v.level === "B1" ? "bg-purple-100 text-purple-700" : v.level === "B2" ? "bg-orange-100 text-orange-700" :
                    v.level === "C1" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700")}>{v.level}</span>
                  <span className="shrink-0 rounded bg-muted px-1 py-0.5 text-[9px] font-bold text-muted-foreground">{v.topic}</span>
                  <span className="text-xs font-bold truncate">{v.title}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent></Card>
      </Wrapper>
    );
  }

  // ── Completion screen ──
  if (practicePhase === "done") {
    const allScores = Object.values(scores);
    const shadowScores = allScores.filter((s) => s.mode === "shadow");
    const dictScores = allScores.filter((s) => s.mode === "dictation");
    const avg = shadowScores.length > 0 ? Math.round(shadowScores.reduce((a, b) => a + b.score, 0) / shadowScores.length) : 0;
    const xp = allScores.length * 2;
    return (
      <Wrapper onBack={onBackHome}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-success px-6 py-6 text-center text-white">
            <PartyPopper className="mx-auto h-10 w-10 mb-2" />
            <h2 className="text-2xl font-black">Hoàn thành bài!</h2>
            <p className="text-lg font-extrabold">+{xp} XP</p>
          </div>
          <CardContent className="p-5 space-y-3">
            {shadowScores.length > 0 && (
              <div className="flex items-center gap-4 justify-center">
                <ScoreRing score={avg} size={72} />
                <div><p className="font-extrabold">Phát âm: {avg}%</p><p className="text-sm text-muted-foreground">{shadowScores.filter((s) => s.score >= SPEAK_PASS).length}/{shadowScores.length} đạt</p></div>
              </div>
            )}
            {dictScores.length > 0 && <p className="text-center font-extrabold">Dictation: {dictScores.filter((s) => s.score === 100).length}/{dictScores.length} đúng</p>}
            <div className="max-h-40 overflow-y-auto space-y-1">
              {sentences.map((s, i) => {
                const sc = scores[i];
                return (<div key={i} className="flex items-center justify-between rounded-lg px-2 py-1 text-sm">
                  <span className="font-bold truncate flex-1">{s.text}</span>
                  {sc && <span className={cn("shrink-0 font-black ml-2", sc.score >= SPEAK_PASS ? "text-success" : "text-red-600")}>
                    {sc.mode === "dictation" ? (sc.score === 100 ? "✓" : "✗") : `${sc.score}%`}
                  </span>}
                </div>);
              })}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setScores({}); setCompletedCount(0); setPracticePhase("idle"); seekToSentence(0); }}><RotateCcw className="h-4 w-4" /> Luyện lại</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setVideoId(""); setYtUrl(""); setSentences([]); setCurrentIdx(-1); setPracticePhase("idle"); setScores({}); setMutedSentences(new Set()); playerRef.current?.destroy?.(); playerRef.current = null; }}><Video className="h-4 w-4" /> Đổi video</Button>
              <Button type="button" className="flex-1" onClick={onBackHome}><Trophy className="h-4 w-4" /> Xong</Button>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // ── Practice screen ──
  const activeSent = currentIdx >= 0 ? sentences[currentIdx] : null;

  return (
    <Wrapper onBack={() => { setVideoId(""); setYtUrl(""); setSentences([]); setCurrentIdx(-1); setPracticePhase("idle"); setScores({}); setMutedSentences(new Set()); playerRef.current?.destroy?.(); playerRef.current = null; }}>
      <div className="aspect-video w-full overflow-hidden rounded-xl mb-2"><div ref={playerDivRef} className="h-full w-full" /></div>

      {/* Controls row 1: play/nav + speed */}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => currentIdx > 0 && seekToSentence(currentIdx - 1)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={togglePlay} className="rounded-full bg-primary p-1.5 text-white shadow-sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => currentIdx < sentences.length - 1 && seekToSentence(currentIdx + 1)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          <span className="text-[10px] font-extrabold text-muted-foreground ml-1">{Math.max(0, currentIdx + 1)}/{sentences.length}</span>
          <button type="button" onClick={() => { setVideoId(""); setYtUrl(""); setSentences([]); setCurrentIdx(-1); setPracticePhase("idle"); setScores({}); setMutedSentences(new Set()); playerRef.current?.destroy?.(); playerRef.current = null; }}
            className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-extrabold text-muted-foreground hover:text-primary"><Video className="inline h-3 w-3" /> Chọn video</button>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
          {SPEEDS.map((s) => (<button key={s} type="button" onClick={() => changeSpeed(s)}
            className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", speed === s ? "bg-primary text-white" : "text-muted-foreground")}>{s}×</button>))}
        </div>
      </div>

      {/* Controls row 2: mode + wait + repeat + IPA */}
      <div className="mb-2 flex items-center justify-between flex-wrap gap-1">
        <div className="flex gap-0.5 rounded-xl bg-muted p-0.5">
          <ModeBtn active={practiceMode === "shadow"} onClick={() => setPracticeMode("shadow")}><Mic className="h-3 w-3" /> Shadow</ModeBtn>
          <ModeBtn active={practiceMode === "dictation"} onClick={() => setPracticeMode("dictation")}><Keyboard className="h-3 w-3" /> Dict</ModeBtn>
          <ModeBtn active={practiceMode === "dubbing"} onClick={() => { setPracticeMode("dubbing"); setWaitMode("off"); }}><VolumeX className="h-3 w-3" /> Dub</ModeBtn>
        </div>
        <div className="flex items-center gap-1">
          {practiceMode !== "dubbing" && <>
            <Clock className="h-3 w-3 text-muted-foreground" />
            {(["off", "3s", "5s", "manual"] as WaitMode[]).map((w) => (
              <button key={w} type="button" onClick={() => setWaitMode(w)}
                className={cn("rounded-md px-1 py-0.5 text-[9px] font-extrabold", waitMode === w ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{WAIT_LABELS[w]}</button>
            ))}
          </>}
          <div className="flex items-center gap-0.5 ml-1">
            <Repeat className="h-3 w-3 text-muted-foreground" />
            {[1, 2, 3, 5].map((r) => (
              <button key={r} type="button" onClick={() => setRepeatTarget(r)}
                className={cn("rounded-md px-1 py-0.5 text-[9px] font-extrabold", repeatTarget === r ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{r}×</button>
            ))}
          </div>
          <button type="button" onClick={() => setShowIpa(!showIpa)}
            className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-extrabold ml-0.5", showIpa ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>IPA</button>
        </div>
      </div>

      {/* Current sentence — click word to lookup */}
      {activeSent && (() => {
        const words = activeSent.text.split(/(\s+)/);
        const ipaLine = showIpa ? words.map((w) => {
          const clean = w.toLowerCase().replace(/[^a-z'-]/g, "");
          if (!clean) return w; // punctuation/space
          return ipaMap[clean] || COMMON_IPA[clean] || clean;
        }).join("") : "";
        return (
          <div className={cn("mb-2 rounded-xl px-4 py-2.5 text-center transition-all", practicePhase !== "idle" ? "bg-primary/10 border border-primary/30" : "bg-muted")}>
            <p className="text-lg font-black leading-relaxed">
              {words.map((w, i) => /[a-zA-Z]/.test(w) ? (
                <button key={i} type="button" onClick={() => lookupWordFn(w)}
                  className="hover:text-primary hover:underline transition-colors">{w}</button>
              ) : <span key={i}>{w}</span>)}
            </p>
            {showIpa && ipaLine && <p className="text-xs font-semibold text-muted-foreground mt-1">{ipaLine}</p>}
            {repeatTarget > 1 && <p className="text-[10px] font-bold text-muted-foreground">Lần {repeatDone + 1}/{repeatTarget}</p>}
          </div>
        );
      })()}

      {/* Word lookup popup */}
      {lookupWord && (
        <Card className="mb-2 border-primary/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-black">{lookupWord}</span>
              <button type="button" onClick={() => { setLookupWord(null); setLookupResult(null); }} className="text-muted-foreground text-xs">✕</button>
            </div>
            {lookupLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            {lookupResult && lookupResult.vi && (
              <div className="space-y-1">
                {lookupResult.phonetic && <p className="text-xs font-semibold text-muted-foreground">{lookupResult.phonetic}</p>}
                {lookupResult.vi.map((v: string, i: number) => <p key={i} className="text-sm font-bold text-primary">{v}</p>)}
                {lookupResult.example && <p className="text-xs font-semibold text-muted-foreground italic">"{lookupResult.example}"</p>}
                {lookupResult.example_vi && <p className="text-xs font-semibold text-muted-foreground">→ {lookupResult.example_vi}</p>}
                {lookupResult.meaning_en && !lookupResult.example && <p className="text-xs text-muted-foreground">{lookupResult.meaning_en}</p>}
                {lookupResult.examples?.slice(0, 1).map((ex: any, i: number) => (
                  <p key={i} className="text-xs font-semibold text-muted-foreground italic">"{ex.en}" — {ex.vi}</p>
                ))}
              </div>
            )}
            {lookupResult && !lookupResult.vi && <p className="text-xs text-muted-foreground">Không tìm thấy</p>}
          </CardContent>
        </Card>
      )}

      {/* Practice area */}
      {practicePhase !== "idle" && (
        <Card className="mb-2"><CardContent className="p-3 space-y-2">
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
              onContinue={() => finishSentence()}
              onSkip={() => finishSentence()} />
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
                <Button type="button" size="sm" onClick={() => finishSentence()}>Tiếp</Button>
              </div>
            </div>
          )}
        </CardContent></Card>
      )}

      {/* Transcript */}
      <div ref={listRef} className="space-y-0.5 rounded-2xl border border-border p-1 max-h-[30vh] overflow-y-auto">
        {sentences.map((s, i) => {
          const isActive = i === currentIdx;
          const sc = scores[i];
          const isMuted = mutedSentences.has(i);
          return (
            <div key={i} className={cn("flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all",
              isActive ? "bg-primary/15 border border-primary/30" : "hover:bg-muted")}>
              {practiceMode === "dubbing" && (
                <button type="button" onClick={() => toggleMute(i)} className={cn("shrink-0 rounded p-0.5", isMuted ? "text-red-500" : "text-muted-foreground")}>
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </button>
              )}
              <button type="button" onClick={() => seekToSentence(i)} className="flex-1 text-left min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground mr-1">{Math.floor(s.start / 60)}:{String(Math.floor(s.start % 60)).padStart(2, "0")}</span>
                <span className={cn("text-sm", isActive ? "font-black text-primary" : "font-bold", isMuted ? "text-red-400" : "")}>{s.text}</span>
              </button>
              {sc && <span className={cn("shrink-0 text-xs font-black", sc.score >= SPEAK_PASS ? "text-success" : "text-red-600")}>
                {sc.mode === "dictation" ? (sc.score === 100 ? "✓" : "✗") : `${sc.score}%`}
              </span>}
              {isActive && isPlaying && <Volume2 className="h-3 w-3 text-primary animate-pulse shrink-0" />}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const color = score >= SPEAK_PASS ? "text-success" : "text-red-600";
  return (<div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className={color} strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
    </svg>
    <span className={cn("absolute text-lg font-black", color)}>{score}%</span>
  </div>);
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-extrabold transition-colors", active ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>{children}</button>;
}

function Wrapper({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return <main className="mx-auto w-full max-w-xl px-4"><SessionHeader title="Shadowing" onClose={onBack} />{children}</main>;
}
