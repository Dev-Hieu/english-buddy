import { apiRequest } from "./api";

export type Lang = "en" | "vi";

// Dịch 2 chiều qua /api/translate (server proxy MyMemory, có cache) — public endpoint.
export async function translate(text: string, from: Lang, to: Lang): Promise<string> {
  const q = text.trim();
  if (!q) return "";
  const data = await apiRequest<{ translation: string }>(
    `/api/translate?text=${encodeURIComponent(q)}&from=${from}&to=${to}`,
    { auth: false }
  );
  return data.translation ?? "";
}

// Tiện ích cho tra từ: Anh -> Việt.
export function translateToVi(text: string): Promise<string> {
  return translate(text, "en", "vi");
}
