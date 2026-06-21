// Phát âm — TECH_SPEC §7.4 / DECISIONS D-006, D-019.
// Thứ tự cho tự nhiên nhất: (1) audioUrl người thật -> (2) Piper TTS tự host (/tts, có cache)
// -> (3) Web Speech trình duyệt. Tôn trọng tùy chọn giọng: vùng (Anh-Mỹ/Anh-Anh) × giới × tốc độ.
import { getVoicePrefs, LENGTH_SCALE, WEB_RATE, voiceKey, langOf, type Gender } from "./voicePrefs";

const TTS_BASE: string = import.meta.env.VITE_TTS_URL ?? ""; // same-origin /tts (Caddy/vite proxy)
let ttsOk: boolean | null = null; // null = chưa dò; true/false = đã biết dịch vụ có chạy không
let current: HTMLAudioElement | null = null; // để dừng câu đang phát

function stopAudio() {
  if (current) { current.pause(); current = null; }
}

function playUrl(url: string, revoke = false): Promise<void> {
  stopAudio();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  const a = new Audio(url);
  current = a;
  if (revoke) a.onended = () => URL.revokeObjectURL(url);
  return a.play();
}

// ── (A) Web Speech: chọn giọng tiếng Anh theo vùng + giới, tự nhiên nhất có trên máy ──
const FEMALE = /(female|samantha|victoria|karen|moira|tessa|fiona|serena|susan|hazel|zira|amy|jenny|martha|libby|sonia|aria)/i;
const MALE = /(\bmale\b|daniel|alex|david|fred|oliver|james|george|arthur|ryan|guy|aaron|gordon|tom)/i;
const NICE = /(google|natural|online|siri|premium|enhanced)/i;

function pickWebVoice(lang: string, gender: Gender): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const lp = lang.toLowerCase();
  const byLang = voices.filter((v) => v.lang?.toLowerCase().startsWith(lp));
  const pool = byLang.length ? byLang : voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const want = gender === "male" ? MALE : FEMALE;
  return pool.find((v) => want.test(v.name)) || pool.find((v) => NICE.test(v.name)) || pool[0] || null;
}

function speakWithWebSpeech(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const p = getVoicePrefs();
  const lang = langOf(p.accent);
  const u = new SpeechSynthesisUtterance(text);
  const v = pickWebVoice(lang, p.gender);
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = lang; }
  u.rate = WEB_RATE[p.rate];
  u.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ── (D) Piper TTS tự host. Trả true nếu phát được; nhớ trạng thái để khỏi gọi lại khi dịch vụ tắt ──
async function speakWithPiper(text: string): Promise<boolean> {
  if (ttsOk === false) return false;
  const p = getVoicePrefs();
  const url = `${TTS_BASE}/tts?text=${encodeURIComponent(text)}&voice=${voiceKey(p)}&ls=${LENGTH_SCALE[p.rate]}`;
  try {
    const res = await fetch(url);
    if (!res.ok) { ttsOk = false; return false; }
    ttsOk = true;
    await playUrl(URL.createObjectURL(await res.blob()), true);
    return true;
  } catch {
    ttsOk = false;
    return false;
  }
}

export function speakText(text: string, audioUrl?: string): void {
  const clean = (text || "").trim();
  if (!clean && !audioUrl) return;
  if (audioUrl) {
    playUrl(audioUrl).catch(() => fallbackSpeak(clean));
    return;
  }
  fallbackSpeak(clean);
}

// Piper trước, không được thì Web Speech.
function fallbackSpeak(text: string): void {
  speakWithPiper(text).then((ok) => { if (!ok) speakWithWebSpeech(text); });
}
