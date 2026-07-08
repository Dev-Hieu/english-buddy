import type { QuizQuestion, QuizType, VocabularyWord } from "../types";

// Sinh câu hỏi quiz thuần từ danh sách từ — TECH_SPEC §7.7.
// Distractor (đáp án sai) lấy từ các từ KHÁC trong cùng tập (cùng chủ đề).

const TYPES: QuizType[] = [
  "choose_meaning",
  "choose_picture",
  "listen_choose",
  "fill_blank",
  "match_meaning",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Lấy tối đa `n` giá trị distractor khác `correct` từ pool. */
function pickDistractors(pool: string[], correct: string, n: number): string[] {
  return shuffle(pool.filter((v) => v && v !== correct)).slice(0, n);
}

function makeOptions(correct: string, distractors: string[]): string[] {
  return shuffle([correct, ...distractors]);
}

function buildQuestion(
  target: VocabularyWord,
  others: VocabularyWord[],
  type: QuizType,
  index: number
): QuizQuestion {
  const id = `q_${index}_${target.id}`;
  const base = { id, wordId: target.id, type };

  switch (type) {
    case "choose_meaning": {
      const answer = target.meaning_vi;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.meaning_vi), answer, 3));
      return { ...base, question: `"${target.word}" nghĩa là gì?`, options, answer };
    }
    case "match_meaning": {
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      return { ...base, question: `Từ nào nghĩa là "${target.meaning_vi}"?`, options, answer };
    }
    case "listen_choose": {
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      return { ...base, question: "Nghe và chọn từ đúng", options, answer };
    }
    case "choose_picture": {
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      const imageOptions = options.map(
        (opt) => (opt === answer ? target : others.find((w) => w.word === opt))?.imageUrl ?? ""
      );
      return { ...base, question: `Chọn ảnh đúng cho "${target.word}"`, options, answer, imageOptions };
    }
    case "fill_blank": {
      const word = target.word;
      if (word.length < 2) {
        // Quá ngắn để tạo fill_blank → fallback sang choose_meaning
        const fallbackAnswer = target.meaning_vi;
        const fallbackOptions = makeOptions(fallbackAnswer, pickDistractors(others.map((w) => w.meaning_vi), fallbackAnswer, 3));
        return { ...base, type: "choose_meaning", question: `"${target.word}" nghĩa là gì?`, options: fallbackOptions, answer: fallbackAnswer };
      }
      const pos = Math.floor(word.length / 2);
      const answer = word[pos];
      const masked = word.slice(0, pos) + "_" + word.slice(pos + 1);
      const letterPool = "abcdefghijklmnopqrstuvwxyz".split("");
      const options = makeOptions(answer, pickDistractors(letterPool, answer, 3));
      return { ...base, question: `Điền chữ còn thiếu: ${masked}`, options, answer };
    }
  }
}

/**
 * Tạo bộ quiz từ danh sách từ.
 * @param words từ thuộc 1 chủ đề (đủ để làm distractor)
 * @param count số câu hỏi muốn sinh
 */
export function buildQuiz(words: VocabularyWord[], count: number): QuizQuestion[] {
  if (words.length === 0) return [];
  const targets = shuffle(words).slice(0, Math.min(count, words.length));
  return targets.map((target, i) => {
    const others = words.filter((w) => w.id !== target.id);
    const type = TYPES[i % TYPES.length];
    return buildQuestion(target, others, type, i);
  });
}
