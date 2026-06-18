# CONTRACTS — Hợp đồng dữ liệu & interface chung

> **Đây là ranh giới giữa Claude (services/data) và Codex (UI).**
> UI chỉ được phụ thuộc vào các type & chữ ký hàm trong file này.
> **Quy tắc vàng:** muốn đổi bất kỳ type nào ở đây → mở một **REQUEST** trong [MESSAGES.md](./MESSAGES.md), đợi ack, rồi mới sửa. Không đổi lén.
> Mỗi thay đổi: tăng **Contracts version** ở dưới và ghi 1 dòng changelog.

**Contracts version:** `2` · cập nhật lần cuối: 2026-06-18

> **Kiến trúc backend (D-010):** services gọi **API server tự host** (`server/`, SQLite + Express) qua `src/services/api.ts`. **Chữ ký các service dữ liệu KHÔNG đổi** so với v1 → UI không phải sửa. Domain types giữ nguyên. v2 chỉ *thêm* `authService` và `contentService`.

Source code tương ứng: `src/types/*.ts`. File `.md` này và code phải khớp nhau.

---

## 1. Domain types (`src/types`)

### user.ts
```ts
export type Role = "parent";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: number; // epoch ms
}
```

### student.ts
```ts
export type Level = "beginner" | "elementary" | "intermediate";

export interface Student {
  id: string;            // "student_001" | "student_002"
  parentId: string;
  name: string;          // "Bảo Ngọc" | "Bảo Nam"
  grade: number;
  level: Level;
  avatar: string;        // asset key, vd "girl_avatar_01"
  dailyGoal: number;     // số từ/ngày
  xp: number;
  streak: number;
  createdAt: number;
}
```

### vocabulary.ts
```ts
export interface Topic {
  id: string;            // "topic_food"
  name: string;          // "Food"
  name_vi: string;       // "Đồ ăn"
  level: Level;
  order: number;
}

export interface VocabularyWord {
  id: string;            // "word_apple"
  word: string;          // "apple"
  phonetic?: string;     // "/ˈæp.əl/"
  meaning_vi: string;    // "quả táo"
  meaning_en?: string;
  example?: string;
  example_vi?: string;
  topicIds: string[];    // 1 từ có thể thuộc nhiều chủ đề (vd "fish")
  level: Level;
  imageUrl: string;      // ảnh đã duyệt cho từ seed
  audioUrl?: string;     // ưu tiên phát file này; rỗng -> dùng TTS
  source: "seed" | "dictionary_api";
  createdAt: number;
}
```

### progress.ts
```ts
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
}
```

### quiz.ts
```ts
export type QuizType =
  | "choose_meaning"
  | "choose_picture"
  | "listen_choose"
  | "fill_blank"
  | "match_meaning";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  wordId: string;          // từ đang được hỏi
  question: string;        // vd "What does 'apple' mean?"
  options: string[];       // gồm 1 đáp án đúng + distractor cùng chủ đề
  answer: string;          // đáp án đúng (giá trị, không phải index)
  imageOptions?: string[]; // dùng cho choose_picture
}

export interface QuizResult {
  studentId: string;
  topicId: string;
  score: number;           // 0..100
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  wrongWordIds: string[];
  durationSeconds: number;
  createdAt: number;
}
```

---

## 2. Service interfaces (`src/services`, owner: Claude)

UI import và gọi đúng các chữ ký này. Mọi service trả `Promise`, ném lỗi dạng `ServiceError`.

```ts
export interface ServiceError extends Error {
  code: "network" | "not_found" | "rate_limit" | "unknown";
}
```

### dictionaryService.ts
```ts
export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: string[];
  examples: string[];
}
export interface DictionaryResult {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  meanings: DictionaryMeaning[];
}
export function getWordDefinition(word: string): Promise<DictionaryResult>;
```

### imageService.ts
```ts
export interface ImageResult {
  id: string;
  url: string;
  thumbUrl: string;
  photographer: string;
  sourceUrl: string;
}
export function getWordImages(query: string): Promise<ImageResult[]>;
```

### translateService.ts
```ts
export function translateToVi(text: string): Promise<string>;
```

### speechService.ts
```ts
export function speakText(text: string, audioUrl?: string, lang?: string): void;
```

### progressService.ts
```ts
export function getStudentProgress(studentId: string): Promise<StudentVocabularyProgress[]>;
export function recordAnswer(studentId: string, wordId: string, correct: boolean): Promise<void>;
export function getDueReviews(studentId: string, now: number): Promise<StudentVocabularyProgress[]>;
export function saveLookup(entry: LookupHistory): Promise<void>;
```

### quizService.ts
```ts
export function generateQuiz(topicId: string, count: number): Promise<QuizQuestion[]>;
export function submitQuiz(result: QuizResult): Promise<void>;
export function getQuizResults(studentId: string): Promise<QuizResult[]>; // v3
```

### authService.ts *(v2)*
```ts
export function login(password: string): Promise<void>; // lưu token (localStorage)
export function logout(): void;
export function isLoggedIn(): boolean;
```

### contentService.ts *(v2 — lấy nội dung từ API thay cho SEED_* nếu muốn)*
```ts
export function getTopics(): Promise<Topic[]>;
export function getVocabulary(topicId?: string): Promise<VocabularyWord[]>;
```

---

## 3. Utils (`src/utils`, owner: Claude)

```ts
// spacedRepetition.ts — thuần, không I/O
export function nextReview(mastery: Mastery, correct: boolean, now: number): {
  mastery: Mastery;
  nextReviewAt: number;
  status: WordStatus;
};

// normalizeWord.ts
export function normalizeWord(raw: string): string; // trim, lowercase, bỏ ký tự thừa
```

---

## 4. Changelog

| Version | Ngày | Thay đổi | Bởi |
|---------|------|----------|-----|
| 1 | 2026-06-18 | Khởi tạo contracts ban đầu (đã đổi `topicId`→`topicIds`, thêm `translateService`) | Claude |
| 2 | 2026-06-18 | Pivot backend sang API tự host (D-010). Thêm `authService`, `contentService`. Chữ ký service dữ liệu giữ nguyên. | Claude |
| 3 | 2026-06-18 | Thêm `quizService.getQuizResults(studentId)` cho Parent Dashboard. | Claude |
