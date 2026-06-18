// Lấy ảnh minh họa từ Pexels cho seed words -> ghi src/data/seedImages.ts.
// Chạy 1 lần: cd server && npx tsx src/fetchImages.ts
import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";

const KEY = process.env.PEXELS_KEY || "";
if (!KEY) {
  console.error("Thiếu PEXELS_KEY trong server/.env");
  process.exit(1);
}

async function fetchOne(q: string): Promise<string> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=square`;
  const r = await fetch(url, { headers: { Authorization: KEY } });
  if (!r.ok) return "";
  const d: any = await r.json();
  return d.photos?.[0]?.src?.medium ?? "";
}

const map: Record<string, string> = {};
let miss = 0;
for (const w of SEED_VOCABULARY) {
  const u = await fetchOne(w.word);
  map[w.id] = u;
  if (!u) miss++;
  console.log(`${w.word.padEnd(14)} ${u ? "ok" : "MISS"}`);
}

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, "..", "..", "src", "data", "seedImages.ts");
const body = `// Ảnh minh họa cho seed words — lấy tự động từ Pexels (review/đổi tay khi cần, C-002).
// Đổi 1 URL ở đây để thay ảnh cho 1 từ; key = word id. Rỗng -> WordCard hiện placeholder chữ cái.
export const IMAGE_URLS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
writeFileSync(out, body);
console.log(`\nĐã ghi ${out} (${SEED_VOCABULARY.length - miss}/${SEED_VOCABULARY.length} từ có ảnh).`);
