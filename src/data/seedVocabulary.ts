import type { VocabularyWord } from "../types";

// Mốc thời gian seed cố định (tránh giá trị động giữa các lần chạy).
const SEED_CREATED_AT = Date.UTC(2026, 5, 18); // 2026-06-18

// CHỦ ĐỀ FOOD — mẫu đầy đủ cho lát cắt dọc (TECH_SPEC §13).
// imageUrl/audioUrl để rỗng: ảnh do anh Hieu duyệt (C-002), audio lấy từ Dictionary hoặc TTS.
// 9 chủ đề còn lại: chờ nội dung (BACKLOG C-001/C-002, MESSAGES M-002).
export const SEED_VOCABULARY: VocabularyWord[] = [
  {
    id: "word_apple", word: "apple", phonetic: "/ˈæp.əl/",
    meaning_vi: "quả táo", meaning_en: "a round fruit with red, green, or yellow skin",
    example: "I eat an apple every day.", example_vi: "Con ăn một quả táo mỗi ngày.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_banana", word: "banana", phonetic: "/bəˈnɑː.nə/",
    meaning_vi: "quả chuối", meaning_en: "a long curved fruit with yellow skin",
    example: "Monkeys like bananas.", example_vi: "Khỉ thích chuối.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_rice", word: "rice", phonetic: "/raɪs/",
    meaning_vi: "cơm / gạo", meaning_en: "small white or brown grains eaten as food",
    example: "We eat rice for lunch.", example_vi: "Chúng con ăn cơm vào bữa trưa.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_bread", word: "bread", phonetic: "/bred/",
    meaning_vi: "bánh mì", meaning_en: "a food made from flour and baked",
    example: "She buys bread in the morning.", example_vi: "Chị ấy mua bánh mì vào buổi sáng.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_milk", word: "milk", phonetic: "/mɪlk/",
    meaning_vi: "sữa", meaning_en: "a white liquid drink from cows",
    example: "I drink milk every morning.", example_vi: "Con uống sữa mỗi sáng.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_water", word: "water", phonetic: "/ˈwɔː.tər/",
    meaning_vi: "nước", meaning_en: "a clear liquid that we drink",
    example: "Please give me some water.", example_vi: "Làm ơn cho con xin chút nước.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_egg", word: "egg", phonetic: "/eɡ/",
    meaning_vi: "quả trứng", meaning_en: "an oval food from a hen",
    example: "I like fried eggs.", example_vi: "Con thích trứng rán.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_chicken", word: "chicken", phonetic: "/ˈtʃɪk.ɪn/",
    meaning_vi: "thịt gà / con gà", meaning_en: "a farm bird, or its meat as food",
    example: "We have chicken for dinner.", example_vi: "Chúng con ăn thịt gà vào bữa tối.",
    topicIds: ["topic_food", "topic_animals"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    // fish thuộc cả Food và Animals -> 1 document, nhiều topicIds (DECISIONS D-008).
    id: "word_fish", word: "fish", phonetic: "/fɪʃ/",
    meaning_vi: "con cá / cá", meaning_en: "an animal that lives in water, also eaten as food",
    example: "My father catches fish.", example_vi: "Bố con bắt cá.",
    topicIds: ["topic_food", "topic_animals"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
  {
    id: "word_orange", word: "orange", phonetic: "/ˈɒr.ɪndʒ/",
    meaning_vi: "quả cam", meaning_en: "a round orange-colored fruit",
    example: "Orange juice is sweet.", example_vi: "Nước cam thì ngọt.",
    topicIds: ["topic_food"], level: "beginner", imageUrl: "", audioUrl: "",
    source: "seed", createdAt: SEED_CREATED_AT,
  },
];
