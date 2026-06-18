// Tổng hợp bài học ngữ pháp theo cấp độ. Thêm đợt mới -> import file & nối vào mảng.
import type { GrammarTopic } from "../../types";

// Mẫu khởi tạo (kids + a1) — các file cấp khác do agent sinh, nối ở dưới.
const SEED_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_kids_thisthat",
    level: "kids",
    title: "This / That",
    title_vi: "This và That",
    summary_vi: "Dùng 'this' cho vật ở GẦN, 'that' cho vật ở XA.",
    points: [
      "this = cái này (ở gần): This is a cat. — Đây là con mèo.",
      "that = cái kia (ở xa): That is a dog. — Kia là con chó.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "___ is my book. (ở gần)", options: ["This", "That"], answer: "This", explain_vi: "Vật ở gần dùng This." },
      { id: "e2", type: "choice", question: "Look! ___ is a bird in the sky. (ở xa)", options: ["This", "That"], answer: "That", explain_vi: "Vật ở xa dùng That." },
      { id: "e3", type: "fill", question: "___ is an apple. (ở gần)", answer: "This", explain_vi: "Điền This cho vật ở gần." },
    ],
  },
  {
    id: "gr_a1_present_simple",
    level: "a1",
    title: "Present Simple",
    title_vi: "Thì hiện tại đơn",
    summary_vi: "Diễn tả thói quen, sự thật. Chủ ngữ he/she/it thì động từ thêm -s.",
    points: [
      "I/you/we/they + V: I play football. — Tôi chơi bóng đá.",
      "he/she/it + V-s: She plays the piano. — Cô ấy chơi piano.",
      "Phủ định: don't / doesn't: He doesn't like tea.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ to school every day.", options: ["go", "goes", "going"], answer: "goes", explain_vi: "Chủ ngữ 'she' nên thêm -es." },
      { id: "e2", type: "choice", question: "They ___ TV in the evening.", options: ["watch", "watches"], answer: "watch", explain_vi: "Chủ ngữ 'they' giữ nguyên động từ." },
      { id: "e3", type: "fill", question: "He ___ (like) coffee.", answer: "likes", explain_vi: "he + V-s -> likes." },
      { id: "e4", type: "reorder", question: "Sắp xếp: every / I / morning / run", options: ["every", "I", "morning", "run"], answer: "I run every morning", explain_vi: "Trật tự: S + V + trạng từ thời gian." },
    ],
  },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [...SEED_GRAMMAR];
