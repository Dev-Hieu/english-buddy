import type { ImageResult } from "../types";
import { getJson, serviceError } from "./http";
import { FUNCTIONS_BASE_URL } from "./firebase";

// Gọi Functions /image (proxy Pexels, giấu key) — TECH_SPEC §8.2 / DECISIONS D-005.
// KHÔNG gọi Pexels trực tiếp ở client.
export async function getWordImages(query: string): Promise<ImageResult[]> {
  if (!FUNCTIONS_BASE_URL) {
    throw serviceError("unknown", "Chưa cấu hình VITE_FUNCTIONS_BASE_URL");
  }
  const url = `${FUNCTIONS_BASE_URL}/image?query=${encodeURIComponent(query.trim())}`;
  return getJson<ImageResult[]>(url);
}
