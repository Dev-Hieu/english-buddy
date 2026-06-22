import type { GrammarTopic } from "../../types";

export const C1_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_c1_inversion",
    level: "c1",
    title: "Inversion",
    title_vi: "Đảo ngữ",
    summary_vi:
      "Đưa trạng từ/cụm trạng từ mang nghĩa phủ định hoặc giới hạn lên đầu câu, sau đó đảo trợ động từ lên trước chủ ngữ để nhấn mạnh. Cấu trúc trang trọng, hay gặp trong văn viết học thuật và IELTS Writing.",
    sections: [
      {
        heading: "Đảo ngữ với trạng từ phủ định",
        points: [
          "Never / Rarely / Seldom / Hardly ever + trợ ĐT + S + V: Never have I seen such a view. — Chưa bao giờ tôi thấy cảnh tượng như vậy.",
          "Little did he know that she was watching. — Anh ấy không hề biết cô ấy đang theo dõi.",
          "At no time / In no way / On no account + trợ ĐT + S + V: At no time did he mention his plan. — Không lúc nào anh ấy nhắc đến kế hoạch.",
        ],
      },
      {
        heading: "Đảo ngữ với cấu trúc tương quan",
        points: [
          "Not only ... but also ...: Not only did she pass, but she also got the top score. — Cô ấy không chỉ đỗ mà còn đạt điểm cao nhất.",
          "Hardly / Scarcely ... when ...: Hardly had I arrived when the phone rang. — Tôi vừa đến thì điện thoại reo.",
          "No sooner ... than ...: No sooner had I left than it rained. — Tôi vừa rời đi thì trời mưa.",
        ],
      },
      {
        heading: "Đảo ngữ với Only / Not until",
        points: [
          "Only after / Only when / Only by + ... + trợ ĐT + S + V: Only after the meeting did he understand. — Chỉ sau cuộc họp anh ấy mới hiểu.",
          "Not until + mệnh đề/cụm từ + trợ ĐT + S + V: Not until midnight did they finish. — Mãi đến nửa đêm họ mới xong.",
          "💡 Mệnh đề sau Only / Not until mới đảo ngữ, mệnh đề đứng ngay sau Only / Not until giữ nguyên thứ tự.",
        ],
      },
    ],
    points: [
      "Trạng từ phủ định + trợ động từ + S + V: Never have I seen such a view. — Chưa bao giờ tôi thấy cảnh tượng như vậy.",
      "Not only ... but also ...: Not only did she pass, but she also got the top score. — Cô ấy không chỉ đỗ mà còn đạt điểm cao nhất.",
      "Hardly/Scarcely ... when ...; No sooner ... than ...: No sooner had I left than it rained. — Tôi vừa rời đi thì trời mưa.",
      "Only after / Only when / Not until ...: Only after the meeting did he understand. — Chỉ sau cuộc họp anh ấy mới hiểu.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "Never ___ such a beautiful sunset before.",
        options: ["I have seen", "have I seen", "I saw"],
        answer: "have I seen",
        explain_vi:
          "Sau trạng từ phủ định 'Never' phải đảo trợ động từ 'have' lên trước chủ ngữ 'I'.",
      },
      {
        id: "e2",
        type: "fill",
        question: "Rarely ___ (do) we encounter such generosity.",
        answer: "do",
        explain_vi:
          "Đảo ngữ với 'Rarely' ở thì hiện tại đơn: Rarely + do + S + V (nguyên thể).",
      },
      {
        id: "e3",
        type: "choice",
        question: "Not only ___ the exam, but she also won a scholarship.",
        options: ["she passed", "did she pass", "passed she"],
        answer: "did she pass",
        explain_vi:
          "'Not only' đứng đầu câu nên đảo trợ động từ 'did' lên trước chủ ngữ.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu đảo ngữ:",
        options: ["had", "Hardly", "she", "arrived", "when the phone rang"],
        answer: "Hardly had she arrived when the phone rang",
        explain_vi:
          "Cấu trúc Hardly + had + S + V3 ... when + mệnh đề: diễn tả hành động vừa xảy ra thì có việc khác xen vào.",
      },
      {
        id: "e5",
        type: "fill",
        question: "Not until I finished did I ___ (realize) my mistake.",
        answer: "realize",
        explain_vi:
          "Sau cấu trúc đảo ngữ 'Not until ... did I' thì động từ chính ở dạng nguyên thể: realize.",
      },
      {
        id: "e6",
        type: "choice",
        question: "Seldom ___ such dedication in young employees.",
        options: ["we see", "do we see", "we do see"],
        answer: "do we see",
        explain_vi:
          "'Seldom' là trạng từ phủ định, đảo trợ động từ 'do' lên trước chủ ngữ 'we'.",
      },
      {
        id: "e7",
        type: "choice",
        question: "No sooner ___ the door than the alarm went off.",
        options: ["had he opened", "he had opened", "he opened"],
        answer: "had he opened",
        explain_vi:
          "Cấu trúc No sooner + had + S + V3 ... than ...: đảo trợ động từ 'had' lên trước chủ ngữ.",
      },
      {
        id: "e8",
        type: "fill",
        question:
          "Only after reading the report ___ (do) the manager realize the problem.",
        answer: "did",
        explain_vi:
          "Sau 'Only after + cụm từ/mệnh đề', mệnh đề chính phải đảo ngữ: did + S + V nguyên thể.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp thành câu đảo ngữ với 'Little':",
        options: ["Little", "did", "they", "know", "about the danger"],
        answer: "Little did they know about the danger",
        explain_vi:
          "Little + did + S + V nguyên thể: đảo ngữ với trạng từ mang nghĩa phủ định 'Little'.",
      },
      {
        id: "e10",
        type: "choice",
        question: "At no time ___ allowed to leave the building.",
        options: ["the staff was", "was the staff", "the staff were"],
        answer: "was the staff",
        explain_vi:
          "'At no time' đứng đầu câu nên đảo trợ động từ 'was' lên trước chủ ngữ 'the staff'.",
      },
      {
        id: "e11",
        type: "fill",
        question:
          "Not only ___ (be) the food delicious, but the service was excellent too.",
        answer: "was",
        explain_vi:
          "Not only + trợ ĐT + S + tính từ: đảo 'was' lên trước 'the food'. Mệnh đề 'but also' giữ nguyên.",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp thành câu đảo ngữ:",
        options: [
          "Only when",
          "she apologized",
          "did",
          "he",
          "forgive her",
        ],
        answer: "Only when she apologized did he forgive her",
        explain_vi:
          "Only when + mệnh đề (giữ nguyên) + trợ ĐT + S + V: mệnh đề chính mới đảo ngữ.",
      },
    ],
  },
  {
    id: "gr_c1_mixed_conditionals",
    level: "c1",
    title: "Mixed Conditionals",
    title_vi: "Câu điều kiện hỗn hợp",
    summary_vi:
      "Kết hợp hai mốc thời gian trong một câu điều kiện không có thật. Dùng khi nguyên nhân và kết quả thuộc về thời gian khác nhau (quá khứ ↔ hiện tại).",
    sections: [
      {
        heading: "Điều kiện quá khứ → Kết quả hiện tại (Loại 3 → 2)",
        points: [
          "If + S + had + V3, S + would/could/might + V nguyên thể (+ now/today).",
          "If I had studied medicine, I would be a doctor now. — Nếu tôi đã học y, giờ tôi đã là bác sĩ.",
          "If they had invested wisely, they would be rich today. — Nếu họ đầu tư khôn ngoan, giờ họ đã giàu.",
        ],
      },
      {
        heading: "Điều kiện hiện tại → Kết quả quá khứ (Loại 2 → 3)",
        points: [
          "If + S + V2/were, S + would/could/might + have + V3.",
          "If I were more careful, I wouldn't have lost it. — Nếu tôi cẩn thận hơn, tôi đã không làm mất nó.",
          "If she spoke French, she would have understood the lecture. — Nếu cô ấy biết tiếng Pháp, cô ấy đã hiểu bài giảng.",
        ],
      },
      {
        heading: "Cách nhận diện",
        points: [
          "Mệnh đề 'if' và mệnh đề chính diễn tả hai mốc thời gian KHÁC nhau.",
          "💡 Chú ý các dấu hiệu thời gian: now, today, at the moment (hiện tại) vs. yesterday, last year (quá khứ) để xác định loại hỗn hợp.",
        ],
      },
    ],
    points: [
      "Điều kiện quá khứ → kết quả hiện tại: If + S + had + V3, S + would + V. If I had studied medicine, I would be a doctor now. — Nếu tôi đã học y, giờ tôi đã là bác sĩ.",
      "Điều kiện hiện tại → kết quả quá khứ: If + S + V2/were, S + would have + V3. If I were more careful, I wouldn't have lost it. — Nếu tôi cẩn thận hơn, tôi đã không làm mất nó.",
      "Mệnh đề 'if' và mệnh đề chính diễn tả những mốc thời gian KHÔNG giống nhau.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "If I ___ harder last year, I would have a better job now.",
        options: ["studied", "had studied", "would study"],
        answer: "had studied",
        explain_vi:
          "Nguyên nhân ở quá khứ (had + V3), kết quả ở hiện tại (would + V). Đây là điều kiện hỗn hợp loại 3→2.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "If she were more organized, she ___ (not / miss) the deadline yesterday.",
        answer: "wouldn't have missed",
        explain_vi:
          "Điều kiện hiện tại (were) → kết quả quá khứ (would not have + V3): wouldn't have missed.",
      },
      {
        id: "e3",
        type: "choice",
        question: "If they had saved money, they ___ in debt today.",
        options: ["wouldn't be", "wouldn't have been", "won't be"],
        answer: "wouldn't be",
        explain_vi:
          "Điều kiện quá khứ (had saved) → kết quả hiện tại (would not + V nguyên thể): wouldn't be.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu điều kiện hỗn hợp:",
        options: [
          "If",
          "he",
          "spoke French,",
          "he would have understood",
          "the lecture",
        ],
        answer: "If he spoke French, he would have understood the lecture",
        explain_vi:
          "Điều kiện hiện tại (spoke) → kết quả quá khứ (would have understood).",
      },
      {
        id: "e5",
        type: "choice",
        question:
          "If she had taken the job in London, she ___ there now.",
        options: ["would live", "would have lived", "will live"],
        answer: "would live",
        explain_vi:
          "Điều kiện quá khứ (had taken) → kết quả hiện tại (would + V): would live.",
      },
      {
        id: "e6",
        type: "fill",
        question:
          "If he ___ (be) a better driver, he wouldn't have had the accident.",
        answer: "were",
        explain_vi:
          "Điều kiện hiện tại (tính cách không đổi) dùng V2/were → kết quả quá khứ (wouldn't have had).",
      },
      {
        id: "e7",
        type: "choice",
        question:
          "If I hadn't broken my leg, I ___ in the marathon tomorrow.",
        options: ["would run", "would have run", "will run"],
        answer: "would run",
        explain_vi:
          "Điều kiện quá khứ (hadn't broken) → kết quả tương lai/hiện tại (would + V): would run.",
      },
      {
        id: "e8",
        type: "reorder",
        question: "Sắp xếp thành câu điều kiện hỗn hợp (loại 3→2):",
        options: [
          "If",
          "we had booked earlier,",
          "we",
          "would have",
          "better seats now",
        ],
        answer: "If we had booked earlier, we would have better seats now",
        explain_vi:
          "Quá khứ (had booked) → hiện tại (would have — ở đây 'have' là động từ chính, không phải trợ động từ).",
      },
      {
        id: "e9",
        type: "fill",
        question:
          "If I ___ (not / eat) so much last night, I wouldn't feel sick now.",
        answer: "hadn't eaten",
        explain_vi:
          "Điều kiện quá khứ dùng past perfect phủ định: hadn't eaten. Kết quả hiện tại: wouldn't feel.",
      },
      {
        id: "e10",
        type: "choice",
        question:
          "If Tom were ambitious, he ___ for the promotion last month.",
        options: [
          "would apply",
          "would have applied",
          "had applied",
        ],
        answer: "would have applied",
        explain_vi:
          "Điều kiện hiện tại (were ambitious — tính cách) → kết quả quá khứ (would have applied).",
      },
    ],
  },
  {
    id: "gr_c1_cleft_sentences",
    level: "c1",
    title: "Cleft Sentences",
    title_vi: "Câu chẻ (câu nhấn mạnh)",
    summary_vi:
      "Tách câu thành hai phần để nhấn mạnh một thành phần cụ thể. Hai dạng phổ biến: It-cleft (It is/was ... that ...) và Wh-cleft (What ... is/was ...).",
    sections: [
      {
        heading: "It-cleft (It is/was ... that/who ...)",
        points: [
          "It is/was + thành phần nhấn mạnh + that/who + phần còn lại.",
          "Nhấn mạnh chủ ngữ: It was John who broke the window. — Chính John là người làm vỡ cửa sổ.",
          "Nhấn mạnh tân ngữ: It was the red dress that she bought. — Chính chiếc váy đỏ là thứ cô ấy mua.",
          "Nhấn mạnh trạng ngữ: It was in Paris that we met. — Chính ở Paris chúng tôi đã gặp nhau.",
        ],
      },
      {
        heading: "Wh-cleft (Pseudo-cleft)",
        points: [
          "What + mệnh đề + is/was + thành phần nhấn mạnh: What I need is a holiday. — Thứ tôi cần là một kỳ nghỉ.",
          "All + mệnh đề + is/was ...: All I want is peace. — Tất cả những gì tôi muốn là sự bình yên.",
          "The thing/person/reason + mệnh đề + is/was ...: The reason I left was the noise. — Lý do tôi rời đi là tiếng ồn.",
        ],
      },
      {
        heading: "Lưu ý khi dùng",
        points: [
          "💡 Trong It-cleft, luôn dùng 'that' làm từ nối (kể cả khi nhấn mạnh thời gian/nơi chốn), tránh dùng 'when/where'.",
          "Khi nhấn mạnh người, có thể dùng 'who' thay 'that': It was Mary who/that helped me.",
        ],
      },
    ],
    points: [
      "It-cleft: It is/was + thành phần nhấn mạnh + that/who + phần còn lại. It was John who broke the window. — Chính John là người làm vỡ cửa sổ.",
      "Wh-cleft (pseudo-cleft): What + mệnh đề + is/was + thành phần nhấn mạnh. What I need is a holiday. — Thứ tôi cần là một kỳ nghỉ.",
      "Có thể nhấn mạnh chủ ngữ, tân ngữ hoặc trạng ngữ: It was in Paris that we met. — Chính ở Paris chúng tôi đã gặp nhau.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "___ Mary who solved the problem.",
        options: ["It was", "There was", "What was"],
        answer: "It was",
        explain_vi:
          "Cấu trúc It-cleft nhấn mạnh chủ ngữ: It was + Mary + who ...",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "___ I really want is more free time. (dùng cấu trúc What-cleft)",
        answer: "What",
        explain_vi:
          "Wh-cleft bắt đầu bằng 'What' + mệnh đề + is/was + thành phần nhấn mạnh.",
      },
      {
        id: "e3",
        type: "choice",
        question: "It was in 2020 ___ the company was founded.",
        options: ["which", "that", "when"],
        answer: "that",
        explain_vi:
          "Trong cấu trúc It-cleft, sau thành phần nhấn mạnh ta dùng 'that' (kể cả khi nhấn mạnh trạng ngữ thời gian).",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu chẻ Wh-cleft:",
        options: ["What", "she enjoys", "is", "reading novels"],
        answer: "What she enjoys is reading novels",
        explain_vi:
          "Wh-cleft: What + mệnh đề (she enjoys) + is + thành phần nhấn mạnh (reading novels).",
      },
      {
        id: "e5",
        type: "fill",
        question: "It was his attitude ___ annoyed everyone. (điền từ nối)",
        answer: "that",
        explain_vi:
          "Nhấn mạnh tân ngữ/danh từ chỉ vật trong It-cleft dùng 'that'.",
      },
      {
        id: "e6",
        type: "choice",
        question: "___ the manager who made the final decision.",
        options: ["It was", "What was", "There was"],
        answer: "It was",
        explain_vi:
          "It-cleft nhấn mạnh người: It was + người + who + phần còn lại.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "___ she said that upset him. (dùng cấu trúc What-cleft, điền từ đầu câu)",
        answer: "What",
        explain_vi:
          "Wh-cleft: What + mệnh đề (she said) + mệnh đề chính (that upset him).",
      },
      {
        id: "e8",
        type: "choice",
        question:
          "It was because of the rain ___ the match was cancelled.",
        options: ["why", "that", "which"],
        answer: "that",
        explain_vi:
          "Trong It-cleft, luôn dùng 'that' sau thành phần nhấn mạnh, kể cả khi nhấn mạnh lý do.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp thành câu chẻ It-cleft:",
        options: ["It", "was", "the noise", "that", "woke me up"],
        answer: "It was the noise that woke me up",
        explain_vi:
          "It-cleft: It + was + thành phần nhấn mạnh (the noise) + that + phần còn lại.",
      },
      {
        id: "e10",
        type: "reorder",
        question: "Sắp xếp thành câu chẻ Wh-cleft:",
        options: [
          "All",
          "I want",
          "is",
          "a cup of coffee",
        ],
        answer: "All I want is a cup of coffee",
        explain_vi:
          "Wh-cleft dạng 'All': All + mệnh đề (I want) + is + thành phần nhấn mạnh.",
      },
      {
        id: "e11",
        type: "fill",
        question:
          "It ___ (be) at the airport that I lost my passport. (dùng thì quá khứ)",
        answer: "was",
        explain_vi:
          "It-cleft nhấn mạnh nơi chốn ở quá khứ: It was + at the airport + that ...",
      },
      {
        id: "e12",
        type: "choice",
        question: "What surprised me ___ his honesty.",
        options: ["was", "were", "is that"],
        answer: "was",
        explain_vi:
          "Wh-cleft: What + mệnh đề (surprised me) + was + thành phần nhấn mạnh (his honesty).",
      },
    ],
  },
  {
    id: "gr_c1_advanced_passive",
    level: "c1",
    title: "Advanced Passive",
    title_vi: "Bị động nâng cao",
    summary_vi:
      "Các dạng bị động học thuật: causative (have/get something done), bị động với động từ tường thuật (It is said that ...; S + is said to ...), và bị động của danh động từ.",
    sections: [
      {
        heading: "Causative (have/get + O + V3)",
        points: [
          "have + tân ngữ + V3 (nhờ ai làm việc gì): I had my car repaired. — Tôi đã nhờ sửa xe.",
          "get + tân ngữ + V3 (nghĩa tương tự, ít trang trọng hơn): She got her nails done. — Cô ấy đi làm móng.",
          "💡 Causative cũng dùng khi bị ai đó làm điều gì (không mong muốn): He had his wallet stolen. — Anh ấy bị móc ví.",
        ],
      },
      {
        heading: "Bị động tường thuật (Reporting passive)",
        points: [
          "It is said/believed/reported/thought + that + mệnh đề: It is said that he is rich. — Người ta nói rằng anh ấy giàu.",
          "S + is said/believed + to-infinitive: He is said to be rich. — Người ta nói anh ấy giàu.",
          "Hành động xảy ra trước: S + is believed + to have + V3: She is believed to have left. — Người ta tin rằng cô ấy đã rời đi.",
        ],
      },
      {
        heading: "Bị động với need / want / require",
        points: [
          "S (vật) + need/want/require + V-ing (mang nghĩa bị động): The car needs washing. = The car needs to be washed. — Xe cần được rửa.",
          "💡 Đây là trường hợp đặc biệt: V-ing sau need/want/require mang nghĩa bị động, không phải chủ động.",
        ],
      },
    ],
    points: [
      "Causative: have/get + tân ngữ + V3 (nhờ ai làm việc gì). I had my car repaired. — Tôi đã nhờ sửa xe.",
      "Bị động tường thuật khách quan: It is said/believed/reported that + mệnh đề. It is said that he is rich.",
      "Bị động với S + to-infinitive: He is said to be rich. — Người ta nói anh ấy giàu.",
      "Bị động hoàn thành của tường thuật: She is believed to have left. — Người ta tin rằng cô ấy đã rời đi.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "I'm going to ___ next week.",
        options: [
          "have cut my hair",
          "have my hair cut",
          "cut my hair have",
        ],
        answer: "have my hair cut",
        explain_vi:
          "Causative: have + tân ngữ (my hair) + V3 (cut) — nhờ người khác cắt tóc.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "It is believed ___ the company is in trouble. (điền từ nối)",
        answer: "that",
        explain_vi:
          "Cấu trúc bị động tường thuật: It is believed that + mệnh đề.",
      },
      {
        id: "e3",
        type: "choice",
        question: "The minister ___ to have accepted the offer.",
        options: ["is said", "says", "is saying"],
        answer: "is said",
        explain_vi:
          "Bị động tường thuật dạng S + is said + to-infinitive: The minister is said to have accepted.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu causative:",
        options: ["She", "got", "her laptop", "fixed", "yesterday"],
        answer: "She got her laptop fixed yesterday",
        explain_vi:
          "Causative với 'get': get + tân ngữ (her laptop) + V3 (fixed).",
      },
      {
        id: "e5",
        type: "fill",
        question: "He is thought ___ (leave) the country last year.",
        answer: "to have left",
        explain_vi:
          "Hành động xảy ra trước thời điểm tường thuật nên dùng to + have + V3: to have left.",
      },
      {
        id: "e6",
        type: "choice",
        question: "The house needs ___.",
        options: ["painting", "to paint", "painted"],
        answer: "painting",
        explain_vi:
          "S (vật) + need + V-ing mang nghĩa bị động: The house needs painting = needs to be painted.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "She had her phone ___ (repair) at the shop last week.",
        answer: "repaired",
        explain_vi:
          "Causative: had + tân ngữ (her phone) + V3 (repair → repaired).",
      },
      {
        id: "e8",
        type: "choice",
        question: "It ___ that the economy will improve next year.",
        options: ["is expected", "expects", "has expected"],
        answer: "is expected",
        explain_vi:
          "Bị động tường thuật: It is expected + that + mệnh đề. Chủ ngữ 'It' là chủ ngữ giả.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp thành câu bị động tường thuật:",
        options: [
          "The suspect",
          "is believed",
          "to have fled",
          "the country",
        ],
        answer: "The suspect is believed to have fled the country",
        explain_vi:
          "Bị động tường thuật: S + is believed + to have + V3 (hành động xảy ra trước).",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "We need to get the roof ___ (fix) before winter.",
        answer: "fixed",
        explain_vi:
          "Causative với 'get': get + tân ngữ (the roof) + V3 (fix → fixed).",
      },
      {
        id: "e11",
        type: "choice",
        question:
          "The prisoners are reported ___ from the jail last night.",
        options: [
          "to have escaped",
          "to escape",
          "escaping",
        ],
        answer: "to have escaped",
        explain_vi:
          "Hành động trốn thoát xảy ra trước thời điểm tường thuật → dùng to have + V3.",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp thành câu causative (bị hại):",
        options: ["He", "had", "his wallet", "stolen", "on the bus"],
        answer: "He had his wallet stolen on the bus",
        explain_vi:
          "Causative (bị hại): had + tân ngữ + V3 — anh ấy bị móc ví trên xe buýt.",
      },
    ],
  },
  {
    id: "gr_c1_subjunctive",
    level: "c1",
    title: "Subjunctive (wish / if only)",
    title_vi: "Thức giả định (wish / if only)",
    summary_vi:
      "Diễn tả mong muốn, hối tiếc hoặc điều trái với thực tế. Dùng wish/if only với thì lùi (past simple cho hiện tại, past perfect cho quá khứ) và 'were' cho mọi chủ ngữ.",
    sections: [
      {
        heading: "Ước trái với hiện tại",
        points: [
          "wish/if only + S + V2 (were): I wish I were taller. — Ước gì tôi cao hơn.",
          "Luôn dùng 'were' cho mọi chủ ngữ (không dùng 'was'): I wish he were here.",
          "💡 Thì trong mệnh đề wish LÙI một bậc so với thực tế: hiện tại → quá khứ đơn.",
        ],
      },
      {
        heading: "Ước/hối tiếc về quá khứ",
        points: [
          "wish/if only + S + had + V3: I wish I had studied harder. — Ước gì tôi đã học chăm hơn.",
          "If only we hadn't missed the train! — Giá mà chúng tôi đã không lỡ tàu!",
        ],
      },
      {
        heading: "Ước về hành vi phiền toái / Thức giả định trang trọng",
        points: [
          "wish + S + would + V: I wish you would stop shouting. — Ước gì bạn ngừng la hét. (than phiền/mong thay đổi)",
          "Sau các ĐT/TT mệnh lệnh (suggest, demand, insist, essential, vital): S + (should) + V nguyên thể.",
          "I suggest that he be present. — Tôi đề nghị anh ấy có mặt. (không chia 'is/be')",
        ],
      },
    ],
    points: [
      "Ước hiện tại (trái thực tế): wish/if only + S + V2 (were). I wish I were taller. — Ước gì tôi cao hơn.",
      "Ước quá khứ (hối tiếc): wish/if only + S + had + V3. I wish I had studied harder. — Ước gì tôi đã học chăm hơn.",
      "Ước về hành vi phiền toái của người khác: wish + S + would + V. I wish you would stop shouting. — Ước gì bạn ngừng la hét.",
      "Sau các động từ/tính từ mệnh lệnh (suggest, demand, essential): S + (should) + V nguyên thể. I suggest that he be present.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "I wish I ___ how to swim.",
        options: ["know", "knew", "have known"],
        answer: "knew",
        explain_vi:
          "Ước trái với hiện tại dùng thì quá khứ đơn (lùi thì): I wish I knew.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "If only I ___ (not / spend) all my money last weekend.",
        answer: "hadn't spent",
        explain_vi:
          "Hối tiếc về quá khứ dùng past perfect: If only + S + had not + V3 = hadn't spent.",
      },
      {
        id: "e3",
        type: "choice",
        question: "She wishes she ___ in a bigger house.",
        options: ["lives", "lived", "had lived"],
        answer: "lived",
        explain_vi:
          "Ước về tình huống hiện tại trái thực tế dùng past simple: lived.",
      },
      {
        id: "e4",
        type: "fill",
        question:
          "It is essential that every student ___ (be) on time. (thức giả định)",
        answer: "be",
        explain_vi:
          "Sau 'It is essential that' dùng thức giả định: động từ nguyên thể 'be' cho mọi chủ ngữ.",
      },
      {
        id: "e5",
        type: "reorder",
        question: "Sắp xếp thành câu giả định:",
        options: ["I", "wish", "you", "would", "listen to me"],
        answer: "I wish you would listen to me",
        explain_vi:
          "wish + S + would + V dùng để than phiền/mong người khác thay đổi hành vi.",
      },
      {
        id: "e6",
        type: "choice",
        question: "If only he ___ here right now!",
        options: ["is", "were", "has been"],
        answer: "were",
        explain_vi:
          "Ước trái với hiện tại: If only + S + were (dùng 'were' cho mọi ngôi, kể cả he/she/it).",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "I wish I ___ (accept) the job offer last month.",
        answer: "had accepted",
        explain_vi:
          "Hối tiếc về quá khứ: wish + S + had + V3 = had accepted.",
      },
      {
        id: "e8",
        type: "choice",
        question:
          "The doctor insisted that the patient ___ more rest.",
        options: ["gets", "get", "got"],
        answer: "get",
        explain_vi:
          "Sau 'insist that' dùng thức giả định: V nguyên thể 'get' cho mọi chủ ngữ.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp thành câu hối tiếc:",
        options: [
          "If only",
          "we",
          "had",
          "arrived",
          "earlier",
        ],
        answer: "If only we had arrived earlier",
        explain_vi:
          "If only + S + had + V3: hối tiếc về quá khứ — giá mà chúng tôi đến sớm hơn.",
      },
      {
        id: "e10",
        type: "choice",
        question:
          "I wish it ___ raining. I want to go for a walk.",
        options: ["stops", "would stop", "stopped"],
        answer: "would stop",
        explain_vi:
          "wish + S + would + V dùng khi muốn tình huống (thời tiết) thay đổi trong tương lai gần.",
      },
      {
        id: "e11",
        type: "fill",
        question:
          "The committee demanded that the report ___ (submit) by Friday.",
        answer: "be submitted",
        explain_vi:
          "Thức giả định sau 'demand that': V nguyên thể. Vì report 'được nộp' (bị động) → be submitted.",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp thành câu thức giả định trang trọng:",
        options: [
          "She",
          "suggested",
          "that",
          "he",
          "take a break",
        ],
        answer: "She suggested that he take a break",
        explain_vi:
          "Sau 'suggest that' dùng V nguyên thể: he take (không phải 'takes' hay 'took').",
      },
    ],
  },
  {
    id: "gr_c1_participle_clauses",
    level: "c1",
    title: "Participle Clauses",
    title_vi: "Mệnh đề phân từ (rút gọn)",
    summary_vi:
      "Rút gọn mệnh đề để câu súc tích, trang trọng. Dùng V-ing (phân từ hiện tại) cho nghĩa chủ động, V3 (phân từ quá khứ) cho nghĩa bị động, having + V3 cho hành động xảy ra trước.",
    sections: [
      {
        heading: "Phân từ hiện tại (V-ing) — nghĩa chủ động",
        points: [
          "Walking home, I saw an accident. — Khi đang đi bộ về nhà, tôi thấy một tai nạn.",
          "Not knowing the answer, she left it blank. — Không biết đáp án, cô ấy bỏ trống.",
          "Dùng khi hai hành động xảy ra đồng thời hoặc hành động phụ diễn tả nguyên nhân/thời gian.",
        ],
      },
      {
        heading: "Phân từ quá khứ (V3) — nghĩa bị động",
        points: [
          "Built in 1900, the house is now a museum. — Được xây năm 1900, ngôi nhà giờ là bảo tàng.",
          "Shocked by the news, he sat down. — Bị sốc bởi tin, anh ấy ngồi xuống.",
        ],
      },
      {
        heading: "Having + V3 — hành động xảy ra trước",
        points: [
          "Having finished the report, she went home. — Sau khi làm xong báo cáo, cô ấy về nhà.",
          "Having been warned, they stayed indoors. — Đã được cảnh báo (bị động + xảy ra trước), họ ở trong nhà.",
          "💡 Chỉ rút gọn được khi hai mệnh đề CÙNG chủ ngữ. Nếu khác chủ ngữ sẽ tạo 'dangling participle' (lỗi ngữ pháp).",
        ],
      },
    ],
    points: [
      "Chủ động: Walking home, I saw an accident. — Khi đang đi bộ về nhà, tôi thấy một tai nạn.",
      "Bị động: Built in 1900, the house is now a museum. — Được xây năm 1900, ngôi nhà giờ là bảo tàng.",
      "Hành động trước: Having finished the report, she went home. — Sau khi làm xong báo cáo, cô ấy về nhà.",
      "Chỉ rút gọn được khi hai mệnh đề CÙNG chủ ngữ.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "___ the news, she burst into tears.",
        options: ["Hearing", "Heard", "To hear"],
        answer: "Hearing",
        explain_vi:
          "Nghĩa chủ động (cô ấy nghe tin) nên dùng phân từ hiện tại V-ing: Hearing.",
      },
      {
        id: "e2",
        type: "choice",
        question:
          "___ in a hurry, the report contained several errors.",
        options: ["Writing", "Written", "Having written"],
        answer: "Written",
        explain_vi:
          "Bản báo cáo 'được viết' (nghĩa bị động) nên dùng phân từ quá khứ V3: Written.",
      },
      {
        id: "e3",
        type: "fill",
        question:
          "___ (finish) his work, he left the office. (hành động xảy ra trước)",
        answer: "Having finished",
        explain_vi:
          "Hành động hoàn tất trước hành động chính dùng Having + V3: Having finished.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành mệnh đề phân từ:",
        options: ["Feeling tired,", "she", "decided", "to rest"],
        answer: "Feeling tired, she decided to rest",
        explain_vi:
          "Mệnh đề phân từ chủ động (Feeling tired) đứng đầu, cùng chủ ngữ 'she' với mệnh đề chính.",
      },
      {
        id: "e5",
        type: "fill",
        question:
          "___ (surround) by mountains, the village is hard to reach.",
        answer: "Surrounded",
        explain_vi:
          "Ngôi làng 'được bao quanh' (bị động) nên dùng phân từ quá khứ: Surrounded.",
      },
      {
        id: "e6",
        type: "choice",
        question:
          "___ the instructions carefully, he assembled the furniture.",
        options: [
          "Having read",
          "Having been read",
          "Being read",
        ],
        answer: "Having read",
        explain_vi:
          "Anh ấy đọc (chủ động) hướng dẫn TRƯỚC khi lắp ráp → Having + V3: Having read.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "___ (not / know) the way, they asked a local for directions.",
        answer: "Not knowing",
        explain_vi:
          "Phân từ hiện tại phủ định: Not + V-ing. Nghĩa chủ động (họ không biết đường).",
      },
      {
        id: "e8",
        type: "choice",
        question: "___ by the loud noise, the baby started crying.",
        options: ["Frightening", "Frightened", "Having frightened"],
        answer: "Frightened",
        explain_vi:
          "Em bé 'bị sợ hãi' bởi tiếng ồn (nghĩa bị động) → dùng phân từ quá khứ: Frightened.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp thành mệnh đề phân từ (hành động trước):",
        options: [
          "Having been warned",
          "about the storm,",
          "they",
          "stayed indoors",
        ],
        answer:
          "Having been warned about the storm, they stayed indoors",
        explain_vi:
          "Bị động + xảy ra trước: Having been + V3. Họ 'đã được cảnh báo' trước khi ở trong nhà.",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "___ (paint) in bright colors, the house stood out on the street.",
        answer: "Painted",
        explain_vi:
          "Ngôi nhà 'được sơn' (bị động) → dùng phân từ quá khứ: Painted.",
      },
      {
        id: "e11",
        type: "choice",
        question:
          "___ along the beach, we found some beautiful shells.",
        options: ["Walked", "Walking", "Having been walked"],
        answer: "Walking",
        explain_vi:
          "Chúng tôi đi bộ (chủ động, đồng thời) → dùng phân từ hiện tại: Walking.",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp thành mệnh đề phân từ bị động:",
        options: [
          "Seen",
          "from above,",
          "the city",
          "looks",
          "like a maze",
        ],
        answer: "Seen from above, the city looks like a maze",
        explain_vi:
          "Thành phố 'được nhìn' từ trên cao (bị động) → phân từ quá khứ: Seen from above.",
      },
    ],
  },
  {
    id: "gr_c1_emphasis",
    level: "c1",
    title: "Emphasis with do/did",
    title_vi: "Nhấn mạnh với do/did",
    summary_vi:
      "Dùng trợ động từ 'do/does/did' trước động từ chính (thể khẳng định) để nhấn mạnh hành động là thật, trái với mong đợi hoặc phản bác lại lời phủ nhận. Thường gặp trong giao tiếp hàng ngày và văn viết bán trang trọng.",
    sections: [
      {
        heading: "Nhấn mạnh ở thì hiện tại",
        points: [
          "do/does + V nguyên thể: I DO like it. — Tôi thích nó thật mà. (nhấn mạnh, phản bác lại ai đó nghĩ mình không thích)",
          "She DOES work hard. — Cô ấy CÓ làm việc chăm chỉ. (nhấn mạnh sự thật)",
          "💡 Khi nói, 'do/does' được nhấn trọng âm mạnh. Khi viết, thường in HOA hoặc in nghiêng để thể hiện.",
        ],
      },
      {
        heading: "Nhấn mạnh ở thì quá khứ",
        points: [
          "did + V nguyên thể: She DID tell me. — Cô ấy CÓ nói cho tôi. (phản bác lại lời phủ nhận)",
          "I DID lock the door. — Tôi CÓ khóa cửa. (khẳng định chắc chắn)",
          "They DID arrive on time, but nobody noticed. — Họ CÓ đến đúng giờ, nhưng không ai để ý.",
        ],
      },
      {
        heading: "Nhấn mạnh với câu mệnh lệnh và các trường hợp đặc biệt",
        points: [
          "Do + V (mệnh lệnh nhấn mạnh / lịch sự): Do sit down! — Mời ngồi! Do be careful! — Hãy cẩn thận nhé!",
          "Dùng trong mệnh đề nhượng bộ: Although he DOES try, he never succeeds. — Dù anh ấy CÓ cố gắng, anh ấy không bao giờ thành công.",
          "💡 Không dùng do/did để nhấn mạnh với 'be', 'have (got)', hoặc modal verbs (can, will...). Chỉ dùng với động từ thường.",
        ],
      },
    ],
    points: [
      "do/does + V nguyên thể (hiện tại): I DO like it. — Tôi thích nó thật mà.",
      "did + V nguyên thể (quá khứ): She DID tell me. — Cô ấy CÓ nói cho tôi.",
      "Do + V (mệnh lệnh nhấn mạnh): Do sit down! — Mời ngồi!",
      "Chỉ dùng với động từ thường, không dùng với be/have got/modal verbs.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "I know you think I forgot, but I ___ remember your birthday.",
        options: ["do", "am", "have"],
        answer: "do",
        explain_vi:
          "Dùng 'do' trước động từ chính 'remember' để nhấn mạnh ở thì hiện tại: I DO remember.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "She ___ (do) enjoy classical music, even though she rarely talks about it.",
        answer: "does",
        explain_vi:
          "Chủ ngữ ngôi 3 số ít 'She' dùng 'does' để nhấn mạnh trước động từ nguyên thể 'enjoy'.",
      },
      {
        id: "e3",
        type: "choice",
        question: "He ___ apologize yesterday, but she didn't accept it.",
        options: ["did", "does", "was"],
        answer: "did",
        explain_vi:
          "Nhấn mạnh hành động đã xảy ra ở quá khứ dùng 'did' + V nguyên thể: did apologize.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu nhấn mạnh:",
        options: ["I", "do", "want", "to help", "you"],
        answer: "I do want to help you",
        explain_vi:
          "Nhấn mạnh với 'do' + V nguyên thể: I do want to help you — Tôi thật sự muốn giúp bạn.",
      },
      {
        id: "e5",
        type: "choice",
        question: "___ be careful on the road!",
        options: ["Do", "Did", "Does"],
        answer: "Do",
        explain_vi:
          "Dùng 'Do' đầu câu mệnh lệnh để nhấn mạnh lời nhắc nhở/lịch sự: Do be careful!",
      },
      {
        id: "e6",
        type: "fill",
        question:
          "They ___ (do) finish the project on time, despite all the problems.",
        answer: "did",
        explain_vi:
          "Nhấn mạnh hành động quá khứ: 'did' + V nguyên thể 'finish'. Họ CÓ hoàn thành đúng hạn.",
      },
      {
        id: "e7",
        type: "choice",
        question:
          "Although the exam was hard, she ___ pass it in the end.",
        options: ["did", "does", "has"],
        answer: "did",
        explain_vi:
          "Nhấn mạnh trong mệnh đề nhượng bộ, hành động quá khứ: did + V nguyên thể.",
      },
      {
        id: "e8",
        type: "reorder",
        question: "Sắp xếp thành câu nhấn mạnh ở quá khứ:",
        options: ["She", "did", "tell", "me", "the truth"],
        answer: "She did tell me the truth",
        explain_vi:
          "Nhấn mạnh quá khứ: S + did + V nguyên thể. Cô ấy CÓ nói sự thật cho tôi.",
      },
      {
        id: "e9",
        type: "fill",
        question:
          "We ___ (do) appreciate your support. Thank you so much!",
        answer: "do",
        explain_vi:
          "Chủ ngữ 'We' (ngôi 1 số nhiều) dùng 'do' để nhấn mạnh: We DO appreciate.",
      },
      {
        id: "e10",
        type: "choice",
        question:
          "Which sentence correctly uses emphatic 'do'?",
        options: [
          "I do am happy.",
          "I do feel happy.",
          "I do be happy.",
        ],
        answer: "I do feel happy.",
        explain_vi:
          "Chỉ dùng do/did với động từ thường (feel), không dùng với 'be' hay 'am'. 'I do feel happy' là đúng.",
      },
      {
        id: "e11",
        type: "reorder",
        question: "Sắp xếp thành câu mệnh lệnh nhấn mạnh:",
        options: ["Do", "come", "and", "visit", "us sometime"],
        answer: "Do come and visit us sometime",
        explain_vi:
          "Câu mệnh lệnh nhấn mạnh lịch sự: Do + V nguyên thể. Do come and visit us sometime — Nhất định hãy đến thăm chúng tôi nhé.",
      },
      {
        id: "e12",
        type: "fill",
        question:
          "He ___ (do) look tired today. Maybe he didn't sleep well.",
        answer: "does",
        explain_vi:
          "Chủ ngữ ngôi 3 số ít 'He' dùng 'does' + V nguyên thể 'look' để nhấn mạnh: He DOES look tired.",
      },
    ],
  },
  {
    id: "gr_c1_discourse_markers",
    level: "c1",
    title: "Discourse Markers",
    title_vi: "Từ nối liên kết văn bản",
    summary_vi:
      "Các từ/cụm từ dùng để tổ chức, liên kết ý trong văn nói và văn viết. Bao gồm: bổ sung (moreover, furthermore), tương phản (on the other hand, nevertheless), nguyên nhân-kết quả (consequently, therefore), ví dụ (for instance), và tổng kết (in conclusion, to sum up).",
    sections: [
      {
        heading: "Bổ sung ý (Addition)",
        points: [
          "moreover / furthermore / in addition / besides: thêm thông tin, trang trọng hơn 'and'.",
          "Moreover, the study revealed a significant improvement. — Hơn nữa, nghiên cứu cho thấy sự cải thiện đáng kể.",
          "Furthermore, the cost was lower than expected. — Thêm vào đó, chi phí thấp hơn dự kiến.",
          "💡 'Moreover' và 'furthermore' thường đứng đầu câu, theo sau bởi dấu phẩy. Mang tính học thuật, trang trọng.",
        ],
      },
      {
        heading: "Tương phản (Contrast)",
        points: [
          "on the other hand / however / nevertheless / nonetheless / conversely: diễn tả ý trái ngược.",
          "On the other hand, some experts disagree. — Mặt khác, một số chuyên gia không đồng ý.",
          "Nevertheless, she decided to continue. — Tuy nhiên, cô ấy quyết định tiếp tục.",
          "💡 'On the other hand' dùng khi so sánh hai mặt. 'However/Nevertheless' dùng khi ý sau trái ngược/bất ngờ so với ý trước.",
        ],
      },
      {
        heading: "Nguyên nhân – Kết quả (Cause & Effect)",
        points: [
          "consequently / therefore / as a result / hence / thus: chỉ kết quả/hệ quả.",
          "The roads were icy. Consequently, several accidents occurred. — Đường trơn. Do đó, nhiều tai nạn xảy ra.",
          "She didn't study; therefore, she failed. — Cô ấy không học; vì vậy, cô ấy trượt.",
        ],
      },
      {
        heading: "Ví dụ và tổng kết (Example & Summary)",
        points: [
          "for instance / for example / such as: đưa ví dụ. For instance, many countries have adopted this policy. — Ví dụ, nhiều nước đã áp dụng chính sách này.",
          "in conclusion / to sum up / in short / all in all: tổng kết. In conclusion, the project was a success. — Tóm lại, dự án đã thành công.",
          "💡 Hầu hết discourse markers đứng đầu câu + dấu phẩy, hoặc giữa hai mệnh đề với dấu chấm phẩy phía trước và dấu phẩy phía sau.",
        ],
      },
    ],
    points: [
      "Bổ sung: moreover, furthermore, in addition, besides — thêm ý, trang trọng.",
      "Tương phản: on the other hand, however, nevertheless, nonetheless — ý trái ngược.",
      "Kết quả: consequently, therefore, as a result, hence, thus — chỉ hệ quả.",
      "Ví dụ: for instance, for example, such as — minh họa ý.",
      "Tổng kết: in conclusion, to sum up, in short, all in all — kết luận.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question:
          "The hotel was expensive. ___, the service was excellent.",
        options: ["Nevertheless", "Consequently", "Furthermore"],
        answer: "Nevertheless",
        explain_vi:
          "Ý sau trái ngược với ý trước (đắt nhưng dịch vụ tốt) → dùng 'Nevertheless' (tuy nhiên).",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "The experiment failed. ___, the team decided to start over. (điền từ chỉ kết quả)",
        answer: "Consequently",
        explain_vi:
          "Thí nghiệm thất bại → hệ quả là đội quyết định làm lại. 'Consequently' = do đó.",
      },
      {
        id: "e3",
        type: "choice",
        question:
          "The product is affordable. ___, it is also eco-friendly.",
        options: ["Moreover", "However", "Therefore"],
        answer: "Moreover",
        explain_vi:
          "Bổ sung thêm ưu điểm (vừa rẻ vừa thân thiện môi trường) → 'Moreover' (hơn nữa).",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp thành câu có discourse marker:",
        options: [
          "On the other hand,",
          "some people",
          "prefer",
          "working",
          "from home",
        ],
        answer: "On the other hand, some people prefer working from home",
        explain_vi:
          "'On the other hand' đứng đầu câu + dấu phẩy để đưa ra quan điểm đối lập.",
      },
      {
        id: "e5",
        type: "choice",
        question:
          "She worked very hard; ___, she got promoted quickly.",
        options: ["nevertheless", "therefore", "on the other hand"],
        answer: "therefore",
        explain_vi:
          "Làm việc chăm chỉ → kết quả là được thăng chức nhanh. 'Therefore' = vì vậy.",
      },
      {
        id: "e6",
        type: "fill",
        question:
          "Many cities face pollution. ___, air quality in Beijing has worsened. (điền từ đưa ví dụ)",
        answer: "For instance",
        explain_vi:
          "Đưa ví dụ cụ thể (Bắc Kinh) cho nhận định chung → 'For instance' = ví dụ.",
      },
      {
        id: "e7",
        type: "choice",
        question:
          "___, the evidence strongly supports the new theory.",
        options: ["In conclusion", "For instance", "On the other hand"],
        answer: "In conclusion",
        explain_vi:
          "Đây là câu tổng kết cuối cùng → dùng 'In conclusion' (tóm lại).",
      },
      {
        id: "e8",
        type: "reorder",
        question: "Sắp xếp thành câu có discourse marker chỉ bổ sung:",
        options: [
          "Furthermore,",
          "the research",
          "confirms",
          "previous",
          "findings",
        ],
        answer: "Furthermore, the research confirms previous findings",
        explain_vi:
          "'Furthermore' đứng đầu câu + dấu phẩy để bổ sung thêm thông tin.",
      },
      {
        id: "e9",
        type: "fill",
        question:
          "The weather was terrible. ___, we decided to cancel the trip. (điền từ chỉ kết quả)",
        answer: "As a result",
        explain_vi:
          "Thời tiết xấu → hệ quả là hủy chuyến đi. 'As a result' = kết quả là.",
      },
      {
        id: "e10",
        type: "choice",
        question:
          "He is very talented. ___, he lacks experience.",
        options: ["However", "Moreover", "Therefore"],
        answer: "However",
        explain_vi:
          "Ý sau trái ngược với ý trước (tài năng nhưng thiếu kinh nghiệm) → 'However' (tuy nhiên).",
      },
      {
        id: "e11",
        type: "reorder",
        question: "Sắp xếp thành câu có discourse marker chỉ tổng kết:",
        options: [
          "To sum up,",
          "the project",
          "was",
          "a great",
          "success",
        ],
        answer: "To sum up, the project was a great success",
        explain_vi:
          "'To sum up' đứng đầu câu + dấu phẩy để tổng kết nội dung.",
      },
      {
        id: "e12",
        type: "fill",
        question:
          "The plan has many advantages. ___, it reduces costs significantly. (điền từ bổ sung ý)",
        answer: "In addition",
        explain_vi:
          "Bổ sung thêm một ưu điểm nữa → 'In addition' = ngoài ra, thêm vào đó.",
      },
    ],
  },
];
