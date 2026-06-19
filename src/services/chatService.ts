import { apiRequest } from "./api";
import type { ChatMessage } from "../types";

// Có bật chat AI (DeepSeek) không -> client chọn chế độ AI hay kịch bản.
export function getChatStatus(): Promise<{ enabled: boolean }> {
  return apiRequest(`/api/chat/status`);
}

// Gửi hội thoại tới gia sư AI (server proxy DeepSeek).
export function sendChat(messages: ChatMessage[], level: string, scenario: string): Promise<{ reply: string }> {
  return apiRequest(`/api/chat`, { method: "POST", body: { messages, level, scenario } });
}
