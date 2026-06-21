// Phát âm — TECH_SPEC §7.4 / DECISIONS D-006.
// Thứ tự ưu tiên cho tự nhiên nhất:
//   1) audioUrl (giọng người thật từ từ điển) nếu có.
//   2) TTS neural tự host (Piper qua /tts, có cache) nếu dịch vụ chạy.
//   3) Web Speech của trình duyệt (chọn giọng tốt nhất + tốc độ chậm vừa cho bé).

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

// ── (A) Web Speech: chọn giọng tiếng Anh tự nhiên nhất có trên máy ──
let cachedVoice: SpeechSynthesisVoice | null | undefined; // undefined = chưa tính
const PREFER = [/google us english/i, /natural/i, /samantha/i, /\baaron\b/i, /microsoft.*online/i, /siri/i];

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // giọng load bất đồng bộ -> để 'voiceschanged' tính lại
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  let best: SpeechSynthesisVoice | undefined;
  for (const re of PREFER) { best = en.find((v) => re.test(v.name)); if (best) break; }
  cachedVoice = best || en.find((v) => v.lang?.toLowerCase() === "en-us") || en[0] || null;
  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = undefined; };
}

function speakWithWebSpeech(text: string, lang: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = lang; }
  u.rate = 0.92; // chậm vừa phải -> rõ ràng, dễ nghe cho trẻ
  u.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ── (D) TTS neural tự host (Piper). Trả true nếu phát được; nhớ trạng thái để khỏi gọi lại khi tắt ──
async function speakWithPiper(text: string): Promise<boolean> {
  if (ttsOk === false) return false;
  try {
    const res = await fetch(`${TTS_BASE}/tts?text=${encodeURIComponent(text)}`);
    if (!res.ok) { ttsOk = false; return false; }
    ttsOk = true;
    await playUrl(URL.createObjectURL(await res.blob()), true);
    return true;
  } catch {
    ttsOk = false;
    return false;
  }
}

export function speakText(text: string, audioUrl?: string, lang = "en-US"): void {
  const clean = (text || "").trim();
  if (!clean && !audioUrl) return;
  if (audioUrl) {
    playUrl(audioUrl).catch(() => fallbackSpeak(clean, lang));
    return;
  }
  fallbackSpeak(clean, lang);
}

// Piper trước, không được thì Web Speech.
function fallbackSpeak(text: string, lang: string): void {
  speakWithPiper(text).then((ok) => { if (!ok) speakWithWebSpeech(text, lang); });
}
