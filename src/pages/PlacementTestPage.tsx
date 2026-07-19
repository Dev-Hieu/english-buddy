import { useState, useRef, useEffect } from "react";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { GraduationCap, CheckCircle, XCircle, Trophy, Award, Printer } from "lucide-react";
import { saveCertificate } from "@/services/certificateService";
import { generateExam } from "@/services/examService";
import type { GeneratedExam } from "@/services/examService";

// ── Types ──

type CEFRLevel = "pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface Question {
  level: CEFRLevel;
  type: "vocabulary" | "grammar" | "listening" | "reading";
  question: string;
  instruction?: string;
  context?: string; // Reading passage or situational context
  options: [string, string, string, string];
  answer: number; // 0-based index
}

interface Props {
  student: Student;
  onComplete: (level: string) => void;
  onBack: () => void;
}

// ── Question bank: 7 levels x 8 questions = 56 total ──
// Designed per CEFR can-do descriptors (Cambridge, EF SET, DIALANG standards)
// Each level tests ability in context, not isolated knowledge

const QUESTION_BANK: Question[] = [
  // ══════════════════════════════════════════════════════════════
  // Pre-A1 — Can recognize isolated familiar words with visual support
  // ══════════════════════════════════════════════════════════════

  // 1. Picture vocab
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Nhìn hình và chọn đáp án đúng",
    question: "🍎 What is this?",
    options: ["Apple", "Car", "Hat", "Cup"],
    answer: 0,
  },
  // 2. Picture vocab
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Nhìn hình và chọn đáp án đúng",
    question: "🐶 What is this?",
    options: ["🐱 Cat", "🐠 Fish", "🐶 Dog", "🐦 Bird"],
    answer: 2,
  },
  // 3. Counting
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Đếm và chọn số đúng",
    question: "How many? ⭐⭐⭐",
    options: ["Two", "Three", "Four", "Five"],
    answer: 1,
  },
  // 4. Color/number
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Đếm và chọn số đúng",
    question: "How many hearts? ❤️❤️❤️❤️",
    options: ["Three", "Five", "Four", "Two"],
    answer: 2,
  },
  // 5. Basic action
  {
    level: "pre-A1", type: "reading",
    instruction: "Nhìn hình và chọn từ đúng",
    question: "The boy is 😴. He is ___.",
    options: ["eating", "sleeping", "running", "reading"],
    answer: 1,
  },
  // 6. Basic action
  {
    level: "pre-A1", type: "reading",
    instruction: "Nhìn hình và chọn từ đúng",
    question: "The girl is 🏃‍♀️. She is ___.",
    options: ["sleeping", "eating", "sitting", "running"],
    answer: 3,
  },
  // 7. Listening - single word recognition
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe và chọn đáp án đúng",
    question: "Listen: 'Blue'. Which color is blue?",
    options: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow"],
    answer: 1,
  },
  // 8. Listening - single word recognition
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe và chọn con vật đúng",
    question: "Listen: 'Cat'. Which one is a cat?",
    options: ["🐶 Dog", "🐱 Cat", "🐟 Fish", "🐘 Elephant"],
    answer: 1,
  },

  // ══════════════════════════════════════════════════════════════
  // A1 — Can understand simple sentences about familiar topics
  // ══════════════════════════════════════════════════════════════

  // 1. Situational
  {
    level: "A1", type: "grammar",
    question: "At a shop: 'How much is this?' — 'It ___ five dollars.'",
    options: ["is", "are", "am", "be"],
    answer: 0,
  },
  // 2. Situational
  {
    level: "A1", type: "grammar",
    question: "At school: 'Where ___ you from?' — 'I'm from Vietnam.'",
    options: ["is", "am", "are", "do"],
    answer: 2,
  },
  // 3. Short reading passage
  {
    level: "A1", type: "reading",
    context: "My name is Lan. I am 8 years old. I have a cat. Her name is Mimi.",
    question: "What pet does Lan have?",
    options: ["A dog", "A cat", "A fish", "A bird"],
    answer: 1,
  },
  // 4. Short reading passage
  {
    level: "A1", type: "reading",
    context: "Tom likes football. He plays every Saturday. His friend Ben likes swimming.",
    question: "What does Tom like?",
    options: ["Swimming", "Reading", "Football", "Running"],
    answer: 2,
  },
  // 5. Grammar in natural dialogue
  {
    level: "A1", type: "grammar",
    question: "'Do you like ice cream?' — 'Yes, I ___.'",
    options: ["am", "do", "is", "like"],
    answer: 1,
  },
  // 6. Grammar in natural dialogue
  {
    level: "A1", type: "grammar",
    question: "'___ is your teacher?' — 'Miss Hoa.'",
    options: ["What", "Where", "Who", "When"],
    answer: 2,
  },
  // 7. Vocabulary in context
  {
    level: "A1", type: "vocabulary",
    question: "I'm thirsty. I want some ___.",
    options: ["water", "chair", "book", "pencil"],
    answer: 0,
  },
  // 8. Vocabulary in context
  {
    level: "A1", type: "vocabulary",
    question: "It's raining outside. I need my ___.",
    options: ["sunglasses", "umbrella", "swimsuit", "sandals"],
    answer: 1,
  },

  // ══════════════════════════════════════════════════════════════
  // A2 — Can understand sentences about areas of immediate relevance
  // ══════════════════════════════════════════════════════════════

  // 1. Narrative comprehension
  {
    level: "A2", type: "reading",
    context: "Last weekend, Mai went to the beach with her family. They swam in the sea and ate seafood for lunch. Mai was very happy.",
    question: "What did Mai do last weekend?",
    options: [
      "She went to school.",
      "She went to the beach.",
      "She stayed at home.",
      "She went to the mountains.",
    ],
    answer: 1,
  },
  // 2. Narrative comprehension
  {
    level: "A2", type: "reading",
    context: "Yesterday, Minh woke up late. He missed the bus and had to walk to school. He arrived 20 minutes late.",
    question: "Why was Minh late for school?",
    options: [
      "He was sick.",
      "The bus was late.",
      "He woke up late and missed the bus.",
      "His mother drove him.",
    ],
    answer: 2,
  },
  // 3. Functional language
  {
    level: "A2", type: "vocabulary",
    question: "You want to buy a train ticket. You say:",
    options: [
      "'Can I have a ticket to Hanoi, please?'",
      "'Where is the hospital?'",
      "'What time is lunch?'",
      "'How old are you?'",
    ],
    answer: 0,
  },
  // 4. Functional language
  {
    level: "A2", type: "vocabulary",
    question: "You are at a restaurant. You want to pay. You say:",
    options: [
      "'Can I see the menu?'",
      "'The food was delicious.'",
      "'Can I have the bill, please?'",
      "'I'd like a table for two.'",
    ],
    answer: 2,
  },
  // 5. Grammar in context - past simple
  {
    level: "A2", type: "grammar",
    question: "'What did you do yesterday?' — 'I ___ to the cinema with my friends.'",
    options: ["go", "goes", "went", "going"],
    answer: 2,
  },
  // 6. Grammar in context - comparatives
  {
    level: "A2", type: "grammar",
    question: "This test is ___ than I expected. I can do it!",
    options: ["easy", "easier", "more easy", "easiest"],
    answer: 1,
  },
  // 7. Sign/notice reading
  {
    level: "A2", type: "reading",
    context: "NOTICE: This door is for staff only. Please use the main entrance.",
    question: "What does this notice mean?",
    options: [
      "Everyone can use this door.",
      "Only workers can use this door.",
      "This door is broken.",
      "The main entrance is closed.",
    ],
    answer: 1,
  },
  // 8. Sign/notice reading
  {
    level: "A2", type: "reading",
    context: "SALE! All shoes 50% off this weekend only.",
    question: "When can you buy cheap shoes?",
    options: [
      "Any day",
      "Only on Monday",
      "This weekend",
      "Next month",
    ],
    answer: 2,
  },

  // ══════════════════════════════════════════════════════════════
  // B1 — Can deal with most situations; can describe experiences and opinions
  // ══════════════════════════════════════════════════════════════

  // 1. Opinion/attitude
  {
    level: "B1", type: "reading",
    context: "Many people think that learning a foreign language is only useful for travelling. However, research shows that bilingual people are better at solving problems and multitasking. Learning a language exercises the brain, just like sport exercises the body.",
    question: "The writer thinks that learning a foreign language ___.",
    options: [
      "is only useful for travelling",
      "is a waste of time",
      "has benefits beyond travelling",
      "is the same as doing sport",
    ],
    answer: 2,
  },
  // 2. Opinion/attitude
  {
    level: "B1", type: "reading",
    context: "Working from home has become more common since 2020. Some workers enjoy the flexibility, but others miss the social interaction of an office. Companies are still trying to find the best balance.",
    question: "According to the text, what is true about working from home?",
    options: [
      "Everyone prefers it to office work.",
      "It has both advantages and disadvantages.",
      "Companies have found the perfect solution.",
      "It was common before 2020.",
    ],
    answer: 1,
  },
  // 3. Functional - giving advice
  {
    level: "B1", type: "vocabulary",
    question: "Your friend is stressed about exams. You say:",
    options: [
      "'You should take a break and study in short sessions.'",
      "'Exams are not important at all.'",
      "'I don't care about your exams.'",
      "'You must study 24 hours a day.'",
    ],
    answer: 0,
  },
  // 4. Functional - making suggestions
  {
    level: "B1", type: "vocabulary",
    question: "You want to suggest going to a new restaurant. You say:",
    options: [
      "'You must eat there.'",
      "'I order you to go.'",
      "'Why don't we try that new restaurant?'",
      "'Restaurants are expensive.'",
    ],
    answer: 2,
  },
  // 5. Grammar - present perfect vs past simple
  {
    level: "B1", type: "grammar",
    question: "'Have you ever been to Japan?' — 'Yes, I ___ there last summer.'",
    options: ["have gone", "went", "have been", "go"],
    answer: 1,
  },
  // 6. Grammar - present perfect vs past simple
  {
    level: "B1", type: "grammar",
    question: "I ___ in this city since I was born, so I know it very well.",
    options: ["lived", "am living", "have lived", "was living"],
    answer: 2,
  },
  // 7. Inference
  {
    level: "B1", type: "reading",
    context: "The shop closed at 5pm. We arrived at 5:15pm and the lights were off. A sign on the door said 'See you tomorrow!'",
    question: "From the text, we can understand that ___.",
    options: [
      "the shop was still open",
      "they could not go shopping that day",
      "the shop had moved to a new location",
      "they arrived before closing time",
    ],
    answer: 1,
  },
  // 8. Inference
  {
    level: "B1", type: "reading",
    context: "Maria applied for the job on Monday. On Wednesday, she received an email asking her to come for an interview on Friday.",
    question: "From the text, we can understand that ___.",
    options: [
      "Maria did not get the job",
      "the company was not interested in Maria",
      "Maria's application was successful enough for the next step",
      "Maria will start working on Friday",
    ],
    answer: 2,
  },

  // ══════════════════════════════════════════════════════════════
  // B2 — Can understand main ideas of complex text on concrete and abstract topics
  // ══════════════════════════════════════════════════════════════

  // 1. Argument analysis
  {
    level: "B2", type: "reading",
    context: "While social media has undoubtedly transformed how we communicate, critics argue that it has created echo chambers where people only encounter opinions that reinforce their existing beliefs. This polarisation, they claim, is undermining democratic discourse.",
    question: "What is the main argument presented in this passage?",
    options: [
      "Social media has improved communication.",
      "Social media may harm democratic discussion by creating echo chambers.",
      "Everyone should stop using social media.",
      "Democratic discourse has always been polarised.",
    ],
    answer: 1,
  },
  // 2. Argument analysis
  {
    level: "B2", type: "reading",
    context: "Renewable energy sources are becoming cheaper, but transitioning entirely away from fossil fuels remains challenging. The infrastructure required is enormous, and many developing nations lack the capital for such investments. A gradual, well-funded transition is more realistic than an immediate switch.",
    question: "The writer's main point is that ___.",
    options: [
      "fossil fuels are better than renewable energy",
      "developing nations should not use renewable energy",
      "a complete switch to renewables needs to be gradual and supported financially",
      "renewable energy is too expensive to be practical",
    ],
    answer: 2,
  },
  // 3. Register - formal/informal
  {
    level: "B2", type: "vocabulary",
    question: "You need to email your professor about missing a deadline. Which is most appropriate?",
    options: [
      "'Hey, I didn't finish the assignment. Can I have more time?'",
      "'I am writing to request an extension for the assignment due to unforeseen circumstances.'",
      "'Give me more time for the homework.'",
      "'Sorry!!! I need more time please please please!'",
    ],
    answer: 1,
  },
  // 4. Register - formal/informal
  {
    level: "B2", type: "vocabulary",
    question: "In a formal business report, which phrase best replaces 'We found out that...'?",
    options: [
      "'We discovered that...'",
      "'Our investigation revealed that...'",
      "'We figured out that...'",
      "'We just realized that...'",
    ],
    answer: 1,
  },
  // 5. Grammar - passive in context
  {
    level: "B2", type: "grammar",
    question: "The new policy ___ by the board last month, but it hasn't been implemented yet.",
    options: ["approved", "was approved", "has approved", "is approving"],
    answer: 1,
  },
  // 6. Grammar - reported speech
  {
    level: "B2", type: "grammar",
    question: "She told me that she ___ the report by Friday, but she still hasn't finished it.",
    options: ["will complete", "would complete", "completes", "is completing"],
    answer: 1,
  },
  // 7. Collocations
  {
    level: "B2", type: "vocabulary",
    question: "After careful consideration, the company decided to ___ the project due to budget cuts.",
    options: ["abandon", "desert", "leave", "quit"],
    answer: 0,
  },
  // 8. Collocations
  {
    level: "B2", type: "vocabulary",
    question: "The research team ___ an experiment to test their hypothesis.",
    options: ["made", "did", "conducted", "performed"],
    answer: 2,
  },

  // ══════════════════════════════════════════════════════════════
  // C1 — Can understand demanding texts and recognize implicit meaning
  // ══════════════════════════════════════════════════════════════

  // 1. Academic reading - inference
  {
    level: "C1", type: "reading",
    context: "The notion that language merely reflects thought has been increasingly challenged by researchers who argue that the structure of a language can fundamentally shape how its speakers perceive and categorise reality. This linguistic relativity, while not deterministic, suggests that translation between languages involves more than word substitution.",
    question: "The passage implies that ___.",
    options: [
      "all languages express ideas in the same way",
      "translation is simply a matter of replacing words",
      "language can influence how people think and perceive the world",
      "linguistic relativity has been disproven",
    ],
    answer: 2,
  },
  // 2. Academic reading - inference
  {
    level: "C1", type: "reading",
    context: "Despite decades of investment in artificial intelligence, machines still struggle with tasks that humans find trivial, such as understanding sarcasm or navigating a cluttered room. This paradox, known as Moravec's paradox, suggests that high-level reasoning requires less computation than low-level sensorimotor skills.",
    question: "According to the text, Moravec's paradox suggests that ___.",
    options: [
      "AI is more intelligent than humans",
      "simple human skills are computationally more complex than abstract reasoning",
      "machines will never be able to think",
      "sarcasm is the hardest problem in AI",
    ],
    answer: 1,
  },
  // 3. Idiomatic meaning
  {
    level: "C1", type: "vocabulary",
    question: "'When she got the promotion, she was over the moon.' This means she was ___.",
    options: ["confused", "extremely happy", "frightened", "suspicious"],
    answer: 1,
  },
  // 4. Idiomatic meaning
  {
    level: "C1", type: "vocabulary",
    question: "'The new regulations are a double-edged sword for small businesses.' This means the regulations ___.",
    options: [
      "are completely harmful",
      "are completely beneficial",
      "have both advantages and disadvantages",
      "are irrelevant to small businesses",
    ],
    answer: 2,
  },
  // 5. Grammar - advanced structures
  {
    level: "C1", type: "grammar",
    question: "Had the government acted sooner, the crisis ___ averted.",
    options: ["would be", "will have been", "could have been", "must be"],
    answer: 2,
  },
  // 6. Grammar - advanced structures (inversion)
  {
    level: "C1", type: "grammar",
    question: "Not only ___ the deadline, but she also exceeded all quality expectations.",
    options: ["she met", "did she meet", "she did meet", "has she met"],
    answer: 1,
  },
  // 7. Nuance - precise word choice
  {
    level: "C1", type: "vocabulary",
    question: "The diplomat's response was carefully ___, avoiding any direct commitment.",
    options: ["said", "worded", "talked", "spoken"],
    answer: 1,
  },
  // 8. Nuance - precise word choice
  {
    level: "C1", type: "vocabulary",
    question: "The evidence is ___ at best — it neither proves nor disproves the theory.",
    options: ["inconclusive", "inclusive", "conclusive", "exclusive"],
    answer: 0,
  },

  // ══════════════════════════════════════════════════════════════
  // C2 — Can understand virtually everything heard or read with ease
  // ══════════════════════════════════════════════════════════════

  // 1. Rhetorical analysis
  {
    level: "C2", type: "reading",
    context: "One might be forgiven for thinking that in an age of unprecedented connectivity, loneliness would be a relic of the past. Yet the opposite appears to be true: the more connected we become digitally, the more disconnected we feel personally. The irony is as bitter as it is pervasive.",
    question: "The writer's primary rhetorical strategy is to ___.",
    options: [
      "present statistical evidence",
      "highlight a paradox between expectation and reality",
      "argue for reducing technology use",
      "compare past and present objectively",
    ],
    answer: 1,
  },
  // 2. Rhetorical analysis
  {
    level: "C2", type: "reading",
    context: "The committee's report, lauded by its authors as 'comprehensive and forward-thinking,' conspicuously omits any mention of the environmental costs. One cannot help but wonder whether this oversight was genuinely accidental or strategically convenient.",
    question: "The writer's tone in this passage is best described as ___.",
    options: [
      "neutral and objective",
      "enthusiastic and supportive",
      "skeptical and subtly critical",
      "indifferent and detached",
    ],
    answer: 2,
  },
  // 3. Ambiguity
  {
    level: "C2", type: "reading",
    question: "'Visiting relatives can be tiresome.' This sentence is ambiguous because it could mean ___.",
    options: [
      "either 'going to visit relatives is tiresome' or 'relatives who visit are tiresome'",
      "either 'relatives are tired' or 'visiting is impossible'",
      "either 'the visit was long' or 'the relatives were old'",
      "either 'tiresome means boring' or 'tiresome means exciting'",
    ],
    answer: 0,
  },
  // 4. Ambiguity
  {
    level: "C2", type: "grammar",
    question: "Which sentence has a genuinely ambiguous meaning?",
    options: [
      "'She saw the man with the telescope.'",
      "'The cat sat on the mat.'",
      "'It is raining outside.'",
      "'He went to the shop.'",
    ],
    answer: 0,
  },
  // 5. Precise collocations
  {
    level: "C2", type: "vocabulary",
    question: "The prosecutor sought to ___ the defendant's credibility by revealing inconsistencies in her testimony.",
    options: ["undermine", "demolish", "damage", "ruin"],
    answer: 0,
  },
  // 6. Precise collocations
  {
    level: "C2", type: "vocabulary",
    question: "The artist's later works represent a radical ___ from the style that first brought her acclaim.",
    options: ["departure", "exit", "leave", "withdrawal"],
    answer: 0,
  },
  // 7. Academic - implicit conclusion
  {
    level: "C2", type: "reading",
    context: "Epigenetic research has demonstrated that environmental factors can modify gene expression without altering the underlying DNA sequence. More provocatively, some of these modifications appear to be heritable, suggesting that the experiences of one generation may leave biological imprints on the next.",
    question: "The passage most strongly implies that ___.",
    options: [
      "DNA determines everything about a person",
      "environmental influences may have biological effects across generations",
      "epigenetics has disproven traditional genetics",
      "gene modifications are always permanent",
    ],
    answer: 1,
  },
  // 8. Academic - implicit conclusion
  {
    level: "C2", type: "reading",
    context: "The philosopher's argument rests on the premise that consciousness is an emergent property of sufficiently complex systems. If this is accepted, the distinction between biological and artificial intelligence becomes one of degree rather than kind — a conclusion that many find philosophically disquieting.",
    question: "The word 'disquieting' suggests that this conclusion ___.",
    options: [
      "is universally accepted",
      "is scientifically proven",
      "challenges comfortable assumptions about human uniqueness",
      "has no practical implications",
    ],
    answer: 2,
  },
];

// ── Helpers ──

const LEVELS: CEFRLevel[] = ["pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];

const MAX_ANSWERS = 30;

/** Pick next unused question at the given level, or null if exhausted */
function pickNextQuestion(level: CEFRLevel, usedIndices: Set<number>, bank: Question[] = QUESTION_BANK): number | null {
  for (let i = 0; i < bank.length; i++) {
    if (!usedIndices.has(i) && bank[i].level === level) return i;
  }
  // Try adjacent levels if current exhausted
  const idx = LEVELS.indexOf(level);
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    const adj = idx + delta;
    if (adj < 0 || adj >= LEVELS.length) continue;
    for (let i = 0; i < bank.length; i++) {
      if (!usedIndices.has(i) && bank[i].level === LEVELS[adj]) return i;
    }
  }
  return null;
}

/**
 * Adaptive algorithm:
 * - Correct → move up 1 level
 * - Wrong → stay at same level
 * - 3 wrong at same level → stop
 */
function adaptLevel(current: CEFRLevel, correct: boolean): CEFRLevel {
  const idx = LEVELS.indexOf(current);
  if (correct) {
    return LEVELS[Math.min(idx + 1, LEVELS.length - 1)];
  }
  return current;
}

/**
 * Determine if the test should stop early.
 * Stops if the learner has answered 3 wrong answers at the same level.
 */
function shouldStopEarly(answers: { level: CEFRLevel; correct: boolean }[]): boolean {
  if (answers.length < 3) return false;
  const last3 = answers.slice(-3);
  const sameLevel = last3.every((a) => a.level === last3[0].level);
  const allWrong = last3.every((a) => !a.correct);
  return sameLevel && allWrong;
}

/** Calculate final CEFR from answer history.
 *  Highest level where accuracy >= 60% (with at least 1 question attempted).
 */
function calculateCEFR(answers: { level: CEFRLevel; correct: boolean }[]): CEFRLevel {
  const stats: Record<CEFRLevel, { correct: number; total: number }> = {
    "pre-A1": { correct: 0, total: 0 },
    A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 }, C2: { correct: 0, total: 0 },
  };
  for (const a of answers) {
    stats[a.level].total++;
    if (a.correct) stats[a.level].correct++;
  }
  let result: CEFRLevel = "pre-A1";
  for (const lv of LEVELS) {
    if (stats[lv].total > 0 && stats[lv].correct / stats[lv].total >= 0.6) {
      result = lv;
    }
  }
  return result;
}

/** Map CEFR string to the app's Level type */
function cefrToAppLevel(cefr: CEFRLevel): string {
  const map: Record<CEFRLevel, string> = {
    "pre-A1": "kids",
    A1: "a1", A2: "a2", B1: "b1", B2: "b2", C1: "c1", C2: "c1",
  };
  return map[cefr];
}

const LEVEL_LABEL: Record<CEFRLevel, string> = {
  "pre-A1": "Pre-A1",
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
};

const LEVEL_DESC_VI: Record<CEFRLevel, string> = {
  "pre-A1": "Khởi đầu — Bạn có thể nhận biết các từ đơn lẻ quen thuộc và hình ảnh cơ bản.",
  A1: "Cơ bản — Bạn hiểu được câu đơn giản về các chủ đề quen thuộc hàng ngày.",
  A2: "Sơ cấp — Bạn giao tiếp được trong các tình huống đơn giản, thường ngày.",
  B1: "Trung cấp — Bạn xử lý được hầu hết các tình huống khi du lịch và diễn đạt được ý kiến cá nhân.",
  B2: "Trung cấp cao — Bạn hiểu được nội dung phức tạp và sử dụng tiếng Anh thành thạo trong nhiều ngữ cảnh.",
  C1: "Cao cấp — Bạn hiểu văn bản dài, phức tạp và nhận ra ý nghĩa ẩn.",
  C2: "Thành thạo — Bạn hiểu mọi thứ dễ dàng, gần như người bản ngữ.",
};

// ── API helpers ──

const API_LEVEL_MAP: Partial<Record<string, CEFRLevel>> = {
  "pre-a1": "pre-A1",
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
  c2: "C2",
};

const TYPE_MAP: Record<string, Question["type"]> = {
  vocabulary: "vocabulary",
  grammar: "grammar",
  listening: "listening",
  reading: "reading",
};

/** Convert API GeneratedExam questions to the placement test Question format. */
function apiToPlacementQuestions(api: GeneratedExam): Question[] {
  const cefrLevel = API_LEVEL_MAP[api.level.toLowerCase()];
  if (!cefrLevel) return [];

  const result: Question[] = [];
  const allSections: [string, GeneratedExam["sections"]["listening"]][] = [
    ["vocabulary", api.sections.vocab_grammar],
    ["listening", api.sections.listening],
    ["reading", api.sections.reading],
  ];

  for (const [sectionType, questions] of allSections) {
    for (const q of questions) {
      if (!q.options || q.options.length !== 4) continue;
      const answerNum = typeof q.answer === "number" ? q.answer : parseInt(String(q.answer), 10);
      if (isNaN(answerNum) || answerNum < 0 || answerNum >= q.options.length) continue;
      const qType: Question["type"] = TYPE_MAP[sectionType] ?? "vocabulary";
      result.push({
        level: cefrLevel,
        type: qType,
        question: q.question,
        options: q.options as [string, string, string, string],
        answer: answerNum,
        context: q.passage,
      });
    }
  }
  return result;
}

// ── Component ──

type Phase = "intro" | "testing" | "result" | "certificate";

export function PlacementTestPage({ student, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>("pre-A1");
  const [questionIdx, setQuestionIdx] = useState<number | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<{ level: CEFRLevel; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resultLevel, setResultLevel] = useState<CEFRLevel>("pre-A1");

  // Extended question bank: starts with hardcoded questions, augmented with API questions on mount.
  const bankRef = useRef<Question[]>([...QUESTION_BANK]);

  useEffect(() => {
    // Load questions from API for key levels and prepend them (API questions first so they're picked first).
    const levels = ["pre-a1", "a1", "a2", "b1", "b2", "c1", "c2"];
    Promise.allSettled(levels.map((lv) => generateExam(lv))).then((results) => {
      const apiQuestions: Question[] = [];
      for (const result of results) {
        if (result.status === "fulfilled") {
          apiQuestions.push(...apiToPlacementQuestions(result.value));
        }
      }
      if (apiQuestions.length > 0) {
        bankRef.current = [...apiQuestions, ...QUESTION_BANK];
      }
    });
  }, []);

  const questionNum = answers.length + 1;
  const progressPct = (answers.length / MAX_ANSWERS) * 100;

  // Start test — always at Pre-A1
  const startTest = () => {
    const idx = pickNextQuestion("pre-A1", new Set(), bankRef.current);
    setQuestionIdx(idx);
    if (idx !== null) setUsedIndices(new Set([idx]));
    setCurrentLevel("pre-A1");
    setPhase("testing");
  };

  // Finish and calculate result
  const finishTest = (finalAnswers: { level: CEFRLevel; correct: boolean }[]) => {
    const finalLevel = calculateCEFR(finalAnswers);
    setResultLevel(finalLevel);

    // Save placement certificate
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / finalAnswers.length) * 100);
    const certId = `PT-${Date.now().toString(36).toUpperCase()}`;
    saveCertificate(student.id, {
      type: "placement",
      level: LEVEL_LABEL[finalLevel],
      score: pct,
      totalQuestions: finalAnswers.length,
      certId,
    }).catch(() => {});

    setPhase("result");
  };

  // Handle answer selection
  const handleSelect = (optionIdx: number) => {
    if (showFeedback || questionIdx === null) return;
    setSelected(optionIdx);
    setShowFeedback(true);

    const q = bankRef.current[questionIdx];
    const correct = optionIdx === q.answer;
    const newAnswers = [...answers, { level: q.level, correct }];

    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      setShowFeedback(false);

      // Check stop conditions
      if (newAnswers.length >= MAX_ANSWERS || shouldStopEarly(newAnswers)) {
        finishTest(newAnswers);
        return;
      }

      // Adapt and pick next
      const nextLevel = adaptLevel(currentLevel, correct);
      setCurrentLevel(nextLevel);
      const newUsed = new Set(usedIndices);
      const nextIdx = pickNextQuestion(nextLevel, newUsed, bankRef.current);
      if (nextIdx !== null) {
        newUsed.add(nextIdx);
        setUsedIndices(newUsed);
        setQuestionIdx(nextIdx);
      } else {
        finishTest(newAnswers);
      }
    }, 800);
  };

  const handleComplete = () => {
    onComplete(cefrToAppLevel(resultLevel));
  };

  // ── Intro screen ──
  if (phase === "intro") {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Kiểm tra xếp lớp" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Bài kiểm tra xếp lớp</h2>
          <Card className="w-full">
            <CardContent className="space-y-3 p-5 text-left text-sm text-muted-foreground">
              <p>Bài kiểm tra này sẽ đánh giá trình độ tiếng Anh của bạn theo khung CEFR (Pre-A1 – C2).</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Từ 10 đến 30 câu hỏi trắc nghiệm</li>
                <li>Khoảng 2 – 5 phút</li>
                <li>Độ khó tự động điều chỉnh</li>
                <li>Phù hợp mọi lứa tuổi: từ mầm non đến tiến sĩ</li>
                <li>Kết quả: xếp lớp theo trình độ CEFR</li>
              </ul>
              <p className="font-medium text-foreground">Hãy trả lời thật tốt nhé, {student.name}!</p>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={startTest}>
            Bắt đầu làm bài
          </Button>
        </div>
      </main>
    );
  }

  // ── Result screen ──
  if (phase === "result") {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Kết quả xếp lớp" icon={<Trophy className="h-4 w-4" />} iconBg="bg-amber-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg">
            <span className="text-3xl font-black text-white">{LEVEL_LABEL[resultLevel]}</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Trình độ của bạn: {LEVEL_LABEL[resultLevel]}</h2>
          <p className="text-sm text-muted-foreground">{LEVEL_DESC_VI[resultLevel]}</p>
          <Card className="w-full">
            <CardContent className="space-y-2 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đúng</span>
                <span className="font-bold text-green-600">{correctCount}/{answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Độ chính xác</span>
                <span className="font-bold">{Math.round((correctCount / answers.length) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Xếp lớp</span>
                <span className="font-bold text-indigo-600">{LEVEL_LABEL[resultLevel]}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={() => setPhase("certificate")}>
            Xem chứng chỉ đầu vào
          </Button>
        </div>
      </main>
    );
  }

  // ── Certificate screen ──
  if (phase === "certificate") {
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / answers.length) * 100);
    const dateStr = new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Chứng chỉ xếp lớp" icon={<Award className="h-4 w-4" />} iconBg="bg-amber-500" onClose={() => setPhase("result")} />

        {/* Print button */}
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-[0.97]"
          >
            <Printer className="h-4 w-4" /> In chứng chỉ
          </button>
        </div>

        {/* Certificate — Placement Test */}
        <div className="cert-print mx-auto max-w-lg bg-white shadow-xl dark:bg-white overflow-hidden" style={{ aspectRatio: "1/1.414" }}>
          <div className="h-full border-[6px] border-indigo-500 p-1">
            <div className="relative h-full border-2 border-indigo-300 px-6 py-5 sm:px-8 sm:py-7 flex flex-col">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <GraduationCap className="h-64 w-64 text-indigo-800" />
              </div>
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 h-6 w-6 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-2 right-2 h-6 w-6 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2 border-indigo-400" />

              {/* Header */}
              <div className="text-center mb-3 relative z-10">
                <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-md">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-[0.2em] text-gray-800 uppercase">Placement Certificate</h1>
                <p className="text-[9px] tracking-wider text-indigo-600 mt-0.5">Chứng chỉ xếp lớp đầu vào</p>
              </div>

              <div className="mx-auto mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-400" />
                <div className="h-2 w-2 rotate-45 bg-indigo-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-400" />
              </div>

              <div className="text-center flex-1 relative z-10">
                <p className="text-[10px] text-gray-500 mb-1 italic">This is to certify that / Chứng nhận rằng</p>
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-1 border-b-2 border-indigo-200 inline-block px-4 pb-1">{student.name}</h2>
                <p className="text-[10px] text-gray-500 mt-2 mb-2 italic">has been assessed at the following level</p>

                <div className="mx-auto mb-2 inline-block">
                  <div className="rounded-lg border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-indigo-100 px-6 py-2 shadow-sm">
                    <p className="text-3xl font-black text-indigo-700 tracking-wider">{LEVEL_LABEL[resultLevel]}</p>
                    <p className="text-[9px] font-bold text-indigo-600 tracking-wider">{LEVEL_DESC_VI[resultLevel]}</p>
                  </div>
                </div>

                <p className="text-[9px] text-gray-500 mb-1">Common European Framework of Reference for Languages</p>

                <div className="inline-flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-1.5 mb-2">
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">{pct}%</p>
                    <p className="text-[8px] text-gray-500 uppercase">Score</p>
                  </div>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">{correctCount}/{answers.length}</p>
                    <p className="text-[8px] text-gray-500 uppercase">Correct</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-400" />
                <div className="h-2 w-2 rotate-45 bg-indigo-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-400" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3 relative z-10">
                <div>
                  <div className="mx-auto mb-1 h-px w-16 bg-gray-400" />
                  <p className="text-[8px] text-gray-500">Ngày / Date</p>
                  <p className="text-[9px] font-bold text-gray-700">{dateStr}</p>
                </div>
                <div>
                  <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-400">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="text-[8px] text-gray-500">Official Seal</p>
                </div>
                <div>
                  <div className="mx-auto mb-1 h-px w-16 bg-gray-400" />
                  <p className="text-[8px] text-gray-500">Examiner</p>
                  <p className="text-[9px] font-bold text-gray-700">English Buddy</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px] text-gray-400 border-t border-indigo-200 pt-2 relative z-10">
                <p>Verify at: en.vev.vn</p>
                <p className="text-[9px] font-black text-indigo-600">English Buddy™</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 print:hidden">
          <button type="button" onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-muted py-3 text-xs font-bold hover:bg-primary/10 transition-colors">
            <Printer className="h-4 w-4" /> In chứng chỉ
          </button>
          <Button className="flex-1 text-base font-extrabold" size="lg" onClick={handleComplete}>
            Bắt đầu học
          </Button>
        </div>

        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .cert-print, .cert-print * { visibility: visible !important; }
            .cert-print {
              position: fixed !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 600px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        `}</style>
      </main>
    );
  }

  // ── Testing screen ──
  const q = questionIdx !== null ? bankRef.current[questionIdx] : null;
  if (!q) return null;

  const typeLabel: Record<Question["type"], string> = {
    vocabulary: "Từ vựng",
    grammar: "Ngữ pháp",
    listening: "Nghe",
    reading: "Đọc hiểu",
  };

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader
        title={`Câu ${questionNum}/${MAX_ANSWERS}`}
        icon={<GraduationCap className="h-4 w-4" />}
        iconBg="bg-indigo-500"
        onClose={onBack}
        progress={progressPct}
      />
      <div className="mt-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-bold text-indigo-700">{LEVEL_LABEL[q.level]}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">{typeLabel[q.type]}</span>
        </div>
        <Card>
          <CardContent className="p-5">
            {q.instruction && (
              <p className="mb-2 text-xs font-medium text-muted-foreground italic">{q.instruction}</p>
            )}
            {q.context && (
              <div className="mb-3 rounded-lg bg-muted/50 p-3.5 sm:p-4 font-reading text-sm lg:text-base leading-relaxed text-muted-foreground">
                {q.context}
              </div>
            )}
            <p className="text-base lg:text-lg font-bold leading-relaxed">{q.question}</p>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            let cls = "w-full justify-start text-left text-sm font-medium border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all";
            if (showFeedback && i === q.answer) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-green-500 bg-green-50 text-green-800";
            } else if (showFeedback && i === selected && i !== q.answer) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-red-400 bg-red-50 text-red-700";
            } else if (selected === i) {
              cls = "w-full justify-start text-left text-sm font-medium border-2 border-primary bg-primary/10";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelect(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 min-h-[44px] ${cls}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {showFeedback && i === q.answer && <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />}
                {showFeedback && i === selected && i !== q.answer && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
