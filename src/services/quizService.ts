import { apiRequest } from "./api";
import type { QuizQuestion, QuizResult } from "../types";

export function generateQuiz(topicId: string, count: number, level = "all"): Promise<QuizQuestion[]> {
  const lv = level && level !== "all" ? `&level=${encodeURIComponent(level)}` : "";
  return apiRequest(`/api/quiz?topicId=${encodeURIComponent(topicId)}&count=${count}${lv}`);
}

export async function submitQuiz(result: QuizResult): Promise<void> {
  await apiRequest(`/api/quiz-results`, { method: "POST", body: result });
}

export function getQuizResults(studentId: string): Promise<QuizResult[]> {
  return apiRequest(`/api/students/${studentId}/quiz-results`);
}
