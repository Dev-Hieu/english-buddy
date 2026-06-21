import { apiRequest } from "./api";

export type Lang = "en" | "vi";

// Dịch 2 chiều qua /api/translate — premium dùng DeepSeek AI, free dùng MyMemory.
// Gửi token (nếu có) để server biết premium hay không.
export async function translate(text: string, from: Lang, to: Lang): Promise<string> {
  const q = text.trim();
  if (!q) return "";
  const data = await apiRequest<{ translation: string }>(
    `/api/translate?text=${encodeURIComponent(q)}&from=${from}&to=${to}`,
    { auth: true }
  );
  return data.translation ?? "";
}

// Tiện ích cho tra từ: Anh -> Việt.
export function translateToVi(text: string): Promise<string> {
  return translate(text, "en", "vi");
}
