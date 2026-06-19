import { apiRequest } from "./api";
import type { LookupHistory, StudentVocabularyProgress } from "../types";

// Gọi API server (server/). Chữ ký giữ nguyên theo CONTRACTS.
export function getStudentProgress(studentId: string): Promise<StudentVocabularyProgress[]> {
  return apiRequest(`/api/students/${studentId}/progress`);
}

export async function recordAnswer(
  studentId: string,
  wordId: string,
  correct: boolean
): Promise<void> {
  await apiRequest(`/api/students/${studentId}/answer`, {
    method: "POST",
    body: { wordId, correct },
  });
}

export function getDueReviews(
  studentId: string,
  now: number
): Promise<StudentVocabularyProgress[]> {
  return apiRequest(`/api/students/${studentId}/reviews?now=${now}`);
}

// Hoàn thành 1 bộ flashcard -> thưởng điểm khuyến khích (1 lần/bộ/ngày).
export async function deckComplete(studentId: string, deckId: string, cards: number): Promise<void> {
  await apiRequest(`/api/students/${studentId}/deck-complete`, { method: "POST", body: { deckId, cards } });
}

export async function saveLookup(entry: LookupHistory): Promise<void> {
  await apiRequest(`/api/lookup`, { method: "POST", body: entry });
}

export interface SavedWord {
  query: string;
  type: "word" | "sentence";
  createdAt: number;
  meaning?: string;
  phonetic?: string;
  imageUrl?: string;
}
export function getMyWords(studentId: string): Promise<SavedWord[]> {
  return apiRequest(`/api/students/${studentId}/lookups`);
}
