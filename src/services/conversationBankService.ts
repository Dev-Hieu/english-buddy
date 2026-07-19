import { apiRequest } from "./api";

export interface BankScenario {
  id: string;
  scenario: string;
  scenario_vi: string;
  level: string;
  category: string;
  roles: string[];
  dialogue: { role: string; en: string; vi: string }[];
  key_phrases: string[];
  key_vocab: string[];
  grammar_points: string[];
}

const cache = new Map<string, BankScenario[]>();

export async function getConversationBank(level?: string, category?: string): Promise<BankScenario[]> {
  const key = `${level || "all"}_${category || "all"}`;
  if (cache.has(key)) return cache.get(key)!;
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  const data = await apiRequest<BankScenario[]>(`/api/conversation-bank?${params}`);
  cache.set(key, data);
  return data;
}
