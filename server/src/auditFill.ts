/** Lấp loại từ (+sửa) cho các từ CHƯA có pos. Ghi audit-report-fill.json. */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";

const KEY = process.env.DEEPSEEK_API_KEY || "";
if (!KEY) { console.error("Thiếu DEEPSEEK_API_KEY"); process.exit(1); }
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const OUT = path.resolve(fileURLToPath(import.meta.url), "../../audit-report-fill.json");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYS = [
  "You are an expert English lexicographer. For EACH input word return one object",
  '{"id":"...","pos":"<loại từ tiếng Việt>","fixes":{...}} in {"items":[...]}.',
  "pos ALWAYS, one of: danh từ, động từ, tính từ, trạng từ, giới từ, đại từ, liên từ, thán từ, mạo từ, số từ.",
  "fixes only when wrong: phonetic (British /.../), meaning_vi, level (kids|a1|a2|b1|b2|c1). JSON only.",
].join(" ");

async function batch(items: any[]) {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, temperature: 0, max_tokens: 2000, response_format: { type: "json_object" },
      messages: [{ role: "system", content: SYS }, { role: "user", content: `Audit:\n${JSON.stringify(items)}` }] }),
  });
  if (!r.ok) return [];
  try { const d: any = await r.json(); const p = JSON.parse(d.choices?.[0]?.message?.content || "{}"); return p.items || []; } catch { return []; }
}

async function main() {
  const missing = SEED_VOCABULARY.filter((w) => !w.pos);
  console.log(`Lấp loại từ cho ${missing.length} từ...`);
  const out: any[] = [];
  for (let i = 0; i < missing.length; i += 20) {
    const b = missing.slice(i, i + 20).map((w) => ({ id: w.id, word: w.word, phonetic: w.phonetic, meaning_vi: w.meaning_vi, level: w.level }));
    out.push(...(await batch(b)));
    writeFileSync(OUT, JSON.stringify(out, null, 2));
    await sleep(300);
  }
  console.log(`Xong: ${out.length} mục -> ${OUT}`);
}
main();
