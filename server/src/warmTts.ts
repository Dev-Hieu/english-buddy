/**
 * Warm cache TTS: tổng hợp sẵn âm thanh các từ để phát NHANH ngay lần đầu (không trễ tổng hợp).
 * Chạy:  cd server && npm run warm:tts        (sau khi dịch vụ tts đã chạy)
 * Tùy chỉnh qua env:
 *   TTS_URL=http://localhost:8789
 *   WARM_VOICES=us-female[,us-male,gb-female,gb-male]   (mặc định chỉ giọng mặc định)
 *   WARM_RATES=normal[,slow,fast]                       (mặc định chỉ tốc độ vừa)
 *   WARM_EXAMPLES=1   (warm thêm câu ví dụ)             WARM_CONC=4 (số luồng)
 */
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";

const TTS = process.env.TTS_URL || "http://localhost:8789";
const VOICES = (process.env.WARM_VOICES || "us-female").split(",").map((s) => s.trim()).filter(Boolean);
const RATES = (process.env.WARM_RATES || "normal").split(",").map((s) => s.trim()).filter(Boolean);
const LS: Record<string, number> = { slow: 1.3, normal: 1.0, fast: 0.82 };
const CONC = Math.max(1, Number(process.env.WARM_CONC || 4));
const INCLUDE_EXAMPLES = process.env.WARM_EXAMPLES === "1";

async function main() {
  try { if (!(await fetch(`${TTS}/health`)).ok) throw new Error("down"); }
  catch { console.error(`Dịch vụ TTS chưa chạy ở ${TTS} — bỏ warm.`); return; }

  const texts = new Set<string>();
  for (const w of SEED_VOCABULARY) {
    if (w.word) texts.add(w.word);
    if (INCLUDE_EXAMPLES && w.example) texts.add(w.example);
  }
  const tasks: { text: string; voice: string; ls: number }[] = [];
  for (const text of texts) for (const v of VOICES) for (const r of RATES) tasks.push({ text, voice: v, ls: LS[r] ?? 1 });
  console.log(`Warm ${tasks.length} mục (texts ${texts.size} × voices ${VOICES.length} × rates ${RATES.length}) -> ${TTS}`);

  let i = 0, done = 0;
  async function worker() {
    while (i < tasks.length) {
      const t = tasks[i++];
      try { await fetch(`${TTS}/tts?text=${encodeURIComponent(t.text)}&voice=${t.voice}&ls=${t.ls}`); } catch { /* bỏ qua */ }
      if (++done % 200 === 0) console.log(`  ${done}/${tasks.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log(`Xong warm ${done} mục.`);
}
main();
