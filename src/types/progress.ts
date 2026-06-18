// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)

export type WordStatus = "new" | "learning" | "review" | "mastered";

/** mastery: 0 chưa học · 1 mới học · 2 nhớ tạm · 3 khá nhớ · 4 nhớ tốt · 5 thành thạo */
export type Mastery = 0 | 1 | 2 | 3 | 4 | 5;

export interface StudentVocabularyProgress {
  studentId: string;
  wordId: string;
  status: WordStatus;
  mastery: Mastery;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt: number;
  nextReviewAt: number;
}

export interface LookupHistory {
  studentId: string;
  query: string;
  type: "word" | "sentence";
  saved: boolean;
  createdAt: number;
  meaning?: string;
  phonetic?: string;
  imageUrl?: string;
}
