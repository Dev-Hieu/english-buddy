import { describe, expect, it } from "vitest";
import type { GrammarExercise } from "../types";
import { checkGrammar, normalizeAnswer } from "./grammarCheck";

const ex = (type: GrammarExercise["type"], answer: string): GrammarExercise => ({ id: "x", type, question: "", answer });

describe("normalizeAnswer", () => {
  it("bỏ khoảng trắng thừa + thường hoá + bỏ dấu cuối", () => {
    expect(normalizeAnswer("  I  Run   every  morning. ")).toBe("i run every morning");
    expect(normalizeAnswer("Goes")).toBe("goes");
  });
});

describe("checkGrammar", () => {
  it("choice/fill khớp không phân biệt hoa thường", () => {
    expect(checkGrammar(ex("choice", "goes"), "Goes")).toBe(true);
    expect(checkGrammar(ex("fill", "likes"), "likes")).toBe(true);
    expect(checkGrammar(ex("fill", "likes"), "like")).toBe(false);
  });
  it("reorder bỏ qua dấu câu + khoảng trắng", () => {
    expect(checkGrammar(ex("reorder", "I run every morning"), "i run  every morning.")).toBe(true);
    expect(checkGrammar(ex("reorder", "I run every morning"), "every morning I run")).toBe(false);
  });
});
