import type { GrammarTopic } from "../../types";

export const B1_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_b1_present_perfect",
    level: "b1",
    title: "Present Perfect",
    title_vi: "Thì hiện tại hoàn thành",
    summary_vi:
      "Cấu trúc have/has + V3 (quá khứ phân từ). Diễn tả kinh nghiệm, việc vừa xảy ra hoặc việc đã hoàn thành nhưng còn liên quan đến hiện tại.",
    sections: [
      {
        heading: "Cấu trúc cơ bản",
        points: [
          "Khẳng định: S + have/has + V3 — I have finished my homework.",
          "Chủ ngữ he/she/it dùng has, còn lại dùng have.",
          "Phủ định: S + have/has + not + V3 — She has not (hasn't) eaten yet.",
          "Nghi vấn: Have/Has + S + V3? — Have you ever been to Japan?",
        ],
      },
      {
        heading: "Cách dùng & dấu hiệu nhận biết",
        points: [
          "Diễn tả kinh nghiệm: I have visited Paris twice.",
          "Việc vừa xảy ra: She has just arrived.",
          "Việc bắt đầu trong quá khứ, kéo dài đến hiện tại: They have lived here for 10 years.",
          "Đi kèm: ever, never, just, already, yet, since, for.",
          "for + khoảng thời gian, since + mốc thời gian: for two years / since 2020.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Phân biệt for/since: for + khoảng (for 3 days), since + mốc (since Monday).",
          "💡 already dùng trong câu khẳng định, yet dùng trong phủ định/nghi vấn.",
          "💡 Không dùng thì này với các mốc thời gian cụ thể trong quá khứ (yesterday, last year) — dùng Past Simple.",
        ],
      },
    ],
    points: [
      "I have finished my homework. — Tôi đã làm xong bài tập (và giờ rảnh).",
      "Chủ ngữ he/she/it dùng has, còn lại dùng have: She has lived here for 5 years.",
      "Đi kèm: ever, never, just, already, yet, since, for.",
      "for + khoảng thời gian, since + mốc thời gian: for two years / since 2020.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I ___ never been to Japan.", options: ["have", "has", "had"], answer: "have", explain_vi: "Chủ ngữ I dùng have." },
      { id: "e2", type: "choice", question: "She ___ lived here ___ 2019.", options: ["has / since", "have / for", "has / for"], answer: "has / since", explain_vi: "she dùng has; 2019 là mốc thời gian nên dùng since." },
      { id: "e3", type: "fill", question: "She has ___ (eat) lunch already.", answer: "eaten", explain_vi: "eat -> eaten (V3)." },
      { id: "e4", type: "fill", question: "They have ___ (not finish) the project yet.", answer: "not finished", explain_vi: "Phủ định: have + not + V3 (finish -> finished)." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["have", "just", "arrived", "They"], answer: "They have just arrived", explain_vi: "Trật tự: S + have + just + V3." },
      { id: "e6", type: "choice", question: "We ___ already ___ dinner.", options: ["have / eaten", "has / eaten", "have / ate"], answer: "have / eaten", explain_vi: "Chủ ngữ we dùng have; eat -> eaten (V3)." },
      { id: "e7", type: "fill", question: "He has ___ (write) three letters today.", answer: "written", explain_vi: "write -> written (V3)." },
      { id: "e8", type: "choice", question: "Have you ___ seen a whale?", options: ["ever", "never", "yet"], answer: "ever", explain_vi: "Trong câu nghi vấn, dùng ever (= bao giờ)." },
      { id: "e9", type: "fill", question: "I have known her ___ 2015. (mốc thời gian)", answer: "since", explain_vi: "2015 là mốc thời gian -> dùng since." },
      { id: "e10", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["has", "She", "not", "finished", "homework", "her", "yet"], answer: "She has not finished her homework yet", explain_vi: "Trật tự: S + has + not + V3 + O + yet." },
    ],
  },
  {
    id: "gr_b1_past_continuous",
    level: "b1",
    title: "Past Continuous",
    title_vi: "Thì quá khứ tiếp diễn",
    summary_vi:
      "Cấu trúc was/were + V-ing. Diễn tả hành động đang diễn ra tại một thời điểm trong quá khứ, hoặc bị một hành động khác xen vào.",
    sections: [
      {
        heading: "Cấu trúc cơ bản",
        points: [
          "Khẳng định: S + was/were + V-ing — I was watching TV.",
          "Chủ ngữ I/he/she/it dùng was; you/we/they dùng were.",
          "Phủ định: S + was/were + not + V-ing — They weren't sleeping.",
          "Nghi vấn: Was/Were + S + V-ing? — Were you studying?",
        ],
      },
      {
        heading: "Cách dùng chính",
        points: [
          "Hành động đang xảy ra tại một thời điểm cụ thể: At 9 p.m., I was reading a book.",
          "Hai hành động diễn ra song song: While I was cooking, she was cleaning.",
          "Hành động đang diễn ra (past continuous) bị hành động ngắn (past simple) xen vào: While I was cooking, the phone rang.",
          "Liên từ thường gặp: when, while, as.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 when + past simple (hành động ngắn), while + past continuous (hành động dài).",
          "💡 Không dùng past continuous với các động từ trạng thái (stative verbs): know, believe, love, belong...",
        ],
      },
    ],
    points: [
      "I was watching TV at 8 p.m. — Lúc 8 giờ tối tôi đang xem TV.",
      "Chủ ngữ I/he/she/it dùng was; you/we/they dùng were.",
      "Hành động đang diễn ra (past continuous) bị hành động ngắn (past simple) xen vào, thường nối bằng when/while: While I was cooking, the phone rang.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "They ___ playing football at 5 p.m.", options: ["was", "were", "are"], answer: "were", explain_vi: "Chủ ngữ they dùng were." },
      { id: "e2", type: "choice", question: "While she ___ , the lights went out.", options: ["was reading", "read", "reads"], answer: "was reading", explain_vi: "Hành động đang diễn ra dùng was + V-ing." },
      { id: "e3", type: "fill", question: "I ___ (study) when you called me.", answer: "was studying", explain_vi: "I + was + V-ing: was studying." },
      { id: "e4", type: "fill", question: "What ___ you ___ (do) at midnight?", answer: "were doing", explain_vi: "you + were + V-ing: were doing." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["was", "raining", "It", "heavily"], answer: "It was raining heavily", explain_vi: "Trật tự: S + was + V-ing + trạng từ." },
      { id: "e6", type: "choice", question: "He ___ not listening to the teacher.", options: ["was", "were", "did"], answer: "was", explain_vi: "He dùng was; phủ định: was + not + V-ing." },
      { id: "e7", type: "fill", question: "While we ___ (walk) home, it started to snow.", answer: "were walking", explain_vi: "we + were + V-ing: were walking." },
      { id: "e8", type: "choice", question: "___ she sleeping when you arrived?", options: ["Was", "Were", "Did"], answer: "Was", explain_vi: "she dùng Was; nghi vấn: Was + S + V-ing?" },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["were", "dancing", "They", "the", "at", "party"], answer: "They were dancing at the party", explain_vi: "Trật tự: S + were + V-ing + giới từ + danh từ." },
      { id: "e10", type: "fill", question: "At 7 a.m., the children ___ (sleep).", answer: "were sleeping", explain_vi: "the children (số nhiều) + were + V-ing." },
    ],
  },
  {
    id: "gr_b1_first_conditional",
    level: "b1",
    title: "First Conditional",
    title_vi: "Câu điều kiện loại 1",
    summary_vi:
      "Cấu trúc: If + hiện tại đơn, will + V (nguyên thể). Diễn tả điều kiện có thật, có khả năng xảy ra ở hiện tại hoặc tương lai.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "If + S + V (hiện tại đơn), S + will + V nguyên thể.",
          "Mệnh đề If dùng thì hiện tại đơn, KHÔNG dùng will.",
          "Mệnh đề chính dùng will + V nguyên thể.",
          "Có thể thay will bằng can/may/might tùy mức chắc chắn.",
        ],
      },
      {
        heading: "Cách dùng & lưu ý",
        points: [
          "Diễn tả điều kiện có thể xảy ra ở tương lai: If it rains, I will stay at home.",
          "Có thể đảo mệnh đề: I will stay at home if it rains. (không cần dấu phẩy khi If đứng sau).",
          "Dùng unless = if ... not: Unless you hurry, you will be late.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Nhớ quy tắc: mệnh đề If KHÔNG BAO GIỜ dùng will.",
          "💡 Phân biệt với điều kiện loại 0 (sự thật chung): If you heat water, it boils. (cả hai mệnh đề dùng hiện tại đơn).",
        ],
      },
    ],
    points: [
      "If it rains, I will stay at home. — Nếu trời mưa, tôi sẽ ở nhà.",
      "Mệnh đề If dùng thì hiện tại đơn, KHÔNG dùng will.",
      "Mệnh đề chính dùng will + V nguyên thể (có thể thay bằng can/may).",
      "Có thể đảo: I will stay at home if it rains. (không cần dấu phẩy khi If đứng sau).",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "If you study hard, you ___ pass the exam.", options: ["will", "would", "are"], answer: "will", explain_vi: "Mệnh đề chính điều kiện loại 1 dùng will + V." },
      { id: "e2", type: "choice", question: "If it ___ tomorrow, we will cancel the trip.", options: ["will rain", "rains", "rained"], answer: "rains", explain_vi: "Mệnh đề If dùng hiện tại đơn, không dùng will." },
      { id: "e3", type: "fill", question: "If she ___ (call) me, I will help her.", answer: "calls", explain_vi: "Mệnh đề If + hiện tại đơn; she -> calls." },
      { id: "e4", type: "fill", question: "We ___ (be) late if we don't hurry.", answer: "will be", explain_vi: "Mệnh đề chính dùng will + V: will be." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["If", "you", "tired,", "are", "rest", "will", "you"], answer: "If you are tired, you will rest", explain_vi: "Trật tự: If + S + hiện tại đơn, S + will + V." },
      { id: "e6", type: "choice", question: "If he ___ the bus, he will be late.", options: ["misses", "will miss", "missed"], answer: "misses", explain_vi: "Mệnh đề If dùng hiện tại đơn: misses." },
      { id: "e7", type: "fill", question: "If I ___ (have) time, I will visit you.", answer: "have", explain_vi: "Mệnh đề If + hiện tại đơn; I -> have (không chia)." },
      { id: "e8", type: "choice", question: "She will buy a car if she ___ enough money.", options: ["saves", "will save", "saved"], answer: "saves", explain_vi: "Mệnh đề If đứng sau cũng dùng hiện tại đơn." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["will", "you", "If", "come,", "I", "happy", "be"], answer: "If you come, I will be happy", explain_vi: "Trật tự: If + S + V, S + will + be + adj." },
      { id: "e10", type: "fill", question: "Unless you ___ (leave) now, you will miss the train.", answer: "leave", explain_vi: "Unless = If ... not; mệnh đề điều kiện dùng hiện tại đơn: leave." },
    ],
  },
  {
    id: "gr_b1_relative_clauses",
    level: "b1",
    title: "Relative Clauses (who / which / that)",
    title_vi: "Mệnh đề quan hệ (who / which / that)",
    summary_vi:
      "Dùng đại từ quan hệ để nối câu và bổ nghĩa cho danh từ: who cho người, which cho vật, that cho cả người và vật.",
    sections: [
      {
        heading: "Các đại từ quan hệ chính",
        points: [
          "who — chỉ người: The man who lives next door is a doctor.",
          "which — chỉ vật/sự vật: The book which I bought is interesting.",
          "that — dùng cho cả người và vật: The car that he drives is new.",
          "whose — chỉ sở hữu: The girl whose bag is red is my sister.",
          "where — chỉ nơi chốn: The restaurant where we ate was nice.",
        ],
      },
      {
        heading: "Mệnh đề quan hệ xác định & không xác định",
        points: [
          "Mệnh đề xác định (defining): cần thiết để hiểu nghĩa, không có dấu phẩy. The man who called you is my boss.",
          "Mệnh đề không xác định (non-defining): bổ sung thông tin, có dấu phẩy. My sister, who lives in Hanoi, is a teacher.",
          "Trong mệnh đề không xác định, KHÔNG dùng that.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Đại từ quan hệ đứng ngay sau danh từ mà nó bổ nghĩa.",
          "💡 Có thể lược bỏ who/which/that khi nó làm tân ngữ: The book (which) I bought = The book I bought.",
        ],
      },
    ],
    points: [
      "who — chỉ người: The man who lives next door is a doctor.",
      "which — chỉ vật/sự vật: The book which I bought is interesting.",
      "that — dùng cho cả người và vật: The car that he drives is new.",
      "Đại từ quan hệ đứng ngay sau danh từ mà nó bổ nghĩa.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "The woman ___ teaches us is kind.", options: ["who", "which", "where"], answer: "who", explain_vi: "Bổ nghĩa cho người (woman) dùng who." },
      { id: "e2", type: "choice", question: "This is the phone ___ I bought yesterday.", options: ["who", "which", "whose"], answer: "which", explain_vi: "Bổ nghĩa cho vật (phone) dùng which." },
      { id: "e3", type: "fill", question: "The boy ___ won the prize is my friend. (chỉ người)", answer: "who", explain_vi: "Chỉ người dùng who (cũng có thể dùng that)." },
      { id: "e4", type: "fill", question: "I like the song ___ you played. (chỉ vật)", answer: "which", explain_vi: "Chỉ vật dùng which (cũng có thể dùng that)." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["the", "dog", "that", "barks", "I", "saw"], answer: "I saw the dog that barks", explain_vi: "Trật tự: S + V + danh từ + that + mệnh đề quan hệ." },
      { id: "e6", type: "choice", question: "That is the house ___ I grew up.", options: ["which", "who", "where"], answer: "where", explain_vi: "Chỉ nơi chốn (house) dùng where." },
      { id: "e7", type: "fill", question: "The girl ___ father is a pilot studies in my class. (sở hữu)", answer: "whose", explain_vi: "Chỉ sở hữu dùng whose (= mà cha của cô ấy)." },
      { id: "e8", type: "choice", question: "The movie ___ we watched last night was great.", options: ["who", "that", "whose"], answer: "that", explain_vi: "Chỉ vật (movie) dùng that hoặc which." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["who", "The", "teacher", "speaks", "French", "is", "Mrs.", "Lan"], answer: "The teacher who speaks French is Mrs. Lan", explain_vi: "Trật tự: Danh từ + who + mệnh đề quan hệ + be + bổ ngữ." },
      { id: "e10", type: "fill", question: "The café ___ we met is closed now. (chỉ nơi chốn)", answer: "where", explain_vi: "Chỉ nơi chốn dùng where." },
    ],
  },
  {
    id: "gr_b1_modal_verbs",
    level: "b1",
    title: "Modal Verbs (should / might / must)",
    title_vi: "Động từ khuyết thiếu (should / might / must)",
    summary_vi:
      "Động từ khuyết thiếu + V nguyên thể. should: lời khuyên; might: khả năng có thể; must: bắt buộc hoặc suy đoán chắc chắn.",
    sections: [
      {
        heading: "should — lời khuyên",
        points: [
          "should + V: đưa lời khuyên — You should see a doctor. — Bạn nên đi khám bác sĩ.",
          "shouldn't + V: khuyên không nên — You shouldn't stay up late.",
        ],
      },
      {
        heading: "might — khả năng có thể",
        points: [
          "might + V: diễn tả điều có thể xảy ra — It might rain later. — Trời có thể mưa lúc sau.",
          "might not + V: có thể không — She might not come to the party.",
        ],
      },
      {
        heading: "must — bắt buộc / suy đoán chắc chắn",
        points: [
          "must + V: bắt buộc — You must wear a helmet. — Bạn phải đội mũ bảo hiểm.",
          "must + V: suy đoán — He must be tired. (Chắc hẳn anh ấy mệt.)",
          "mustn't + V: cấm — You mustn't smoke here.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Sau modal luôn là động từ nguyên thể, không chia, không thêm to.",
          "💡 Phân biệt mustn't (cấm) với don't have to (không cần thiết).",
          "💡 must không có dạng quá khứ — dùng had to thay thế.",
        ],
      },
    ],
    points: [
      "should + V: lời khuyên — You should see a doctor. — Bạn nên đi khám bác sĩ.",
      "might + V: khả năng (có thể) — It might rain later. — Trời có thể mưa lúc sau.",
      "must + V: bắt buộc / suy đoán chắc chắn — You must wear a helmet. — Bạn phải đội mũ bảo hiểm.",
      "Sau modal luôn là động từ nguyên thể, không chia, không thêm to.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "You ___ study harder if you want to pass.", options: ["should", "might", "musts"], answer: "should", explain_vi: "Đưa lời khuyên dùng should." },
      { id: "e2", type: "choice", question: "Take an umbrella; it ___ rain later.", options: ["must", "might", "should"], answer: "might", explain_vi: "Diễn tả khả năng có thể xảy ra dùng might." },
      { id: "e3", type: "choice", question: "Drivers ___ stop at a red light.", options: ["might", "must", "should"], answer: "must", explain_vi: "Quy định bắt buộc dùng must." },
      { id: "e4", type: "fill", question: "You should ___ (be) careful on the road.", answer: "be", explain_vi: "Sau modal dùng động từ nguyên thể: be." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["might", "She", "late", "be", "today"], answer: "She might be late today", explain_vi: "Trật tự: S + modal + V nguyên thể + phần còn lại." },
      { id: "e6", type: "choice", question: "You ___ smoke in the hospital.", options: ["mustn't", "don't must", "shouldn't must"], answer: "mustn't", explain_vi: "Cấm dùng mustn't (must not)." },
      { id: "e7", type: "fill", question: "He looks pale. He must ___ (feel) sick.", answer: "feel", explain_vi: "Suy đoán chắc chắn: must + V nguyên thể: feel." },
      { id: "e8", type: "choice", question: "You ___ eat so much sugar. It's bad for you.", options: ["shouldn't", "mustn't", "might not"], answer: "shouldn't", explain_vi: "Lời khuyên không nên làm dùng shouldn't." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["must", "You", "your", "wear", "seatbelt"], answer: "You must wear your seatbelt", explain_vi: "Trật tự: S + must + V + O." },
      { id: "e10", type: "fill", question: "She ___ not come to the party. She's busy. (có thể)", answer: "might", explain_vi: "Diễn tả khả năng có thể không xảy ra: might not." },
    ],
  },
  {
    id: "gr_b1_too_enough",
    level: "b1",
    title: "Too / Enough",
    title_vi: "Cấu trúc too và enough",
    summary_vi:
      "too = quá (mang nghĩa tiêu cực, đứng trước tính từ/trạng từ). enough = đủ (đứng SAU tính từ/trạng từ nhưng TRƯỚC danh từ).",
    sections: [
      {
        heading: "Cấu trúc với too",
        points: [
          "too + adj/adv: This coffee is too hot. — Cà phê này quá nóng.",
          "too + adj/adv + to V: He is too young to drive. — Anh ấy quá trẻ để lái xe.",
          "too + adj/adv + for sb + to V: The box is too heavy for me to carry.",
        ],
      },
      {
        heading: "Cấu trúc với enough",
        points: [
          "adj/adv + enough: He is tall enough to reach the shelf. — Anh ấy đủ cao để với tới kệ.",
          "enough + danh từ: I have enough money. — Tôi có đủ tiền.",
          "adj + enough + to V: She is old enough to vote.",
          "enough + danh từ + to V: We have enough time to finish.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 too mang nghĩa tiêu cực (quá ... nên không thể), khác very (rất — trung tính).",
          "💡 Vị trí: too đứng TRƯỚC adj; enough đứng SAU adj nhưng TRƯỚC noun.",
        ],
      },
    ],
    points: [
      "too + adj/adv: This coffee is too hot. — Cà phê này quá nóng.",
      "adj/adv + enough: He is tall enough to reach the shelf. — Anh ấy đủ cao để với tới kệ.",
      "enough + danh từ: I have enough money. — Tôi có đủ tiền.",
      "Cấu trúc thường gặp: too + adj + to V / adj + enough + to V.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "The box is ___ heavy to carry.", options: ["too", "enough", "very enough"], answer: "too", explain_vi: "too + adj (heavy): quá nặng để mang." },
      { id: "e2", type: "choice", question: "She is old ___ to drive a car.", options: ["too", "enough", "much"], answer: "enough", explain_vi: "enough đứng SAU tính từ (old enough)." },
      { id: "e3", type: "choice", question: "We don't have ___ chairs for everyone.", options: ["enough", "too", "too much"], answer: "enough", explain_vi: "enough + danh từ (chairs): đủ ghế." },
      { id: "e4", type: "fill", question: "It's ___ cold to go swimming. (quá lạnh)", answer: "too", explain_vi: "Diễn tả 'quá' (nghĩa tiêu cực) dùng too." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["is", "strong", "He", "enough", "to", "lift", "it"], answer: "He is strong enough to lift it", explain_vi: "Trật tự: S + be + adj + enough + to + V." },
      { id: "e6", type: "fill", question: "The music is ___ loud. I can't concentrate. (quá)", answer: "too", explain_vi: "Diễn tả quá mức (tiêu cực) dùng too." },
      { id: "e7", type: "choice", question: "This room is not big ___ for 30 students.", options: ["enough", "too", "very"], answer: "enough", explain_vi: "not + adj + enough: không đủ lớn." },
      { id: "e8", type: "fill", question: "He runs fast ___ to win the race. (đủ)", answer: "enough", explain_vi: "Trạng từ + enough: fast enough." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["too", "The", "is", "soup", "hot", "to", "eat"], answer: "The soup is too hot to eat", explain_vi: "Trật tự: S + be + too + adj + to + V." },
      { id: "e10", type: "choice", question: "Do we have ___ food for the party?", options: ["enough", "too", "too much enough"], answer: "enough", explain_vi: "enough + danh từ (food): đủ thức ăn." },
    ],
  },
  {
    id: "gr_b1_present_perfect_continuous",
    level: "b1",
    title: "Present Perfect Continuous",
    title_vi: "Thì hiện tại hoàn thành tiếp diễn",
    summary_vi:
      "Cấu trúc have/has been + V-ing. Nhấn mạnh quá trình hoặc thời gian kéo dài của hành động bắt đầu trong quá khứ và còn tiếp diễn hoặc vừa mới dừng.",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Nhấn mạnh quá trình/thời gian: I have been studying for 3 hours. — Tôi đã học suốt 3 giờ rồi.",
          "Hành động vừa dừng nhưng còn kết quả: She has been crying. (Mắt cô ấy còn đỏ.)",
          "Dấu hiệu: for, since, all day, all morning, recently, lately, how long.",
          "for + khoảng thời gian, since + mốc thời gian (giống Present Perfect).",
        ],
      },
      {
        heading: "Cấu trúc (+)(-)(?) ",
        points: [
          "Khẳng định: S + have/has + been + V-ing — They have been waiting for an hour.",
          "Chủ ngữ he/she/it dùng has been, còn lại dùng have been.",
          "Phủ định: S + have/has + not + been + V-ing — I haven't been sleeping well lately.",
          "Nghi vấn: Have/Has + S + been + V-ing? — Has he been working all day?",
        ],
      },
      {
        heading: "So sánh với Present Perfect",
        points: [
          "Present Perfect nhấn mạnh kết quả: I have read 3 books. (đã đọc xong 3 cuốn)",
          "Present Perfect Continuous nhấn mạnh quá trình: I have been reading all morning. (suốt buổi sáng)",
          "Không dùng thì này với stative verbs (know, believe, love...) — dùng Present Perfect thay thế.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Khi muốn nhấn mạnh 'bao lâu' (how long) thì ưu tiên dùng thì này.",
          "💡 Nếu thấy kết quả rõ ràng của hành động vừa dừng (mặt đỏ, đường ướt...) → Present Perfect Continuous.",
          "💡 Công thức nhớ: have/has + BEEN + V-ING = đã đang làm gì đó (kéo dài).",
        ],
      },
    ],
    points: [
      "have/has + been + V-ing: nhấn mạnh quá trình kéo dài — I have been studying for 3 hours.",
      "Hành động vừa dừng nhưng còn kết quả: She has been crying. (mắt còn đỏ).",
      "Dấu hiệu: for, since, all day, all morning, recently, lately, how long.",
      "Không dùng với stative verbs (know, love, believe) — dùng Present Perfect.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "She ___ been working here since 2020.", options: ["has", "have", "had"], answer: "has", explain_vi: "Chủ ngữ she dùng has." },
      { id: "e2", type: "choice", question: "They ___ been waiting for the bus for 30 minutes.", options: ["have", "has", "are"], answer: "have", explain_vi: "Chủ ngữ they dùng have." },
      { id: "e3", type: "fill", question: "I have been ___ (learn) English for five years.", answer: "learning", explain_vi: "have been + V-ing: learn → learning." },
      { id: "e4", type: "fill", question: "He has been ___ (run) since 6 a.m.", answer: "running", explain_vi: "has been + V-ing: run → running (nhân đôi n)." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["been", "has", "She", "all", "cooking", "morning"], answer: "She has been cooking all morning", explain_vi: "Trật tự: S + has + been + V-ing + thời gian." },
      { id: "e6", type: "choice", question: "How long ___ you been living in this city?", options: ["have", "has", "do"], answer: "have", explain_vi: "Chủ ngữ you dùng have; câu hỏi How long + have + S + been + V-ing." },
      { id: "e7", type: "fill", question: "We have been ___ (wait) for you since 3 o'clock.", answer: "waiting", explain_vi: "have been + V-ing: wait → waiting." },
      { id: "e8", type: "choice", question: "It ___ been raining all day.", options: ["has", "have", "is"], answer: "has", explain_vi: "Chủ ngữ it dùng has." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["have", "not", "I", "well", "sleeping", "been", "lately"], answer: "I have not been sleeping well lately", explain_vi: "Trật tự: S + have + not + been + V-ing + trạng từ." },
      { id: "e10", type: "fill", question: "___ she been ___ (study) all night? (nghi vấn)", answer: "Has / studying", explain_vi: "Nghi vấn: Has + S + been + V-ing: Has she been studying." },
      { id: "e11", type: "choice", question: "My eyes are red because I ___ been reading for hours.", options: ["have", "has", "am"], answer: "have", explain_vi: "Chủ ngữ I dùng have; kết quả còn thấy được (mắt đỏ)." },
    ],
  },
  {
    id: "gr_b1_past_perfect",
    level: "b1",
    title: "Past Perfect",
    title_vi: "Thì quá khứ hoàn thành",
    summary_vi:
      "Cấu trúc had + V3 (quá khứ phân từ). Diễn tả hành động xảy ra trước một hành động khác trong quá khứ (quá khứ của quá khứ).",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "Hành động xảy ra TRƯỚC một hành động khác trong quá khứ: When I arrived, the train had already left.",
          "Dấu hiệu: before, after, by the time, already, just, never ... before, until.",
          "Thường đi kèm Past Simple: had + V3 (hành động trước) + Past Simple (hành động sau).",
          "after + Past Perfect, Past Simple: After she had eaten, she went to bed.",
          "before + Past Simple, Past Perfect: Before I went out, I had finished my homework.",
        ],
      },
      {
        heading: "Cấu trúc (+)(-)(?) ",
        points: [
          "Khẳng định: S + had + V3 — They had finished dinner before 8 p.m.",
          "had dùng cho TẤT CẢ các ngôi (I/you/he/she/it/we/they).",
          "Phủ định: S + had + not + V3 — She had not (hadn't) seen that movie before.",
          "Nghi vấn: Had + S + V3? — Had you ever visited London before 2020?",
        ],
      },
      {
        heading: "So sánh với Past Simple",
        points: [
          "Past Simple: hành động xảy ra tại thời điểm trong quá khứ — I arrived at 9.",
          "Past Perfect: hành động xảy ra TRƯỚC thời điểm đó — The train had left before I arrived.",
          "Nếu kể đúng trình tự thời gian, có thể chỉ dùng Past Simple: I ate dinner and then went to bed.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Past Perfect = quá khứ của quá khứ. Hành động nào xảy ra TRƯỚC → dùng had + V3.",
          "💡 Nhớ: after + hành động TRƯỚC (had V3), before + hành động SAU (Past Simple).",
          "💡 had dùng cho mọi ngôi, không cần phân biệt như has/have.",
        ],
      },
    ],
    points: [
      "had + V3: hành động xảy ra trước một hành động khác trong quá khứ — The train had left before I arrived.",
      "had dùng cho TẤT CẢ các ngôi (không phân biệt).",
      "Dấu hiệu: before, after, by the time, already, just, never ... before.",
      "Nếu kể đúng trình tự, có thể chỉ dùng Past Simple: I ate and went to bed.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "By the time we arrived, the movie ___.", options: ["had started", "started", "has started"], answer: "had started", explain_vi: "Hành động xảy ra trước (phim bắt đầu) dùng had + V3." },
      { id: "e2", type: "choice", question: "She ___ never seen snow before she moved to Canada.", options: ["had", "has", "was"], answer: "had", explain_vi: "Hành động trước 'moved' → dùng had + V3." },
      { id: "e3", type: "fill", question: "After he had ___ (finish) his homework, he went out.", answer: "finished", explain_vi: "had + V3: finish → finished." },
      { id: "e4", type: "fill", question: "I ___ (not eat) anything before the meeting.", answer: "had not eaten", explain_vi: "Phủ định: had + not + V3: had not eaten." },
      { id: "e5", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["had", "left", "already", "They", "I", "when", "arrived"], answer: "They had already left when I arrived", explain_vi: "Trật tự: S + had + already + V3 + when + S + V (Past Simple)." },
      { id: "e6", type: "choice", question: "Before I ___ the email, she had called me.", options: ["read", "had read", "reading"], answer: "read", explain_vi: "before + Past Simple (hành động sau); hành động trước đã dùng had called." },
      { id: "e7", type: "fill", question: "By the time she arrived, we had ___ (eat) all the cake.", answer: "eaten", explain_vi: "had + V3: eat → eaten." },
      { id: "e8", type: "choice", question: "He told me that he ___ the book.", options: ["had lost", "lost", "has lost"], answer: "had lost", explain_vi: "Tường thuật lại sự kiện trước 'told' → had + V3." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["had", "not", "She", "the", "before", "seen", "movie"], answer: "She had not seen the movie before", explain_vi: "Trật tự: S + had + not + V3 + O + before." },
      { id: "e10", type: "fill", question: "___ you ___ (visit) Paris before your trip last year?", answer: "Had / visited", explain_vi: "Nghi vấn: Had + S + V3: Had you visited." },
      { id: "e11", type: "choice", question: "After they ___ dinner, they watched a film.", options: ["had had", "had", "have had"], answer: "had had", explain_vi: "After + Past Perfect: had had (had + V3 của have = had)." },
    ],
  },
  {
    id: "gr_b1_future_forms",
    level: "b1",
    title: "Future Forms (will vs be going to vs present continuous)",
    title_vi: "Các dạng tương lai (will / be going to / hiện tại tiếp diễn)",
    summary_vi:
      "So sánh ba cách diễn đạt tương lai: will (quyết định tức thì, dự đoán), be going to (kế hoạch, dự đoán có căn cứ), present continuous (lịch trình đã sắp xếp).",
    sections: [
      {
        heading: "Cách dùng & Dấu hiệu",
        points: [
          "will + V: quyết định tức thì tại lúc nói — I'll help you. / dự đoán không có căn cứ — I think it will rain.",
          "be going to + V: kế hoạch đã có từ trước — I'm going to visit my grandma this weekend. / dự đoán có căn cứ — Look at those clouds! It's going to rain.",
          "Present Continuous (am/is/are + V-ing): lịch trình cá nhân đã sắp xếp — I'm meeting John at 5 p.m. tomorrow.",
          "Dấu hiệu will: I think, I believe, probably, perhaps, tomorrow, next week.",
          "Dấu hiệu be going to: plan, intend, look!, listen! (có bằng chứng).",
        ],
      },
      {
        heading: "Cấu trúc (+)(-)(?) ",
        points: [
          "will: S + will + V / S + will not (won't) + V / Will + S + V?",
          "be going to: S + am/is/are + going to + V / S + am/is/are + not + going to + V / Am/Is/Are + S + going to + V?",
          "Present Continuous: S + am/is/are + V-ing / S + am/is/are + not + V-ing / Am/Is/Are + S + V-ing?",
        ],
      },
      {
        heading: "So sánh ba dạng",
        points: [
          "will: quyết định tức thì, lời hứa, dự đoán chung — I'll call you later.",
          "be going to: kế hoạch có trước, dự đoán có bằng chứng — She's going to have a baby. (đang mang thai)",
          "Present Continuous: kế hoạch cụ thể đã sắp xếp (thường có thời gian, địa điểm) — We're flying to London on Friday.",
          "Cả ba đều nói về tương lai nhưng sắc thái khác nhau.",
        ],
      },
      {
        heading: "💡 Mẹo ghi nhớ",
        points: [
          "💡 Quyết định ngay lúc nói → will. Kế hoạch đã nghĩ trước → be going to.",
          "💡 Thấy bằng chứng rõ ràng (mây đen, bụng bầu...) → be going to.",
          "💡 Đã đặt vé, đã hẹn lịch → Present Continuous for future.",
          "💡 I think / I believe / probably → will (dự đoán mang tính cá nhân).",
        ],
      },
    ],
    points: [
      "will + V: quyết định tức thì, lời hứa, dự đoán — I'll help you. / I think it will rain.",
      "be going to + V: kế hoạch đã có, dự đoán có căn cứ — I'm going to study abroad. / It's going to rain (mây đen).",
      "Present Continuous: lịch trình đã sắp xếp — I'm meeting John at 5 p.m. tomorrow.",
      "Phân biệt: quyết định ngay → will, kế hoạch trước → going to, đã đặt lịch → present continuous.",
    ],
    exercises: [
      { id: "e1", type: "choice", question: "I forgot my wallet. — Don't worry, I ___ pay for you.", options: ["will", "am going to", "am paying"], answer: "will", explain_vi: "Quyết định tức thì tại lúc nói → dùng will." },
      { id: "e2", type: "choice", question: "Look at those dark clouds! It ___.", options: ["is going to rain", "will rain", "is raining"], answer: "is going to rain", explain_vi: "Có bằng chứng (mây đen) → dùng be going to." },
      { id: "e3", type: "choice", question: "We ___ dinner with the Smiths on Saturday. It's all arranged.", options: ["are having", "will have", "going to have"], answer: "are having", explain_vi: "Lịch trình đã sắp xếp → dùng Present Continuous." },
      { id: "e4", type: "fill", question: "I think she ___ (win) the competition. (dự đoán cá nhân)", answer: "will win", explain_vi: "I think + will + V: dự đoán mang tính cá nhân." },
      { id: "e5", type: "fill", question: "He ___ (travel) to Japan next month. He already bought the tickets. (kế hoạch đã sắp xếp)", answer: "is traveling", explain_vi: "Đã mua vé rồi = lịch trình cụ thể → Present Continuous: is traveling." },
      { id: "e6", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["going", "I'm", "to", "study", "abroad", "year", "next"], answer: "I'm going to study abroad next year", explain_vi: "Kế hoạch đã có từ trước: S + am/is/are + going to + V." },
      { id: "e7", type: "choice", question: "The phone is ringing. — I ___ get it!", options: ["will", "am going to", "am getting"], answer: "will", explain_vi: "Quyết định tức thì → will." },
      { id: "e8", type: "fill", question: "She ___ (not / come) to the party. She told me yesterday. (kế hoạch trước)", answer: "is not going to come", explain_vi: "Kế hoạch đã có từ trước → be going to: is not going to come." },
      { id: "e9", type: "reorder", question: "Sắp xếp các từ thành câu đúng:", options: ["will", "I", "you", "promise", "help"], answer: "I promise I will help you", explain_vi: "Lời hứa dùng will: I promise I will help you." },
      { id: "e10", type: "choice", question: "We ___ the 7 o'clock train. I've already booked the seats.", options: ["are taking", "will take", "are going to take"], answer: "are taking", explain_vi: "Đã đặt chỗ rồi = lịch trình cụ thể → Present Continuous." },
      { id: "e11", type: "fill", question: "Be careful! You ___ (fall)! (dự đoán có bằng chứng)", answer: "are going to fall", explain_vi: "Có bằng chứng ngay trước mắt → be going to: are going to fall." },
    ],
  },
];
