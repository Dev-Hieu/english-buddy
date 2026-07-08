import type { QuizQuestion, QuizType, VocabularyWord } from "../types";

// Sinh câu hỏi quiz thuần từ danh sách từ — TECH_SPEC §7.7.
// Distractor (đáp án sai) lấy từ các từ KHÁC trong cùng tập (cùng chủ đề).

/** Các loại câu dễ, trung bình, khó. */
const EASY_TYPES: QuizType[] = ["choose_meaning", "choose_picture"];
const MEDIUM_TYPES: QuizType[] = ["match_meaning", "listen_choose", "fill_blank"];
const HARD_TYPES: QuizType[] = ["sentence_fill", "choose_correct_sentence", "reorder_words"];
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

/** Phân bổ loại câu theo tỉ lệ: 30% dễ, 40% trung bình, 30% khó. */
function distributeTypes(count: number, wordsWithExample: number): QuizType[] {
  const easy = Math.round(count * 0.3);
  const hard = wordsWithExample >= 3 ? Math.round(count * 0.3) : 0;
  const medium = count - easy - hard;

  const types: QuizType[] = [];
  for (let i = 0; i < easy; i++) types.push(EASY_TYPES[i % EASY_TYPES.length]);
  for (let i = 0; i < medium; i++) types.push(MEDIUM_TYPES[i % MEDIUM_TYPES.length]);
  for (let i = 0; i < hard; i++) types.push(HARD_TYPES[i % HARD_TYPES.length]);
  return shuffle(types);
}

/** Tạo câu sai bằng cách thay từ target trong câu gốc bằng từ khác. */
function makeWrongSentence(example: string, word: string, replacement: string): string {
  const regex = new RegExp(`\\b${word}\\b`, "gi");
  return example.replace(regex, replacement);
}

/** Trộn các từ trong câu thành mảng random. */
function scrambleWords(sentence: string): string[] {
  // Bỏ dấu chấm cuối nếu có, giữ nguyên phần còn lại
  const cleaned = sentence.replace(/[.!?]+$/, "").trim();
  return shuffle(cleaned.split(/\s+/));
}

function buildQuestion(
  target: VocabularyWord,
  others: VocabularyWord[],
  type: QuizType,
  index: number,
): QuizQuestion {
  const id = `q_${index}_${target.id}`;
  const base = { id, wordId: target.id, type };

  switch (type) {
    case "choose_meaning": {
      const answer = target.meaning_vi;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.meaning_vi), answer, 3));
      const explanation = target.example
        ? `"${target.word}" = ${target.meaning_vi}. Ví dụ: ${target.example}`
        : `"${target.word}" = ${target.meaning_vi}`;
      return { ...base, question: `"${target.word}" nghĩa là gì?`, options, answer, explanation };
    }
    case "match_meaning": {
      // choose_word: Vietnamese → English
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      const explanation = `"${target.meaning_vi}" = ${target.word}${target.phonetic ? ` ${target.phonetic}` : ""}`;
      return { ...base, question: `Từ nào nghĩa là "${target.meaning_vi}"?`, options, answer, explanation };
    }
    case "listen_choose": {
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      const explanation = `Từ đúng: "${target.word}"${target.phonetic ? ` ${target.phonetic}` : ""} — ${target.meaning_vi}`;
      return { ...base, question: "Nghe và chọn từ đúng", options, answer, explanation };
    }
    case "choose_picture": {
      const answer = target.word;
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      const imageOptions = options.map(
        (opt) => (opt === answer ? target : others.find((w) => w.word === opt))?.imageUrl ?? "",
      );
      const explanation = `Ảnh đúng là "${target.word}" — ${target.meaning_vi}`;
      return { ...base, question: `Chọn ảnh đúng cho "${target.word}"`, options, answer, imageOptions, explanation };
    }
    case "fill_blank": {
      const word = target.word;
      if (word.length < 2) {
        // Quá ngắn để tạo fill_blank → fallback sang choose_meaning
        const fallbackAnswer = target.meaning_vi;
        const fallbackOptions = makeOptions(fallbackAnswer, pickDistractors(others.map((w) => w.meaning_vi), fallbackAnswer, 3));
        return { ...base, type: "choose_meaning", question: `"${target.word}" nghĩa là gì?`, options: fallbackOptions, answer: fallbackAnswer, explanation: `"${target.word}" = ${target.meaning_vi}` };
      }
      const pos = Math.floor(word.length / 2);
      const answer = word[pos];
      const masked = word.slice(0, pos) + "_" + word.slice(pos + 1);
      const letterPool = "abcdefghijklmnopqrstuvwxyz".split("");
      const options = makeOptions(answer, pickDistractors(letterPool, answer, 3));
      const explanation = `Từ đầy đủ: "${target.word}" — ${target.meaning_vi}`;
      return { ...base, question: `Điền chữ còn thiếu: ${masked}`, options, answer, explanation };
    }
    case "sentence_fill": {
      // Đọc câu có blank, chọn từ đúng để điền
      if (!target.example) {
        // Fallback nếu không có câu ví dụ
        return buildQuestion(target, others, "choose_meaning", index);
      }
      const answer = target.word;
      const regex = new RegExp(`\\b${answer}\\b`, "gi");
      const blanked = target.example.replace(regex, "______");
      // Nếu replace không thay được gì (từ không nằm trong câu) → fallback
      if (blanked === target.example) {
        return buildQuestion(target, others, "match_meaning", index);
      }
      const options = makeOptions(answer, pickDistractors(others.map((w) => w.word), answer, 3));
      const explanation = `Câu đầy đủ: "${target.example}"${target.example_vi ? ` — ${target.example_vi}` : ""}`;
      return { ...base, question: `Điền từ vào chỗ trống:\n"${blanked}"`, options, answer, explanation };
    }
    case "choose_correct_sentence": {
      // Chọn câu đúng ngữ pháp (1 câu đúng + 3 câu sai thay từ)
      if (!target.example) {
        return buildQuestion(target, others, "choose_meaning", index);
      }
      const answer = target.example;
      const wrongWords = shuffle(others.filter((w) => w.word !== target.word)).slice(0, 3);
      const wrongSentences = wrongWords.map((w) => makeWrongSentence(target.example!, target.word, w.word));
      // Nếu câu sai giống câu đúng (từ không nằm trong câu) → fallback
      if (wrongSentences.some((s) => s === answer)) {
        return buildQuestion(target, others, "match_meaning", index);
      }
      const options = makeOptions(answer, wrongSentences);
      const explanation = `Câu đúng: "${target.example}"${target.example_vi ? ` — ${target.example_vi}` : ""}`;
      return { ...base, question: `Chọn câu đúng (nghĩa: "${target.meaning_vi}"):`, options, answer, explanation };
    }
    case "reorder_words": {
      // Sắp xếp lại từ thành câu đúng
      if (!target.example) {
        return buildQuestion(target, others, "choose_meaning", index);
      }
      const cleaned = target.example.replace(/[.!?]+$/, "").trim();
      const words = cleaned.split(/\s+/);
      if (words.length < 3) {
        return buildQuestion(target, others, "match_meaning", index);
      }
      const scrambled = scrambleWords(target.example);
      // Đáp án = câu gốc không dấu câu cuối
      const answer = cleaned;
      // Các options là các cách sắp xếp khác nhau
      const wrongOptions: string[] = [];
      const attempts = new Set<string>();
      attempts.add(answer);
      for (let i = 0; i < 20 && wrongOptions.length < 3; i++) {
        const candidate = shuffle(words).join(" ");
        if (!attempts.has(candidate)) {
          attempts.add(candidate);
          wrongOptions.push(candidate);
        }
      }
      // Nếu không đủ 3 options sai (câu quá ngắn) → fallback
      if (wrongOptions.length < 3) {
        return buildQuestion(target, others, "match_meaning", index);
      }
      const options = makeOptions(answer, wrongOptions);
      const explanation = `Câu đúng: "${target.example}"${target.example_vi ? ` — ${target.example_vi}` : ""}`;
      return { ...base, question: `Sắp xếp thành câu đúng:\n[ ${scrambled.join(" / ")} ]`, options, answer, explanation };
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
  const wordsWithExample = targets.filter((w) => w.example).length;
  const types = distributeTypes(targets.length, wordsWithExample);
  return targets.map((target, i) => {
    const others = words.filter((w) => w.id !== target.id);
    return buildQuestion(target, others, types[i], i);
  });
}
