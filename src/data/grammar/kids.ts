import type { GrammarTopic } from "../../types";

export const KIDS_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_kids_aan",
    level: "kids",
    title: "A / An",
    title_vi: "Mạo từ a và an",
    summary_vi: "Dùng 'a' trước phụ âm, 'an' trước nguyên âm (a, e, i, o, u).",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Mạo từ a/an đứng trước danh từ số ít, chỉ một cái.",
          "Dùng khi nói về một thứ chung chung, không xác định cụ thể.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "a + danh từ bắt đầu bằng phụ âm (b, c, d, f, g, …)",
          "an + danh từ bắt đầu bằng nguyên âm (a, e, i, o, u)",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "a cat — một con mèo",
          "a dog — một con chó",
          "an apple — một quả táo",
          "an egg — một quả trứng",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 Nhớ 5 nguyên âm: A - E - I - O - U → dùng 'an'. Còn lại dùng 'a'.",
        ],
      },
    ],
    points: [
      "a + phụ âm: a cat — một con mèo",
      "an + nguyên âm: an apple — một quả táo",
      "Mạo từ a/an đứng trước danh từ số ít, chỉ một cái.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I see ___ elephant.", options: ["a", "an"], answer: "an", explain_vi: "elephant bắt đầu bằng nguyên âm e → dùng an." },
      { id: "e2", type: "choice", question: "She has ___ ball.", options: ["a", "an"], answer: "a", explain_vi: "ball bắt đầu bằng phụ âm b → dùng a." },
      { id: "e3", type: "choice", question: "He eats ___ ice cream.", options: ["a", "an"], answer: "an", explain_vi: "ice bắt đầu bằng nguyên âm i → dùng an." },
      { id: "e4", type: "choice", question: "I want ___ umbrella.", options: ["a", "an"], answer: "an", explain_vi: "umbrella bắt đầu bằng nguyên âm u → dùng an." },
      { id: "e5", type: "choice", question: "There is ___ fish in the tank.", options: ["a", "an"], answer: "a", explain_vi: "fish bắt đầu bằng phụ âm f → dùng a." },
      { id: "e6", type: "fill", question: "It is ___ orange. (điền a hoặc an)", answer: "an", explain_vi: "orange bắt đầu bằng nguyên âm o → dùng an." },
      { id: "e7", type: "fill", question: "This is ___ dog. (điền a hoặc an)", answer: "a", explain_vi: "dog bắt đầu bằng phụ âm d → dùng a." },
      { id: "e8", type: "fill", question: "I have ___ ant. (điền a hoặc an)", answer: "an", explain_vi: "ant bắt đầu bằng nguyên âm a → dùng an." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["is", "This", "an", "egg"], answer: "This is an egg", explain_vi: "Trật tự: This + is + an + egg (một quả trứng)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["a", "I", "have", "pen"], answer: "I have a pen", explain_vi: "Trật tự: I + have + a + pen (một cây bút)." },
    ],
  },
  {
    id: "gr_kids_plural_s",
    level: "kids",
    title: "Plural -s",
    title_vi: "Danh từ số nhiều thêm -s",
    summary_vi: "Khi có nhiều hơn một, ta thêm -s vào sau danh từ.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Khi nói về từ hai thứ trở lên, ta thêm -s vào cuối danh từ.",
          "Số đếm (two, three, four, …) luôn đi với danh từ số nhiều.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "Số ít: one + danh từ (one cat)",
          "Số nhiều: two/three/… + danh từ + s (two cats)",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "one cat → two cats — một con mèo → hai con mèo",
          "one book → three books — một quyển sách → ba quyển sách",
          "one ball → five balls — một quả bóng → năm quả bóng",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 Thấy số lớn hơn 1 → nhớ thêm -s!",
        ],
      },
    ],
    points: [
      "one cat → two cats — một con mèo → hai con mèo",
      "one book → three books — một quyển sách → ba quyển sách",
      "Số nhiều nghĩa là có nhiều cái (từ hai trở lên).",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I have three ___.", options: ["dog", "dogs"], answer: "dogs", explain_vi: "three (ba) là số nhiều nên thêm -s → dogs." },
      { id: "e2", type: "choice", question: "She has one ___.", options: ["pen", "pens"], answer: "pen", explain_vi: "one (một) là số ít nên giữ nguyên → pen." },
      { id: "e3", type: "choice", question: "There are four ___.", options: ["star", "stars"], answer: "stars", explain_vi: "four (bốn) là số nhiều → thêm -s thành stars." },
      { id: "e4", type: "choice", question: "He has one ___.", options: ["toy", "toys"], answer: "toy", explain_vi: "one (một) là số ít → giữ nguyên toy." },
      { id: "e5", type: "fill", question: "Two ___ (cat) are on the bed.", answer: "cats", explain_vi: "two (hai) là số nhiều → thêm -s thành cats." },
      { id: "e6", type: "fill", question: "I see five ___ (apple).", answer: "apples", explain_vi: "five (năm) là số nhiều → thêm -s thành apples." },
      { id: "e7", type: "fill", question: "She has three ___ (doll).", answer: "dolls", explain_vi: "three (ba) là số nhiều → thêm -s thành dolls." },
      { id: "e8", type: "fill", question: "There are six ___ (egg) in the box.", answer: "eggs", explain_vi: "six (sáu) là số nhiều → thêm -s thành eggs." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["two", "I", "balls", "have"], answer: "I have two balls", explain_vi: "Trật tự: I + have + two + balls (hai quả bóng)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["are", "three", "There", "cats"], answer: "There are three cats", explain_vi: "Trật tự: There + are + three + cats (có ba con mèo)." },
    ],
  },
  {
    id: "gr_kids_tobe",
    level: "kids",
    title: "I am / You are / It is",
    title_vi: "Động từ to be (am, is, are)",
    summary_vi: "I dùng 'am'; he/she/it dùng 'is'; you/we/they dùng 'are'.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Động từ to be dùng để nói trạng thái hoặc giới thiệu.",
          "Nghĩa: là, thì, ở.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "I + am (I am happy.)",
          "He / She / It + is (She is tall.)",
          "You / We / They + are (They are friends.)",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I am happy. — Tôi vui.",
          "You are tall. — Bạn cao.",
          "It is a cat. — Nó là một con mèo.",
          "We are students. — Chúng tôi là học sinh.",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 I → am (chỉ duy nhất I đi với am).",
          "💡 He/She/It → is (số ít ngôi thứ ba).",
          "💡 You/We/They → are (số nhiều hoặc ngôi thứ hai).",
        ],
      },
    ],
    points: [
      "I am happy. — Tôi vui.",
      "You are tall. — Bạn cao.",
      "It is a cat. — Nó là một con mèo.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I ___ a student.", options: ["am", "is", "are"], answer: "am", explain_vi: "Với I luôn dùng am." },
      { id: "e2", type: "choice", question: "You ___ my friend.", options: ["am", "is", "are"], answer: "are", explain_vi: "Với you dùng are." },
      { id: "e3", type: "choice", question: "They ___ happy.", options: ["am", "is", "are"], answer: "are", explain_vi: "Với they dùng are." },
      { id: "e4", type: "choice", question: "He ___ a doctor.", options: ["am", "is", "are"], answer: "is", explain_vi: "Với he dùng is." },
      { id: "e5", type: "fill", question: "It ___ a big dog. (am/is/are)", answer: "is", explain_vi: "Với it dùng is." },
      { id: "e6", type: "fill", question: "She ___ happy. (am/is/are)", answer: "is", explain_vi: "Với she dùng is." },
      { id: "e7", type: "fill", question: "We ___ friends. (am/is/are)", answer: "are", explain_vi: "Với we dùng are." },
      { id: "e8", type: "fill", question: "I ___ seven years old. (am/is/are)", answer: "am", explain_vi: "Với I dùng am." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["am", "I", "boy", "a"], answer: "I am a boy", explain_vi: "Trật tự: I + am + a + boy (một cậu bé)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["are", "We", "students"], answer: "We are students", explain_vi: "Trật tự: We + are + students (học sinh)." },
    ],
  },
  {
    id: "gr_kids_can",
    level: "kids",
    title: "Can",
    title_vi: "Động từ can (khả năng)",
    summary_vi: "Dùng 'can' để nói có thể làm gì. Sau 'can' là động từ nguyên mẫu.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Dùng 'can' để diễn tả khả năng — có thể làm được việc gì đó.",
          "Dùng 'can't' (cannot) để nói không thể làm được.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "Khẳng định: Chủ ngữ + can + động từ nguyên mẫu",
          "Phủ định: Chủ ngữ + can't + động từ nguyên mẫu",
          "Câu hỏi: Can + chủ ngữ + động từ nguyên mẫu?",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I can swim. — Tôi có thể bơi.",
          "He can run. — Cậu ấy có thể chạy.",
          "I can't fly. — Tôi không thể bay.",
          "Can you sing? — Bạn có thể hát không?",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 Sau can luôn là động từ nguyên mẫu (không thêm -s, -ing, -ed).",
          "💡 can dùng giống nhau cho tất cả các ngôi (I/you/he/she/it/we/they).",
        ],
      },
    ],
    points: [
      "I can swim. — Tôi có thể bơi.",
      "He can run. — Cậu ấy có thể chạy.",
      "Phủ định: cannot / can't: I can't fly. — Tôi không thể bay.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "A bird ___ fly.", options: ["can", "is"], answer: "can", explain_vi: "Nói khả năng (có thể bay) dùng can." },
      { id: "e2", type: "choice", question: "I can ___.", options: ["sing", "sings"], answer: "sing", explain_vi: "Sau can dùng động từ nguyên mẫu → sing." },
      { id: "e3", type: "choice", question: "A fish ___ walk.", options: ["can", "can't"], answer: "can't", explain_vi: "Cá không thể đi bộ → dùng can't." },
      { id: "e4", type: "choice", question: "___ you swim?", options: ["Can", "Are"], answer: "Can", explain_vi: "Hỏi khả năng dùng Can ở đầu câu." },
      { id: "e5", type: "fill", question: "She can ___ (jump) high.", answer: "jump", explain_vi: "Sau can giữ nguyên động từ → jump." },
      { id: "e6", type: "fill", question: "Fish ___ swim. (điền can)", answer: "can", explain_vi: "Cá có thể bơi → dùng can." },
      { id: "e7", type: "fill", question: "I ___ fly. (điền can't)", answer: "can't", explain_vi: "Người không thể bay → dùng can't." },
      { id: "e8", type: "fill", question: "He can ___ (read) books.", answer: "read", explain_vi: "Sau can giữ nguyên động từ → read." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["can", "I", "run"], answer: "I can run", explain_vi: "Trật tự: I + can + run (Tôi có thể chạy)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["Can", "swim", "you", "?"], answer: "Can you swim ?", explain_vi: "Trật tự: Can + you + swim + ? (Bạn có thể bơi không?)." },
    ],
  },
  {
    id: "gr_kids_have_has",
    level: "kids",
    title: "Have / Has",
    title_vi: "Động từ have và has",
    summary_vi: "I/you/we/they dùng 'have'; he/she/it dùng 'has'. Nghĩa là 'có'.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "Dùng have/has để nói ai có cái gì.",
          "have dùng với: I, you, we, they.",
          "has dùng với: he, she, it.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "I / You / We / They + have + danh từ",
          "He / She / It + has + danh từ",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I have a cat. — Tôi có một con mèo.",
          "She has a doll. — Cô ấy có một con búp bê.",
          "It has four legs. — Nó có bốn chân.",
          "They have many toys. — Họ có nhiều đồ chơi.",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 He/She/It → has (thêm -s giống quy tắc chia động từ ngôi thứ ba số ít).",
          "💡 Tất cả ngôi còn lại → have.",
        ],
      },
    ],
    points: [
      "I have a cat. — Tôi có một con mèo.",
      "She has a doll. — Cô ấy có một con búp bê.",
      "It has four legs. — Nó có bốn chân.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I ___ a red bag.", options: ["have", "has"], answer: "have", explain_vi: "Với I dùng have." },
      { id: "e2", type: "choice", question: "He ___ a new ball.", options: ["have", "has"], answer: "has", explain_vi: "Với he dùng has." },
      { id: "e3", type: "choice", question: "They ___ two dogs.", options: ["have", "has"], answer: "have", explain_vi: "Với they dùng have." },
      { id: "e4", type: "choice", question: "It ___ a long tail.", options: ["have", "has"], answer: "has", explain_vi: "Với it dùng has." },
      { id: "e5", type: "fill", question: "She ___ two cats. (have/has)", answer: "has", explain_vi: "Với she dùng has." },
      { id: "e6", type: "fill", question: "We ___ a big house. (have/has)", answer: "have", explain_vi: "Với we dùng have." },
      { id: "e7", type: "fill", question: "You ___ a nice hat. (have/has)", answer: "have", explain_vi: "Với you dùng have." },
      { id: "e8", type: "fill", question: "The cat ___ blue eyes. (have/has)", answer: "has", explain_vi: "The cat = it → dùng has." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["a", "has", "She", "dog"], answer: "She has a dog", explain_vi: "Trật tự: She + has + a + dog (một con chó)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["have", "We", "books", "many"], answer: "We have many books", explain_vi: "Trật tự: We + have + many + books (nhiều sách)." },
    ],
  },
  {
    id: "gr_kids_in_on_under",
    level: "kids",
    title: "In / On / Under",
    title_vi: "Giới từ in, on, under",
    summary_vi: "in = ở trong; on = ở trên (chạm bề mặt); under = ở dưới.",
    sections: [
      {
        heading: "Cách dùng",
        points: [
          "in: chỉ vị trí bên trong một không gian.",
          "on: chỉ vị trí trên bề mặt (chạm vào).",
          "under: chỉ vị trí phía dưới một vật.",
        ],
      },
      {
        heading: "Cấu trúc",
        points: [
          "Chủ ngữ + is/are + in/on/under + the + danh từ",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "in the box — ở trong cái hộp",
          "on the table — ở trên bàn",
          "under the chair — ở dưới cái ghế",
          "The cat is in the bag. — Con mèo ở trong cái túi.",
        ],
      },
      {
        heading: "💡 Mẹo nhớ",
        points: [
          "💡 in = IN (bên trong), on = ON (trên mặt), under = dưới (under → dưới).",
        ],
      },
    ],
    points: [
      "in the box — ở trong cái hộp",
      "on the table — ở trên bàn",
      "under the chair — ở dưới cái ghế",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "The cat is ___ the box. (ở trong)", options: ["in", "on", "under"], answer: "in", explain_vi: "Ở trong cái hộp dùng in." },
      { id: "e2", type: "choice", question: "The book is ___ the table. (ở trên)", options: ["in", "on", "under"], answer: "on", explain_vi: "Ở trên mặt bàn dùng on." },
      { id: "e3", type: "choice", question: "The dog is ___ the bed. (ở dưới)", options: ["in", "on", "under"], answer: "under", explain_vi: "Ở dưới giường dùng under." },
      { id: "e4", type: "choice", question: "The fish is ___ the water. (ở trong)", options: ["in", "on", "under"], answer: "in", explain_vi: "Cá ở trong nước dùng in." },
      { id: "e5", type: "fill", question: "The ball is ___ the bed. (ở dưới)", answer: "under", explain_vi: "Ở dưới giường dùng under." },
      { id: "e6", type: "fill", question: "The pen is ___ the bag. (ở trong)", answer: "in", explain_vi: "Ở trong túi dùng in." },
      { id: "e7", type: "fill", question: "The cup is ___ the table. (ở trên)", answer: "on", explain_vi: "Ở trên bàn dùng on." },
      { id: "e8", type: "fill", question: "The shoes are ___ the chair. (ở dưới)", answer: "under", explain_vi: "Ở dưới ghế dùng under." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["on", "is", "It", "the", "chair"], answer: "It is on the chair", explain_vi: "Trật tự: It + is + on + the + chair (trên ghế)." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["in", "The", "is", "cat", "the", "box"], answer: "The cat is in the box", explain_vi: "Trật tự: The + cat + is + in + the + box (con mèo ở trong hộp)." },
    ],
  },
];
