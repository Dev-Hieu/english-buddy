import type { GrammarTopic } from "../../types";

export const B2_GRAMMAR: GrammarTopic[] = [
  {
    id: "gr_b2_passive",
    level: "b2",
    title: "Passive Voice",
    title_vi: "Câu bị động",
    summary_vi:
      "Cấu trúc be + V3, dùng khi muốn nhấn mạnh đối tượng chịu tác động thay vì người thực hiện hành động. Thì của câu nằm ở động từ 'be'.",
    sections: [
      {
        heading: "Công thức chung",
        points: [
          "S + be (chia theo thì) + V3 (past participle) + (by + tác nhân).",
          "💡 Chỉ động từ có tân ngữ (transitive) mới chuyển được sang bị động.",
        ],
      },
      {
        heading: "Bị động theo từng thì",
        points: [
          "Hiện tại đơn: is/are + V3 — English is spoken here.",
          "Quá khứ đơn: was/were + V3 — The cake was eaten by the kids.",
          "Hiện tại tiếp diễn: is/are + being + V3 — The bridge is being built now.",
          "Quá khứ tiếp diễn: was/were + being + V3 — The house was being painted.",
          "Hiện tại hoàn thành: have/has + been + V3 — The report has been finished.",
          "Tương lai đơn: will + be + V3 — The package will be delivered tomorrow.",
        ],
      },
      {
        heading: "Khi nào dùng bị động?",
        points: [
          "Khi không biết hoặc không quan trọng ai thực hiện: My bike was stolen.",
          "Khi muốn nhấn mạnh đối tượng chịu tác động: The Mona Lisa was painted by Leonardo da Vinci.",
          "Trong văn phong trang trọng, học thuật, báo chí.",
        ],
      },
    ],
    points: [
      "The cake was eaten by the kids. — Cái bánh đã bị bọn trẻ ăn.",
      "English is spoken in many countries. — Tiếng Anh được nói ở nhiều quốc gia.",
      "The bridge is being built now. — Cây cầu đang được xây dựng.",
      "The report has been finished. — Bản báo cáo đã được hoàn thành.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "The letter ___ yesterday.",
        options: ["was sent", "sent", "is sent"],
        answer: "was sent",
        explain_vi: "Bị động ở quá khứ đơn: was/were + V3 (send -> sent).",
      },
      {
        id: "e2",
        type: "fill",
        question: "This novel ___ (write) by a famous author.",
        answer: "was written",
        explain_vi: "Bị động quá khứ: was + V3 (write -> written).",
      },
      {
        id: "e3",
        type: "choice",
        question: "The new road ___ at the moment.",
        options: ["is being built", "is built", "builds"],
        answer: "is being built",
        explain_vi: "Bị động thì hiện tại tiếp diễn: is/are + being + V3.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp: Pho mát được làm từ sữa.",
        options: ["Cheese", "is", "made", "from milk"],
        answer: "Cheese is made from milk",
        explain_vi: "Cấu trúc bị động hiện tại đơn: S + is/are + V3 + ...",
      },
      {
        id: "e5",
        type: "fill",
        question: "All the tickets ___ (sell) already.",
        answer: "have been sold",
        explain_vi: "Bị động hiện tại hoàn thành: have/has + been + V3.",
      },
      {
        id: "e6",
        type: "choice",
        question: "The package ___ tomorrow morning.",
        options: ["will be delivered", "will deliver", "is delivering"],
        answer: "will be delivered",
        explain_vi: "Bị động tương lai đơn: will + be + V3 (deliver -> delivered).",
      },
      {
        id: "e7",
        type: "fill",
        question: "The house ___ (paint) when we arrived.",
        answer: "was being painted",
        explain_vi: "Bị động quá khứ tiếp diễn: was/were + being + V3.",
      },
      {
        id: "e8",
        type: "choice",
        question: "Spanish ___ in many countries around the world.",
        options: ["is spoken", "speaks", "is speaking"],
        answer: "is spoken",
        explain_vi: "Sự thật chung, bị động hiện tại đơn: is/are + V3.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp: Bài kiểm tra đã được chấm bởi giáo viên.",
        options: ["The test", "was", "marked", "by the teacher"],
        answer: "The test was marked by the teacher",
        explain_vi: "Bị động quá khứ đơn: S + was/were + V3 + by + tác nhân.",
      },
      {
        id: "e10",
        type: "fill",
        question: "A new hospital ___ (build) in our city next year.",
        answer: "will be built",
        explain_vi: "Bị động tương lai đơn: will + be + V3 (build -> built).",
      },
      {
        id: "e11",
        type: "choice",
        question: "The windows ___ by the storm last night.",
        options: ["were broken", "broke", "are broken"],
        answer: "were broken",
        explain_vi:
          "Bị động quá khứ đơn, chủ ngữ số nhiều: were + V3 (break -> broken).",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp: Đơn hàng đã được giao rồi.",
        options: ["The order", "has", "been", "delivered"],
        answer: "The order has been delivered",
        explain_vi: "Bị động hiện tại hoàn thành: S + has/have + been + V3.",
      },
    ],
  },
  {
    id: "gr_b2_second_conditional",
    level: "b2",
    title: "Second Conditional",
    title_vi: "Câu điều kiện loại 2",
    summary_vi:
      "Diễn tả tình huống không có thật hoặc khó xảy ra ở hiện tại/tương lai. Cấu trúc: If + S + V (quá khứ đơn), S + would/could + V (nguyên thể).",
    sections: [
      {
        heading: "Cấu trúc cơ bản",
        points: [
          "If + S + V-ed (quá khứ đơn), S + would + V (nguyên thể).",
          "Với 'be' luôn dùng 'were' cho mọi ngôi: If I were you, I would study harder.",
          "💡 Mệnh đề If dùng thì quá khứ nhưng ý nghĩa là hiện tại/tương lai.",
        ],
      },
      {
        heading: "Khi nào dùng điều kiện loại 2?",
        points: [
          "Tình huống giả định, không có thật ở hiện tại: If I had wings, I would fly.",
          "Lời khuyên lịch sự: If I were you, I would see a doctor.",
          "Mơ ước, tưởng tượng: If I won the lottery, I would buy a mansion.",
        ],
      },
      {
        heading: "Biến thể",
        points: [
          "Có thể dùng could/might thay would: If I had time, I could help you.",
          "Dạng phủ định: If he didn't work so hard, he would have more free time.",
        ],
      },
    ],
    points: [
      "If I had money, I would travel the world. — Nếu tôi có tiền, tôi sẽ đi du lịch khắp thế giới.",
      "If she studied harder, she would pass. — Nếu cô ấy học chăm hơn, cô ấy sẽ đậu.",
      "I would help you if I were you. — Tôi sẽ giúp bạn nếu tôi là bạn (luôn dùng 'were' cho mọi ngôi).",
      "What would you do if you won the lottery? — Bạn sẽ làm gì nếu bạn trúng số?",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "If I ___ rich, I would buy a big house.",
        options: ["were", "am", "will be"],
        answer: "were",
        explain_vi:
          "Điều kiện loại 2 dùng quá khứ đơn ở mệnh đề if; với 'be' dùng 'were' cho mọi ngôi.",
      },
      {
        id: "e2",
        type: "fill",
        question: "If we had more time, we ___ (visit) the museum.",
        answer: "would visit",
        explain_vi: "Mệnh đề chính: would + V nguyên thể.",
      },
      {
        id: "e3",
        type: "choice",
        question: "She would call you if she ___ your number.",
        options: ["knew", "knows", "would know"],
        answer: "knew",
        explain_vi: "Mệnh đề if dùng quá khứ đơn (know -> knew).",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp: Nếu tôi là bạn, tôi sẽ học chăm hơn.",
        options: ["If", "I", "were", "you", "I would study harder"],
        answer: "If I were you I would study harder",
        explain_vi: "If + S + were, S + would + V (nguyên thể).",
      },
      {
        id: "e5",
        type: "fill",
        question: "If he ___ (not be) so lazy, he would get a better job.",
        answer: "were not",
        explain_vi: "Dạng phủ định của 'be' trong loại 2: were not (weren't).",
      },
      {
        id: "e6",
        type: "choice",
        question: "If they ___ a car, they would drive to work.",
        options: ["had", "have", "would have"],
        answer: "had",
        explain_vi: "Mệnh đề if dùng quá khứ đơn: have -> had.",
      },
      {
        id: "e7",
        type: "fill",
        question: "I ___ (travel) around the world if I had enough money.",
        answer: "would travel",
        explain_vi: "Mệnh đề chính: would + V nguyên thể (travel).",
      },
      {
        id: "e8",
        type: "choice",
        question: "What ___ you do if you found a wallet on the street?",
        options: ["would", "will", "do"],
        answer: "would",
        explain_vi:
          "Câu hỏi điều kiện loại 2: What would + S + V (nguyên thể)?",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp: Nếu cô ấy biết nấu ăn, cô ấy sẽ mời bạn bè.",
        options: [
          "If",
          "she",
          "could cook",
          "she would invite",
          "her friends",
        ],
        answer: "If she could cook she would invite her friends",
        explain_vi:
          "If + S + could + V, S + would + V. 'Could' thay thế 'quá khứ đơn' trong mệnh đề if.",
      },
      {
        id: "e10",
        type: "fill",
        question: "If it ___ (not rain), we would go for a walk.",
        answer: "did not rain",
        explain_vi:
          "Phủ định trong mệnh đề if: did not + V nguyên thể (didn't rain).",
      },
      {
        id: "e11",
        type: "choice",
        question: "If I ___ you, I would apologize immediately.",
        options: ["were", "was", "am"],
        answer: "were",
        explain_vi:
          "💡 Luôn dùng 'were' (không dùng 'was') trong điều kiện loại 2 cho mọi ngôi.",
      },
      {
        id: "e12",
        type: "reorder",
        question: "Sắp xếp: Anh ấy sẽ mua nhà nếu anh ấy có đủ tiền.",
        options: ["He", "would buy", "a house", "if", "he", "had enough money"],
        answer: "He would buy a house if he had enough money",
        explain_vi:
          "Có thể đặt mệnh đề chính trước: S + would + V + if + S + V-ed.",
      },
    ],
  },
  {
    id: "gr_b2_third_conditional",
    level: "b2",
    title: "Third Conditional",
    title_vi: "Câu điều kiện loại 3",
    summary_vi:
      "Diễn tả điều trái với quá khứ, một việc đã không xảy ra. Cấu trúc: If + S + had + V3, S + would/could have + V3.",
    sections: [
      {
        heading: "Cấu trúc",
        points: [
          "If + S + had + V3 (quá khứ hoàn thành), S + would have + V3.",
          "💡 Loại 3 nói về quá khứ không thể thay đổi, thường để tiếc nuối hoặc phê bình.",
        ],
      },
      {
        heading: "Ý nghĩa và cách dùng",
        points: [
          "Tiếc nuối: If I had studied harder, I would have passed. (Nhưng tôi đã không học chăm.)",
          "Phê bình: If you had listened to me, this wouldn't have happened.",
          "Suy đoán về quá khứ: If they had left earlier, they would have caught the train.",
        ],
      },
      {
        heading: "Biến thể",
        points: [
          "could have / might have thay would have: If I had known, I could have helped.",
          "Dạng phủ định: If she hadn't called, I wouldn't have known.",
        ],
      },
    ],
    points: [
      "If I had studied, I would have passed. — Nếu tôi đã học, tôi đã đậu (nhưng thực tế không học và không đậu).",
      "If they had left earlier, they wouldn't have missed the train. — Nếu họ đã đi sớm hơn, họ đã không lỡ tàu.",
      "She would have helped if you had asked. — Cô ấy đã giúp nếu bạn đã hỏi.",
      "If we had known, we would have come. — Nếu chúng tôi đã biết, chúng tôi đã đến.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "If she ___ harder, she would have passed the exam.",
        options: ["had studied", "studied", "studies"],
        answer: "had studied",
        explain_vi: "Mệnh đề if của loại 3 dùng quá khứ hoàn thành: had + V3.",
      },
      {
        id: "e2",
        type: "fill",
        question: "If I had seen you, I ___ (say) hello.",
        answer: "would have said",
        explain_vi: "Mệnh đề chính: would have + V3 (say -> said).",
      },
      {
        id: "e3",
        type: "choice",
        question: "They wouldn't have got lost if they ___ a map.",
        options: ["had had", "had", "have had"],
        answer: "had had",
        explain_vi:
          "Quá khứ hoàn thành của 'have' là 'had had' (had + V3 'had').",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp: Nếu tôi đã biết, tôi đã giúp bạn.",
        options: ["If", "I", "had known", "I would have helped you"],
        answer: "If I had known I would have helped you",
        explain_vi: "If + S + had + V3, S + would have + V3.",
      },
      {
        id: "e5",
        type: "fill",
        question: "We ___ (not miss) the flight if we had woken up earlier.",
        answer: "would not have missed",
        explain_vi:
          "Dạng phủ định mệnh đề chính: would not have + V3 (miss -> missed).",
      },
      {
        id: "e6",
        type: "choice",
        question:
          "If he ___ the warning, the accident wouldn't have happened.",
        options: ["had seen", "saw", "has seen"],
        answer: "had seen",
        explain_vi:
          "Mệnh đề if loại 3: had + V3. see -> seen.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "She ___ (not buy) that dress if she had known the price.",
        answer: "would not have bought",
        explain_vi:
          "Phủ định: would not have + V3. buy -> bought.",
      },
      {
        id: "e8",
        type: "choice",
        question: "If I had taken the job, I ___ moved to Paris.",
        options: ["would have", "would", "will have"],
        answer: "would have",
        explain_vi: "Mệnh đề chính loại 3: would have + V3.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp: Cô ấy đã không bị trễ nếu cô ấy đã bắt taxi.",
        options: [
          "She",
          "wouldn't have been",
          "late",
          "if",
          "she",
          "had taken a taxi",
        ],
        answer:
          "She wouldn't have been late if she had taken a taxi",
        explain_vi:
          "S + wouldn't have + V3 + if + S + had + V3.",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "If they ___ (arrive) on time, they could have seen the show.",
        answer: "had arrived",
        explain_vi:
          "Mệnh đề if loại 3: had + V3. arrive -> arrived.",
      },
      {
        id: "e11",
        type: "choice",
        question:
          "I ___ have told you if I had known about the meeting.",
        options: ["would", "will", "had"],
        answer: "would",
        explain_vi:
          "💡 Mệnh đề chính loại 3: would (not will) + have + V3.",
      },
      {
        id: "e12",
        type: "reorder",
        question:
          "Sắp xếp: Nếu chúng tôi đã mang ô, chúng tôi đã không bị ướt.",
        options: [
          "If",
          "we",
          "had brought",
          "an umbrella",
          "we wouldn't have got wet",
        ],
        answer:
          "If we had brought an umbrella we wouldn't have got wet",
        explain_vi:
          "If + S + had + V3, S + wouldn't have + V3.",
      },
    ],
  },
  {
    id: "gr_b2_reported_speech",
    level: "b2",
    title: "Reported Speech",
    title_vi: "Câu tường thuật",
    summary_vi:
      "Thuật lại lời người khác nói. Thường lùi thì một bậc về quá khứ và đổi đại từ, trạng từ chỉ thời gian/nơi chốn.",
    sections: [
      {
        heading: "Quy tắc lùi thì",
        points: [
          "Hiện tại đơn -> Quá khứ đơn: \"I like coffee\" -> He said he liked coffee.",
          "Hiện tại tiếp diễn -> Quá khứ tiếp diễn: \"I am reading\" -> She said she was reading.",
          "Hiện tại hoàn thành -> Quá khứ hoàn thành: \"I have finished\" -> He said he had finished.",
          "will -> would, can -> could, may -> might.",
        ],
      },
      {
        heading: "Đổi đại từ và trạng từ",
        points: [
          "I -> he/she, you -> I/me, my -> his/her, we -> they.",
          "today -> that day, yesterday -> the day before, tomorrow -> the next day.",
          "here -> there, this -> that, these -> those.",
        ],
      },
      {
        heading: "Câu hỏi tường thuật",
        points: [
          "Yes/No: dùng if/whether — \"Do you like it?\" -> She asked if I liked it.",
          "Wh-: giữ từ hỏi — \"Where do you live?\" -> He asked where I lived.",
          "💡 Câu hỏi tường thuật dùng trật tự câu trần thuật (không đảo ngữ).",
        ],
      },
    ],
    points: [
      "\"I am tired.\" -> He said he was tired. — Lùi thì: am -> was.",
      "\"I will call you.\" -> She said she would call me. — will -> would, you -> me.",
      "\"I have finished.\" -> He said he had finished. — have finished -> had finished.",
      "\"Do you like it?\" -> She asked if I liked it. — Câu hỏi Yes/No dùng 'if/whether'.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: 'She said she ___ tired. (gốc: "I am tired.")',
        options: ["was", "is", "will be"],
        answer: "was",
        explain_vi: "Lùi thì hiện tại đơn 'am' về quá khứ đơn 'was'.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          'He said he ___ (will) help me. (gốc: "I will help you.")',
        answer: "would",
        explain_vi: "Trong câu tường thuật, 'will' lùi thành 'would'.",
      },
      {
        id: "e3",
        type: "choice",
        question:
          'They told me they ___ already eaten. (gốc: "We have already eaten.")',
        options: ["had", "have", "has"],
        answer: "had",
        explain_vi:
          "Hiện tại hoàn thành 'have eaten' lùi thành quá khứ hoàn thành 'had eaten'.",
      },
      {
        id: "e4",
        type: "reorder",
        question: 'Sắp xếp tường thuật của "I like this book.":',
        options: ["He", "said", "he", "liked", "that book"],
        answer: "He said he liked that book",
        explain_vi: "Lùi thì like -> liked; this -> that.",
      },
      {
        id: "e5",
        type: "fill",
        question:
          'She asked ___ I could swim. (gốc: "Can you swim?")',
        answer: "if",
        explain_vi:
          "Câu hỏi Yes/No tường thuật dùng 'if' hoặc 'whether'.",
      },
      {
        id: "e6",
        type: "choice",
        question:
          'He said he ___ studying at that moment. (gốc: "I am studying now.")',
        options: ["was", "is", "has been"],
        answer: "was",
        explain_vi:
          "Hiện tại tiếp diễn 'am studying' lùi thành quá khứ tiếp diễn 'was studying'. now -> at that moment.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          'She told me she ___ (can) speak three languages. (gốc: "I can speak three languages.")',
        answer: "could",
        explain_vi: "Trong câu tường thuật, 'can' lùi thành 'could'.",
      },
      {
        id: "e8",
        type: "choice",
        question:
          'He asked me where I ___. (gốc: "Where do you live?")',
        options: ["lived", "live", "living"],
        answer: "lived",
        explain_vi:
          "💡 Câu hỏi Wh- tường thuật: giữ từ hỏi, lùi thì, trật tự câu trần thuật.",
      },
      {
        id: "e9",
        type: "reorder",
        question:
          'Sắp xếp tường thuật của "I bought a new car yesterday.":',
        options: [
          "She",
          "said",
          "she",
          "had bought",
          "a new car",
          "the day before",
        ],
        answer: "She said she had bought a new car the day before",
        explain_vi:
          "bought -> had bought (lùi thì); yesterday -> the day before.",
      },
      {
        id: "e10",
        type: "fill",
        question:
          'He asked me ___ I had ever been to Japan. (gốc: "Have you ever been to Japan?")',
        answer: "if",
        explain_vi:
          "Câu hỏi Yes/No tường thuật dùng 'if' hoặc 'whether'.",
      },
      {
        id: "e11",
        type: "choice",
        question:
          'She said she ___ come the next day. (gốc: "I will come tomorrow.")',
        options: ["would", "will", "could"],
        answer: "would",
        explain_vi:
          "will -> would; tomorrow -> the next day.",
      },
      {
        id: "e12",
        type: "reorder",
        question:
          'Sắp xếp tường thuật của "Don\'t open the door!":',
        options: ["He", "told me", "not to", "open", "the door"],
        answer: "He told me not to open the door",
        explain_vi:
          "Mệnh lệnh phủ định tường thuật: told + O + not to + V.",
      },
    ],
  },
  {
    id: "gr_b2_used_to_would",
    level: "b2",
    title: "Used to / Would",
    title_vi: "Used to và would (thói quen trong quá khứ)",
    summary_vi:
      "'used to + V' diễn tả thói quen hoặc trạng thái trong quá khứ nay không còn. 'would + V' chỉ thói quen lặp lại trong quá khứ (không dùng cho trạng thái/sở hữu).",
    sections: [
      {
        heading: "Used to + V",
        points: [
          "Diễn tả thói quen HOẶC trạng thái trong quá khứ nay không còn.",
          "I used to play football. — Tôi đã từng chơi bóng đá (giờ không chơi nữa).",
          "She used to live in London. — Cô ấy đã từng sống ở London.",
          "Phủ định: didn't use to + V. Câu hỏi: Did + S + use to + V?",
        ],
      },
      {
        heading: "Would + V",
        points: [
          "Chỉ diễn tả thói quen lặp lại trong quá khứ (hành động), KHÔNG dùng cho trạng thái.",
          "Every summer we would go to the beach. — Mỗi hè chúng tôi thường ra biển.",
          "💡 Không nói: I would live in London. (live = trạng thái -> chỉ dùng 'used to').",
        ],
      },
      {
        heading: "So sánh used to vs would",
        points: [
          "Trạng thái (live, know, have, be): chỉ dùng 'used to'.",
          "Hành động lặp lại (play, go, visit): dùng cả 'used to' và 'would'.",
          "💡 'Would' thường đi kèm trạng từ chỉ tần suất: every day, often, always.",
        ],
      },
    ],
    points: [
      "I used to play football every day. — Tôi đã từng chơi bóng đá mỗi ngày.",
      "She used to live in London. — Cô ấy đã từng sống ở London (trạng thái -> chỉ dùng 'used to').",
      "Every summer we would go to the beach. — Mỗi mùa hè chúng tôi thường ra biển.",
      "Did you use to smoke? — Bạn đã từng hút thuốc không? (dạng câu hỏi: did + use to).",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "I ___ live in a small village when I was young.",
        options: ["used to", "use to", "would"],
        answer: "used to",
        explain_vi:
          "'live' là trạng thái nên dùng 'used to'; không dùng 'would' cho trạng thái.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "When we were kids, we ___ (would) play in the park for hours.",
        answer: "would",
        explain_vi: "'would + V' diễn tả thói quen lặp lại trong quá khứ.",
      },
      {
        id: "e3",
        type: "choice",
        question: "___ you use to have long hair?",
        options: ["Did", "Do", "Were"],
        answer: "Did",
        explain_vi:
          "Câu hỏi với 'used to' dùng trợ động từ 'did' + use to (bỏ 'd').",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp: Cô ấy đã từng không thích cà phê.",
        options: ["She", "didn't", "use to", "like coffee"],
        answer: "She didn't use to like coffee",
        explain_vi: "Phủ định: didn't + use to + V (bỏ 'd' ở use).",
      },
      {
        id: "e5",
        type: "fill",
        question:
          "He ___ (used to) own a motorbike, but he sold it.",
        answer: "used to",
        explain_vi:
          "'own' là trạng thái sở hữu -> chỉ dùng 'used to', không dùng 'would'.",
      },
      {
        id: "e6",
        type: "choice",
        question:
          "Every evening, my grandfather ___ tell us stories by the fire.",
        options: ["would", "used to", "both are correct"],
        answer: "both are correct",
        explain_vi:
          "'tell' là hành động lặp lại trong quá khứ -> dùng được cả 'used to' và 'would'.",
      },
      {
        id: "e7",
        type: "fill",
        question: "We ___ (not use to) eat sushi, but now we love it.",
        answer: "didn't use to",
        explain_vi:
          "Phủ định: didn't + use to + V. Bỏ 'd' khi có trợ động từ did.",
      },
      {
        id: "e8",
        type: "choice",
        question: "She ___ be very shy, but now she's confident.",
        options: ["used to", "would", "is used to"],
        answer: "used to",
        explain_vi:
          "'be shy' là trạng thái -> chỉ dùng 'used to'. 'is used to' = quen với (nghĩa khác).",
      },
      {
        id: "e9",
        type: "reorder",
        question:
          "Sắp xếp: Bạn có thường hay đi bộ đến trường không?",
        options: ["Did", "you", "use to", "walk", "to school"],
        answer: "Did you use to walk to school",
        explain_vi: "Câu hỏi: Did + S + use to + V?",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "When I was a child, I ___ (would) visit my grandparents every weekend.",
        answer: "would",
        explain_vi:
          "'visit' là hành động lặp lại + trạng từ tần suất 'every weekend' -> dùng 'would'.",
      },
      {
        id: "e11",
        type: "choice",
        question: "I ___ know how to swim, but my dad taught me.",
        options: ["didn't use to", "wouldn't", "wasn't used to"],
        answer: "didn't use to",
        explain_vi:
          "💡 'know' là trạng thái -> chỉ dùng 'used to' (phủ định: didn't use to).",
      },
      {
        id: "e12",
        type: "reorder",
        question:
          "Sắp xếp: Chúng tôi thường đi cắm trại mỗi mùa hè.",
        options: [
          "We",
          "would",
          "go camping",
          "every summer",
        ],
        answer: "We would go camping every summer",
        explain_vi:
          "Hành động lặp lại + every summer -> dùng 'would' hoặc 'used to'.",
      },
    ],
  },
  {
    id: "gr_b2_gerunds_infinitives",
    level: "b2",
    title: "Gerunds vs Infinitives",
    title_vi: "Danh động từ và động từ nguyên thể có 'to'",
    summary_vi:
      "Một số động từ theo sau là V-ing (enjoy, avoid, finish), một số theo sau là to + V (want, decide, hope). Sau giới từ luôn dùng V-ing.",
    sections: [
      {
        heading: "Động từ + V-ing (Gerund)",
        points: [
          "enjoy, avoid, finish, mind, suggest, imagine, keep, practise, deny, risk.",
          "I enjoy reading books. — enjoy + V-ing.",
          "She avoids eating fast food. — avoid + V-ing.",
        ],
      },
      {
        heading: "Động từ + to V (Infinitive)",
        points: [
          "want, decide, hope, plan, promise, agree, refuse, learn, afford, manage.",
          "She decided to leave early. — decide + to V.",
          "I want to learn English. — want + to V.",
        ],
      },
      {
        heading: "Sau giới từ",
        points: [
          "Sau giới từ (in, at, of, about, for, without...) luôn dùng V-ing.",
          "He is good at swimming. — sau 'at' dùng V-ing.",
          "She left without saying goodbye. — sau 'without' dùng V-ing.",
        ],
      },
      {
        heading: "Động từ theo sau bởi cả hai (nghĩa khác nhau)",
        points: [
          "stop + V-ing = dừng hẳn: I stopped smoking. (tôi bỏ thuốc).",
          "stop + to V = dừng lại để làm gì: I stopped to smoke. (tôi dừng lại để hút thuốc).",
          "remember + V-ing = nhớ đã làm. remember + to V = nhớ phải làm.",
          "💡 try + V-ing = thử làm. try + to V = cố gắng làm.",
        ],
      },
    ],
    points: [
      "I enjoy reading books. — Tôi thích đọc sách (enjoy + V-ing).",
      "She decided to leave early. — Cô ấy quyết định rời đi sớm (decide + to V).",
      "He is good at swimming. — Anh ấy bơi giỏi (sau giới từ 'at' dùng V-ing).",
      "I want to learn English. — Tôi muốn học tiếng Anh (want + to V).",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "She enjoys ___ to music.",
        options: ["listening", "to listen", "listen"],
        answer: "listening",
        explain_vi: "Sau 'enjoy' dùng danh động từ V-ing.",
      },
      {
        id: "e2",
        type: "fill",
        question: "They decided ___ (go) home early.",
        answer: "to go",
        explain_vi: "Sau 'decide' dùng to + V nguyên thể.",
      },
      {
        id: "e3",
        type: "choice",
        question: "I'm interested in ___ Spanish.",
        options: ["learning", "to learn", "learn"],
        answer: "learning",
        explain_vi: "Sau giới từ 'in' luôn dùng V-ing.",
      },
      {
        id: "e4",
        type: "fill",
        question: "He avoided ___ (talk) about the problem.",
        answer: "talking",
        explain_vi: "Sau 'avoid' dùng V-ing.",
      },
      {
        id: "e5",
        type: "reorder",
        question: "Sắp xếp: Tôi hy vọng sẽ gặp lại bạn.",
        options: ["I", "hope", "to see", "you again"],
        answer: "I hope to see you again",
        explain_vi: "Sau 'hope' dùng to + V nguyên thể.",
      },
      {
        id: "e6",
        type: "choice",
        question: "She promised ___ on time.",
        options: ["to arrive", "arriving", "arrive"],
        answer: "to arrive",
        explain_vi: "Sau 'promise' dùng to + V nguyên thể.",
      },
      {
        id: "e7",
        type: "fill",
        question: "I can't imagine ___ (live) in another country.",
        answer: "living",
        explain_vi: "Sau 'imagine' dùng V-ing.",
      },
      {
        id: "e8",
        type: "choice",
        question: "He stopped ___ when he saw me.",
        options: ["talking", "to talk", "talk"],
        answer: "talking",
        explain_vi:
          "stop + V-ing = dừng hẳn việc đang làm. Anh ấy dừng nói khi thấy tôi.",
      },
      {
        id: "e9",
        type: "fill",
        question:
          "She left the house without ___ (lock) the door.",
        answer: "locking",
        explain_vi: "Sau giới từ 'without' luôn dùng V-ing.",
      },
      {
        id: "e10",
        type: "reorder",
        question: "Sắp xếp: Anh ấy từ chối giúp chúng tôi.",
        options: ["He", "refused", "to help", "us"],
        answer: "He refused to help us",
        explain_vi: "Sau 'refuse' dùng to + V nguyên thể.",
      },
      {
        id: "e11",
        type: "choice",
        question: "Do you mind ___ the window?",
        options: ["opening", "to open", "open"],
        answer: "opening",
        explain_vi: "Sau 'mind' dùng V-ing.",
      },
      {
        id: "e12",
        type: "fill",
        question: "I remember ___ (meet) her at the party last year.",
        answer: "meeting",
        explain_vi:
          "💡 remember + V-ing = nhớ đã làm. Tôi nhớ đã gặp cô ấy (sự việc đã xảy ra).",
      },
    ],
  },
  {
    id: "gr_b2_linking_words",
    level: "b2",
    title: "Linking Words",
    title_vi: "Từ nối (although/however/despite/in spite of/whereas/nevertheless)",
    summary_vi:
      "Các từ/cụm từ nối dùng để diễn tả sự tương phản, nhượng bộ hoặc đối lập giữa hai ý trong câu. Nắm vững cấu trúc ngữ pháp đi sau mỗi từ nối là chìa khóa.",
    sections: [
      {
        heading: "Although / Even though + mệnh đề",
        points: [
          "Although / Even though + S + V, S + V. — Dùng để nối hai mệnh đề tương phản.",
          "Although it was raining, we went out. — Mặc dù trời mưa, chúng tôi vẫn ra ngoài.",
          "💡 Sau 'although' luôn là một mệnh đề đầy đủ (có chủ ngữ + động từ).",
        ],
      },
      {
        heading: "Despite / In spite of + danh từ / V-ing",
        points: [
          "Despite / In spite of + N / V-ing, S + V.",
          "Despite the rain, we went out. — Bất chấp mưa, chúng tôi vẫn ra ngoài.",
          "In spite of being tired, she kept working. — Mặc dù mệt, cô ấy vẫn tiếp tục làm việc.",
          "💡 Không dùng mệnh đề sau despite/in spite of. Muốn dùng mệnh đề thì thêm 'the fact that': Despite the fact that it rained, ...",
        ],
      },
      {
        heading: "However / Nevertheless",
        points: [
          "However / Nevertheless đứng đầu câu thứ hai, theo sau bởi dấu phẩy.",
          "It was raining. However, we went out. — Trời mưa. Tuy nhiên, chúng tôi vẫn ra ngoài.",
          "The exam was hard. Nevertheless, she passed. — Bài thi khó. Tuy vậy, cô ấy vẫn đậu.",
          "💡 'However' và 'nevertheless' nối hai câu riêng biệt, không nối hai mệnh đề trong cùng một câu bằng dấu phẩy.",
        ],
      },
      {
        heading: "Whereas / While (đối lập)",
        points: [
          "Whereas / While + S + V, S + V. — Dùng để đối lập hai sự việc.",
          "She loves coffee, whereas her husband prefers tea. — Cô ấy thích cà phê, trong khi chồng cô ấy thích trà.",
          "While Tom is outgoing, his brother is very shy. — Trong khi Tom hướng ngoại thì anh trai anh ấy rất nhút nhát.",
        ],
      },
    ],
    points: [
      "Although it was cold, she wore a dress. — Mặc dù trời lạnh, cô ấy vẫn mặc váy.",
      "Despite the traffic, we arrived on time. — Bất chấp kẹt xe, chúng tôi đến đúng giờ.",
      "The food was expensive. However, it was delicious. — Đồ ăn đắt. Tuy nhiên, nó rất ngon.",
      "She is very kind, whereas her sister is quite rude. — Cô ấy rất tốt bụng, trong khi chị cô ấy khá thô lỗ.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "___ the bad weather, the match continued.",
        options: ["Despite", "Although", "However"],
        answer: "Despite",
        explain_vi:
          "Sau chỗ trống là danh từ 'the bad weather' -> dùng 'Despite'. 'Although' cần mệnh đề đầy đủ.",
      },
      {
        id: "e2",
        type: "fill",
        question: "___ she was tired, she finished the report.",
        answer: "Although",
        explain_vi:
          "Sau chỗ trống là mệnh đề 'she was tired' -> dùng 'Although' (không dùng 'Despite').",
      },
      {
        id: "e3",
        type: "choice",
        question:
          "The hotel was expensive. ___, the service was terrible.",
        options: ["However", "Although", "Despite"],
        answer: "However",
        explain_vi:
          "Nối hai câu riêng biệt với nghĩa tương phản -> dùng 'However' + dấu phẩy.",
      },
      {
        id: "e4",
        type: "reorder",
        question: "Sắp xếp: Mặc dù mệt, anh ấy vẫn đi làm.",
        options: ["In spite of", "being tired", "he", "went to work"],
        answer: "In spite of being tired he went to work",
        explain_vi:
          "In spite of + V-ing (being tired), S + V.",
      },
      {
        id: "e5",
        type: "fill",
        question:
          "He is very rich. ___, he lives a simple life.",
        answer: "Nevertheless",
        explain_vi:
          "Nối hai câu riêng biệt mang nghĩa nhượng bộ -> 'Nevertheless' (Tuy vậy).",
      },
      {
        id: "e6",
        type: "choice",
        question:
          "___ being very young, she speaks three languages fluently.",
        options: ["Despite", "Although", "However"],
        answer: "Despite",
        explain_vi:
          "Sau chỗ trống là V-ing (being) -> dùng 'Despite' hoặc 'In spite of'.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "Tom loves sports, ___ his brother prefers reading.",
        answer: "whereas",
        explain_vi:
          "Đối lập hai sự việc trong cùng một câu -> dùng 'whereas' (trong khi đó).",
      },
      {
        id: "e8",
        type: "choice",
        question:
          "___ the fact that he studied hard, he failed the exam.",
        options: ["Despite", "However", "Whereas"],
        answer: "Despite",
        explain_vi:
          "💡 'Despite the fact that + mệnh đề' là cách kết hợp despite với mệnh đề đầy đủ.",
      },
      {
        id: "e9",
        type: "reorder",
        question: "Sắp xếp: Trời mưa. Tuy nhiên, chúng tôi vẫn vui.",
        options: ["It rained.", "However,", "we", "still had fun"],
        answer: "It rained. However, we still had fun",
        explain_vi:
          "However đứng đầu câu thứ hai, sau dấu chấm của câu trước.",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "___ it was a public holiday, some shops were open.",
        answer: "Although",
        explain_vi:
          "Sau chỗ trống là mệnh đề đầy đủ (it was...) -> dùng 'Although'.",
      },
      {
        id: "e11",
        type: "choice",
        question:
          "She didn't get the job ___ having a lot of experience.",
        options: ["despite", "although", "however"],
        answer: "despite",
        explain_vi:
          "Sau chỗ trống là V-ing (having) -> dùng 'despite' hoặc 'in spite of'.",
      },
      {
        id: "e12",
        type: "reorder",
        question:
          "Sắp xếp: Trong khi cô ấy giỏi toán thì anh ấy giỏi văn.",
        options: [
          "While",
          "she is good at maths,",
          "he",
          "is good at",
          "literature",
        ],
        answer: "While she is good at maths, he is good at literature",
        explain_vi:
          "While + S + V, S + V. Dùng để đối lập hai sự việc.",
      },
    ],
  },
  {
    id: "gr_b2_future_perfect_continuous",
    level: "b2",
    title: "Future Perfect & Future Continuous",
    title_vi: "Tương lai hoàn thành và Tương lai tiếp diễn",
    summary_vi:
      "Future Perfect (will have + V3) diễn tả hành động sẽ hoàn thành trước một mốc thời gian trong tương lai. Future Continuous (will be + V-ing) diễn tả hành động đang diễn ra tại một thời điểm trong tương lai.",
    sections: [
      {
        heading: "Future Perfect: will have + V3",
        points: [
          "Cấu trúc: S + will have + V3 (past participle).",
          "Phủ định: S + will not (won't) have + V3.",
          "Câu hỏi: Will + S + have + V3?",
          "Diễn tả hành động sẽ hoàn thành trước một mốc thời gian: By 2030, I will have graduated.",
          "💡 Thường đi với 'by + thời gian': by tomorrow, by next week, by the time...",
        ],
      },
      {
        heading: "Future Continuous: will be + V-ing",
        points: [
          "Cấu trúc: S + will be + V-ing.",
          "Phủ định: S + won't be + V-ing.",
          "Câu hỏi: Will + S + be + V-ing?",
          "Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong tương lai: At 8 PM tonight, I will be studying.",
          "💡 Thường đi với 'at + thời điểm cụ thể' hoặc 'this time tomorrow/next week'.",
        ],
      },
      {
        heading: "So sánh hai thì",
        points: [
          "Future Perfect nhấn mạnh sự hoàn thành: By 6 PM, I will have finished dinner. (xong trước 6 giờ).",
          "Future Continuous nhấn mạnh đang diễn ra: At 6 PM, I will be eating dinner. (đang ăn lúc 6 giờ).",
          "💡 Future Perfect = xong trước mốc. Future Continuous = đang làm tại mốc.",
        ],
      },
      {
        heading: "Dấu hiệu nhận biết",
        points: [
          "Future Perfect: by + thời gian, by the time + mệnh đề, before + thời gian.",
          "Future Continuous: at this time tomorrow, at + giờ cụ thể, this time next week.",
        ],
      },
    ],
    points: [
      "By next year, I will have finished my degree. — Trước năm sau, tôi sẽ hoàn thành bằng cấp.",
      "At 10 PM tonight, she will be sleeping. — Lúc 10 giờ tối nay, cô ấy sẽ đang ngủ.",
      "Will you have completed the project by Friday? — Bạn sẽ hoàn thành dự án trước thứ Sáu chứ?",
      "This time next week, we will be lying on the beach. — Giờ này tuần sau, chúng tôi sẽ đang nằm trên bãi biển.",
    ],
    exercises: [
      {
        id: "e1",
        type: "choice",
        question: "By the end of this month, she ___ here for ten years.",
        options: [
          "will have worked",
          "will be working",
          "will work",
        ],
        answer: "will have worked",
        explain_vi:
          "'By the end of this month' = trước cuối tháng -> nhấn mạnh hoàn thành -> Future Perfect: will have + V3.",
      },
      {
        id: "e2",
        type: "fill",
        question:
          "At 9 AM tomorrow, I ___ (fly) to London.",
        answer: "will be flying",
        explain_vi:
          "'At 9 AM tomorrow' = thời điểm cụ thể -> hành động đang diễn ra -> Future Continuous: will be + V-ing.",
      },
      {
        id: "e3",
        type: "choice",
        question:
          "This time next week, we ___ on the beach in Bali.",
        options: [
          "will be relaxing",
          "will have relaxed",
          "will relax",
        ],
        answer: "will be relaxing",
        explain_vi:
          "'This time next week' = giờ này tuần sau -> đang diễn ra tại mốc -> Future Continuous.",
      },
      {
        id: "e4",
        type: "fill",
        question:
          "By the time you arrive, we ___ (leave) already.",
        answer: "will have left",
        explain_vi:
          "'By the time + mệnh đề' -> hành động hoàn thành trước mốc -> Future Perfect: will have + V3.",
      },
      {
        id: "e5",
        type: "reorder",
        question:
          "Sắp xếp: Trước năm 2030, họ sẽ xây xong cây cầu mới.",
        options: [
          "By 2030,",
          "they",
          "will have built",
          "the new bridge",
        ],
        answer: "By 2030, they will have built the new bridge",
        explain_vi:
          "By + mốc thời gian -> Future Perfect: will have + V3 (build -> built).",
      },
      {
        id: "e6",
        type: "choice",
        question:
          "Don't call me at 7 PM. I ___ dinner with my family.",
        options: [
          "will be having",
          "will have had",
          "will have",
        ],
        answer: "will be having",
        explain_vi:
          "At 7 PM = thời điểm cụ thể, hành động đang diễn ra -> Future Continuous: will be + V-ing.",
      },
      {
        id: "e7",
        type: "fill",
        question:
          "By next Friday, he ___ (read) the whole book.",
        answer: "will have read",
        explain_vi:
          "'By next Friday' = trước thứ Sáu tới -> hoàn thành -> Future Perfect: will have + V3 (read -> read).",
      },
      {
        id: "e8",
        type: "choice",
        question:
          "At this time tomorrow, the students ___ their final exam.",
        options: [
          "will be taking",
          "will have taken",
          "will take",
        ],
        answer: "will be taking",
        explain_vi:
          "💡 'At this time tomorrow' = giờ này ngày mai -> hành động đang diễn ra -> Future Continuous.",
      },
      {
        id: "e9",
        type: "reorder",
        question:
          "Sắp xếp: Lúc 3 giờ chiều, cô ấy sẽ đang họp.",
        options: [
          "At 3 PM,",
          "she",
          "will be having",
          "a meeting",
        ],
        answer: "At 3 PM, she will be having a meeting",
        explain_vi:
          "At + giờ cụ thể -> Future Continuous: will be + V-ing.",
      },
      {
        id: "e10",
        type: "fill",
        question:
          "By the time the movie starts, we ___ (eat) dinner.",
        answer: "will have eaten",
        explain_vi:
          "'By the time + mệnh đề' -> hoàn thành trước mốc -> Future Perfect: will have + V3 (eat -> eaten).",
      },
      {
        id: "e11",
        type: "choice",
        question:
          "I ___ you the money back by the end of the week. I promise.",
        options: [
          "will have paid",
          "will be paying",
          "will pay",
        ],
        answer: "will have paid",
        explain_vi:
          "'By the end of the week' -> hoàn thành trước mốc -> Future Perfect: will have + V3.",
      },
      {
        id: "e12",
        type: "reorder",
        question:
          "Sắp xếp: Trước khi bạn tỉnh dậy, tôi sẽ đã chạy xong 10 km.",
        options: [
          "Before",
          "you wake up,",
          "I",
          "will have run",
          "10 kilometres",
        ],
        answer: "Before you wake up, I will have run 10 kilometres",
        explain_vi:
          "💡 'Before + mệnh đề' cũng là dấu hiệu của Future Perfect: will have + V3 (run -> run).",
      },
    ],
  },
];
