// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)
import type { Level } from "./student";

export interface Topic {
  id: string; // "topic_food"
  name: string; // "Food"
  name_vi: string; // "Đồ ăn"
  level: Level;
  order: number;
}

export interface VocabularyWord {
  id: string; // "word_apple"
  word: string; // "apple"
  phonetic?: string; // "/ˈæp.əl/"
  meaning_vi: string; // "quả táo"
  meaning_en?: string;
  example?: string;
  example_vi?: string;
  topicIds: string[]; // 1 từ có thể thuộc nhiều chủ đề (vd "fish")
  level: Level;
  imageUrl: string; // ảnh đã duyệt cho từ seed
  audioUrl?: string; // ưu tiên phát file này; rỗng -> dùng TTS
  source: "seed" | "dictionary_api";
  createdAt: number;
}
