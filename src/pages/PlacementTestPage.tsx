import { useState } from "react";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { GraduationCap, CheckCircle, XCircle, Trophy, Award, Printer } from "lucide-react";

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
    instruction: "Nh\u00ECn h\u00ECnh v\u00E0 ch\u1ECDn \u0111\u00E1p \u00E1n \u0111\u00FAng",
    question: "\uD83C\uDF4E What is this?",
    options: ["Apple", "Car", "Hat", "Cup"],
    answer: 0,
  },
  // 2. Picture vocab
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "Nh\u00ECn h\u00ECnh v\u00E0 ch\u1ECDn \u0111\u00E1p \u00E1n \u0111\u00FAng",
    question: "\uD83D\uDC36 What is this?",
    options: ["\uD83D\uDC31 Cat", "\uD83D\uDC20 Fish", "\uD83D\uDC36 Dog", "\uD83D\uDC26 Bird"],
    answer: 2,
  },
  // 3. Counting
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "\u0110\u1EBFm v\u00E0 ch\u1ECDn s\u1ED1 \u0111\u00FAng",
    question: "How many? \u2B50\u2B50\u2B50",
    options: ["Two", "Three", "Four", "Five"],
    answer: 1,
  },
  // 4. Color/number
  {
    level: "pre-A1", type: "vocabulary",
    instruction: "\u0110\u1EBFm v\u00E0 ch\u1ECDn s\u1ED1 \u0111\u00FAng",
    question: "How many hearts? \u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F",
    options: ["Three", "Five", "Four", "Two"],
    answer: 2,
  },
  // 5. Basic action
  {
    level: "pre-A1", type: "reading",
    instruction: "Nh\u00ECn h\u00ECnh v\u00E0 ch\u1ECDn t\u1EEB \u0111\u00FAng",
    question: "The boy is \uD83D\uDE34. He is ___.",
    options: ["eating", "sleeping", "running", "reading"],
    answer: 1,
  },
  // 6. Basic action
  {
    level: "pre-A1", type: "reading",
    instruction: "Nh\u00ECn h\u00ECnh v\u00E0 ch\u1ECDn t\u1EEB \u0111\u00FAng",
    question: "The girl is \uD83C\uDFC3\u200D\u2640\uFE0F. She is ___.",
    options: ["sleeping", "eating", "sitting", "running"],
    answer: 3,
  },
  // 7. Listening - single word recognition
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe v\u00E0 ch\u1ECDn \u0111\u00E1p \u00E1n \u0111\u00FAng",
    question: "Listen: 'Blue'. Which color is blue?",
    options: ["\uD83D\uDD34 Red", "\uD83D\uDD35 Blue", "\uD83D\uDFE2 Green", "\uD83D\uDFE1 Yellow"],
    answer: 1,
  },
  // 8. Listening - single word recognition
  {
    level: "pre-A1", type: "listening",
    instruction: "Nghe v\u00E0 ch\u1ECDn con v\u1EADt \u0111\u00FAng",
    question: "Listen: 'Cat'. Which one is a cat?",
    options: ["\uD83D\uDC36 Dog", "\uD83D\uDC31 Cat", "\uD83D\uDC1F Fish", "\uD83D\uDC18 Elephant"],
    answer: 1,
  },

  // ══════════════════════════════════════════════════════════════
  // A1 — Can understand simple sentences about familiar topics
  // ══════════════════════════════════════════════════════════════

  // 1. Situational
  {
    level: "A1", type: "grammar",
    question: "At a shop: 'How much is this?' \u2014 'It ___ five dollars.'",
    options: ["is", "are", "am", "be"],
    answer: 0,
  },
  // 2. Situational
  {
    level: "A1", type: "grammar",
    question: "At school: 'Where ___ you from?' \u2014 'I'm from Vietnam.'",
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
    question: "'Do you like ice cream?' \u2014 'Yes, I ___.'",
    options: ["am", "do", "is", "like"],
    answer: 1,
  },
  // 6. Grammar in natural dialogue
  {
    level: "A1", type: "grammar",
    question: "'___ is your teacher?' \u2014 'Miss Hoa.'",
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
    question: "'What did you do yesterday?' \u2014 'I ___ to the cinema with my friends.'",
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
    question: "'Have you ever been to Japan?' \u2014 'Yes, I ___ there last summer.'",
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
    question: "The evidence is ___ at best \u2014 it neither proves nor disproves the theory.",
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
    context: "The philosopher's argument rests on the premise that consciousness is an emergent property of sufficiently complex systems. If this is accepted, the distinction between biological and artificial intelligence becomes one of degree rather than kind \u2014 a conclusion that many find philosophically disquieting.",
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
function pickNextQuestion(level: CEFRLevel, usedIndices: Set<number>): number | null {
  for (let i = 0; i < QUESTION_BANK.length; i++) {
    if (!usedIndices.has(i) && QUESTION_BANK[i].level === level) return i;
  }
  // Try adjacent levels if current exhausted
  const idx = LEVELS.indexOf(level);
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    const adj = idx + delta;
    if (adj < 0 || adj >= LEVELS.length) continue;
    for (let i = 0; i < QUESTION_BANK.length; i++) {
      if (!usedIndices.has(i) && QUESTION_BANK[i].level === LEVELS[adj]) return i;
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
  "pre-A1": "Kh\u1EDFi \u0111\u1EA7u \u2014 B\u1EA1n c\u00F3 th\u1EC3 nh\u1EADn bi\u1EBFt c\u00E1c t\u1EEB \u0111\u01A1n l\u1EBB quen thu\u1ED9c v\u00E0 h\u00ECnh \u1EA3nh c\u01A1 b\u1EA3n.",
  A1: "C\u01A1 b\u1EA3n \u2014 B\u1EA1n hi\u1EC3u \u0111\u01B0\u1EE3c c\u00E2u \u0111\u01A1n gi\u1EA3n v\u1EC1 c\u00E1c ch\u1EE7 \u0111\u1EC1 quen thu\u1ED9c h\u00E0ng ng\u00E0y.",
  A2: "S\u01A1 c\u1EA5p \u2014 B\u1EA1n giao ti\u1EBFp \u0111\u01B0\u1EE3c trong c\u00E1c t\u00ECnh hu\u1ED1ng \u0111\u01A1n gi\u1EA3n, th\u01B0\u1EDDng ng\u00E0y.",
  B1: "Trung c\u1EA5p \u2014 B\u1EA1n x\u1EED l\u00FD \u0111\u01B0\u1EE3c h\u1EA7u h\u1EBFt c\u00E1c t\u00ECnh hu\u1ED1ng khi du l\u1ECBch v\u00E0 di\u1EC5n \u0111\u1EA1t \u0111\u01B0\u1EE3c \u00FD ki\u1EBFn c\u00E1 nh\u00E2n.",
  B2: "Trung c\u1EA5p cao \u2014 B\u1EA1n hi\u1EC3u \u0111\u01B0\u1EE3c n\u1ED9i dung ph\u1EE9c t\u1EA1p v\u00E0 s\u1EED d\u1EE5ng ti\u1EBFng Anh th\u00E0nh th\u1EA1o trong nhi\u1EC1u ng\u1EEF c\u1EA3nh.",
  C1: "Cao c\u1EA5p \u2014 B\u1EA1n hi\u1EC3u v\u0103n b\u1EA3n d\u00E0i, ph\u1EE9c t\u1EA1p v\u00E0 nh\u1EADn ra \u00FD ngh\u0129a \u1EA9n.",
  C2: "Th\u00E0nh th\u1EA1o \u2014 B\u1EA1n hi\u1EC3u m\u1ECDi th\u1EE9 d\u1EC5 d\u00E0ng, g\u1EA7n nh\u01B0 ng\u01B0\u1EDDi b\u1EA3n ng\u1EEF.",
};

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

  const questionNum = answers.length + 1;
  const progressPct = (answers.length / MAX_ANSWERS) * 100;

  // Start test — always at Pre-A1
  const startTest = () => {
    const idx = pickNextQuestion("pre-A1", new Set());
    setQuestionIdx(idx);
    if (idx !== null) setUsedIndices(new Set([idx]));
    setCurrentLevel("pre-A1");
    setPhase("testing");
  };

  // Finish and calculate result
  const finishTest = (finalAnswers: { level: CEFRLevel; correct: boolean }[]) => {
    const finalLevel = calculateCEFR(finalAnswers);
    setResultLevel(finalLevel);
    setPhase("result");
  };

  // Handle answer selection
  const handleSelect = (optionIdx: number) => {
    if (showFeedback || questionIdx === null) return;
    setSelected(optionIdx);
    setShowFeedback(true);

    const q = QUESTION_BANK[questionIdx];
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
      const nextIdx = pickNextQuestion(nextLevel, newUsed);
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
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="Ki\u1EC3m tra x\u1EBFp l\u1EDBp" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">B\u00E0i ki\u1EC3m tra x\u1EBFp l\u1EDBp</h2>
          <Card className="w-full">
            <CardContent className="space-y-3 p-5 text-left text-sm text-muted-foreground">
              <p>B\u00E0i ki\u1EC3m tra n\u00E0y s\u1EBD \u0111\u00E1nh gi\u00E1 tr\u00ECnh \u0111\u1ED9 ti\u1EBFng Anh c\u1EE7a b\u1EA1n theo khung CEFR (Pre-A1 \u2013 C2).</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>T\u1EEB 10 \u0111\u1EBFn 30 c\u00E2u h\u1ECFi tr\u1EAFc nghi\u1EC7m</li>
                <li>Kho\u1EA3ng 2 \u2013 5 ph\u00FAt</li>
                <li>\u0110\u1ED9 kh\u00F3 t\u1EF1 \u0111\u1ED9ng \u0111i\u1EC1u ch\u1EC9nh</li>
                <li>Ph\u00F9 h\u1EE3p m\u1ECDi l\u1EE9a tu\u1ED5i: t\u1EEB m\u1EA7m non \u0111\u1EBFn ti\u1EBFn s\u0129</li>
                <li>K\u1EBFt qu\u1EA3: x\u1EBFp l\u1EDBp theo tr\u00ECnh \u0111\u1ED9 CEFR</li>
              </ul>
              <p className="font-medium text-foreground">H\u00E3y tr\u1EA3 l\u1EDDi th\u1EADt t\u1ED1t nh\u00E9, {student.name}!</p>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={startTest}>
            B\u1EAFt \u0111\u1EA7u l\u00E0m b\u00E0i
          </Button>
        </div>
      </main>
    );
  }

  // ── Result screen ──
  if (phase === "result") {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="K\u1EBFt qu\u1EA3 x\u1EBFp l\u1EDBp" icon={<Trophy className="h-4 w-4" />} iconBg="bg-amber-500" onClose={onBack} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg">
            <span className="text-3xl font-black text-white">{LEVEL_LABEL[resultLevel]}</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Tr\u00ECnh \u0111\u1ED9 c\u1EE7a b\u1EA1n: {LEVEL_LABEL[resultLevel]}</h2>
          <p className="text-sm text-muted-foreground">{LEVEL_DESC_VI[resultLevel]}</p>
          <Card className="w-full">
            <CardContent className="space-y-2 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">\u0110\u00FAng</span>
                <span className="font-bold text-green-600">{correctCount}/{answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">\u0110\u1ED9 ch\u00EDnh x\u00E1c</span>
                <span className="font-bold">{Math.round((correctCount / answers.length) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">X\u1EBFp l\u1EDBp</span>
                <span className="font-bold text-indigo-600">{LEVEL_LABEL[resultLevel]}</span>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full text-base font-extrabold" size="lg" onClick={() => setPhase("certificate")}>
            Xem ch\u1EE9ng ch\u1EC9 \u0111\u1EA7u v\u00E0o
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
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <SessionHeader title="Ch\u1EE9ng ch\u1EC9 x\u1EBFp l\u1EDBp" icon={<Award className="h-4 w-4" />} iconBg="bg-amber-500" onClose={() => setPhase("result")} />

        {/* Print button */}
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-[0.97]"
          >
            <Printer className="h-4 w-4" /> In ch\u1EE9ng ch\u1EC9
          </button>
        </div>

        {/* Certificate */}
        <div className="cert-print mx-auto max-w-lg rounded-2xl border-4 border-double border-amber-400 bg-white p-8 shadow-xl dark:bg-white">
          <div className="rounded-xl border-2 border-amber-200 p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-black tracking-wider text-gray-800 uppercase">CH\u1EE8NG CH\u1EC8 X\u1EBEP L\u1EDBP</h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Placement Test Certificate</p>
            </div>

            <div className="mx-auto mb-5 h-px w-32 bg-amber-300" />

            <p className="text-xs text-gray-500 mb-2">Ch\u1EE9ng nh\u1EADn h\u1ECDc sinh</p>
            <h2 className="text-2xl font-black text-gray-800 mb-2">{student.name}</h2>

            <p className="text-xs text-gray-500 mb-4">\u0111\u00E3 ho\u00E0n th\u00E0nh b\u00E0i ki\u1EC3m tra x\u1EBFp l\u1EDBp \u0111\u1EA7u v\u00E0o</p>

            <div className="mx-auto mb-4 inline-flex flex-col items-center gap-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 shadow-md">
              <span className="text-2xl font-black text-white">{LEVEL_LABEL[resultLevel]}</span>
              <span className="text-xs font-bold text-white/90">{LEVEL_DESC_VI[resultLevel]}</span>
            </div>

            <p className="text-xs text-gray-500 mb-1">Tr\u00ECnh \u0111\u1ED9 CEFR</p>
            <p className="text-sm font-bold text-gray-700 mb-4">\u0110i\u1EC3m: {correctCount}/{answers.length} ({pct}%)</p>

            <div className="mx-auto mb-4 h-px w-32 bg-amber-300" />

            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <div className="text-left">
                <p>Ng\u00E0y c\u1EA5p: {dateStr}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-600">English Buddy</p>
                <p>N\u1EC1n t\u1EA3ng h\u1ECDc ti\u1EBFng Anh</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full text-base font-extrabold" size="lg" onClick={handleComplete}>
            B\u1EAFt \u0111\u1EA7u h\u1ECDc
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
              width: 700px !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </main>
    );
  }

  // ── Testing screen ──
  const q = questionIdx !== null ? QUESTION_BANK[questionIdx] : null;
  if (!q) return null;

  const typeLabel: Record<Question["type"], string> = {
    vocabulary: "T\u1EEB v\u1EF1ng",
    grammar: "Ng\u1EEF ph\u00E1p",
    listening: "Nghe",
    reading: "\u0110\u1ECDc hi\u1EC3u",
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <SessionHeader
        title={`C\u00E2u ${questionNum}/${MAX_ANSWERS}`}
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
              <div className="mb-3 rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                {q.context}
              </div>
            )}
            <p className="text-base font-bold leading-relaxed">{q.question}</p>
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
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 ${cls}`}
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
