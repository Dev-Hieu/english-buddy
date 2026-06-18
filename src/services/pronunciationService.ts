// Gọi microservice tự host chấm phát âm theo từng âm (IPA).
const BASE: string = import.meta.env.VITE_SPEECH_EVAL_URL ?? "http://localhost:8788";

export interface Phone {
  ipa: string;
  ok: boolean;
}
export interface PronResult {
  score: number; // 0..100 — % âm đúng
  phones: Phone[]; // từng âm chuẩn + đúng/sai
  heard: string; // chuỗi âm model nghe được
}

export async function assessPronunciation(wav: Blob, ipa: string): Promise<PronResult> {
  const fd = new FormData();
  fd.append("audio", wav, "rec.wav");
  fd.append("ipa", ipa);
  const res = await fetch(`${BASE}/pronounce`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("pronounce failed");
  return res.json() as Promise<PronResult>;
}

export const SPEECH_EVAL_URL = BASE;
