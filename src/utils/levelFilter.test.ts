import { describe, expect, it } from "vitest";
import type { VocabularyWord } from "../types";
import { matchesLevel, topicWords, topicsWithLevel } from "./levelFilter";

const mk = (id: string, level: string, topicIds: string[]): VocabularyWord => ({
  id, word: id, meaning_vi: id, topicIds, level: level as VocabularyWord["level"],
  imageUrl: "", source: "seed", createdAt: 0,
});

const WORDS = [
  mk("k1", "kids", ["topic_food"]),
  mk("k2", "kids", ["topic_food", "topic_animals"]),
  mk("a1", "a1", ["topic_food"]),
  mk("b1", "b1", ["topic_work"]),
];
const TOPICS = [{ id: "topic_food" }, { id: "topic_animals" }, { id: "topic_work" }];

describe("matchesLevel (kế thừa: ≤ cấp)", () => {
  it("'all' khớp mọi cấp", () => {
    expect(matchesLevel("kids", "all")).toBe(true);
    expect(matchesLevel("c1", "all")).toBe(true);
  });
  it("từ cấp THẤP hiện ở cấp CAO; từ cấp cao KHÔNG hiện ở cấp thấp", () => {
    expect(matchesLevel("kids", "a1")).toBe(true); // kids ≤ a1
    expect(matchesLevel("a1", "a1")).toBe(true);
    expect(matchesLevel("a1", "kids")).toBe(false); // a1 > kids
    expect(matchesLevel("b1", "a2")).toBe(false);
  });
  it("cấp lạ -> so khớp tuyệt đối", () => {
    expect(matchesLevel("beginner", "a1")).toBe(false);
  });
});

describe("topicWords (kế thừa)", () => {
  it("'kids' chỉ lấy từ kids", () => {
    expect(topicWords(WORDS, "topic_food", "kids").map((w) => w.id)).toEqual(["k1", "k2"]);
  });
  it("'a1' lấy kids + a1", () => {
    expect(topicWords(WORDS, "topic_food", "a1").map((w) => w.id)).toEqual(["k1", "k2", "a1"]);
  });
  it("'all' lấy mọi cấp trong chủ đề", () => {
    expect(topicWords(WORDS, "topic_food", "all").map((w) => w.id)).toEqual(["k1", "k2", "a1"]);
  });
});

describe("topicsWithLevel (kế thừa)", () => {
  it("'kids' -> chủ đề có từ kids", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "kids").map((t) => t.id)).toEqual(["topic_food", "topic_animals"]);
  });
  it("'b1' -> mọi chủ đề có từ ≤ b1", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "b1").map((t) => t.id)).toEqual(["topic_food", "topic_animals", "topic_work"]);
  });
  it("'all' -> mọi chủ đề có từ", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "all").map((t) => t.id)).toEqual(["topic_food", "topic_animals", "topic_work"]);
  });
});
