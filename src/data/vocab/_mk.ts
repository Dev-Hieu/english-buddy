import type { Level, VocabularyWord } from "../../types";
import { IMAGE_URLS } from "../seedImages";

const CREATED = Date.UTC(2026, 5, 18);

// Helper tạo 1 từ vựng đầy đủ trường. Agent sinh dữ liệu chỉ cần gọi mk(...).
// imageUrl/audioUrl để rỗng (ảnh lấy Pexels qua /picker, audio TTS/dictionary).
export function mk(
  level: Level,
  id: string,
  word: string,
  phonetic: string,
  meaning_vi: string,
  meaning_en: string,
  example: string,
  example_vi: string,
  topicIds: string[],
): VocabularyWord {
  return {
    id, word, phonetic, meaning_vi, meaning_en, example, example_vi,
    topicIds, level, imageUrl: IMAGE_URLS[id] ?? "", audioUrl: "", source: "seed", createdAt: CREATED,
  };
}
