import { apiRequest } from "./api";

export interface ExamQuestion {
  section: string;
  type: string;
  question: string;
  question_vi?: string;
  options?: string[];
  answer: number | string;
  audio_text?: string;
  passage?: string;
  explain_vi?: string;
  word?: string;
  phonetic?: string;
  meaning_vi?: string;
}

export interface GeneratedExam {
  level: string;
  totalQuestions: number;
  sections: {
    vocab_grammar: ExamQuestion[];
    listening: ExamQuestion[];
    reading: ExamQuestion[];
    writing: ExamQuestion[];
  };
  generatedAt: number;
}

export async function generateExam(level: string): Promise<GeneratedExam> {
  return apiRequest<GeneratedExam>(`/api/generate-exam?level=${level}`);
}
