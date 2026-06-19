/**
 * Đổ báo cáo audit (audit-report.json) thành src/data/vocabOverrides.ts để áp sửa.
 * Chỉ nhận trường hợp lệ: phonetic dạng /.../, meaning_vi không rỗng, level ∈ CEFR.
 * Chạy:  cd server && ./node_modules/.bin/tsx src/applyAudit.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORT = path.resolve(fileURLToPath(import.meta.url), "../../audit-report.json");
const OUT = path.resolve(fileURLToPath(import.meta.url), "../../../src/data/vocabOverrides.ts");
const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];

const POS = ["danh từ", "động từ", "tính từ", "trạng từ", "giới từ", "đại từ", "liên từ", "thán từ", "mạo từ", "số từ"];
const report: any[] = JSON.parse(readFileSync(REPORT, "utf8"));
const overrides: Record<string, any> = {};
let nPhon = 0, nMean = 0, nLevel = 0, nPos = 0;

for (const item of report) {
  const id = item.id;
  const f = item.fixes || {};
  if (!id) continue;
  const o: any = {};
  if (typeof item.pos === "string" && POS.includes(item.pos.trim())) { o.pos = item.pos.trim(); nPos++; }
  if (typeof f.phonetic === "string" && /^\/.*\/$/.test(f.phonetic.trim())) { o.phonetic = f.phonetic.trim(); nPhon++; }
  if (typeof f.meaning_vi === "string" && f.meaning_vi.trim().length >= 2) { o.meaning_vi = f.meaning_vi.trim(); nMean++; }
  if (typeof f.level === "string" && LEVELS.includes(f.level.trim())) { o.level = f.level.trim(); nLevel++; }
  if (Object.keys(o).length) overrides[id] = o;
}

const body = `import type { Level } from "../types";

// SỬA theo từ điển quốc tế (Oxford/Cambridge) — sinh tự động từ audit (DeepSeek) + duyệt.
// Áp đè lên từ gốc theo id tại seedVocabulary. Để trống = không đổi.
export interface VocabOverride {
  phonetic?: string;
  meaning_vi?: string;
  meaning_en?: string;
  pos?: string;
  level?: Level;
}

export const VOCAB_OVERRIDES: Record<string, VocabOverride> = ${JSON.stringify(overrides, null, 2)};
`;
writeFileSync(OUT, body);
console.log(`Áp ${Object.keys(overrides).length} từ -> vocabOverrides.ts (loại từ ${nPos}, phonetic ${nPhon}, nghĩa ${nMean}, cấp ${nLevel}).`);
