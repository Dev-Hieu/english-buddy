// Lấy ảnh Pexels cho seed words còn THIẾU ảnh (incremental) -> ghi src/data/seedImages.ts.
// Chạy: cd server && npx tsx src/fetchImages.ts [maxCount]
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";
import { IMAGE_URLS } from "../../src/data/seedImages";

const KEY = process.env.PEXELS_KEY || "";
if (!KEY) {
  console.error("Thiếu PEXELS_KEY trong server/.env");
  process.exit(1);
}
const MAX = Number(process.argv[2] || 250); // giới hạn mỗi lần chạy (tránh rate-limit Pexels)

async function fetchOne(q: string): Promise<string> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=square`;
  const r = await fetch(url, { headers: { Authorization: KEY } });
  if (!r.ok) return "";
  const d: any = await r.json();
  return d.photos?.[0]?.src?.medium ?? "";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const map: Record<string, string> = { ...IMAGE_URLS };
  const missing = SEED_VOCABULARY.filter((w) => !map[w.id] && !w.word.includes(" "));
  console.log(`Tổng ${SEED_VOCABULARY.length} từ; thiếu ảnh: ${missing.length}; lấy tối đa ${MAX} lần này.`);

  let got = 0, miss = 0;
  for (const w of missing.slice(0, MAX)) {
    const u = await fetchOne(w.word);
    if (u) { map[w.id] = u; got++; } else miss++;
    await sleep(120); // nhẹ tay với Pexels
  }

  const dir = path.dirname(fileURLToPath(import.meta.url));
  const out = path.join(dir, "..", "..", "src", "data", "seedImages.ts");
  const body = `// Ảnh minh họa cho seed words — chỉnh qua /picker hoặc sửa tay (C-002).
export const IMAGE_URLS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
  writeFileSync(out, body);
  console.log(`Xong: +${got} ảnh (miss ${miss}). Còn thiếu: ${Math.max(0, missing.length - MAX)} (chạy lại để lấy tiếp).`);
}

main();
