import { apiRequest } from "./api";
import type { ImageResult } from "../types";

// Gọi /api/image (server proxy Pexels, giấu key) — public endpoint.
export function getWordImages(query: string): Promise<ImageResult[]> {
  return apiRequest(`/api/image?query=${encodeURIComponent(query.trim())}`, { auth: false });
}
