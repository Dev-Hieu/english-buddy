import { describe, expect, it } from "vitest";
import { buildQuiz } from "./quizGenerator";
import { SEED_VOCABULARY } from "../data/seedVocabulary";

const foodWords = SEED_VOCABULARY.filter((w) => w.topicIds.includes("topic_food"));

describe("buildQuiz", () => {
  it("danh sách rỗng -> không có câu hỏi", () => {
    expect(buildQuiz([], 5)).toEqual([]);
  });

  it("sinh đúng số câu (<= số từ)", () => {
    expect(buildQuiz(foodWords, 5)).toHaveLength(5);
    expect(buildQuiz(foodWords, 999)).toHaveLength(foodWords.length);
  });

  it("mỗi câu: đáp án đúng nằm trong options và wordId hợp lệ", () => {
    const ids = new Set(foodWords.map((w) => w.id));
    for (const q of buildQuiz(foodWords, foodWords.length)) {
      expect(q.options).toContain(q.answer);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.length).toBeLessThanOrEqual(4);
      expect(ids.has(q.wordId)).toBe(true);
    }
  });

  it("choose_picture có imageOptions cùng độ dài options", () => {
    const q = buildQuiz(foodWords, foodWords.length).find((x) => x.type === "choose_picture");
    if (q) expect(q.imageOptions).toHaveLength(q.options.length);
  });
});
