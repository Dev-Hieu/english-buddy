import { LEVEL_ORDER, type VocabularyWord } from "../types";

// "all" = mọi cấp; còn lại là một Level cụ thể (kids/a1/a2/b1/b2/c1).
export type LevelFilter = string;

const rank = (lv: string): number => LEVEL_ORDER.indexOf(lv as never);

// Kế thừa: từ ở cấp THẤP cũng xuất hiện ở cấp CAO hơn (a1 = kids+a1; b2 = kids..b2).
export function matchesLevel(wordLevel: string, level: LevelFilter): boolean {
  if (level === "all") return true;
  const wr = rank(wordLevel);
  const lr = rank(level);
  if (wr < 0 || lr < 0) return wordLevel === level; // cấp lạ -> so khớp tuyệt đối
  return wr <= lr;
}

// Các từ thuộc 1 chủ đề và đúng cấp đang chọn.
export function topicWords(words: VocabularyWord[], topicId: string, level: LevelFilter): VocabularyWord[] {
  return words.filter((w) => w.topicIds.includes(topicId) && matchesLevel(w.level, level));
}

// Các chủ đề có ít nhất 1 từ ở cấp đang chọn (để không hiện chủ đề rỗng).
export function topicsWithLevel<T extends { id: string }>(topics: T[], words: VocabularyWord[], level: LevelFilter): T[] {
  return topics.filter((t) => words.some((w) => w.topicIds.includes(t.id) && matchesLevel(w.level, level)));
}
