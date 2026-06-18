import type { GrammarTopic } from "../../types";

export const A2_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_a2_past_simple",
    level: "a2",
    title: "Past Simple",
    title_vi: "Thì quá khứ đơn",
    summary_vi:
      "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ. Động từ thường thêm -ed; nhiều động từ bất quy tắc phải học thuộc. Phủ định và nghi vấn dùng 'did'.",
    points: [
      "Động từ thường + ed: I played football yesterday. — Hôm qua tôi đã chơi bóng.",
      "Bất quy tắc: go -> went, see -> saw, have -> had, buy -> bought.",
      "Phủ định: didn't + V (nguyên thể): She didn't go. — Cô ấy đã không đi.",
      "Nghi vấn: Did + S + V? — Did you eat? — Bạn đã ăn chưa?",
      "Trạng từ thường gặp: yesterday, last night, ago, in 2010.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ to school yesterday.", options: ["go", "went", "goes"], answer: "went", explain_vi: "go là động từ bất quy tắc -> went." },
      { id: "e2", type: "fill", question: "They ___ (watch) a film last night.", answer: "watched", explain_vi: "watch là động từ thường, thêm -ed -> watched." },
      { id: "e3", type: "choice", question: "He ___ buy a new phone last week.", options: ["didn't", "doesn't", "wasn't"], answer: "didn't", explain_vi: "Phủ định quá khứ dùng didn't + V nguyên thể." },
      { id: "e4", type: "fill", question: "I ___ (have) a great holiday in 2020.", answer: "had", explain_vi: "have bất quy tắc ở quá khứ -> had." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["visited", "We", "grandma", "yesterday"], answer: "We visited grandma yesterday", explain_vi: "Trật tự: S + V-ed + O + trạng từ thời gian." },
    ],
  },
  {
    id: "gr_a2_comparative_superlative",
    level: "a2",
    title: "Comparative & Superlative",
    title_vi: "So sánh hơn và so sánh nhất",
    summary_vi:
      "So sánh hơn dùng để so sánh 2 đối tượng (thêm -er hoặc more). So sánh nhất so sánh trong một nhóm (thêm -est hoặc most, đứng sau 'the').",
    points: [
      "Tính từ ngắn + er ... than: Tom is taller than Sam. — Tom cao hơn Sam.",
      "Tính từ dài: more + adj + than: This book is more interesting than that one.",
      "So sánh nhất ngắn: the + adj-est: She is the tallest in the class.",
      "So sánh nhất dài: the most + adj: It is the most expensive car.",
      "Bất quy tắc: good -> better -> the best; bad -> worse -> the worst.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "An elephant is ___ than a dog.", options: ["big", "bigger", "biggest"], answer: "bigger", explain_vi: "So sánh hơn của tính từ ngắn 'big' -> bigger (gấp đôi phụ âm)." },
      { id: "e2", type: "fill", question: "This is the ___ (good) film I have ever seen.", answer: "best", explain_vi: "good là bất quy tắc, so sánh nhất -> the best." },
      { id: "e3", type: "choice", question: "Math is ___ difficult than English.", options: ["more", "most", "much"], answer: "more", explain_vi: "Tính từ dài 'difficult' dùng more + adj ở so sánh hơn." },
      { id: "e4", type: "fill", question: "Mount Everest is the ___ (high) mountain in the world.", answer: "highest", explain_vi: "Tính từ ngắn 'high' so sánh nhất -> the highest." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["is", "She", "the", "in", "tallest", "the", "class"], answer: "She is the tallest in the class", explain_vi: "Trật tự: S + be + the + adj-est + cụm trạng ngữ." },
    ],
  },
  {
    id: "gr_a2_be_going_to",
    level: "a2",
    title: "Be going to (Future)",
    title_vi: "Tương lai với 'be going to'",
    summary_vi:
      "Dùng 'be going to' để nói về dự định, kế hoạch đã định trước, hoặc dự đoán dựa trên dấu hiệu hiện tại. Cấu trúc: be (am/is/are) + going to + V.",
    points: [
      "Khẳng định: I am going to study tonight. — Tối nay tôi sẽ học.",
      "Chia 'be' theo chủ ngữ: He is going to..., They are going to...",
      "Phủ định: She isn't going to come. — Cô ấy sẽ không đến.",
      "Nghi vấn: Are you going to travel? — Bạn sẽ đi du lịch chứ?",
      "Dự đoán có dấu hiệu: Look at the clouds! It's going to rain.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I ___ going to visit Paris next month.", options: ["am", "is", "are"], answer: "am", explain_vi: "Chủ ngữ 'I' đi với 'am'." },
      { id: "e2", type: "fill", question: "Look at the sky! It ___ (be) going to rain.", answer: "is", explain_vi: "Chủ ngữ 'It' dùng 'is' + going to." },
      { id: "e3", type: "choice", question: "They ___ going to buy a new house.", options: ["am", "is", "are"], answer: "are", explain_vi: "Chủ ngữ số nhiều 'they' dùng 'are'." },
      { id: "e4", type: "choice", question: "She isn't ___ to study tonight.", options: ["go", "going", "goes"], answer: "going", explain_vi: "Cấu trúc cố định: be + going to + V." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["going", "We", "are", "to", "watch", "a", "film"], answer: "We are going to watch a film", explain_vi: "Trật tự: S + be + going to + V + O." },
    ],
  },
  {
    id: "gr_a2_countable_uncountable",
    level: "a2",
    title: "Countable & Uncountable Nouns",
    title_vi: "Danh từ đếm được và không đếm được",
    summary_vi:
      "Danh từ đếm được có số ít/số nhiều (a book, books). Danh từ không đếm được không có số nhiều (water, money). Dùng some/any, much/many tùy loại.",
    points: [
      "some dùng trong câu khẳng định: I have some apples.",
      "any dùng trong câu phủ định/nghi vấn: I don't have any money. Do you have any sugar?",
      "many + danh từ đếm được số nhiều: many books.",
      "much + danh từ không đếm được: much water, much time.",
      "a lot of dùng được cho cả hai loại: a lot of friends / a lot of water.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "How ___ water do you drink every day?", options: ["many", "much", "any"], answer: "much", explain_vi: "water không đếm được nên dùng 'much'." },
      { id: "e2", type: "choice", question: "There are ___ students in the room.", options: ["much", "many", "any"], answer: "many", explain_vi: "students đếm được số nhiều nên dùng 'many'." },
      { id: "e3", type: "fill", question: "I don't have ___ money. (some/any)", answer: "any", explain_vi: "Câu phủ định dùng 'any'." },
      { id: "e4", type: "fill", question: "Would you like ___ tea? (some/any)", answer: "some", explain_vi: "Lời mời lịch sự dùng 'some' dù là câu hỏi." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["There", "are", "many", "books", "on", "the", "table"], answer: "There are many books on the table", explain_vi: "Trật tự: There are + many + danh từ + trạng ngữ nơi chốn." },
    ],
  },
  {
    id: "gr_a2_adverbs_of_frequency",
    level: "a2",
    title: "Adverbs of Frequency",
    title_vi: "Trạng từ chỉ tần suất",
    summary_vi:
      "Trạng từ chỉ tần suất cho biết mức độ thường xuyên của hành động: always, usually, often, sometimes, rarely, never. Chúng đứng trước động từ thường nhưng sau động từ 'to be'.",
    points: [
      "Mức độ: always (100%) > usually > often > sometimes > rarely > never (0%).",
      "Đứng TRƯỚC động từ thường: She always gets up early. — Cô ấy luôn dậy sớm.",
      "Đứng SAU động từ to be: He is never late. — Anh ấy không bao giờ trễ.",
      "Với trợ động từ, đứng giữa: I have never been to Japan.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ drinks coffee in the morning.", options: ["always", "is always", "be always"], answer: "always", explain_vi: "Đứng trước động từ thường 'drinks' nên chỉ cần 'always'." },
      { id: "e2", type: "choice", question: "He is ___ late for school.", options: ["never", "never is", "is never"], answer: "never", explain_vi: "Sau động từ to be 'is' thì đặt trạng từ tần suất ngay sau." },
      { id: "e3", type: "fill", question: "Sắp xếp đúng vị trí: I / often / play tennis -> 'I ___ play tennis.'", answer: "often", explain_vi: "Trạng từ tần suất đứng trước động từ thường 'play'." },
      { id: "e4", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["always", "We", "have", "dinner", "at", "7"], answer: "We always have dinner at 7", explain_vi: "Trật tự: S + trạng từ tần suất + V + O." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["is", "She", "usually", "happy"], answer: "She is usually happy", explain_vi: "Trạng từ tần suất đứng sau động từ to be 'is'." },
    ],
  },
  {
    id: "gr_a2_have_to_must",
    level: "a2",
    title: "Have to / Must",
    title_vi: "Have to và Must (sự bắt buộc)",
    summary_vi:
      "Cả 'must' và 'have to' diễn tả sự bắt buộc, cần thiết. 'must' thường là quy tắc/ý kiến người nói; 'have to' là bắt buộc từ bên ngoài. Lưu ý: 'mustn't' = cấm, còn 'don't have to' = không cần thiết.",
    points: [
      "must + V (nguyên thể): You must wear a helmet. — Bạn phải đội mũ bảo hiểm.",
      "have to / has to + V: She has to work on Sunday. — Cô ấy phải làm việc Chủ nhật.",
      "mustn't = cấm, không được: You mustn't smoke here. — Bạn không được hút thuốc ở đây.",
      "don't/doesn't have to = không cần phải: You don't have to come early. — Bạn không cần đến sớm.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ work tomorrow because it's a holiday.", options: ["must", "has to", "doesn't have to"], answer: "doesn't have to", explain_vi: "Vì là ngày nghỉ nên 'không cần phải' làm việc -> doesn't have to." },
      { id: "e2", type: "choice", question: "You ___ smoke in the hospital. (cấm)", options: ["mustn't", "don't have to", "have to"], answer: "mustn't", explain_vi: "Sự cấm đoán dùng 'mustn't'." },
      { id: "e3", type: "fill", question: "He ___ (have to) wear a uniform at school.", answer: "has to", explain_vi: "Chủ ngữ 'he' nên dùng 'has to'." },
      { id: "e4", type: "choice", question: "We ___ stop at a red light. (quy tắc bắt buộc)", options: ["mustn't", "must", "don't have to"], answer: "must", explain_vi: "Quy tắc bắt buộc dùng 'must'." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["have", "I", "to", "finish", "my", "homework"], answer: "I have to finish my homework", explain_vi: "Trật tự: S + have to + V + O." },
    ],
  },
];
