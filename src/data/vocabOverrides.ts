import type { Level } from "../types";

// Sửa chính xác theo từ điển quốc tế (Oxford/Cambridge) — áp đè lên từ gốc theo id.
// File này do quá trình rà (auditContent.ts + duyệt) sinh ra; áp tại seedVocabulary.
// Để trống = không đổi gì. Mỗi mục chỉ ghi trường cần sửa.
export interface VocabOverride {
  phonetic?: string;
  meaning_vi?: string;
  meaning_en?: string;
  pos?: string;
  level?: Level;
}

export const VOCAB_OVERRIDES: Record<string, VocabOverride> = {};
