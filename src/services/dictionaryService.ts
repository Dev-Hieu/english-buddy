import type { DictionaryResult } from "../types";
import { getJson, serviceError } from "./http";
import { normalizeWord } from "../utils/normalizeWord";

// Free Dictionary API — không cần key. TECH_SPEC §8.1.
const ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en";

// Shape thô (rút gọn) của Free Dictionary API.
interface RawPhonetic { text?: string; audio?: string }
interface RawDefinition { definition: string; example?: string }
interface RawMeaning { partOfSpeech: string; definitions: RawDefinition[] }
interface RawEntry {
  word: string;
  phonetic?: string;
  phonetics?: RawPhonetic[];
  meanings?: RawMeaning[];
}

export async function getWordDefinition(word: string): Promise<DictionaryResult> {
  const q = normalizeWord(word);
  if (!q) throw serviceError("not_found", "Từ trống");

  const entries = await getJson<RawEntry[]>(`${ENDPOINT}/${encodeURIComponent(q)}`);
  const entry = entries?.[0];
  if (!entry) throw serviceError("not_found", `Không có dữ liệu cho "${q}"`);

  const phonetic = entry.phonetic ?? entry.phonetics?.find((p) => p.text)?.text;
  const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || undefined;

  const meanings = (entry.meanings ?? []).map((m) => ({
    partOfSpeech: m.partOfSpeech,
    definitions: m.definitions.map((d) => d.definition),
    examples: m.definitions.map((d) => d.example).filter((e): e is string => !!e),
  }));

  return { word: entry.word, phonetic, audioUrl, meanings };
}
