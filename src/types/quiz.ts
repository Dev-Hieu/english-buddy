// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)

export type QuizType =
  | "choose_meaning"
  | "choose_picture"
  | "listen_choose"
  | "fill_blank"
  | "match_meaning"
  | "sentence_fill"
  | "choose_correct_sentence"
  | "reorder_words";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  wordId: string; // từ đang được hỏi
  question: string; // vd "What does 'apple' mean?"
  options: string[]; // gồm 1 đáp án đúng + distractor cùng chủ đề
  answer: string; // đáp án đúng (giá trị, không phải index)
  imageOptions?: string[]; // dùng cho choose_picture
  explanation?: string; // giải thích khi trả lời sai
}

export interface QuizResult {
  studentId: string;
  topicId: string;
  score: number; // 0..100
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  wrongWordIds: string[];
  durationSeconds: number;
  createdAt: number;
}
