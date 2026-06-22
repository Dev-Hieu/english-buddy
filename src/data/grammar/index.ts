// Tổng hợp bài học ngữ pháp theo cấp độ. Thêm đợt mới -> import file & nối vào mảng.
import type { GrammarTopic } from "../../types";
import { KIDS_GRAMMAR } from "./kids";
import { A1_GRAMMAR } from "./a1";
import { A2_GRAMMAR } from "./a2";
import { B1_GRAMMAR } from "./b1";
import { B2_GRAMMAR } from "./b2";
import { C1_GRAMMAR } from "./c1";

// Mẫu khởi tạo (kids + a1) — các file cấp khác do agent sinh, nối ở dưới.
const SEED_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_kids_thisthat",
    level: "kids",
    title: "This / That",
    title_vi: "This và That",
    summary_vi: "Dùng 'this' cho vật ở GẦN, 'that' cho vật ở XA.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "this = cái này → vật ở GẦN mình.",
          "that = cái kia → vật ở XA mình.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "This is + danh từ số ít: This is a cat. — Đây là con mèo.",
          "That is + danh từ số ít: That is a dog. — Kia là con chó.",
          "Câu hỏi: Is this/that...? → Is this your pen? — Đây có phải bút của bạn không?",
        ],
      },
      {
        heading: "Số nhiều: These / Those",
        points: [
          "these = những cái này (gần): These are my books. — Đây là sách của tôi.",
          "those = những cái kia (xa): Those are birds. — Kia là những con chim.",
          "💡 this → these (gần, số nhiều) | that → those (xa, số nhiều).",
        ],
      },
    ],
    points: [
      "this = cái này (ở gần): This is a cat. — Đây là con mèo.",
      "that = cái kia (ở xa): That is a dog. — Kia là con chó.",
      "these = những cái này (gần): These are my books.",
      "those = những cái kia (xa): Those are birds.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "___ is my book. (ở gần)", options: ["This", "That"], answer: "This", explain_vi: "Vật ở gần dùng This." },
      { id: "e2", type: "choice", question: "Look! ___ is a bird in the sky. (ở xa)", options: ["This", "That"], answer: "That", explain_vi: "Vật ở xa dùng That." },
      { id: "e3", type: "choice", question: "___ are my shoes. (ở gần, số nhiều)", options: ["This", "These", "Those"], answer: "These", explain_vi: "Gần + số nhiều → These." },
      { id: "e4", type: "choice", question: "___ are clouds in the sky. (ở xa, số nhiều)", options: ["These", "Those", "That"], answer: "Those", explain_vi: "Xa + số nhiều → Those." },
      { id: "e5", type: "fill", question: "___ is an apple. (ở gần)", answer: "This", explain_vi: "Vật ở gần, số ít → This." },
      { id: "e6", type: "fill", question: "___ is a mountain. (ở xa)", answer: "That", explain_vi: "Vật ở xa, số ít → That." },
      { id: "e7", type: "fill", question: "___ are pencils on my desk. (ở gần, nhiều)", answer: "These", explain_vi: "Gần + số nhiều → These." },
      { id: "e8", type: "choice", question: "Is ___ your bag? (ở gần)", options: ["this", "that", "those"], answer: "this", explain_vi: "Hỏi vật ở gần → this." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["is", "This", "cat", "a"], answer: "This is a cat", explain_vi: "This is + a + danh từ." },
      { id: "e10", type: "reorder", question: "Sắp xếp:", options: ["are", "Those", "dogs"], answer: "Those are dogs", explain_vi: "Those are + danh từ số nhiều." },
    ],
  },
  {
    id: "gr_a1_present_simple",
    level: "a1",
    title: "Present Simple",
    title_vi: "Thì hiện tại đơn",
    summary_vi: "Diễn tả thói quen, chân lý hoặc sự thật hiển nhiên.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: thói quen hàng ngày, sự thật, chân lý.",
          "Dấu hiệu: always, usually, often, sometimes, never, every day/week...",
        ],
      },
      {
        heading: "Với động từ TO BE (am / is / are)",
        points: [
          "(+) Khẳng định: S + am/is/are → I am a student. / She is happy.",
          "(-) Phủ định: S + am not / isn't / aren't → He isn't at home.",
          "(?) Câu hỏi: Am/Is/Are + S...? → Are you ready?",
        ],
      },
      {
        heading: "Với động từ THƯỜNG (V)",
        points: [
          "(+) I/You/We/They + V → I play tennis.",
          "(+) He/She/It + V-s/V-es → She watches TV.",
          "💡 Thêm -es khi V tận cùng O, S, CH, X, SH (Oanh Sáu Chạy Xe SH): go → goes, wash → washes.",
          "(-) S + don't/doesn't + V → He doesn't like tea. (đã dùng trợ ĐT thì V không thêm s).",
          "(?) Do/Does + S + V? → Do you play football?",
        ],
      },
    ],
    points: [
      "Thói quen: I play football every day. — Tôi chơi bóng đá mỗi ngày.",
      "Sự thật: Water boils at 100°C. — Nước sôi ở 100°C.",
      "He/She/It + V-s: She plays the piano. — Cô ấy chơi piano.",
      "Phủ định: don't / doesn't + V: He doesn't like tea.",
      "Câu hỏi: Do / Does + S + V?: Does she speak English?",
      "💡 Thêm -es: go → goes, watch → watches, wash → washes (O, S, CH, X, SH).",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ to school every day.", options: ["go", "goes", "going"], answer: "goes", explain_vi: "Chủ ngữ 'she' (số ít) → thêm -es: go → goes." },
      { id: "e2", type: "choice", question: "They ___ TV in the evening.", options: ["watch", "watches"], answer: "watch", explain_vi: "Chủ ngữ 'they' (số nhiều) → giữ nguyên V." },
      { id: "e3", type: "fill", question: "He ___ (like) coffee.", answer: "likes", explain_vi: "He (số ít) + V-s → likes." },
      { id: "e4", type: "choice", question: "He doesn't ___ tea.", options: ["like", "likes", "liking"], answer: "like", explain_vi: "Đã có trợ ĐT 'doesn't' → V giữ nguyên thể: like." },
      { id: "e5", type: "choice", question: "___ you play football?", options: ["Do", "Does", "Are"], answer: "Do", explain_vi: "Chủ ngữ 'you' → dùng Do." },
      { id: "e6", type: "fill", question: "She ___ (wash) the dishes every night.", answer: "washes", explain_vi: "She (số ít) + V-es: wash → washes (tận cùng -sh)." },
      { id: "e7", type: "reorder", question: "Sắp xếp: every / I / morning / run", options: ["every", "I", "morning", "run"], answer: "I run every morning", explain_vi: "Trật tự: S + V + trạng từ thời gian." },
    ],
  },
];

function dedupe(list: GrammarTopic[]): GrammarTopic[] {
  const seen = new Set<string>();
  return list.filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
}

export const GRAMMAR_TOPICS: GrammarTopic[] = dedupe([
  ...SEED_GRAMMAR,
  ...KIDS_GRAMMAR, ...A1_GRAMMAR, ...A2_GRAMMAR, ...B1_GRAMMAR, ...B2_GRAMMAR, ...C1_GRAMMAR,
]);
