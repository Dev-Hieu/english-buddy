import { apiRequest } from "./api";
import type { Topic, VocabularyWord } from "../types";

// Lấy nội dung từ server (public). UI có thể dùng thay cho SEED_* khi muốn data thật.
export function getTopics(): Promise<Topic[]> {
  return apiRequest(`/api/topics`, { auth: false });
}

export function getVocabulary(topicId?: string): Promise<VocabularyWord[]> {
  const q = topicId ? `?topicId=${encodeURIComponent(topicId)}` : "";
  return apiRequest(`/api/vocabulary${q}`, { auth: false });
}
