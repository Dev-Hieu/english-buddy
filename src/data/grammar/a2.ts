import type { GrammarTopic } from "../../types";

export const A2_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_a2_past_simple",
    level: "a2",
    title: "Past Simple",
    title_vi: "Thì quá khứ đơn",
    summary_vi:
      "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ. Động từ thường thêm -ed; nhiều động từ bất quy tắc phải học thuộc. Phủ định và nghi vấn dùng 'did'.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: hành động đã xảy ra và hoàn tất trong quá khứ.",
          "Dấu hiệu: yesterday, last night/week/month/year, ago, in 2010, when I was young...",
        ],
      },
      {
        heading: "Cấu trúc (+) (-) (?) — Với động từ TO BE (was / were)",
        points: [
          "(+) I/He/She/It + was → I was tired. / She was at home.",
          "(+) You/We/They + were → They were happy.",
          "(-) S + wasn't / weren't → He wasn't ready.",
          "(?) Was/Were + S...? → Were you at the party?",
        ],
      },
      {
        heading: "Cấu trúc (+) (-) (?) — Với động từ THƯỜNG (V)",
        points: [
          "(+) S + V-ed (hoặc V bất quy tắc) → I played football. / She went home.",
          "💡 Quy tắc thêm -ed: play → played; stop → stopped (nhân đôi); study → studied (y → ied).",
          "💡 Bất quy tắc phổ biến: go → went, see → saw, have → had, buy → bought, eat → ate, take → took.",
          "(-) S + didn't + V (nguyên thể) → She didn't go. (không phải 'didn't went').",
          "(?) Did + S + V (nguyên thể)? → Did you eat? — Bạn đã ăn chưa?",
        ],
      },
    ],
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
      { id: "e6", type: "choice", question: "___ you see the movie last Friday?", options: ["Did", "Do", "Were"], answer: "Did", explain_vi: "Câu hỏi quá khứ đơn với động từ thường dùng Did + S + V nguyên thể." },
      { id: "e7", type: "fill", question: "She ___ (study) English two years ago.", answer: "studied", explain_vi: "study kết thúc bằng phụ âm + y -> bỏ y thêm -ied: studied." },
      { id: "e8", type: "choice", question: "They ___ at home last Sunday.", options: ["was", "were", "are"], answer: "were", explain_vi: "Chủ ngữ 'they' (số nhiều) dùng 'were' trong quá khứ." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["didn't", "He", "come", "to", "the", "party"], answer: "He didn't come to the party", explain_vi: "Trật tự phủ định: S + didn't + V nguyên thể + ..." },
      { id: "e10", type: "fill", question: "We ___ (be) very tired after the trip.", answer: "were", explain_vi: "Chủ ngữ 'we' dùng 'were' (quá khứ của are)." },
      { id: "e11", type: "choice", question: "I ___ a strange noise last night.", options: ["hear", "heard", "heared"], answer: "heard", explain_vi: "hear là động từ bất quy tắc -> heard (không phải 'heared')." },
      { id: "e12", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["Was", "she", "happy", "yesterday", "?"], answer: "Was she happy yesterday ?", explain_vi: "Câu hỏi to be quá khứ: Was/Were + S + adj + ...?" },
    ],
  },
  {
    id: "gr_a2_comparative_superlative",
    level: "a2",
    title: "Comparative & Superlative",
    title_vi: "So sánh hơn và so sánh nhất",
    summary_vi:
      "So sánh hơn dùng để so sánh 2 đối tượng (thêm -er hoặc more). So sánh nhất so sánh trong một nhóm (thêm -est hoặc most, đứng sau 'the').",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "Tính từ ngắn (1 âm tiết): adj + -er + than / the + adj + -est.",
          "Tính từ dài (2+ âm tiết): more + adj + than / the most + adj.",
          "💡 Tính từ 2 âm tiết tận cùng -y: bỏ y thêm -ier / -iest: happy → happier → the happiest.",
          "💡 Nhân đôi phụ âm cuối khi 1 nguyên âm + 1 phụ âm: big → bigger → the biggest.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "So sánh hơn: Tom is taller than Sam. — Tom cao hơn Sam.",
          "So sánh hơn (dài): This book is more interesting than that one.",
          "So sánh nhất: She is the tallest in the class.",
          "So sánh nhất (dài): It is the most expensive car.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "Bất quy tắc: good → better → the best; bad → worse → the worst; far → farther → the farthest.",
          "💡 Nhớ: so sánh hơn luôn có 'than', so sánh nhất luôn có 'the'.",
        ],
      },
    ],
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
      { id: "e6", type: "choice", question: "Today is ___ than yesterday.", options: ["hotter", "more hot", "hotest"], answer: "hotter", explain_vi: "hot là tính từ ngắn, nhân đôi phụ âm cuối: hot -> hotter." },
      { id: "e7", type: "fill", question: "She is ___ (happy) than her sister.", answer: "happier", explain_vi: "happy tận cùng -y -> bỏ y thêm -ier: happier." },
      { id: "e8", type: "choice", question: "This is the ___ book in the library.", options: ["interestingest", "most interesting", "more interesting"], answer: "most interesting", explain_vi: "interesting là tính từ dài, so sánh nhất dùng the most + adj." },
      { id: "e9", type: "fill", question: "My score is ___ (bad) than yours.", answer: "worse", explain_vi: "bad là bất quy tắc, so sánh hơn -> worse." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["is", "This", "more", "than", "expensive", "that", "one"], answer: "This is more expensive than that one", explain_vi: "Trật tự: S + be + more + adj + than + O." },
      { id: "e11", type: "choice", question: "A car is ___ than a bicycle.", options: ["fast", "faster", "fastest"], answer: "faster", explain_vi: "So sánh hơn: tính từ ngắn fast + -er -> faster." },
      { id: "e12", type: "fill", question: "He is the ___ (old) person in our family.", answer: "oldest", explain_vi: "Tính từ ngắn old, so sánh nhất -> the oldest." },
    ],
  },
  {
    id: "gr_a2_be_going_to",
    level: "a2",
    title: "Be going to (Future)",
    title_vi: "Tương lai với 'be going to'",
    summary_vi:
      "Dùng 'be going to' để nói về dự định, kế hoạch đã định trước, hoặc dự đoán dựa trên dấu hiệu hiện tại. Cấu trúc: be (am/is/are) + going to + V.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: dự định đã quyết định từ trước; dự đoán có bằng chứng/dấu hiệu.",
          "Dấu hiệu: tomorrow, next week/month, tonight, this weekend, look! (khi có dấu hiệu rõ).",
        ],
      },
      {
        heading: "Cấu trúc (+) (-) (?)",
        points: [
          "(+) S + am/is/are + going to + V → I am going to study tonight.",
          "💡 Chia 'be' theo chủ ngữ: I → am, He/She/It → is, You/We/They → are.",
          "(-) S + am not / isn't / aren't + going to + V → She isn't going to come.",
          "(?) Am/Is/Are + S + going to + V? → Are you going to travel?",
        ],
      },
    ],
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
      { id: "e6", type: "fill", question: "He ___ (be) going to start a new job next week.", answer: "is", explain_vi: "Chủ ngữ 'He' dùng 'is'." },
      { id: "e7", type: "choice", question: "___ you going to join us tomorrow?", options: ["Are", "Is", "Am"], answer: "Are", explain_vi: "Chủ ngữ 'you' dùng 'Are' trong câu hỏi." },
      { id: "e8", type: "choice", question: "Look! The baby ___ going to cry.", options: ["am", "is", "are"], answer: "is", explain_vi: "The baby là số ít, dùng 'is'. Có dấu hiệu 'Look!'." },
      { id: "e9", type: "fill", question: "They ___ (not / be) going to come to the party.", answer: "aren't", explain_vi: "They + are not (aren't) + going to + V." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["Is", "she", "going", "to", "cook", "dinner", "?"], answer: "Is she going to cook dinner ?", explain_vi: "Câu hỏi: Is/Are + S + going to + V + O?" },
      { id: "e11", type: "choice", question: "We ___ going to move to a new city.", options: ["am", "is", "are"], answer: "are", explain_vi: "Chủ ngữ 'We' (số nhiều) dùng 'are'." },
      { id: "e12", type: "fill", question: "I ___ (be) going to learn how to drive this summer.", answer: "am", explain_vi: "Chủ ngữ 'I' luôn đi với 'am'." },
    ],
  },
  {
    id: "gr_a2_countable_uncountable",
    level: "a2",
    title: "Countable & Uncountable Nouns",
    title_vi: "Danh từ đếm được và không đếm được",
    summary_vi:
      "Danh từ đếm được có số ít/số nhiều (a book, books). Danh từ không đếm được không có số nhiều (water, money). Dùng some/any, much/many tùy loại.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "Đếm được (countable): có a/an, có số nhiều → a book, two books.",
          "Không đếm được (uncountable): không dùng a/an, không có số nhiều → water, money, rice, information.",
          "some + khẳng định (cả hai loại): I have some apples. / I need some water.",
          "any + phủ định / nghi vấn: I don't have any money. / Do you have any sugar?",
          "many + đếm được số nhiều: How many books do you have?",
          "much + không đếm được: How much water do you drink?",
          "a lot of: dùng cho cả hai loại trong câu khẳng định.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "There are many students in the class. — Có nhiều học sinh trong lớp.",
          "I don't have much time. — Tôi không có nhiều thời gian.",
          "Would you like some tea? — Bạn muốn uống trà không? (lời mời dùng some).",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Lời mời / yêu cầu lịch sự dùng 'some' dù là câu hỏi: Would you like some cake?",
          "💡 Một số danh từ trông đếm được nhưng không đếm được: advice, furniture, homework, news.",
        ],
      },
    ],
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
      { id: "e6", type: "choice", question: "She doesn't have ___ friends here.", options: ["some", "any", "much"], answer: "any", explain_vi: "Câu phủ định dùng 'any' với danh từ đếm được số nhiều." },
      { id: "e7", type: "fill", question: "How ___ eggs do we need? (much/many)", answer: "many", explain_vi: "eggs là danh từ đếm được -> dùng 'many'." },
      { id: "e8", type: "choice", question: "There isn't ___ milk in the fridge.", options: ["many", "much", "some"], answer: "much", explain_vi: "milk không đếm được + câu phủ định -> much." },
      { id: "e9", type: "choice", question: "Can I have ___ sugar, please?", options: ["any", "some", "many"], answer: "some", explain_vi: "Yêu cầu lịch sự dùng 'some' dù là câu hỏi." },
      { id: "e10", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["much", "How", "does", "rice", "cost", "?"], answer: "How much does rice cost ?", explain_vi: "rice không đếm được -> How much + trợ ĐT + S + V?" },
      { id: "e11", type: "fill", question: "We have ___ of time. Don't worry. (a lot)", answer: "a lot", explain_vi: "a lot of dùng cho cả danh từ đếm được và không đếm được." },
      { id: "e12", type: "choice", question: "I need ___ information about the course.", options: ["a", "an", "some"], answer: "some", explain_vi: "information không đếm được, không dùng a/an. Câu khẳng định dùng 'some'." },
    ],
  },
  {
    id: "gr_a2_adverbs_of_frequency",
    level: "a2",
    title: "Adverbs of Frequency",
    title_vi: "Trạng từ chỉ tần suất",
    summary_vi:
      "Trạng từ chỉ tần suất cho biết mức độ thường xuyên của hành động: always, usually, often, sometimes, rarely, never. Chúng đứng trước động từ thường nhưng sau động từ 'to be'.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "Mức độ: always (100%) > usually > often > sometimes > rarely/seldom > never (0%).",
          "Đứng TRƯỚC động từ thường: S + adv + V → She always gets up early.",
          "Đứng SAU động từ to be: S + be + adv → He is never late.",
          "Với trợ động từ, đứng giữa: S + aux + adv + V → I have never been to Japan.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "I usually walk to school. — Tôi thường đi bộ đến trường.",
          "She is always on time. — Cô ấy luôn đúng giờ.",
          "We sometimes eat out. — Đôi khi chúng tôi ăn ngoài.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 'sometimes' linh hoạt hơn, có thể đứng đầu câu: Sometimes I read before bed.",
          "💡 'never' đã mang nghĩa phủ định, không dùng thêm 'not': He never lies. (KHÔNG nói He doesn't never lie).",
        ],
      },
    ],
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
      { id: "e6", type: "choice", question: "They ___ go to the gym on Mondays.", options: ["usually", "are usually", "usually are"], answer: "usually", explain_vi: "Đứng trước động từ thường 'go' -> chỉ cần 'usually'." },
      { id: "e7", type: "fill", question: "He is ___ tired after work. (always / always is)", answer: "always", explain_vi: "Sau to be 'is' đặt trạng từ tần suất: He is always tired." },
      { id: "e8", type: "choice", question: "___ I forget my keys.", options: ["Sometimes", "Always sometimes", "Never sometimes"], answer: "Sometimes", explain_vi: "'Sometimes' có thể đứng đầu câu." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["never", "I", "eat", "fast", "food"], answer: "I never eat fast food", explain_vi: "Trật tự: S + adv (never) + V + O." },
      { id: "e10", type: "fill", question: "My parents ___ (rarely) watch TV at night. -> 'My parents ___ watch TV at night.'", answer: "rarely", explain_vi: "Trạng từ tần suất đứng trước động từ thường 'watch'." },
      { id: "e11", type: "choice", question: "She has ___ visited London.", options: ["never", "never has", "always never"], answer: "never", explain_vi: "Với trợ động từ 'has', trạng từ tần suất đứng giữa: has never visited." },
      { id: "e12", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["are", "They", "often", "late", "for", "class"], answer: "They are often late for class", explain_vi: "Sau to be 'are' đặt trạng từ tần suất: are often." },
    ],
  },
  {
    id: "gr_a2_have_to_must",
    level: "a2",
    title: "Have to / Must",
    title_vi: "Have to và Must (sự bắt buộc)",
    summary_vi:
      "Cả 'must' và 'have to' diễn tả sự bắt buộc, cần thiết. 'must' thường là quy tắc/ý kiến người nói; 'have to' là bắt buộc từ bên ngoài. Lưu ý: 'mustn't' = cấm, còn 'don't have to' = không cần thiết.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "must + V (nguyên thể): You must wear a helmet.",
          "have to / has to + V: She has to work on Sunday. (has to với he/she/it).",
          "mustn't + V = CẤM, không được làm: You mustn't smoke here.",
          "don't / doesn't have to + V = KHÔNG CẦN phải: You don't have to come early.",
        ],
      },
      {
        heading: "Ví dụ",
        points: [
          "You must stop at a red light. — Bạn phải dừng ở đèn đỏ. (quy tắc bắt buộc)",
          "She has to wear a uniform at school. — Cô ấy phải mặc đồng phục ở trường. (quy định trường)",
          "You mustn't use your phone in the exam. — Bạn không được dùng điện thoại trong kỳ thi.",
          "You don't have to wait. — Bạn không cần phải chờ.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 mustn't ≠ don't have to: mustn't = cấm (0% được phép); don't have to = không bắt buộc (tùy bạn).",
          "💡 must không có dạng quá khứ -> dùng had to thay thế: I had to work yesterday.",
        ],
      },
    ],
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
      { id: "e6", type: "choice", question: "You ___ touch that wire. It's dangerous!", options: ["mustn't", "don't have to", "must"], answer: "mustn't", explain_vi: "Sự cấm đoán (nguy hiểm) dùng 'mustn't'." },
      { id: "e7", type: "fill", question: "She ___ (not have to) cook tonight. We're eating out.", answer: "doesn't have to", explain_vi: "She + doesn't have to = không cần phải. Chủ ngữ số ít dùng doesn't." },
      { id: "e8", type: "choice", question: "Students ___ do their homework every day.", options: ["have to", "has to", "must to"], answer: "have to", explain_vi: "Students (số nhiều) dùng 'have to'. Không có 'must to'." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["mustn't", "You", "run", "in", "the", "hallway"], answer: "You mustn't run in the hallway", explain_vi: "Trật tự: S + mustn't + V + trạng ngữ." },
      { id: "e10", type: "fill", question: "I ___ (have to) get up early yesterday for the exam.", answer: "had to", explain_vi: "must không có quá khứ, dùng 'had to' cho quá khứ." },
      { id: "e11", type: "choice", question: "You ___ bring food. There will be plenty at the party.", options: ["mustn't", "don't have to", "must"], answer: "don't have to", explain_vi: "Không cần phải mang đồ ăn (không bắt buộc) -> don't have to." },
      { id: "e12", type: "choice", question: "She ___ be at work by 8 a.m. every day.", options: ["has to", "have to", "must to"], answer: "has to", explain_vi: "She (số ít) + has to. Không tồn tại 'must to'." },
    ],
  },
  {
    id: "gr_a2_future_will",
    level: "a2",
    title: "Future Simple (will / won't)",
    title_vi: "Thì tương lai đơn (will / won't)",
    summary_vi:
      "Dùng 'will' để nói về dự đoán chung (không có bằng chứng rõ), lời hứa, quyết định tức thời. Phủ định: won't (will not). Sau will luôn là động từ nguyên thể.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: dự đoán chung (I think it will rain), lời hứa (I will help you), quyết định ngay lúc nói (I'll have the chicken).",
          "Dấu hiệu: I think, I believe, probably, maybe, tomorrow, next year, in the future, I promise.",
          "💡 So sánh: 'be going to' = dự định từ trước / dấu hiệu rõ; 'will' = dự đoán chung / quyết định tức thời.",
        ],
      },
      {
        heading: "Cấu trúc (+) (-) (?)",
        points: [
          "(+) S + will + V (nguyên thể) → She will come tomorrow. / I'll help you.",
          "💡 Viết tắt: I will = I'll, he will = he'll, they will = they'll.",
          "(-) S + will not (won't) + V → He won't be late. / They won't agree.",
          "(?) Will + S + V? → Will you marry me? — Yes, I will. / No, I won't.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 Sau will luôn là V nguyên thể, không chia: She will go (KHÔNG nói will goes).",
          "💡 will giống nhau cho mọi chủ ngữ, không chia theo ngôi: I will, he will, they will.",
        ],
      },
    ],
    points: [
      "Khẳng định: S + will + V: She will come tomorrow. — Ngày mai cô ấy sẽ đến.",
      "Viết tắt: I'll, he'll, she'll, we'll, they'll.",
      "Phủ định: S + won't + V: He won't be late. — Anh ấy sẽ không trễ.",
      "Nghi vấn: Will + S + V? — Will you help me? — Bạn sẽ giúp tôi chứ?",
      "Dùng cho dự đoán, lời hứa, quyết định tức thời.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I think it ___ rain tomorrow.", options: ["will", "is going to", "does"], answer: "will", explain_vi: "Dự đoán chung (I think...) dùng 'will'." },
      { id: "e2", type: "fill", question: "She ___ (not / come) to the party tonight.", answer: "won't come", explain_vi: "Phủ định: will not = won't + V nguyên thể." },
      { id: "e3", type: "choice", question: "___ you help me with this box?", options: ["Will", "Do", "Are"], answer: "Will", explain_vi: "Yêu cầu/đề nghị dùng 'Will + S + V?'." },
      { id: "e4", type: "choice", question: "Don't worry. I ___ be there on time. I promise.", options: ["will", "am going to", "going to"], answer: "will", explain_vi: "Lời hứa dùng 'will': I will be there." },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["will", "They", "arrive", "at", "6", "o'clock"], answer: "They will arrive at 6 o'clock", explain_vi: "Trật tự: S + will + V + trạng ngữ thời gian." },
      { id: "e6", type: "fill", question: "He ___ (be) 20 years old next month.", answer: "will be", explain_vi: "Sự thật trong tương lai: S + will + be + tuổi." },
      { id: "e7", type: "choice", question: "I'm hungry. I think I ___ have a sandwich.", options: ["will", "am having", "have"], answer: "will", explain_vi: "Quyết định tức thời (ngay lúc nói) dùng 'will'." },
      { id: "e8", type: "fill", question: "We ___ (not / forget) your birthday.", answer: "won't forget", explain_vi: "Phủ định: won't + V nguyên thể -> won't forget." },
      { id: "e9", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["Will", "she", "call", "us", "later", "?"], answer: "Will she call us later ?", explain_vi: "Câu hỏi: Will + S + V + O + trạng ngữ?" },
      { id: "e10", type: "choice", question: "I ___ probably travel to Japan next year.", options: ["will", "am", "do"], answer: "will", explain_vi: "Dự đoán với 'probably' dùng 'will': will probably + V." },
      { id: "e11", type: "fill", question: "___ you ___ (be) at home tonight?", answer: "Will ... be", explain_vi: "Câu hỏi: Will + S + be...? -> Will you be at home tonight?" },
      { id: "e12", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["won't", "I", "tell", "anyone", "your", "secret"], answer: "I won't tell anyone your secret", explain_vi: "Lời hứa phủ định: S + won't + V + O." },
    ],
  },
  {
    id: "gr_a2_should",
    level: "a2",
    title: "Should / Shouldn't",
    title_vi: "Should / Shouldn't (lời khuyên)",
    summary_vi:
      "Dùng 'should' để đưa ra lời khuyên, gợi ý, hoặc nói điều nên làm. 'shouldn't' dùng khi khuyên không nên làm gì. Sau should luôn là động từ nguyên thể.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Dùng cho: lời khuyên (You should see a doctor), gợi ý (We should try that restaurant), ý kiến về điều đúng/nên làm.",
          "Dấu hiệu: I think you should..., You should/shouldn't..., What should I...?",
        ],
      },
      {
        heading: "Cấu trúc (+) (-) (?)",
        points: [
          "(+) S + should + V (nguyên thể) → You should drink more water.",
          "(-) S + shouldn't + V → You shouldn't eat too much sugar.",
          "(?) Should + S + V? → Should I call him? — Tôi có nên gọi cho anh ấy không?",
          "💡 should giống nhau cho mọi chủ ngữ, không chia theo ngôi: I should, he should, they should.",
        ],
      },
      {
        heading: "Lưu ý",
        points: [
          "💡 should nhẹ hơn must/have to: should = nên (lời khuyên), must = phải (bắt buộc).",
          "💡 Sau should luôn là V nguyên thể: You should go (KHÔNG nói should goes / should to go).",
        ],
      },
    ],
    points: [
      "Khẳng định: S + should + V: You should see a doctor. — Bạn nên đi khám bác sĩ.",
      "Phủ định: S + shouldn't + V: You shouldn't stay up late. — Bạn không nên thức khuya.",
      "Nghi vấn: Should + S + V? — Should I bring an umbrella? — Tôi có nên mang ô không?",
      "should nhẹ hơn must: should = nên, must = phải.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "You look tired. You ___ go to bed early.", options: ["should", "must to", "shouldn't"], answer: "should", explain_vi: "Lời khuyên 'nên' dùng 'should'. Không tồn tại 'must to'." },
      { id: "e2", type: "choice", question: "You ___ eat so much junk food. It's bad for you.", options: ["should", "shouldn't", "don't should"], answer: "shouldn't", explain_vi: "Khuyên không nên dùng 'shouldn't'. Không tồn tại 'don't should'." },
      { id: "e3", type: "fill", question: "She has a toothache. She ___ (see) a dentist.", answer: "should see", explain_vi: "Lời khuyên: should + V nguyên thể -> should see." },
      { id: "e4", type: "choice", question: "___ I take a jacket? It might be cold.", options: ["Should", "Do", "Am"], answer: "Should", explain_vi: "Hỏi lời khuyên: Should + S + V?" },
      { id: "e5", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["should", "You", "drink", "more", "water"], answer: "You should drink more water", explain_vi: "Trật tự: S + should + V + O." },
      { id: "e6", type: "fill", question: "It's raining. You ___ (not / go) out without an umbrella.", answer: "shouldn't go", explain_vi: "Khuyên không nên: shouldn't + V nguyên thể." },
      { id: "e7", type: "choice", question: "He ___ study harder if he wants to pass the exam.", options: ["should", "shouldn't", "should to"], answer: "should", explain_vi: "Lời khuyên 'nên' dùng 'should'. Không có 'should to'." },
      { id: "e8", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["shouldn't", "We", "waste", "food"], answer: "We shouldn't waste food", explain_vi: "Trật tự: S + shouldn't + V + O." },
      { id: "e9", type: "choice", question: "What ___ I do? I lost my wallet!", options: ["should", "do", "am"], answer: "should", explain_vi: "Hỏi lời khuyên: What should I do?" },
      { id: "e10", type: "fill", question: "You ___ (be) more careful when you drive.", answer: "should be", explain_vi: "Lời khuyên: should + be -> should be more careful." },
      { id: "e11", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["Should", "we", "invite", "Tom", "to", "the", "party", "?"], answer: "Should we invite Tom to the party ?", explain_vi: "Câu hỏi: Should + S + V + O?" },
      { id: "e12", type: "choice", question: "Children ___ play near the road. It's dangerous.", options: ["should", "shouldn't", "don't should"], answer: "shouldn't", explain_vi: "Khuyên không nên (nguy hiểm) dùng 'shouldn't'." },
    ],
  },
  {
    id: "gr_a2_prepositions_time",
    level: "a2",
    title: "Prepositions of Time (in / on / at)",
    title_vi: "Giới từ chỉ thời gian (in / on / at)",
    summary_vi:
      "Dùng 'at' cho giờ và thời điểm cụ thể, 'on' cho ngày và ngày trong tuần, 'in' cho tháng, năm, mùa, buổi trong ngày. Cách nhớ: AT cho điểm nhỏ nhất, IN cho khoảng lớn nhất.",
    sections: [
      {
        heading: "Quy tắc chung",
        points: [
          "AT + giờ / thời điểm cụ thể: at 3 o'clock, at noon, at midnight, at night, at the weekend.",
          "ON + ngày / ngày trong tuần / ngày tháng: on Monday, on 5th June, on Christmas Day, on my birthday.",
          "IN + tháng / năm / mùa / buổi: in March, in 2024, in summer, in the morning, in the afternoon, in the evening.",
          "💡 Cách nhớ: AT = điểm nhỏ (giờ) → ON = vừa (ngày) → IN = lớn (tháng, năm, mùa).",
        ],
      },
      {
        heading: "Ngoại lệ quan trọng",
        points: [
          "💡 'at night' (KHÔNG nói 'in the night' trong tiếng Anh phổ thông).",
          "💡 'at the weekend' (Anh-Anh) hoặc 'on the weekend' (Anh-Mỹ) — cả hai đều đúng.",
          "💡 Không dùng giới từ trước: this, last, next, every → I'll go next Monday (KHÔNG nói on next Monday).",
        ],
      },
    ],
    points: [
      "AT + giờ: at 3 o'clock, at noon, at midnight, at night.",
      "ON + ngày: on Monday, on 5th June, on Christmas Day.",
      "IN + tháng/năm/mùa/buổi: in March, in 2024, in summer, in the morning.",
      "Không dùng giới từ với this/last/next/every: See you next Friday (không có on).",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "The meeting is ___ 9 o'clock.", options: ["at", "on", "in"], answer: "at", explain_vi: "Giờ cụ thể dùng 'at': at 9 o'clock." },
      { id: "e2", type: "choice", question: "My birthday is ___ July.", options: ["in", "on", "at"], answer: "in", explain_vi: "Tháng dùng 'in': in July." },
      { id: "e3", type: "choice", question: "We have English class ___ Monday.", options: ["on", "in", "at"], answer: "on", explain_vi: "Ngày trong tuần dùng 'on': on Monday." },
      { id: "e4", type: "fill", question: "She was born ___ 1995.", answer: "in", explain_vi: "Năm dùng 'in': in 1995." },
      { id: "e5", type: "choice", question: "I usually exercise ___ the morning.", options: ["in", "on", "at"], answer: "in", explain_vi: "Buổi trong ngày dùng 'in': in the morning." },
      { id: "e6", type: "fill", question: "The concert is ___ Saturday evening.", answer: "on", explain_vi: "Ngày cụ thể + buổi dùng 'on': on Saturday evening." },
      { id: "e7", type: "choice", question: "He always reads ___ night.", options: ["at", "in", "on"], answer: "at", explain_vi: "Ngoại lệ: luôn dùng 'at night' (không dùng in the night)." },
      { id: "e8", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["starts", "School", "in", "September"], answer: "School starts in September", explain_vi: "Tháng dùng 'in': in September." },
      { id: "e9", type: "fill", question: "The shop opens ___ 8:30 a.m.", answer: "at", explain_vi: "Giờ cụ thể dùng 'at': at 8:30 a.m." },
      { id: "e10", type: "choice", question: "We go on holiday ___ summer.", options: ["in", "on", "at"], answer: "in", explain_vi: "Mùa dùng 'in': in summer." },
      { id: "e11", type: "reorder", question: "Sắp xếp thành câu đúng:", options: ["meet", "Let's", "on", "Friday", "at", "noon"], answer: "Let's meet on Friday at noon", explain_vi: "Ngày dùng 'on', giờ dùng 'at': on Friday at noon." },
      { id: "e12", type: "choice", question: "The exam is ___ 15th March.", options: ["on", "in", "at"], answer: "on", explain_vi: "Ngày tháng cụ thể dùng 'on': on 15th March." },
    ],
  },
];
