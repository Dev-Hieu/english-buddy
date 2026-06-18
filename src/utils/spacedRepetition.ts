import type { Mastery, WordStatus } from "../types";

// Spaced repetition đơn giản hóa (Leitner) — TECH_SPEC §7.6.
// Khoảng ôn (ngày) theo mastery SAU KHI trả lời đúng:
//   1 -> 1 ngày · 2 -> 3 ngày · 3 -> 7 ngày · 4 -> 14 ngày · 5 (thành thạo) -> 14 ngày.
const DAY = 86_400_000;
const DAYS_BY_MASTERY: Record<Mastery, number> = { 0: 1, 1: 1, 2: 3, 3: 7, 4: 14, 5: 14 };

const clamp = (m: number): Mastery => Math.max(0, Math.min(5, m)) as Mastery;

function statusOf(m: Mastery): WordStatus {
  if (m <= 0) return "new";
  if (m <= 2) return "learning";
  if (m <= 4) return "review";
  return "mastered";
}

export interface NextReview {
  mastery: Mastery;
  nextReviewAt: number;
  status: WordStatus;
}

/**
 * Tính trạng thái ôn tập kế tiếp cho 1 từ.
 * @param mastery mức thành thạo hiện tại (0..5)
 * @param correct lần trả lời này đúng hay sai
 * @param now epoch ms hiện tại
 */
export function nextReview(mastery: Mastery, correct: boolean, now: number): NextReview {
  if (!correct) {
    // Sai -> hạ 1 bậc (tối thiểu 1 vì từ đã được nhìn thấy), ôn lại ngay trong ngày.
    const m = clamp(Math.max(1, mastery - 1));
    return { mastery: m, nextReviewAt: now, status: statusOf(m) };
  }
  const m = clamp(mastery + 1);
  return { mastery: m, nextReviewAt: now + DAYS_BY_MASTERY[m] * DAY, status: statusOf(m) };
}
