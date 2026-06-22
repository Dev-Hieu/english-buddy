// Ngữ pháp tiếng Anh cấp A1 (giải thích tiếng Việt). KHÔNG bao gồm 'Present Simple' (đã có ở index).
import type { GrammarTopic } from "../../types";

export const A1_GRAMMAR: GrammarTopic[] = [
  /* ───────────────────────────── 1. VERB TO BE ───────────────────────────── */
  {
    id: "gr_a1_to_be",
    level: "a1",
    title: "Verb to be (am / is / are)",
    title_vi: "Động từ to be (thì, là, ở)",
    summary_vi:
      "Dùng 'am' với I, 'is' với he/she/it (số ít), 'are' với you/we/they (số nhiều).",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "(+) Khẳng định: S + am/is/are → I am a student. / She is happy. / They are at home.",
          "(-) Phủ định: S + am not / isn't / aren't → I am not tired. / He isn't here.",
          "(?) Câu hỏi: Am/Is/Are + S...? → Is she a teacher? — Yes, she is. / No, she isn't.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I am a student. — Tôi là học sinh.",
          "She is happy. — Cô ấy vui.",
          "They are at home. — Họ ở nhà.",
          "We are not (aren't) late. — Chúng tôi không trễ.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Rút gọn: I'm, he's, she's, it's, you're, we're, they're.",
          "💡 'am not' KHÔNG rút gọn thành *amn't; chỉ nói I'm not.",
        ],
      },
    ],
    points: [
      "I am a student. — Tôi là học sinh.",
      "She is happy. — Cô ấy vui.",
      "They are at home. — Họ ở nhà.",
      "Phủ định: thêm 'not': I am not tired. / He is not (isn't) here.",
      "Câu hỏi: Am/Is/Are + S? → Is she a teacher?",
      "💡 Rút gọn: I'm, he's, she's, it's, you're, we're, they're.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I ___ a teacher.", options: ["am", "is", "are"], answer: "am", explain_vi: "Chủ ngữ 'I' luôn đi với 'am'." },
      { id: "e2", type: "choice", question: "She ___ my friend.", options: ["am", "is", "are"], answer: "is", explain_vi: "Chủ ngữ số ít 'she' đi với 'is'." },
      { id: "e3", type: "fill", question: "We ___ students. (am/is/are)", answer: "are", explain_vi: "Chủ ngữ 'we' (số nhiều) đi với 'are'." },
      { id: "e4", type: "fill", question: "He ___ not at school. (am/is/are)", answer: "is", explain_vi: "'he' đi với 'is'; phủ định là is not / isn't." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["are", "You", "tall"], answer: "You are tall", explain_vi: "Trật tự: S (You) + to be (are) + tính từ." },
      { id: "e6", type: "choice", question: "___ they your parents?", options: ["Am", "Is", "Are"], answer: "Are", explain_vi: "'they' là số nhiều → dùng 'Are' cho câu hỏi." },
      { id: "e7", type: "fill", question: "It ___ a beautiful day. (am/is/are)", answer: "is", explain_vi: "'it' là số ít → dùng 'is'." },
      { id: "e8", type: "choice", question: "We ___ not ready.", options: ["am", "is", "are"], answer: "are", explain_vi: "'we' là số nhiều → dùng 'are'." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["not", "is", "He", "hungry"], answer: "He is not hungry", explain_vi: "Phủ định: S + is + not + tính từ." },
      { id: "e10", type: "choice", question: "I ___ not a doctor.", options: ["am", "is", "are"], answer: "am", explain_vi: "'I' luôn đi với 'am', kể cả phủ định: I am not." },
      { id: "e11", type: "fill", question: "___ you happy? (Am/Is/Are)", answer: "Are", explain_vi: "'you' đi với 'Are' trong câu hỏi." },
      { id: "e12", type: "reorder", question: "Sắp xếp:", options: ["Is", "a", "she", "student", "?"], answer: "Is she a student ?", explain_vi: "Câu hỏi: Is + S + danh từ?" },
    ],
  },

  /* ──────────────────────── 2. THERE IS / THERE ARE ──────────────────────── */
  {
    id: "gr_a1_there_is",
    level: "a1",
    title: "There is / There are",
    title_vi: "Có (số ít / số nhiều)",
    summary_vi: "There is + danh từ số ít; There are + danh từ số nhiều.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "(+) There is + danh từ số ít: There is a book on the table.",
          "(+) There are + danh từ số nhiều: There are two cats.",
          "(-) There isn't / There aren't: There aren't any chairs.",
          "(?) Is there...? / Are there...? → Is there a park near here?",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "There is a book on the table. — Có một quyển sách trên bàn.",
          "There are two cats. — Có hai con mèo.",
          "There aren't any chairs. — Không có cái ghế nào.",
          "Is there a bank near here? — Có ngân hàng gần đây không?",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Rút gọn: There's = There is. Không rút gọn There are thành *There're (hiếm dùng).",
          "💡 Dùng 'any' trong phủ định và câu hỏi: There aren't any books.",
        ],
      },
    ],
    points: [
      "There is a book on the table. — Có một quyển sách trên bàn.",
      "There are two cats. — Có hai con mèo.",
      "Phủ định: There isn't / There aren't: There aren't any chairs. — Không có cái ghế nào.",
      "Câu hỏi: Is there...? / Are there...?",
      "💡 Rút gọn: There's = There is.",
      "💡 Dùng 'any' trong phủ định và câu hỏi.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "___ three apples.", options: ["There is", "There are"], answer: "There are", explain_vi: "'three apples' là số nhiều → There are." },
      { id: "e2", type: "choice", question: "___ a dog in the garden.", options: ["There is", "There are"], answer: "There is", explain_vi: "'a dog' số ít → There is." },
      { id: "e3", type: "fill", question: "There ___ a pen. (is/are)", answer: "is", explain_vi: "'a pen' số ít → is." },
      { id: "e4", type: "fill", question: "There ___ many people here. (is/are)", answer: "are", explain_vi: "'many people' số nhiều → are." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["are", "There", "two", "dogs"], answer: "There are two dogs", explain_vi: "There are + danh từ số nhiều." },
      { id: "e6", type: "choice", question: "___ there a hospital near here?", options: ["Is", "Are"], answer: "Is", explain_vi: "'a hospital' số ít → Is there." },
      { id: "e7", type: "fill", question: "There ___ not any milk. (is/are)", answer: "is", explain_vi: "'milk' là danh từ không đếm được → is." },
      { id: "e8", type: "choice", question: "___ there any students in the room?", options: ["Is", "Are"], answer: "Are", explain_vi: "'students' số nhiều → Are there." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["Is", "there", "a", "park", "?"], answer: "Is there a park ?", explain_vi: "Câu hỏi: Is there + danh từ số ít?" },
      { id: "e10", type: "fill", question: "There ___ five books on the shelf. (is/are)", answer: "are", explain_vi: "'five books' số nhiều → are." },
    ],
  },

  /* ─────────────────────── 3. ARTICLES (A / AN / THE) ────────────────────── */
  {
    id: "gr_a1_articles",
    level: "a1",
    title: "Articles (a / an / the)",
    title_vi: "Mạo từ (a / an / the)",
    summary_vi:
      "Dùng 'a' trước phụ âm, 'an' trước nguyên âm (a,e,i,o,u); 'the' cho danh từ đã xác định.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "a + phụ âm: a book, a car, a university (âm /juː/ → phụ âm).",
          "an + nguyên âm: an apple, an egg, an hour (âm /aʊ/ → nguyên âm).",
          "the = cái đã nhắc đến hoặc duy nhất: the sun, the moon.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "a book — một quyển sách; a car — một chiếc xe.",
          "an apple — một quả táo; an egg — một quả trứng.",
          "The sun is hot. — Mặt trời thì nóng. (duy nhất)",
          "I have a cat. The cat is black. — Tôi có một con mèo. Con mèo đó màu đen. (đã nhắc)",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Quan trọng là ÂM đầu, không phải chữ cái: 'a university' (âm /j/), 'an hour' (âm /aʊ/).",
          "💡 Không dùng a/an với danh từ số nhiều hoặc không đếm được: ✗ a waters → ✓ water.",
        ],
      },
    ],
    points: [
      "a + phụ âm: a book, a car. — một quyển sách, một chiếc xe.",
      "an + nguyên âm: an apple, an egg. — một quả táo, một quả trứng.",
      "the = cái đã nhắc đến / duy nhất: The sun is hot. — Mặt trời thì nóng.",
      "💡 Quan trọng là ÂM đầu: 'a university' (âm /j/), 'an hour' (âm /aʊ/).",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I have ___ orange.", options: ["a", "an", "the"], answer: "an", explain_vi: "'orange' bắt đầu bằng nguyên âm 'o' → an." },
      { id: "e2", type: "choice", question: "She is reading ___ book.", options: ["a", "an"], answer: "a", explain_vi: "'book' bắt đầu bằng phụ âm 'b' → a." },
      { id: "e3", type: "fill", question: "He bought ___ umbrella. (a/an)", answer: "an", explain_vi: "'umbrella' bắt đầu bằng nguyên âm 'u' (âm /ʌ/) → an." },
      { id: "e4", type: "choice", question: "Look at ___ moon tonight.", options: ["a", "an", "the"], answer: "the", explain_vi: "Mặt trăng là vật duy nhất → the." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["an", "It", "egg", "is"], answer: "It is an egg", explain_vi: "S + to be + a/an + danh từ; 'egg' dùng 'an'." },
      { id: "e6", type: "choice", question: "He is ___ honest man.", options: ["a", "an", "the"], answer: "an", explain_vi: "'honest' có âm đầu /ɒ/ (h câm) → dùng 'an'." },
      { id: "e7", type: "fill", question: "She wants ___ banana. (a/an)", answer: "a", explain_vi: "'banana' bắt đầu bằng phụ âm 'b' → a." },
      { id: "e8", type: "choice", question: "This is ___ university.", options: ["a", "an"], answer: "a", explain_vi: "'university' có âm đầu /juː/ (phụ âm) → a." },
      { id: "e9", type: "fill", question: "I saw ___ elephant at the zoo. (a/an)", answer: "an", explain_vi: "'elephant' bắt đầu bằng nguyên âm 'e' → an." },
      { id: "e10", type: "reorder", question: "Sắp xếp:", options: ["the", "is", "The", "book", "on", "table"], answer: "The book is on the table", explain_vi: "'The book' (đã xác định) + is + on + the table." },
    ],
  },

  /* ──────────────────────────── 4. CAN / CAN'T ───────────────────────────── */
  {
    id: "gr_a1_can",
    level: "a1",
    title: "Can / Can't",
    title_vi: "Có thể / Không thể (khả năng)",
    summary_vi:
      "'can' diễn tả khả năng; sau 'can' là động từ nguyên thể (không 'to', không '-s').",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "(+) S + can + V (nguyên thể): I can swim.",
          "(-) S + can't (cannot) + V: He can't drive.",
          "(?) Can + S + V? → Can you speak English? — Yes, I can. / No, I can't.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I can swim. — Tôi có thể bơi.",
          "She can speak English. — Cô ấy có thể nói tiếng Anh.",
          "He can't drive. — Anh ấy không lái xe được.",
          "Can you help me? — Bạn có thể giúp tôi không?",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 'can' KHÔNG đổi theo chủ ngữ: He can (KHÔNG phải *He cans).",
          "💡 Sau 'can' KHÔNG có 'to': I can swim (KHÔNG phải *I can to swim).",
          "💡 can't = cannot (viết liền, không phải *can not).",
        ],
      },
    ],
    points: [
      "I can swim. — Tôi có thể bơi.",
      "She can speak English. — Cô ấy có thể nói tiếng Anh.",
      "Phủ định: can't (cannot): He can't drive. — Anh ấy không lái xe được.",
      "Câu hỏi: Can + S + V? → Can you help me?",
      "💡 'can' không đổi theo chủ ngữ, sau 'can' là V nguyên thể (không 'to').",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "Birds ___ fly.", options: ["can", "cans", "to can"], answer: "can", explain_vi: "'can' không thay đổi theo chủ ngữ." },
      { id: "e2", type: "choice", question: "She can ___ the piano.", options: ["play", "plays", "playing"], answer: "play", explain_vi: "Sau 'can' dùng động từ nguyên thể, không thêm -s." },
      { id: "e3", type: "fill", question: "Fish can't ___. (walk)", answer: "walk", explain_vi: "Sau can't dùng động từ nguyên thể: walk." },
      { id: "e4", type: "fill", question: "I ___ sing very well. (can/cans)", answer: "can", explain_vi: "'can' giữ nguyên với mọi chủ ngữ." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["can", "swim", "I"], answer: "I can swim", explain_vi: "Trật tự: S + can + V." },
      { id: "e6", type: "choice", question: "___ you speak French?", options: ["Can", "Do", "Are"], answer: "Can", explain_vi: "Hỏi khả năng → Can + S + V?" },
      { id: "e7", type: "fill", question: "He ___ run very fast. (can/can't)", answer: "can", explain_vi: "Câu khẳng định khả năng → can." },
      { id: "e8", type: "choice", question: "She can't ___ a car.", options: ["drive", "drives", "driving"], answer: "drive", explain_vi: "Sau can't dùng V nguyên thể." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["Can", "you", "me", "help", "?"], answer: "Can you help me ?", explain_vi: "Câu hỏi: Can + S + V + O?" },
      { id: "e10", type: "fill", question: "My baby ___ walk yet. (can/can't)", answer: "can't", explain_vi: "'yet' gợi ý chưa làm được → can't." },
      { id: "e11", type: "reorder", question: "Sắp xếp:", options: ["can't", "He", "cook"], answer: "He can't cook", explain_vi: "Phủ định: S + can't + V." },
    ],
  },

  /* ────────────────────── 5. PRESENT CONTINUOUS ──────────────────────────── */
  {
    id: "gr_a1_present_continuous",
    level: "a1",
    title: "Present Continuous",
    title_vi: "Thì hiện tại tiếp diễn (am/is/are + V-ing)",
    summary_vi:
      "Diễn tả hành động đang xảy ra: to be (am/is/are) + động từ thêm -ing.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: hành động đang xảy ra ngay lúc nói, kế hoạch tương lai gần.",
          "Dấu hiệu: now, right now, at the moment, look!, listen!",
        ],
      },
      {
        heading: "Với động từ TO BE",
        points: [
          "(+) S + am/is/are + V-ing: I am reading a book.",
          "(-) S + am not / isn't / aren't + V-ing: She isn't cooking.",
          "(?) Am/Is/Are + S + V-ing? → Are you studying?",
        ],
      },
      {
        heading: "Với động từ THƯỜNG",
        points: [
          "Thêm -ing: play → playing, eat → eating.",
          "💡 Bỏ 'e' cuối rồi thêm -ing: write → writing, make → making.",
          "💡 Gấp đôi phụ âm cuối (1 nguyên âm + 1 phụ âm): run → running, sit → sitting.",
          "💡 'ie' → 'ying': lie → lying, die → dying.",
        ],
      },
    ],
    points: [
      "I am reading a book. — Tôi đang đọc sách.",
      "She is cooking now. — Cô ấy đang nấu ăn lúc này.",
      "They are playing football. — Họ đang chơi bóng đá.",
      "Phủ định: S + am not / isn't / aren't + V-ing.",
      "Câu hỏi: Am/Is/Are + S + V-ing?",
      "💡 Bỏ 'e': write → writing. Gấp đôi phụ âm: run → running.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "He ___ watching TV.", options: ["am", "is", "are"], answer: "is", explain_vi: "Chủ ngữ 'he' đi với 'is'." },
      { id: "e2", type: "choice", question: "They ___ playing now.", options: ["is", "are"], answer: "are", explain_vi: "Chủ ngữ số nhiều 'they' đi với 'are'." },
      { id: "e3", type: "fill", question: "I am ___ (run) in the park.", answer: "running", explain_vi: "run → gấp đôi 'n' + -ing → running." },
      { id: "e4", type: "fill", question: "She is ___ (write) a letter.", answer: "writing", explain_vi: "write bỏ 'e' rồi thêm -ing → writing." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["is", "She", "singing"], answer: "She is singing", explain_vi: "Trật tự: S + is/are/am + V-ing." },
      { id: "e6", type: "choice", question: "I ___ eating breakfast.", options: ["am", "is", "are"], answer: "am", explain_vi: "'I' luôn đi với 'am'." },
      { id: "e7", type: "fill", question: "The baby is ___ (sleep) now.", answer: "sleeping", explain_vi: "sleep + -ing → sleeping (không gấp đôi vì 2 nguyên âm)." },
      { id: "e8", type: "choice", question: "She ___ not working today.", options: ["am", "is", "are"], answer: "is", explain_vi: "'she' đi với 'is'; phủ định: is not + V-ing." },
      { id: "e9", type: "fill", question: "They are ___ (swim) in the pool.", answer: "swimming", explain_vi: "swim → gấp đôi 'm' + -ing → swimming." },
      { id: "e10", type: "reorder", question: "Sắp xếp:", options: ["Are", "studying", "you", "?"], answer: "Are you studying ?", explain_vi: "Câu hỏi: Are + S + V-ing?" },
      { id: "e11", type: "choice", question: "___ he reading a book?", options: ["Am", "Is", "Are"], answer: "Is", explain_vi: "'he' đi với 'Is' trong câu hỏi." },
      { id: "e12", type: "fill", question: "We are ___ (make) dinner.", answer: "making", explain_vi: "make bỏ 'e' + -ing → making." },
    ],
  },

  /* ──────────────── 6. PREPOSITIONS OF PLACE (IN / ON / AT) ──────────────── */
  {
    id: "gr_a1_prepositions_place",
    level: "a1",
    title: "Prepositions of place (in / on / at)",
    title_vi: "Giới từ chỉ nơi chốn (in / on / at)",
    summary_vi:
      "'in' = bên trong; 'on' = trên bề mặt; 'at' = tại một điểm cụ thể.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "in = bên trong (không gian 3 chiều): in the box, in the room, in Vietnam.",
          "on = trên bề mặt: on the table, on the wall, on the floor.",
          "at = tại một điểm cụ thể: at school, at the bus stop, at home.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "The cat is in the box. — Con mèo ở trong hộp.",
          "The book is on the table. — Quyển sách ở trên bàn.",
          "I am at school. — Tôi ở trường.",
          "The picture is on the wall. — Bức tranh ở trên tường.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 at home, at work, at school — các cụm cố định (không có 'the').",
          "💡 in + thành phố/nước: in Hanoi, in Vietnam. at + địa chỉ cụ thể: at 5 Le Loi Street.",
          "💡 on + phương tiện công cộng: on the bus, on the train. Nhưng: in the car, in the taxi.",
        ],
      },
    ],
    points: [
      "in = trong: The cat is in the box. — Con mèo ở trong hộp.",
      "on = trên (bề mặt): The book is on the table. — Quyển sách ở trên bàn.",
      "at = tại (điểm): I am at school. — Tôi ở trường.",
      "💡 at home, at work, at school — cụm cố định.",
      "💡 in + thành phố/nước; at + địa chỉ cụ thể.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "The pen is ___ the bag.", options: ["in", "on", "at"], answer: "in", explain_vi: "Bên trong cái túi → in." },
      { id: "e2", type: "choice", question: "The cup is ___ the table.", options: ["in", "on", "at"], answer: "on", explain_vi: "Trên bề mặt bàn → on." },
      { id: "e3", type: "fill", question: "She is ___ the bus stop. (in/on/at)", answer: "at", explain_vi: "Tại một điểm cụ thể (trạm xe buýt) → at." },
      { id: "e4", type: "fill", question: "The picture is ___ the wall. (in/on/at)", answer: "on", explain_vi: "Trên bề mặt tường → on." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["in", "is", "The", "room", "boy", "the"], answer: "The boy is in the room", explain_vi: "S + to be + giới từ + nơi chốn; bên trong phòng → in." },
      { id: "e6", type: "choice", question: "He is ___ home now.", options: ["in", "on", "at"], answer: "at", explain_vi: "Cụm cố định: at home." },
      { id: "e7", type: "fill", question: "The keys are ___ the drawer. (in/on/at)", answer: "in", explain_vi: "Bên trong ngăn kéo → in." },
      { id: "e8", type: "choice", question: "There is a fly ___ the ceiling.", options: ["in", "on", "at"], answer: "on", explain_vi: "Trên bề mặt trần nhà → on." },
      { id: "e9", type: "fill", question: "She works ___ a hospital. (in/on/at)", answer: "in", explain_vi: "Bên trong tòa nhà bệnh viện → in." },
      { id: "e10", type: "reorder", question: "Sắp xếp:", options: ["at", "is", "She", "school"], answer: "She is at school", explain_vi: "S + to be + at + school (cụm cố định)." },
      { id: "e11", type: "choice", question: "My sister lives ___ Hanoi.", options: ["in", "on", "at"], answer: "in", explain_vi: "in + tên thành phố: in Hanoi." },
    ],
  },

  /* ───────────────────── 7. POSSESSIVE ADJECTIVES & 'S ────────────────────── */
  {
    id: "gr_a1_possessives",
    level: "a1",
    title: "Possessive adjectives & possessive 's",
    title_vi: "Tính từ sở hữu (my/your/his/her...) & sở hữu cách 's",
    summary_vi:
      "Tính từ sở hữu đứng trước danh từ để chỉ ai sở hữu. Thêm 's sau tên riêng/danh từ để chỉ sở hữu.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Tính từ sở hữu (possessive adjectives) thay cho đại từ để nói vật thuộc về ai.",
          "I → my, you → your, he → his, she → her, it → its, we → our, they → their.",
          "Possessive 's: thêm 's sau danh từ chỉ người để diễn tả sở hữu.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "Tính từ sở hữu + danh từ: my book, your name, his car, her phone.",
          "Danh từ số ít + 's: Tom's bag, my mother's house.",
          "Danh từ số nhiều đã có -s + ': the students' books, my parents' car.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "This is my book. — Đây là sách của tôi.",
          "Her name is Lan. — Tên cô ấy là Lan.",
          "Their house is big. — Nhà của họ to.",
          "Tom's bag is blue. — Cái túi của Tom màu xanh.",
          "The cat likes its toy. — Con mèo thích đồ chơi của nó.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 'its' (sở hữu) KHÔNG có dấu nháy. 'it's' = it is.",
          "💡 'your' (sở hữu) khác 'you're' (you are).",
          "💡 'their' (sở hữu) khác 'they're' (they are) và 'there' (ở đó).",
        ],
      },
    ],
    points: [
      "I → my, you → your, he → his, she → her, it → its, we → our, they → their.",
      "This is my book. — Đây là sách của tôi.",
      "Her name is Lan. — Tên cô ấy là Lan.",
      "Tom's bag is blue. — Cái túi của Tom màu xanh. (possessive 's)",
      "💡 'its' (sở hữu) khác 'it's' (it is).",
      "💡 'your' khác 'you're'; 'their' khác 'they're'.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "This is ___ pen. (I)", options: ["my", "I", "me"], answer: "my", explain_vi: "'I' → tính từ sở hữu 'my'." },
      { id: "e2", type: "choice", question: "___ name is Anna. (she)", options: ["She", "Her", "His"], answer: "Her", explain_vi: "'she' → tính từ sở hữu 'Her'." },
      { id: "e3", type: "fill", question: "They love ___ children. (they → ?)", answer: "their", explain_vi: "'they' → tính từ sở hữu 'their'." },
      { id: "e4", type: "choice", question: "The dog is eating ___ food.", options: ["it's", "its", "his"], answer: "its", explain_vi: "'its' là sở hữu (không có dấu nháy). 'it's' = it is." },
      { id: "e5", type: "fill", question: "Is this ___ car? (you → ?)", answer: "your", explain_vi: "'you' → tính từ sở hữu 'your'." },
      { id: "e6", type: "reorder", question: "Sắp xếp:", options: ["is", "His", "Tom", "name"], answer: "His name is Tom", explain_vi: "Tính từ sở hữu + danh từ: His name." },
      { id: "e7", type: "choice", question: "This is ___'s house.", options: ["Anna", "anna", "Annas"], answer: "Anna", explain_vi: "Thêm 's sau tên riêng: Anna's house." },
      { id: "e8", type: "fill", question: "We like ___ school. (we → ?)", answer: "our", explain_vi: "'we' → tính từ sở hữu 'our'." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["my", "is", "This", "book"], answer: "This is my book", explain_vi: "This is + tính từ sở hữu + danh từ." },
      { id: "e10", type: "choice", question: "___ bag is heavy. (Tom)", options: ["Tom's", "Toms", "Tom"], answer: "Tom's", explain_vi: "Sở hữu cách: Tom's = của Tom." },
      { id: "e11", type: "fill", question: "He likes ___ new phone. (he → ?)", answer: "his", explain_vi: "'he' → tính từ sở hữu 'his'." },
      { id: "e12", type: "reorder", question: "Sắp xếp:", options: ["mother's", "My", "is", "kind", "friend"], answer: "My mother's friend is kind", explain_vi: "My mother's friend = bạn của mẹ tôi (possessive 's)." },
    ],
  },

  /* ─────────────────────────── 8. SOME / ANY ──────────────────────────────── */
  {
    id: "gr_a1_some_any",
    level: "a1",
    title: "Some / Any",
    title_vi: "Some / Any (một vài, một ít)",
    summary_vi:
      "Dùng 'some' trong câu khẳng định (+), 'any' trong câu phủ định (-) và câu hỏi (?).",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "'some' = một vài / một ít — dùng trong câu khẳng định.",
          "'any' = bất kỳ / nào — dùng trong câu phủ định và câu hỏi.",
          "Cả hai dùng được với danh từ số nhiều đếm được và danh từ không đếm được.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "(+) S + V + some + N: I have some books. / There is some milk.",
          "(-) S + don't/doesn't/isn't/aren't + any + N: I don't have any books.",
          "(?) Do/Does/Is/Are... + any + N? → Do you have any money?",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I have some friends here. — Tôi có một vài người bạn ở đây.",
          "There is some water in the glass. — Có một ít nước trong ly.",
          "I don't have any brothers. — Tôi không có anh em trai nào.",
          "Are there any shops near here? — Có cửa hàng nào gần đây không?",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Dùng 'some' trong câu hỏi mời/xin lịch sự: Would you like some tea? / Can I have some water?",
          "💡 'not any' = 'no': I don't have any money. = I have no money.",
        ],
      },
    ],
    points: [
      "some = một vài/một ít — câu khẳng định: I have some books.",
      "any — câu phủ định & câu hỏi: I don't have any books. / Do you have any money?",
      "Dùng với danh từ số nhiều hoặc không đếm được: some water, any chairs.",
      "💡 'some' trong câu hỏi lịch sự: Would you like some tea?",
      "💡 'not any' = 'no': I don't have any money = I have no money.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I have ___ apples.", options: ["some", "any"], answer: "some", explain_vi: "Câu khẳng định → dùng 'some'." },
      { id: "e2", type: "choice", question: "She doesn't have ___ money.", options: ["some", "any"], answer: "any", explain_vi: "Câu phủ định → dùng 'any'." },
      { id: "e3", type: "fill", question: "Are there ___ eggs in the fridge? (some/any)", answer: "any", explain_vi: "Câu hỏi → dùng 'any'." },
      { id: "e4", type: "fill", question: "There is ___ milk on the table. (some/any)", answer: "some", explain_vi: "Câu khẳng định → dùng 'some'." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["have", "I", "some", "books"], answer: "I have some books", explain_vi: "S + V + some + N (câu khẳng định)." },
      { id: "e6", type: "choice", question: "Do you have ___ brothers?", options: ["some", "any"], answer: "any", explain_vi: "Câu hỏi → dùng 'any'." },
      { id: "e7", type: "choice", question: "Would you like ___ coffee?", options: ["some", "any"], answer: "some", explain_vi: "Câu mời lịch sự → dùng 'some'." },
      { id: "e8", type: "fill", question: "We don't have ___ homework today. (some/any)", answer: "any", explain_vi: "Câu phủ định (don't have) → 'any'." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["any", "don't", "I", "have", "pets"], answer: "I don't have any pets", explain_vi: "Phủ định: S + don't + V + any + N." },
      { id: "e10", type: "choice", question: "There are ___ chairs in the room.", options: ["some", "any"], answer: "some", explain_vi: "Câu khẳng định → 'some'." },
      { id: "e11", type: "fill", question: "Can I have ___ water, please? (some/any)", answer: "some", explain_vi: "Câu xin lịch sự → dùng 'some'." },
      { id: "e12", type: "reorder", question: "Sắp xếp:", options: ["any", "there", "Are", "near", "shops", "here", "?"], answer: "Are there any shops near here ?", explain_vi: "Câu hỏi: Are there + any + N + ...?" },
    ],
  },

  /* ──────────────────── 9. HOW MUCH / HOW MANY ────────────────────────────── */
  {
    id: "gr_a1_how_much_many",
    level: "a1",
    title: "How much / How many",
    title_vi: "Bao nhiêu (đếm được / không đếm được)",
    summary_vi:
      "'How many' + danh từ đếm được số nhiều; 'How much' + danh từ không đếm được.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "'How many' hỏi số lượng danh từ đếm được (countable): chairs, books, people.",
          "'How much' hỏi số lượng danh từ không đếm được (uncountable): water, money, time.",
          "'How much' cũng dùng để hỏi giá: How much is this? — Cái này giá bao nhiêu?",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "How many + N (số nhiều) + are there? → How many students are there?",
          "How many + N (số nhiều) + do/does + S + have? → How many books do you have?",
          "How much + N (không đếm được) + is there? → How much water is there?",
          "How much + is/are + N? → How much is this shirt? (hỏi giá)",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "How many chairs are there? — Có bao nhiêu cái ghế?",
          "How many brothers do you have? — Bạn có bao nhiêu anh em trai?",
          "How much milk is there? — Có bao nhiêu sữa?",
          "How much is this bag? — Cái túi này giá bao nhiêu?",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Danh từ không đếm được phổ biến: water, milk, rice, bread, money, time, sugar, coffee.",
          "💡 Không dùng 'How many' với danh từ không đếm được: ✗ How many water → ✓ How much water.",
          "💡 'How much' + không đếm được dùng 'is' (số ít): How much sugar is there?",
        ],
      },
    ],
    points: [
      "How many + đếm được (số nhiều): How many chairs are there?",
      "How much + không đếm được: How much water is there?",
      "How much = hỏi giá: How much is this? — Cái này bao nhiêu tiền?",
      "💡 Không đếm được thường gặp: water, milk, rice, bread, money, time.",
      "💡 Không dùng 'How many' với danh từ không đếm được.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "How ___ apples do you have?", options: ["much", "many"], answer: "many", explain_vi: "'apples' đếm được số nhiều → How many." },
      { id: "e2", type: "choice", question: "How ___ water do you need?", options: ["much", "many"], answer: "much", explain_vi: "'water' không đếm được → How much." },
      { id: "e3", type: "fill", question: "How ___ is this shirt? (much/many)", answer: "much", explain_vi: "Hỏi giá → How much." },
      { id: "e4", type: "choice", question: "How ___ students are in the class?", options: ["much", "many"], answer: "many", explain_vi: "'students' đếm được → How many." },
      { id: "e5", type: "fill", question: "How ___ sugar do you want? (much/many)", answer: "much", explain_vi: "'sugar' không đếm được → How much." },
      { id: "e6", type: "reorder", question: "Sắp xếp:", options: ["many", "How", "do", "books", "have", "you", "?"], answer: "How many books do you have ?", explain_vi: "How many + N + do + S + V?" },
      { id: "e7", type: "choice", question: "How ___ money do you have?", options: ["much", "many"], answer: "much", explain_vi: "'money' không đếm được → How much." },
      { id: "e8", type: "fill", question: "How ___ children does she have? (much/many)", answer: "many", explain_vi: "'children' đếm được → How many." },
      { id: "e9", type: "reorder", question: "Sắp xếp:", options: ["much", "How", "is", "this", "?"], answer: "How much is this ?", explain_vi: "Hỏi giá: How much + is + N?" },
      { id: "e10", type: "choice", question: "How ___ rice is there?", options: ["much", "many"], answer: "much", explain_vi: "'rice' không đếm được → How much." },
      { id: "e11", type: "fill", question: "How ___ eggs do we need? (much/many)", answer: "many", explain_vi: "'eggs' đếm được số nhiều → How many." },
      { id: "e12", type: "reorder", question: "Sắp xếp:", options: ["milk", "How", "is", "much", "there", "?"], answer: "How much milk is there ?", explain_vi: "How much + N (không đếm được) + is there?" },
    ],
  },

  /* ─────────────────────────── 10. IMPERATIVES ────────────────────────────── */
  {
    id: "gr_a1_imperatives",
    level: "a1",
    title: "Imperatives",
    title_vi: "Câu mệnh lệnh (Go! Don't run! Please sit down.)",
    summary_vi:
      "Dùng động từ nguyên thể (không chủ ngữ) để ra lệnh, yêu cầu, chỉ dẫn. Thêm 'Don't' để cấm.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Ra lệnh, yêu cầu: Open the door. / Sit down.",
          "Chỉ dẫn, hướng dẫn: Turn left. / Go straight.",
          "Lời mời, đề nghị: Come in. / Have a seat.",
          "Cấm, ngăn: Don't touch! / Don't be late.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "(+) V (nguyên thể) + ... : Open the window. / Listen!",
          "(-) Don't + V (nguyên thể) + ... : Don't run! / Don't be noisy.",
          "Thêm 'Please' để lịch sự: Please sit down. / Close the door, please.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "Go! — Đi đi!",
          "Don't run! — Đừng chạy!",
          "Please sit down. — Xin hãy ngồi xuống.",
          "Be quiet! — Im lặng!",
          "Don't be late. — Đừng đến trễ.",
          "Turn off your phone. — Tắt điện thoại đi.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Câu mệnh lệnh KHÔNG có chủ ngữ (ngầm hiểu là 'you').",
          "💡 Dùng 'Be' cho tính từ: Be careful! / Be quiet! (KHÔNG phải *Careful! trong ngữ pháp chuẩn).",
          "💡 Phủ định 'be': Don't be + adj: Don't be sad. (KHÔNG phải *Be not sad).",
        ],
      },
    ],
    points: [
      "Khẳng định: V nguyên thể → Open the door! / Sit down!",
      "Phủ định: Don't + V nguyên thể → Don't run! / Don't be late.",
      "Lịch sự: thêm 'Please' → Please sit down. / Close the door, please.",
      "💡 Không có chủ ngữ (ngầm hiểu là 'you').",
      "💡 Dùng 'Be' cho tính từ: Be careful! / Don't be sad.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "___ the door, please.", options: ["Open", "Opens", "Opening"], answer: "Open", explain_vi: "Câu mệnh lệnh dùng V nguyên thể: Open." },
      { id: "e2", type: "choice", question: "___ run in the hall!", options: ["Don't", "Doesn't", "Not"], answer: "Don't", explain_vi: "Phủ định mệnh lệnh: Don't + V." },
      { id: "e3", type: "fill", question: "___ quiet, please! (be/do)", answer: "Be", explain_vi: "Câu mệnh lệnh với tính từ: Be + adj." },
      { id: "e4", type: "fill", question: "Don't ___ late for class. (be/is)", answer: "be", explain_vi: "Don't + be + adj: Don't be late." },
      { id: "e5", type: "reorder", question: "Sắp xếp:", options: ["down", "Please", "sit"], answer: "Please sit down", explain_vi: "Please + V + trạng từ: Please sit down." },
      { id: "e6", type: "choice", question: "___ careful! The road is wet.", options: ["Be", "Is", "Are"], answer: "Be", explain_vi: "Mệnh lệnh + tính từ: Be careful!" },
      { id: "e7", type: "fill", question: "___ touch that! It's hot. (Do/Don't)", answer: "Don't", explain_vi: "Cấm → Don't + V: Don't touch." },
      { id: "e8", type: "reorder", question: "Sắp xếp:", options: ["Don't", "noisy", "be"], answer: "Don't be noisy", explain_vi: "Phủ định: Don't + be + adj." },
      { id: "e9", type: "choice", question: "___ left at the traffic light.", options: ["Turn", "Turns", "Turning"], answer: "Turn", explain_vi: "Chỉ dẫn: V nguyên thể → Turn." },
      { id: "e10", type: "fill", question: "___ your homework now. (do/does)", answer: "Do", explain_vi: "Mệnh lệnh: V nguyên thể → Do (your homework)." },
      { id: "e11", type: "reorder", question: "Sắp xếp:", options: ["the", "off", "Turn", "light"], answer: "Turn off the light", explain_vi: "V + trạng từ + tân ngữ: Turn off the light." },
      { id: "e12", type: "choice", question: "___ a seat, please.", options: ["Have", "Has", "Having"], answer: "Have", explain_vi: "Lời mời: V nguyên thể → Have a seat." },
    ],
  },
];
