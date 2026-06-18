import { getJson, serviceError } from "./http";
import { FUNCTIONS_BASE_URL } from "./firebase";

// Gọi Functions /translate (nghĩa tiếng Việt cho Quick Lookup) — TECH_SPEC §8.3 / DECISIONS D-003.
export async function translateToVi(text: string): Promise<string> {
  const q = text.trim();
  if (!q) return "";
  if (!FUNCTIONS_BASE_URL) {
    throw serviceError("unknown", "Chưa cấu hình VITE_FUNCTIONS_BASE_URL");
  }
  const url = `${FUNCTIONS_BASE_URL}/translate?text=${encodeURIComponent(q)}`;
  const data = await getJson<{ translation: string }>(url);
  return data.translation ?? "";
}
