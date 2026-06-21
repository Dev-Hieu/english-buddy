import type { Level } from "./student";

export type GrammarExerciseType = "choice" | "fill" | "reorder";

export interface GrammarExercise {
  id: string;
  type: GrammarExerciseType;
  question: string; // "choice"/"fill": câu có chỗ trống ___ ; "reorder": câu gợi ý/nghĩa
  options?: string[]; // "choice": đáp án; "reorder": các từ bị xáo trộn cần sắp xếp
  answer: string; // đáp án đúng (reorder: cả câu đúng)
  explain_vi?: string; // giải thích ngắn vì sao đúng
}

export interface GrammarSection {
  heading: string;
  points: string[];
}

export interface GrammarTopic {
  id: string;
  level: Level;
  title: string; // tiêu đề tiếng Anh, vd "Present Simple"
  title_vi: string; // "Thì hiện tại đơn"
  summary_vi: string; // giải thích ngắn gọn bằng tiếng Việt
  sections?: GrammarSection[]; // khối lý thuyết tách riêng (ưu tiên hiện nếu có)
  points: string[]; // các ý/quy tắc + ví dụ (fallback nếu không có sections)
  exercises: GrammarExercise[];
}
