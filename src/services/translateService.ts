import { apiRequest } from "./api";

// Gọi /api/translate (server proxy MyMemory en->vi, có cache) — public endpoint.
export async function translateToVi(text: string): Promise<string> {
  const q = text.trim();
  if (!q) return "";
  const data = await apiRequest<{ translation: string }>(
    `/api/translate?text=${encodeURIComponent(q)}`,
    { auth: false }
  );
  return data.translation ?? "";
}
