// Tình huống luyện hội thoại. Chạy 2 chế độ:
// - AI (có DEEPSEEK_API_KEY): chat tự do, sửa lỗi câu.
// - Kịch bản (free, không key): đi theo các bước có sẵn, chọn câu trả lời đúng.

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ScriptOption {
  en: string;
  vi: string;
}

export interface ScriptStep {
  bot_en: string; // nhân vật nói
  bot_vi: string;
  options: ScriptOption[]; // các câu trả lời để chọn
  answer: string; // câu đúng (∈ options.en)
}

export interface ChatScenario {
  id: string;
  emoji: string;
  title_vi: string;
  prompt: string; // ngữ cảnh cho AI
  opening_en: string; // câu mở đầu
  opening_vi: string;
  steps: ScriptStep[]; // dùng cho chế độ kịch bản (free)
}
