import { apiRequest } from "./api";

// Bài Thi kỹ năng: điểm = số kỹ năng đang qua mỗi từ. Server chấm + giữ đáp án.
export type Skill = "listen_word" | "image_word" | "speak" | "write";

export interface SkillTestItem {
  wordId: string;
  word: string;
  phonetic?: string;
  meaning_vi?: string;
  imageUrl?: string;
  audioUrl?: string;
  options?: string[]; // cho nghe/nhìn hình -> chọn chữ
}
export interface SkillTestSession {
  sessionId: string;
  level: string;
  skills: Skill[];
  items: SkillTestItem[];
}
export interface SkillAnswer {
  wordId: string;
  skill: Skill;
  value: string | number; // listen/image/write: chữ; speak: điểm phát âm 0-100 (hoặc "skip")
}
export interface SkillResult {
  wordId: string;
  passed: Skill[];
  lost: Skill[];
  points: number;
}

export function getPending(studentId: string): Promise<{ words: string[]; count: number }> {
  return apiRequest(`/api/students/${studentId}/pending`);
}
export function getRelearn(studentId: string): Promise<{ words: string[]; count: number }> {
  return apiRequest(`/api/students/${studentId}/relearn`);
}
export function getDueTests(studentId: string, now = Date.now()): Promise<{ words: string[]; count: number }> {
  return apiRequest(`/api/students/${studentId}/due-tests?now=${now}`);
}
export function startSkillTest(studentId: string, mode: "new" | "review"): Promise<SkillTestSession> {
  return apiRequest(`/api/students/${studentId}/skill-test/start`, { method: "POST", body: { mode } });
}
export function submitSkillTest(
  studentId: string,
  sessionId: string,
  answers: SkillAnswer[]
): Promise<{ results: SkillResult[]; totalDelta: number }> {
  return apiRequest(`/api/students/${studentId}/skill-test/submit`, { method: "POST", body: { sessionId, answers } });
}
