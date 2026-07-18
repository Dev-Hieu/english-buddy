/**
 * Video-first lesson content.
 * Mỗi topic có 1 video YouTube → từ vựng + cụm từ + câu mẫu rút từ video.
 * Các pages ưu tiên dùng dữ liệu này khi topicId khớp.
 */

export interface VideoWord {
  word: string;
  meaning_vi: string;
  pos: string;
  example: string;
}

export interface VideoPhrase {
  en: string;
  vi: string;
  context: string;
}

export interface VideoSentence {
  en: string;
  vi: string;
}

export interface VideoLesson {
  topicId: string;
  videoId: string;
  title: string;
  channel: string;
  vocabulary: VideoWord[];
  phrases: VideoPhrase[];
  sentences: VideoSentence[];
}

// ════════════════════════════════════════
// A1 — BBC Learning English + Easy English
// ════════════════════════════════════════

const greetings: VideoLesson = {
  topicId: "topic_greetings",
  videoId: "I_tRSrPru94",
  title: "How to introduce yourself",
  channel: "BBC Learning English",
  vocabulary: [
    { word: "hello", meaning_vi: "xin chào", pos: "interjection", example: "Hello, what's your name?" },
    { word: "hi", meaning_vi: "chào", pos: "interjection", example: "Hi, I'm Tim." },
    { word: "hey", meaning_vi: "này", pos: "interjection", example: "Hey. What are your names?" },
    { word: "hiya", meaning_vi: "chào bạn", pos: "interjection", example: "Hello! Hiya." },
    { word: "goodbye", meaning_vi: "tạm biệt", pos: "interjection", example: "Goodbye! Bye!" },
    { word: "bye", meaning_vi: "tạm biệt", pos: "interjection", example: "Bye, Buli!" },
    { word: "name", meaning_vi: "tên", pos: "noun", example: "What's your name?" },
    { word: "my", meaning_vi: "của tôi", pos: "pronoun", example: "My name's Tim." },
    { word: "your", meaning_vi: "của bạn", pos: "pronoun", example: "What's your name?" },
    { word: "his", meaning_vi: "của anh ấy", pos: "pronoun", example: "His name's Tim." },
    { word: "her", meaning_vi: "của cô ấy", pos: "pronoun", example: "Her name's Sian." },
    { word: "I", meaning_vi: "tôi", pos: "pronoun", example: "I'm Tim." },
    { word: "you", meaning_vi: "bạn", pos: "pronoun", example: "Nice to meet you." },
    { word: "he", meaning_vi: "anh ấy", pos: "pronoun", example: "What's his name?" },
    { word: "she", meaning_vi: "cô ấy", pos: "pronoun", example: "She's Sian." },
    { word: "meet", meaning_vi: "gặp", pos: "verb", example: "Nice to meet you." },
    { word: "nice", meaning_vi: "vui", pos: "adjective", example: "Nice to meet you." },
    { word: "lovely", meaning_vi: "tuyệt vời", pos: "adjective", example: "Lovely to meet you too." },
    { word: "great", meaning_vi: "tuyệt vời", pos: "adjective", example: "Great to meet you too." },
    { word: "too", meaning_vi: "cũng", pos: "adverb", example: "Lovely to meet you too." },
    { word: "how", meaning_vi: "thế nào", pos: "adverb", example: "How's it going?" },
    { word: "going", meaning_vi: "diễn ra", pos: "verb", example: "How's it going?" },
    { word: "what", meaning_vi: "gì", pos: "pronoun", example: "What's your name?" },
    { word: "where", meaning_vi: "ở đâu", pos: "adverb", example: "Where are they from?" },
    { word: "from", meaning_vi: "từ", pos: "preposition", example: "Where are they from?" },
    { word: "live", meaning_vi: "sống", pos: "verb", example: "Where do they live?" },
    { word: "right", meaning_vi: "đúng", pos: "adjective", example: "That's right." },
    { word: "now", meaning_vi: "bây giờ", pos: "adverb", example: "Now, what's her name?" },
    { word: "next", meaning_vi: "tiếp theo", pos: "adjective", example: "Find out in the next video!" },
  ],
  phrases: [
    { en: "Hello, what's your name?", vi: "Xin chào, tên bạn là gì?", context: "Bắt đầu hội thoại, hỏi tên" },
    { en: "Hi, I'm Tim.", vi: "Chào, tôi là Tim.", context: "Giới thiệu bản thân" },
    { en: "My name's Tim.", vi: "Tên tôi là Tim.", context: "Cách khác để giới thiệu" },
    { en: "It's nice to meet you.", vi: "Rất vui được gặp bạn.", context: "Lịch sự khi gặp ai lần đầu" },
    { en: "Lovely to meet you too.", vi: "Tôi cũng rất vui.", context: "Đáp lại 'nice to meet you'" },
    { en: "Hello, how's it going?", vi: "Chào, dạo này thế nào?", context: "Hỏi thăm thân mật" },
    { en: "What are your names?", vi: "Tên các bạn là gì?", context: "Hỏi tên nhiều người" },
    { en: "Where are they from?", vi: "Họ đến từ đâu?", context: "Hỏi quê quán" },
    { en: "Where do they live?", vi: "Họ sống ở đâu?", context: "Hỏi nơi ở" },
    { en: "What's his name?", vi: "Tên anh ấy là gì?", context: "Hỏi tên nam" },
    { en: "What's her name?", vi: "Tên cô ấy là gì?", context: "Hỏi tên nữ" },
    { en: "That's right.", vi: "Đúng vậy.", context: "Xác nhận đúng" },
    { en: "Goodbye!", vi: "Tạm biệt!", context: "Chào tạm biệt" },
  ],
  sentences: [
    { en: "Hello, what's your name?", vi: "Xin chào, tên bạn là gì?" },
    { en: "Hi, I'm Tim.", vi: "Chào, tôi là Tim." },
    { en: "My name's Tim.", vi: "Tên tôi là Tim." },
    { en: "It's nice to meet you.", vi: "Rất vui được gặp bạn." },
    { en: "Lovely to meet you too.", vi: "Tôi cũng rất vui được gặp bạn." },
    { en: "Hello, how's it going?", vi: "Xin chào, dạo này thế nào?" },
    { en: "What are your names?", vi: "Tên các bạn là gì?" },
    { en: "Nice to meet you, Georgie!", vi: "Rất vui được gặp bạn, Georgie!" },
    { en: "Where are they from?", vi: "Họ đến từ đâu?" },
    { en: "Where do they live?", vi: "Họ sống ở đâu?" },
    { en: "What's his name?", vi: "Tên anh ấy là gì?" },
    { en: "What's her name?", vi: "Tên cô ấy là gì?" },
    { en: "That's right.", vi: "Đúng vậy." },
    { en: "Goodbye!", vi: "Tạm biệt!" },
  ],
};

// ── Registry ──

export const VIDEO_LESSONS: Record<string, VideoLesson> = {
  topic_greetings: greetings,
};

/** Get video lesson for a topicId, or undefined if none exists */
export function getVideoLesson(topicId: string): VideoLesson | undefined {
  return VIDEO_LESSONS[topicId];
}
