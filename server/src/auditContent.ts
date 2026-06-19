/**
 * Rà từ vựng theo chuẩn từ điển quốc tế bằng DeepSeek (Oxford 3000/5000, Cambridge EVP).
 * Kiểm: IPA (British), nghĩa tiếng Việt, và cấp CEFR. Xuất BÁO CÁO sửa (không tự sửa file).
 *
 * Chạy:  cd server && DEEPSEEK_API_KEY=... ./node_modules/.bin/tsx src/auditContent.ts [start] [count]
 * Kết quả: ghi server/audit-report.json (mảng {id, word, fixes:{ipa?,meaning_vi?,level?}, note}).
 */
import "dotenv/config";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";

const KEY = process.env.DEEPSEEK_API_KEY || "";
if (!KEY) { console.error("Thiếu DEEPSEEK_API_KEY trong server/.env"); process.exit(1); }
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const START = Number(process.argv[2] || 0);
const COUNT = Number(process.argv[3] || SEED_VOCABULARY.length);
const BATCH = 20;
const OUT = path.resolve(fileURLToPath(import.meta.url), "../../audit-report.json");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYS = [
  "You are an expert English lexicographer. Audit each vocabulary item against the Oxford Learner's Dictionary,",
  "Cambridge Dictionary, the Oxford 3000/5000 and the Cambridge English Vocabulary Profile (EVP).",
  "Return a JSON object {\"items\":[...]} with EXACTLY ONE object per input word:",
  '{"id":"...","pos":"<loại từ tiếng Việt>","fixes":{...}}',
  "- pos: ALWAYS provide the part of speech IN VIETNAMESE for the word's main sense, one of:",
  "  danh từ, động từ, tính từ, trạng từ, giới từ, đại từ, liên từ, thán từ, mạo từ, số từ.",
  "- fixes: include a field ONLY if the current value is wrong; omit fixes entirely if all correct. Fields:",
  "  phonetic (correct British IPA wrapped in /.../), meaning_vi (correct natural Vietnamese meaning),",
  "  level (correct CEFR: kids|a1|a2|b1|b2|c1; 'kids'=very basic concrete words for young children).",
  "JSON only, no prose.",
].join(" ");

async function auditBatch(items: any[]): Promise<any[]> {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL, temperature: 0, max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYS },
        { role: "user", content: `Audit these:\n${JSON.stringify(items)}` },
      ],
    }),
  });
  if (!r.ok) { console.warn(`  batch lỗi ${r.status}`); return []; }
  const data: any = await r.json();
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return Array.isArray(parsed) ? parsed : (parsed.items || parsed.corrections || []);
  } catch { return []; }
}

async function main() {
  const slice = SEED_VOCABULARY.slice(START, START + COUNT);
  const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
  const fixes: any[] = [...prev];
  console.log(`Rà ${slice.length} từ (từ ${START}), batch ${BATCH}...`);
  for (let i = 0; i < slice.length; i += BATCH) {
    const batch = slice.slice(i, i + BATCH).map((w) => ({ id: w.id, word: w.word, phonetic: w.phonetic, meaning_vi: w.meaning_vi, level: w.level }));
    const got = await auditBatch(batch);
    fixes.push(...got);
    writeFileSync(OUT, JSON.stringify(fixes, null, 2));
    console.log(`  ${START + i + batch.length}/${START + slice.length} | tổng đề xuất sửa: ${fixes.length}`);
    await sleep(400);
  }
  console.log(`Xong. Báo cáo: ${OUT} (${fixes.length} mục cần sửa).`);
}
main();
