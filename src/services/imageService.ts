import { apiRequest } from "./api";
import type { ImageResult } from "../types";

// Gọi /api/image (server proxy Pexels, giấu key) — public endpoint.
export function getWordImages(query: string, count = 12, page = 1): Promise<ImageResult[]> {
  return apiRequest(`/api/image?query=${encodeURIComponent(query.trim())}&count=${count}&page=${page}`, { auth: false });
}

// Chọn/đổi ảnh cho 1 từ (admin) — server cập nhật DB + seedImages.ts.
export function pickImage(wordId: string, url: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/image-pick`, { method: "POST", body: { wordId, url } });
}

// Bản đồ ảnh mới nhất từ DB (id -> url) — áp đè ảnh build sẵn để mọi người thấy ảnh đã đổi.
export function getImageMap(): Promise<Record<string, string>> {
  return apiRequest(`/api/images`, { auth: false });
}
