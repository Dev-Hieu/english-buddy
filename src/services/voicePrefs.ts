// Tùy chọn giọng đọc (lưu localStorage): Vùng (Anh-Mỹ/Anh-Anh) × Giới (Nữ/Nam) × Tốc độ.
export type Accent = "us" | "gb";
export type Gender = "female" | "male";
export type Rate = "slow" | "normal" | "fast";

export interface VoicePrefs { accent: Accent; gender: Gender; rate: Rate }

const KEY = "eb:voice";
const DEFAULT: VoicePrefs = { accent: "us", gender: "female", rate: "normal" };

export function getVoicePrefs(): VoicePrefs {
  if (typeof localStorage === "undefined") return DEFAULT;
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return DEFAULT; }
}

export function setVoicePrefs(p: Partial<VoicePrefs>): VoicePrefs {
  const next = { ...getVoicePrefs(), ...p };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* bỏ qua */ }
  return next;
}

// Piper: length-scale (>1 chậm hơn). Web Speech: rate (1 = thường).
export const LENGTH_SCALE: Record<Rate, number> = { slow: 1.3, normal: 1.0, fast: 0.82 };
export const WEB_RATE: Record<Rate, number> = { slow: 0.8, normal: 0.95, fast: 1.12 };
export const voiceKey = (p: VoicePrefs) => `${p.accent}-${p.gender}`;
export const langOf = (a: Accent) => (a === "gb" ? "en-GB" : "en-US");
