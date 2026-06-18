// I/O types dùng chung giữa services (Claude) và UI (Codex).
// Đồng bộ với docs/CONTRACTS.md §2 (Contracts version 1).

export interface ServiceError extends Error {
  code: "network" | "not_found" | "rate_limit" | "unknown";
}

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

export interface ImageResult {
  id: string;
  url: string;
  thumbUrl: string;
  photographer: string;
  sourceUrl: string;
}
