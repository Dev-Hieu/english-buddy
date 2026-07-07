// Phát âm — TECH_SPEC §7.4 / DECISIONS D-006, D-019.
// Thứ tự cho tự nhiên nhất: (1) audioUrl người thật -> (2) Piper TTS tự host (/tts, có cache)
// -> (3) Web Speech trình duyệt. Tôn trọng tùy chọn giọng: vùng (Anh-Mỹ/Anh-Anh) × giới × tốc độ.
import { getVoicePrefs, LENGTH_SCALE, WEB_RATE, voiceKey, langOf, type Gender } from "./voicePrefs";

const TTS_BASE: string = import.meta.env.VITE_TTS_URL ?? ""; // same-origin /tts (Caddy/vite proxy)
let ttsFailCount = 0; // đếm lỗi liên tiếp, reset khi thành công
const TTS_MAX_FAILS = 3; // sau 3 lỗi liên tiếp mới tạm dừng thử Piper
let ttsBackoffUntil = 0; // timestamp cho phép thử lại sau khi tạm dừng
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

// ── (D) Piper TTS tự host. Dùng URL trực tiếp (không blob) để tương thích mobile tốt hơn ──
async function speakWithPiper(text: string): Promise<boolean> {
  if (ttsFailCount >= TTS_MAX_FAILS && Date.now() < ttsBackoffUntil) return false;
  const p = getVoicePrefs();
  const url = `${TTS_BASE}/tts?text=${encodeURIComponent(text)}&voice=${voiceKey(p)}&ls=${LENGTH_SCALE[p.rate]}&v=5`;
  try {
    // Dùng URL trực tiếp thay vì fetch+blob — tránh lỗi decode trên mobile
    await playUrl(url);
    ttsFailCount = 0;
    return true;
  } catch {
    ttsFailCount++;
    ttsBackoffUntil = Date.now() + 30_000;
    return false;
  }
}

// Phát với tốc độ tuỳ chỉnh (1.0 = bình thường). Trả Promise resolve khi phát xong.
export function speakTextWithSpeed(text: string, speed: number = 1.0): Promise<void> {
  const clean = (text || "").trim();
  if (!clean) return Promise.resolve();
  const p = getVoicePrefs();
  const ls = Math.max(0.5, Math.min(2.0, (LENGTH_SCALE[p.rate] || 1.0) / speed));
  const url = `${TTS_BASE}/tts?text=${encodeURIComponent(clean)}&voice=${voiceKey(p)}&ls=${ls}&v=5`;
  return playUrl(url).catch(() => {
    // Fallback Web Speech
    return new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(clean);
      const lang = langOf(p.accent);
      const v = pickWebVoice(lang, p.gender);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = lang; }
      u.rate = (WEB_RATE[p.rate] || 1) * speed;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    });
  });
}

export function speakText(text: string, _audioUrl?: string): void {
  const clean = (text || "").trim();
  if (!clean) return;
  // Luôn dùng Edge TTS (chất lượng cao, đồng nhất) — bỏ qua dictionary audioUrl (chất lượng thấp).
  fallbackSpeak(clean);
}

// Piper trước, không được thì Web Speech.
function fallbackSpeak(text: string): void {
  speakWithPiper(text).then((ok) => { if (!ok) speakWithWebSpeech(text); });
}
