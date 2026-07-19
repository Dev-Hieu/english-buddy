import { apiRequest } from "./api";

export interface BankGrammarTopic {
  id: string;
  title: string;
  title_vi: string;
  level: string;
  category: string;
  description_vi: string;
  rules: { rule: string; example_en: string; example_vi: string }[];
  common_mistakes: { wrong: string; correct: string; explain_vi: string }[];
  related_vocab: string[];
  related_phrases: string[];
  exercises: any[];
}

const cache = new Map<string, BankGrammarTopic[]>();

export async function getGrammarBank(level?: string, category?: string): Promise<BankGrammarTopic[]> {
  const key = `${level || "all"}_${category || "all"}`;
  if (cache.has(key)) return cache.get(key)!;
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  const data = await apiRequest<BankGrammarTopic[]>(`/api/grammar-bank?${params}`);
  cache.set(key, data);
  return data;
}
