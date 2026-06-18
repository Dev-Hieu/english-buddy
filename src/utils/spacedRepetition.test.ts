import { describe, expect, it } from "vitest";
import { nextReview } from "./spacedRepetition";

const NOW = Date.UTC(2026, 5, 18);
const DAY = 86_400_000;

describe("nextReview", () => {
  it("từ mới trả lời đúng -> mastery 1, ôn lại sau 1 ngày, learning", () => {
    const r = nextReview(0, true, NOW);
    expect(r.mastery).toBe(1);
    expect(r.status).toBe("learning");
    expect(r.nextReviewAt).toBe(NOW + 1 * DAY);
  });

  it("trả lời sai -> hạ về tối thiểu 1 và đến hạn ngay", () => {
    const r = nextReview(0, false, NOW);
    expect(r.mastery).toBe(1);
    expect(r.nextReviewAt).toBe(NOW); // ôn lại ngay trong ngày
  });

  it("mastery 2 đúng -> 3 (review), +7 ngày", () => {
    const r = nextReview(2, true, NOW);
    expect(r.mastery).toBe(3);
    expect(r.status).toBe("review");
    expect(r.nextReviewAt).toBe(NOW + 7 * DAY);
  });

  it("mastery 4 đúng -> 5 (mastered), +14 ngày", () => {
    const r = nextReview(4, true, NOW);
    expect(r.mastery).toBe(5);
    expect(r.status).toBe("mastered");
    expect(r.nextReviewAt).toBe(NOW + 14 * DAY);
  });

  it("mastery 5 đúng -> giữ 5, không vượt trần", () => {
    const r = nextReview(5, true, NOW);
    expect(r.mastery).toBe(5);
  });

  it("mastery 5 sai -> tụt xuống 4, đến hạn ngay", () => {
    const r = nextReview(5, false, NOW);
    expect(r.mastery).toBe(4);
    expect(r.nextReviewAt).toBe(NOW);
  });
});
