import { apiRequest } from "./api";

export interface Category {
  id: string;
  name: string;
  name_vi: string;
  order: number;
  sub_topics: string[];
}

export interface BankWord {
  id: string;
  word: string;
  phonetic: string;
  meaning_vi: string;
  meaning_en: string;
  pos: string;
  level: string;
  categories: string[];
  frequency: number;
  examples: { en: string; vi: string }[];
  word_family: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  common_mistakes: { wrong: string; correct: string; explain_vi: string }[];
  grammar_patterns: string[];
  image: string;
  audio: string;
}

let cachedCategories: Category[] | null = null;
const wordCache = new Map<string, BankWord[]>();

export async function getCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  const data = await apiRequest<Category[]>("/api/categories");
  cachedCategories = data;
  return data;
}

export async function getWordBank(level?: string, category?: string): Promise<BankWord[]> {
  const key = `${level || "all"}_${category || "all"}`;
  if (wordCache.has(key)) return wordCache.get(key)!;
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  const data = await apiRequest<BankWord[]>(`/api/word-bank?${params}`);
  wordCache.set(key, data);
  return data;
}
