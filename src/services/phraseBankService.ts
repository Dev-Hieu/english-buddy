import { apiRequest } from "./api";

export interface BankPhrase {
  id: string;
  phrase: string;
  meaning_vi: string;
  type: "phrasal_verb" | "collocation" | "expression";
  level: string;
  category: string;
  examples: { en: string; vi: string }[];
  collocations: string[];
  response: string;
  example_dialogue: { speaker: string; text: string }[];
}

const cache = new Map<string, BankPhrase[]>();

export async function getPhraseBank(level?: string, category?: string): Promise<BankPhrase[]> {
  const key = `${level || "all"}_${category || "all"}`;
  if (cache.has(key)) return cache.get(key)!;
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  const data = await apiRequest<BankPhrase[]>(`/api/phrase-bank?${params}`);
  cache.set(key, data);
  return data;
}
