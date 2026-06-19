/** Rà ngữ pháp: kiểm đáp án + giải thích từng bài tập theo chuẩn (DeepSeek). Ghi grammar-audit.json. */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GRAMMAR_TOPICS } from "../../src/data/grammar";

const KEY = process.env.DEEPSEEK_API_KEY || "";
if (!KEY) { console.error("Thiếu DEEPSEEK_API_KEY"); process.exit(1); }
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const OUT = path.resolve(fileURLToPath(import.meta.url), "../../grammar-audit.json");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYS = [
  "You are an English grammar expert. For each grammar exercise, verify:",
  "1) the marked answer is grammatically correct and is the BEST answer to the question;",
  "2) for 'choice', the answer is among options; for 'reorder', the answer is a valid sentence using the given words.",
  'Return {"issues":[...]} with ONLY problematic exercises:',
  '{"topicId":"...","exerciseId":"...","problem":"...","suggestedAnswer":"..."}. If all correct return {"issues":[]}. JSON only.',
].join(" ");

async function checkTopic(t: any) {
  const payload = { topicId: t.id, title: t.title, exercises: t.exercises.map((e: any) => ({ id: e.id, type: e.type, question: e.question, options: e.options, answer: e.answer })) };
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, temperature: 0, max_tokens: 1500, response_format: { type: "json_object" },
      messages: [{ role: "system", content: SYS }, { role: "user", content: JSON.stringify(payload) }] }),
  });
  if (!r.ok) return [];
  try { const d: any = await r.json(); const p = JSON.parse(d.choices?.[0]?.message?.content || "{}"); return p.issues || []; } catch { return []; }
}

async function main() {
  console.log(`Rà ${GRAMMAR_TOPICS.length} chủ đề ngữ pháp...`);
  const issues: any[] = [];
  for (const t of GRAMMAR_TOPICS) {
    issues.push(...(await checkTopic(t)));
    writeFileSync(OUT, JSON.stringify(issues, null, 2));
    await sleep(300);
  }
  console.log(`Xong: ${issues.length} vấn đề -> ${OUT}`);
}
main();
