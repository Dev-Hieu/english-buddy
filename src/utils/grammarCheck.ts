import type { GrammarExercise } from "../types";

// Chuẩn hoá để so đáp án: bỏ khoảng trắng thừa, thường hoá, bỏ dấu câu cuối.
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?,]+$/g, "").trim();
}

export function checkGrammar(ex: GrammarExercise, input: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(ex.answer);
}
