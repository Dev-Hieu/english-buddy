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


export async function saveLookup(entry: LookupHistory): Promise<void> {
  await apiRequest(`/api/lookup`, { method: "POST", body: entry });
}

export async function getLookupHistory(studentId: string, type: "word" | "sentence", limit = 8): Promise<{ query: string }[]> {
  const all = await apiRequest<{ query: string }[]>(`/api/students/${studentId}/lookups`);
  return all.filter((r) => r.query).slice(0, limit);
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
