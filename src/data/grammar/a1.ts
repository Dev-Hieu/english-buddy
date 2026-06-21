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
];
