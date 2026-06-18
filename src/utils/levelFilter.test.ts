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

describe("matchesLevel", () => {
  it("'all' khớp mọi cấp", () => {
    expect(matchesLevel("kids", "all")).toBe(true);
    expect(matchesLevel("c1", "all")).toBe(true);
  });
  it("khớp đúng cấp, lệch thì không", () => {
    expect(matchesLevel("kids", "kids")).toBe(true);
    expect(matchesLevel("a1", "kids")).toBe(false);
  });
});

describe("topicWords", () => {
  it("lọc theo chủ đề + cấp", () => {
    expect(topicWords(WORDS, "topic_food", "kids").map((w) => w.id)).toEqual(["k1", "k2"]);
    expect(topicWords(WORDS, "topic_food", "a1").map((w) => w.id)).toEqual(["a1"]);
  });
  it("'all' lấy mọi cấp trong chủ đề", () => {
    expect(topicWords(WORDS, "topic_food", "all").map((w) => w.id)).toEqual(["k1", "k2", "a1"]);
  });
  it("cấp không có từ -> rỗng", () => {
    expect(topicWords(WORDS, "topic_food", "c1")).toEqual([]);
  });
});

describe("topicsWithLevel", () => {
  it("chỉ chủ đề có từ ở cấp đó", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "kids").map((t) => t.id)).toEqual(["topic_food", "topic_animals"]);
    expect(topicsWithLevel(TOPICS, WORDS, "b1").map((t) => t.id)).toEqual(["topic_work"]);
  });
  it("cấp/level lạ -> không chủ đề nào", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "beginner")).toEqual([]);
  });
  it("'all' -> mọi chủ đề có từ", () => {
    expect(topicsWithLevel(TOPICS, WORDS, "all").map((t) => t.id)).toEqual(["topic_food", "topic_animals", "topic_work"]);
  });
});
