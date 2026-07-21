import { BookOpen, CheckCircle2, Ear, GraduationCap, Mic, PenLine, Play, RotateCcw, Volume2, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Student } from "@/types";
import { speakText } from "@/services/speechService";
import { listenOnce, isRecognitionSupported } from "@/services/speechRecognitionService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

// ── Types ──

type StepType = "vocab" | "listen" | "read" | "grammar" | "speak" | "write";

interface LessonStep {
  type: StepType;
  title: string;
  content: string;
  words?: { en: string; vi: string }[];
  questions?: { q: string; options: string[]; answer: number }[];
  passage?: string;
  rule?: string;
  exercises?: { sentence: string; blank: string; options: string[]; answer: number }[];
  phrase?: string;
  prompt?: string;
}

interface IntegratedLesson {
  id: string;
  title: string;
  titleVi: string;
  level: string;
  topic: string;
  steps: LessonStep[];
}

// ── 6 Sample Lessons ──

const LESSONS: IntegratedLesson[] = [
  {
    id: "il_01",
    title: "My Family",
    titleVi: "Gia đình của tôi",
    level: "a1",
    topic: "family",
    steps: [
      {
        type: "vocab",
        title: "Family Words",
        content: "Learn these family words.",
        words: [
          { en: "mother", vi: "mẹ" },
          { en: "father", vi: "bố" },
          { en: "sister", vi: "chị/em gái" },
          { en: "brother", vi: "anh/em trai" },
          { en: "grandmother", vi: "bà" },
          { en: "grandfather", vi: "ông" },
        ],
      },
      {
        type: "listen",
        title: "Listen to a Family",
        content: "Listen and answer the questions.",
        passage: "My name is Lily. I have a big family. My mother is a teacher. My father is a doctor. I have one brother and two sisters. My grandmother lives with us.",
        questions: [
          { q: "What is the mother's job?", options: ["doctor", "teacher", "nurse"], answer: 1 },
          { q: "How many sisters does Lily have?", options: ["one", "two", "three"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read About a Family",
        content: "Read the text and answer.",
        passage: "Tom has a small family. He lives with his mother and father. He does not have brothers or sisters. His grandmother visits every Sunday. They eat lunch together.",
        questions: [
          { q: "Does Tom have brothers?", options: ["Yes", "No"], answer: 1 },
          { q: "When does grandmother visit?", options: ["Saturday", "Sunday", "Monday"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying this sentence.",
        phrase: "This is my mother. She is very kind.",
      },
      {
        type: "write",
        title: "Write Family Names",
        content: "Write the names of your family members in English.",
        prompt: "Write about your family. Example: My mother's name is ...",
      },
    ],
  },
  {
    id: "il_02",
    title: "At School",
    titleVi: "Ở trường học",
    level: "a1",
    topic: "school",
    steps: [
      {
        type: "vocab",
        title: "School Vocabulary",
        content: "Learn these school words.",
        words: [
          { en: "teacher", vi: "giáo viên" },
          { en: "student", vi: "học sinh" },
          { en: "classroom", vi: "lớp học" },
          { en: "book", vi: "sách" },
          { en: "pencil", vi: "bút chì" },
          { en: "desk", vi: "bàn học" },
        ],
      },
      {
        type: "listen",
        title: "Daily Routine",
        content: "Listen to the daily routine.",
        passage: "I wake up at seven o'clock. I eat breakfast and go to school. My first class is English. After lunch, I have math. I go home at four o'clock.",
        questions: [
          { q: "What time does the student wake up?", options: ["six", "seven", "eight"], answer: 1 },
          { q: "What is the first class?", options: ["math", "English", "science"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read About School",
        content: "Read and answer.",
        passage: "My school is big. There are twenty classrooms. I like my English teacher. She is nice. My favorite subject is art. I draw pictures every day.",
        questions: [
          { q: "How many classrooms are there?", options: ["ten", "twenty", "thirty"], answer: 1 },
          { q: "What is the favorite subject?", options: ["English", "math", "art"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Present Simple",
        content: "We use present simple for habits and routines.",
        rule: "Subject + verb (add -s for he/she/it). Example: I go to school. She goes to school.",
        exercises: [
          { sentence: "He ___ to school every day.", blank: "goes", options: ["go", "goes", "going"], answer: 1 },
          { sentence: "They ___ English on Monday.", blank: "study", options: ["studies", "study", "studying"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying these sentences.",
        phrase: "I go to school at eight o'clock. My teacher is very nice.",
      },
    ],
  },
  {
    id: "il_03",
    title: "Going Shopping",
    titleVi: "Đi mua sắm",
    level: "a2",
    topic: "shopping",
    steps: [
      {
        type: "vocab",
        title: "Shopping Phrases",
        content: "Learn these shopping phrases.",
        words: [
          { en: "How much is this?", vi: "Cái này bao nhiêu?" },
          { en: "I'd like to buy...", vi: "Tôi muốn mua..." },
          { en: "Do you have...?", vi: "Bạn có...?" },
          { en: "receipt", vi: "hóa đơn" },
          { en: "discount", vi: "giảm giá" },
          { en: "change", vi: "tiền thừa" },
        ],
      },
      {
        type: "listen",
        title: "Shopping Dialogue",
        content: "Listen to the dialogue.",
        passage: "Customer: Excuse me, how much is this shirt? Shopkeeper: It's twenty dollars. Customer: Can I have a discount? Shopkeeper: I can give you ten percent off. Customer: Great, I'll take it!",
        questions: [
          { q: "How much is the shirt?", options: ["$10", "$20", "$30"], answer: 1 },
          { q: "What discount did the customer get?", options: ["5%", "10%", "20%"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Shopping List",
        content: "Read the shopping list and answer.",
        passage: "Shopping List: 2 kg of apples, 1 loaf of bread, 500g of cheese, 1 bottle of milk, 3 cans of tuna. Total budget: $25. Remember to check for discounts!",
        questions: [
          { q: "How many kg of apples?", options: ["1", "2", "3"], answer: 1 },
          { q: "What is the budget?", options: ["$15", "$20", "$25"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Can / Could",
        content: "We use 'can' for ability and requests, 'could' for polite requests.",
        rule: "Can + base verb. Could + base verb (more polite). Example: Can I try this on? Could you give me a discount?",
        exercises: [
          { sentence: "___ I try this shirt on?", blank: "Can", options: ["Can", "Do", "Is"], answer: 0 },
          { sentence: "___ you help me, please?", blank: "Could", options: ["Can", "Could", "Will"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write a Shopping List",
        content: "Write your own shopping list in English.",
        prompt: "Write a shopping list with at least 5 items. Include quantities.",
      },
    ],
  },
  {
    id: "il_04",
    title: "My Holiday",
    titleVi: "Kỳ nghỉ của tôi",
    level: "a2",
    topic: "travel",
    steps: [
      {
        type: "vocab",
        title: "Travel Vocabulary",
        content: "Learn these travel words.",
        words: [
          { en: "airport", vi: "sân bay" },
          { en: "hotel", vi: "khách sạn" },
          { en: "suitcase", vi: "vali" },
          { en: "passport", vi: "hộ chiếu" },
          { en: "souvenir", vi: "quà lưu niệm" },
          { en: "beach", vi: "bãi biển" },
        ],
      },
      {
        type: "listen",
        title: "Travel Story",
        content: "Listen to the travel story.",
        passage: "Last summer, I went to Da Nang with my family. We stayed at a hotel near the beach. We swam in the sea every morning. We visited the Golden Bridge and ate delicious seafood. It was an amazing trip!",
        questions: [
          { q: "Where did they go?", options: ["Ha Noi", "Da Nang", "Ho Chi Minh"], answer: 1 },
          { q: "What did they visit?", options: ["Golden Bridge", "museum", "park"], answer: 0 },
        ],
      },
      {
        type: "read",
        title: "Read a Postcard",
        content: "Read the postcard and answer.",
        passage: "Dear Mom, I am having a wonderful time in London! Yesterday I visited the Tower of London and saw the Crown Jewels. Today I walked along the River Thames. The weather is cold but sunny. I bought you a nice souvenir! Love, Anna.",
        questions: [
          { q: "Where is Anna?", options: ["Paris", "London", "New York"], answer: 1 },
          { q: "How is the weather?", options: ["hot and rainy", "cold but sunny", "warm and cloudy"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Past Simple",
        content: "We use past simple for finished actions in the past.",
        rule: "Regular: verb + -ed (visited, walked). Irregular: went, saw, ate, bought. Example: I visited London last year.",
        exercises: [
          { sentence: "I ___ to the beach yesterday.", blank: "went", options: ["go", "went", "going"], answer: 1 },
          { sentence: "She ___ a postcard to her mom.", blank: "wrote", options: ["write", "wrote", "written"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write About a Trip",
        content: "Write about a trip you took.",
        prompt: "Write about a holiday or trip. Where did you go? What did you do? Use past simple.",
      },
    ],
  },
  {
    id: "il_05",
    title: "Health & Fitness",
    titleVi: "Sức khỏe và thể dục",
    level: "b1",
    topic: "health",
    steps: [
      {
        type: "vocab",
        title: "Health Vocabulary",
        content: "Learn these health words.",
        words: [
          { en: "symptom", vi: "triệu chứng" },
          { en: "prescription", vi: "đơn thuốc" },
          { en: "exercise", vi: "tập thể dục" },
          { en: "balanced diet", vi: "chế độ ăn cân bằng" },
          { en: "headache", vi: "đau đầu" },
          { en: "fever", vi: "sốt" },
        ],
      },
      {
        type: "listen",
        title: "Doctor Dialogue",
        content: "Listen to the conversation with the doctor.",
        passage: "Doctor: What seems to be the problem? Patient: I've had a headache for three days and I feel tired all the time. Doctor: Do you exercise regularly? Patient: Not really. I sit at my desk all day. Doctor: I'd recommend at least 30 minutes of exercise daily and drinking more water. You should also get more sleep.",
        questions: [
          { q: "How long has the patient had a headache?", options: ["one day", "three days", "a week"], answer: 1 },
          { q: "What does the doctor recommend?", options: ["medicine", "exercise and water", "surgery"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Health Article",
        content: "Read the article and answer.",
        passage: "Regular exercise has many benefits for both physical and mental health. Studies show that people who exercise for at least 150 minutes per week have a lower risk of heart disease. Exercise also helps reduce stress, improve sleep quality, and boost mood. A balanced diet combined with regular physical activity is the key to a healthy lifestyle.",
        questions: [
          { q: "How many minutes per week is recommended?", options: ["100", "150", "200"], answer: 1 },
          { q: "Exercise helps reduce what?", options: ["appetite", "stress", "height"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Should / Must",
        content: "We use 'should' for advice and 'must' for strong obligation.",
        rule: "Should + base verb (advice): You should drink more water. Must + base verb (obligation): You must see a doctor if the pain continues.",
        exercises: [
          { sentence: "You ___ eat more vegetables. (advice)", blank: "should", options: ["must", "should", "can"], answer: 1 },
          { sentence: "You ___ wear a seatbelt. (obligation)", blank: "must", options: ["should", "must", "could"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write Health Advice",
        content: "Give advice to a friend about staying healthy.",
        prompt: "Write 3-5 sentences giving health advice to a friend. Use 'should' and 'must'.",
      },
    ],
  },
  {
    id: "il_06",
    title: "Technology",
    titleVi: "Công nghệ",
    level: "b1",
    topic: "technology",
    steps: [
      {
        type: "vocab",
        title: "Tech Vocabulary",
        content: "Learn these technology words.",
        words: [
          { en: "smartphone", vi: "điện thoại thông minh" },
          { en: "artificial intelligence", vi: "trí tuệ nhân tạo" },
          { en: "software", vi: "phần mềm" },
          { en: "cybersecurity", vi: "an ninh mạng" },
          { en: "social media", vi: "mạng xã hội" },
          { en: "innovation", vi: "đổi mới/sáng tạo" },
        ],
      },
      {
        type: "listen",
        title: "Tech Debate",
        content: "Listen to the debate about technology.",
        passage: "Speaker A: Technology makes our lives easier. We can communicate instantly and access information anywhere. Speaker B: But it also has drawbacks. People spend too much time on social media. Children are addicted to screens. Speaker A: I agree that balance is important, but we can't deny the benefits of innovation. Speaker B: True, but we must use technology responsibly.",
        questions: [
          { q: "What does Speaker A think about technology?", options: ["It's dangerous", "It makes life easier", "It's boring"], answer: 1 },
          { q: "What concern does Speaker B raise?", options: ["cost", "screen addiction", "complexity"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Tech Article",
        content: "Read the article and answer.",
        passage: "Artificial intelligence is transforming many industries. In healthcare, AI can analyze medical images faster than doctors. In education, AI-powered apps personalize learning for each student. However, concerns about privacy and job displacement remain. Many experts believe that AI should be developed with ethical guidelines to ensure it benefits everyone.",
        questions: [
          { q: "What can AI do in healthcare?", options: ["perform surgery", "analyze medical images", "replace doctors"], answer: 1 },
          { q: "What concerns exist about AI?", options: ["privacy and jobs", "speed", "cost of electricity"], answer: 0 },
        ],
      },
      {
        type: "grammar",
        title: "Passive Voice",
        content: "We use passive voice when the action is more important than who does it.",
        rule: "Form: be + past participle. Active: People use smartphones every day. Passive: Smartphones are used every day.",
        exercises: [
          { sentence: "The software ___ by a team in Vietnam. (develop)", blank: "was developed", options: ["developed", "was developed", "is developing"], answer: 1 },
          { sentence: "New apps ___ every day. (create)", blank: "are created", options: ["are created", "create", "creating"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write Your Opinion",
        content: "Write your opinion about technology.",
        prompt: "Do you think technology is mostly positive or negative? Write a short paragraph (4-6 sentences) explaining your opinion. Use passive voice at least once.",
      },
    ],
  },
  // ── A1 Lessons (il_07 – il_12) ──

  {
    id: "il_07",
    title: "Daily Life",
    titleVi: "Cuộc sống hàng ngày",
    level: "a1",
    topic: "daily_life",
    steps: [
      {
        type: "vocab",
        title: "Morning Routine Words",
        content: "Learn these daily life words.",
        words: [
          { en: "wake up", vi: "thức dậy" },
          { en: "breakfast", vi: "bữa sáng" },
          { en: "brush teeth", vi: "đánh răng" },
          { en: "get dressed", vi: "mặc quần áo" },
          { en: "go to work", vi: "đi làm" },
          { en: "good morning", vi: "chào buổi sáng" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Morning",
        content: "Listen and answer the questions.",
        passage: "Every morning, Nam wakes up at six o'clock. He brushes his teeth and gets dressed. Then he eats breakfast with his family. He says good morning to his mother. After breakfast, he goes to work.",
        questions: [
          { q: "What time does Nam wake up?", options: ["five o'clock", "six o'clock", "seven o'clock"], answer: 1 },
          { q: "Who does Nam eat breakfast with?", options: ["his friends", "his family", "alone"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Mai's Day",
        content: "Read and answer.",
        passage: "Mai has a busy morning. She wakes up early and brushes her teeth. She gets dressed quickly because she is late. She does not have time for breakfast today. She runs to the bus stop.",
        questions: [
          { q: "Why is Mai in a hurry?", options: ["she is hungry", "she is late", "she is happy"], answer: 1 },
          { q: "Does Mai eat breakfast?", options: ["Yes", "No"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying your morning routine.",
        phrase: "I wake up at seven. I brush my teeth and eat breakfast.",
      },
      {
        type: "write",
        title: "Write Your Morning",
        content: "Describe what you do every morning.",
        prompt: "Write 3-4 sentences about your morning routine. Example: I wake up at... Then I...",
      },
    ],
  },
  {
    id: "il_08",
    title: "Food & Drinks",
    titleVi: "Đồ ăn và đồ uống",
    level: "a1",
    topic: "food_and_drink",
    steps: [
      {
        type: "vocab",
        title: "Food Words",
        content: "Learn these food and drink words.",
        words: [
          { en: "rice", vi: "cơm" },
          { en: "noodles", vi: "mì/bún" },
          { en: "chicken", vi: "gà" },
          { en: "vegetables", vi: "rau" },
          { en: "water", vi: "nước" },
          { en: "cook", vi: "nấu ăn" },
        ],
      },
      {
        type: "listen",
        title: "Listen: At the Restaurant",
        content: "Listen and answer the questions.",
        passage: "Waiter: Hello! What would you like? Customer: I'd like rice and chicken, please. Waiter: Would you like vegetables? Customer: Yes, please. And water to drink. Waiter: Of course! I will cook your food now.",
        questions: [
          { q: "What food does the customer order?", options: ["noodles and beef", "rice and chicken", "rice and fish"], answer: 1 },
          { q: "What does the customer drink?", options: ["juice", "tea", "water"], answer: 2 },
        ],
      },
      {
        type: "read",
        title: "Read: Lan's Lunch",
        content: "Read and answer.",
        passage: "Lan likes to cook at home. Today she makes noodles with chicken and vegetables. She adds water and cooks for twenty minutes. The food smells good. Her family eats lunch together.",
        questions: [
          { q: "What does Lan make today?", options: ["rice", "noodles", "soup"], answer: 1 },
          { q: "How long does she cook?", options: ["ten minutes", "fifteen minutes", "twenty minutes"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Like + verb-ing",
        content: "We use 'like' + verb-ing to talk about things we enjoy.",
        rule: "Subject + like/likes + verb-ing. Example: I like eating rice. She likes cooking noodles.",
        exercises: [
          { sentence: "He ___ eating chicken every day.", blank: "___", options: ["like", "likes", "liked"], answer: 1 },
          { sentence: "They ___ cooking vegetables.", blank: "___", options: ["likes", "like", "liking"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write About Food",
        content: "Write about your favourite food.",
        prompt: "What is your favourite food? Write 3 sentences. Example: My favourite food is... I like it because...",
      },
    ],
  },
  {
    id: "il_09",
    title: "Animals",
    titleVi: "Động vật",
    level: "a1",
    topic: "animals_and_nature",
    steps: [
      {
        type: "vocab",
        title: "Animal Words",
        content: "Learn these animal words.",
        words: [
          { en: "dog", vi: "chó" },
          { en: "cat", vi: "mèo" },
          { en: "cow", vi: "bò" },
          { en: "chicken", vi: "gà" },
          { en: "fish", vi: "cá" },
          { en: "rabbit", vi: "thỏ" },
        ],
      },
      {
        type: "listen",
        title: "Listen: On the Farm",
        content: "Listen and answer the questions.",
        passage: "My uncle has a big farm. He has three cows and many chickens. He also has a dog and a cat. The dog helps look after the farm. The cat catches mice. My uncle loves his animals very much.",
        questions: [
          { q: "How many cows does the uncle have?", options: ["two", "three", "four"], answer: 1 },
          { q: "What does the dog do?", options: ["catches mice", "looks after the farm", "eats chickens"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: My Pets",
        content: "Read and answer.",
        passage: "Minh has two pets: a cat and a rabbit. His cat is white and very soft. His rabbit is brown and eats vegetables. Minh feeds his pets every morning. He loves his cat and rabbit.",
        questions: [
          { q: "What colour is Minh's cat?", options: ["brown", "black", "white"], answer: 2 },
          { q: "What does the rabbit eat?", options: ["meat", "fish", "vegetables"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice talking about animals.",
        phrase: "I have a dog. My dog is small and brown. I love my dog.",
      },
      {
        type: "write",
        title: "Write About an Animal",
        content: "Write about your pet or a favourite animal.",
        prompt: "Write 3-4 sentences about an animal. Example: My favourite animal is a dog. It is... I like it because...",
      },
    ],
  },
  {
    id: "il_10",
    title: "My House",
    titleVi: "Ngôi nhà của tôi",
    level: "a1",
    topic: "house_and_home",
    steps: [
      {
        type: "vocab",
        title: "House Words",
        content: "Learn these words about the home.",
        words: [
          { en: "bedroom", vi: "phòng ngủ" },
          { en: "kitchen", vi: "bếp" },
          { en: "living room", vi: "phòng khách" },
          { en: "table", vi: "bàn" },
          { en: "chair", vi: "ghế" },
          { en: "window", vi: "cửa sổ" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A New Home",
        content: "Listen and answer the questions.",
        passage: "My family moved to a new house last week. The house has three bedrooms and a big kitchen. The living room has a large table and four chairs. There are many windows so the house is very bright. I love my new bedroom.",
        questions: [
          { q: "How many bedrooms does the house have?", options: ["two", "three", "four"], answer: 1 },
          { q: "How many chairs are in the living room?", options: ["three", "four", "five"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Hoa's Room",
        content: "Read and answer.",
        passage: "Hoa's bedroom is small but cosy. She has a bed, a table, and a chair. Her window looks out onto the garden. She keeps her books on the table. She loves reading in her bedroom.",
        questions: [
          { q: "What can Hoa see from her window?", options: ["the street", "the garden", "the kitchen"], answer: 1 },
          { q: "Where does Hoa keep her books?", options: ["on the chair", "on the bed", "on the table"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "There is / There are",
        content: "We use 'there is' for one thing and 'there are' for many things.",
        rule: "There is + singular noun. There are + plural noun. Example: There is a table in the kitchen. There are four chairs.",
        exercises: [
          { sentence: "___ a big window in my bedroom.", blank: "___", options: ["There are", "There is", "There have"], answer: 1 },
          { sentence: "___ three chairs in the living room.", blank: "___", options: ["There is", "There are", "There was"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write About Your Home",
        content: "Describe your home in English.",
        prompt: "Write 3-4 sentences about your house or room. Use 'There is' and 'There are'. Example: There is a big kitchen. There are two bedrooms.",
      },
    ],
  },
  {
    id: "il_11",
    title: "Numbers & Time",
    titleVi: "Số và thời gian",
    level: "a1",
    topic: "measurements_and_numbers",
    steps: [
      {
        type: "vocab",
        title: "Time Words",
        content: "Learn these number and time words.",
        words: [
          { en: "o'clock", vi: "giờ đúng" },
          { en: "half past", vi: "rưỡi" },
          { en: "quarter to", vi: "kém một quý" },
          { en: "minute", vi: "phút" },
          { en: "hour", vi: "giờ" },
          { en: "midnight", vi: "nửa đêm" },
        ],
      },
      {
        type: "listen",
        title: "Listen: What Time Is It?",
        content: "Listen and answer the questions.",
        passage: "Teacher: Class starts at eight o'clock. Lunch is at half past twelve. After lunch, we have one hour of study. The school day ends at four o'clock. Please do not be late — every minute counts!",
        questions: [
          { q: "What time does class start?", options: ["seven o'clock", "eight o'clock", "nine o'clock"], answer: 1 },
          { q: "What time is lunch?", options: ["half past eleven", "half past twelve", "one o'clock"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: A Busy Day",
        content: "Read and answer.",
        passage: "Tuan has a very busy day. He wakes up at six o'clock. He starts work at eight o'clock. He takes a break at quarter to one. He finishes work at five o'clock. He goes to bed at midnight.",
        questions: [
          { q: "What time does Tuan start work?", options: ["six", "seven", "eight"], answer: 2 },
          { q: "What time does he go to bed?", options: ["ten o'clock", "eleven o'clock", "midnight"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Say the Time!",
        content: "Practice saying times in English.",
        phrase: "It is eight o'clock. School starts now. Class ends at four o'clock.",
      },
      {
        type: "write",
        title: "Write Your Schedule",
        content: "Write about your daily schedule using times.",
        prompt: "Write 4 sentences about your day using o'clock, half past, or quarter to. Example: I wake up at six o'clock. I have lunch at...",
      },
    ],
  },
  {
    id: "il_12",
    title: "Body & Health",
    titleVi: "Cơ thể và sức khỏe",
    level: "a1",
    topic: "health_and_body",
    steps: [
      {
        type: "vocab",
        title: "Body Words",
        content: "Learn these body and health words.",
        words: [
          { en: "head", vi: "đầu" },
          { en: "stomach", vi: "bụng" },
          { en: "arm", vi: "cánh tay" },
          { en: "leg", vi: "chân" },
          { en: "cold", vi: "cảm lạnh" },
          { en: "pain", vi: "đau" },
        ],
      },
      {
        type: "listen",
        title: "Listen: At the Doctor",
        content: "Listen and answer the questions.",
        passage: "Doctor: Hello. What is wrong? Patient: I have a pain in my stomach. My head hurts too. Doctor: Do you have a cold? Patient: No, but my arm is sore. Doctor: I see. Let me check your leg too. Please rest at home today.",
        questions: [
          { q: "Where does the patient have pain?", options: ["back and leg", "stomach and head", "arm and cold"], answer: 1 },
          { q: "What does the doctor say?", options: ["Go to hospital", "Take medicine", "Rest at home"], answer: 2 },
        ],
      },
      {
        type: "read",
        title: "Read: Feeling Sick",
        content: "Read and answer.",
        passage: "Lan is sick today. She has a bad cold and her head hurts. Her stomach feels bad too. Her mother says she must rest. She cannot go to school. She stays in bed all day.",
        questions: [
          { q: "What is wrong with Lan?", options: ["broken arm", "cold and headache", "leg pain"], answer: 1 },
          { q: "What must Lan do?", options: ["go to school", "rest", "see the doctor"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Have got (body complaints)",
        content: "We use 'have got' to talk about illness or pain.",
        rule: "I/You/We/They have got + pain/illness. He/She has got + pain/illness. Example: I have got a headache. She has got a cold.",
        exercises: [
          { sentence: "He ___ a pain in his stomach.", blank: "___", options: ["have got", "has got", "had got"], answer: 1 },
          { sentence: "They ___ bad colds.", blank: "___", options: ["has got", "have got", "is got"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write About Being Sick",
        content: "Write about a time when you were sick.",
        prompt: "Write 3-4 sentences about being sick. What was wrong? What did you do? Example: I had a cold. My head hurt. I stayed at home...",
      },
    ],
  },

  // ── A2 Lessons (il_13 – il_18) ──

  {
    id: "il_13",
    title: "Transport",
    titleVi: "Phương tiện giao thông",
    level: "a2",
    topic: "travel_and_transport",
    steps: [
      {
        type: "vocab",
        title: "Transport Words",
        content: "Learn these transport words.",
        words: [
          { en: "bus stop", vi: "trạm xe buýt" },
          { en: "platform", vi: "sân ga / ke ga" },
          { en: "ticket", vi: "vé" },
          { en: "direction", vi: "hướng / chỉ đường" },
          { en: "delay", vi: "trễ / chậm trễ" },
          { en: "timetable", vi: "lịch trình" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Missing the Bus",
        content: "Listen and answer the questions.",
        passage: "Minh arrived at the bus stop at nine o'clock but there was a delay. He checked the timetable on his phone. The next bus was in twenty minutes. A woman gave him directions to the nearest train station. He bought a ticket and waited on the platform.",
        questions: [
          { q: "Why did Minh wait at the bus stop?", options: ["He lost his ticket", "There was a delay", "He missed the platform"], answer: 1 },
          { q: "Where did Minh go instead?", options: ["the airport", "the train station", "home"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Getting Around the City",
        content: "Read and answer.",
        passage: "In big cities, people use many types of transport. Buses and trains are cheap and follow a timetable. If you need directions, you can ask a local or use your phone. Always buy your ticket before you get on. Remember to check for delays before you travel.",
        questions: [
          { q: "What are two cheap ways to travel?", options: ["taxi and plane", "buses and trains", "bicycle and car"], answer: 1 },
          { q: "What should you check before you travel?", options: ["the weather", "delays", "the price of food"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Ask for Directions!",
        content: "Practice asking and giving directions.",
        phrase: "Excuse me, where is the nearest bus stop? Go straight and turn left.",
      },
      {
        type: "write",
        title: "Write About Your Journey",
        content: "Write about how you travel to school or work.",
        prompt: "Write 4-5 sentences about your daily journey. How do you travel? How long does it take? Do you ever have delays?",
      },
    ],
  },
  {
    id: "il_14",
    title: "City & Places",
    titleVi: "Thành phố và địa điểm",
    level: "a2",
    topic: "places",
    steps: [
      {
        type: "vocab",
        title: "City Words",
        content: "Learn these city and places words.",
        words: [
          { en: "museum", vi: "bảo tàng" },
          { en: "pharmacy", vi: "nhà thuốc" },
          { en: "post office", vi: "bưu điện" },
          { en: "supermarket", vi: "siêu thị" },
          { en: "roundabout", vi: "vòng xuyến" },
          { en: "opposite", vi: "đối diện" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Finding the Museum",
        content: "Listen and answer the questions.",
        passage: "Tourist: Excuse me, how do I get to the museum? Local: Go straight ahead, past the supermarket. Then turn right at the roundabout. The museum is opposite the post office. Tourist: Is there a pharmacy near here? Local: Yes, it's next to the supermarket.",
        questions: [
          { q: "Where is the museum?", options: ["next to the pharmacy", "opposite the post office", "near the supermarket"], answer: 1 },
          { q: "Where is the pharmacy?", options: ["next to the supermarket", "opposite the museum", "at the roundabout"], answer: 0 },
        ],
      },
      {
        type: "read",
        title: "Read: My Neighbourhood",
        content: "Read and answer.",
        passage: "My neighbourhood has everything I need. There is a supermarket on my street and a pharmacy opposite it. The post office is five minutes away on foot. There is also a small museum about the history of our city. I am proud of where I live.",
        questions: [
          { q: "What is opposite the supermarket?", options: ["museum", "post office", "pharmacy"], answer: 2 },
          { q: "How far is the post office?", options: ["ten minutes", "five minutes", "fifteen minutes"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Prepositions of Place",
        content: "We use prepositions to describe where things are.",
        rule: "next to, opposite, between, behind, in front of. Example: The pharmacy is next to the supermarket. The museum is opposite the park.",
        exercises: [
          { sentence: "The post office is ___ the museum and the bank.", blank: "___", options: ["opposite", "between", "behind"], answer: 1 },
          { sentence: "The pharmacy is ___ the supermarket.", blank: "___", options: ["next to", "in front of", "between"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write About Your Area",
        content: "Describe places near your home.",
        prompt: "Write 4-5 sentences about your neighbourhood. Use prepositions: next to, opposite, near. Example: There is a supermarket next to my house...",
      },
    ],
  },
  {
    id: "il_15",
    title: "Weather",
    titleVi: "Thời tiết",
    level: "a2",
    topic: "weather_and_seasons",
    steps: [
      {
        type: "vocab",
        title: "Weather Words",
        content: "Learn these weather and season words.",
        words: [
          { en: "sunny", vi: "nắng" },
          { en: "rainy", vi: "mưa" },
          { en: "cloudy", vi: "nhiều mây" },
          { en: "temperature", vi: "nhiệt độ" },
          { en: "forecast", vi: "dự báo thời tiết" },
          { en: "season", vi: "mùa" },
        ],
      },
      {
        type: "listen",
        title: "Listen: The Weather Forecast",
        content: "Listen and answer the questions.",
        passage: "Good morning! Here is today's weather forecast. This morning is sunny with a temperature of 28 degrees. In the afternoon, it will become cloudy. Tonight there will be rainy weather, so carry an umbrella. The dry season starts next month.",
        questions: [
          { q: "What is the morning weather like?", options: ["rainy", "cloudy", "sunny"], answer: 2 },
          { q: "What should you carry tonight?", options: ["a jacket", "an umbrella", "sunglasses"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Vietnam's Seasons",
        content: "Read and answer.",
        passage: "Vietnam has two main seasons: the dry season and the rainy season. In the dry season, the weather is sunny and the temperature is high. In the rainy season, it rains almost every day. Many people check the forecast before going out. The weather can change quickly.",
        questions: [
          { q: "How many seasons does Vietnam have?", options: ["four", "three", "two"], answer: 2 },
          { q: "What do people do before going out?", options: ["check the forecast", "wear a jacket", "stay home"], answer: 0 },
        ],
      },
      {
        type: "speak",
        title: "Talk About Weather!",
        content: "Practice talking about the weather.",
        phrase: "Today it is sunny and warm. The temperature is thirty degrees. I think it will rain tonight.",
      },
      {
        type: "write",
        title: "Write About the Weather",
        content: "Write about the weather today or your favourite season.",
        prompt: "Write 4-5 sentences about the weather. What is it like today? What is your favourite season and why?",
      },
    ],
  },
  {
    id: "il_16",
    title: "Hobbies",
    titleVi: "Sở thích",
    level: "a2",
    topic: "hobbies_and_leisure",
    steps: [
      {
        type: "vocab",
        title: "Hobby Words",
        content: "Learn these hobby and free time words.",
        words: [
          { en: "swimming", vi: "bơi lội" },
          { en: "painting", vi: "vẽ tranh" },
          { en: "hiking", vi: "đi bộ đường dài" },
          { en: "gardening", vi: "làm vườn" },
          { en: "spare time", vi: "thời gian rảnh" },
          { en: "team sport", vi: "thể thao đồng đội" },
        ],
      },
      {
        type: "listen",
        title: "Listen: After School",
        content: "Listen and answer the questions.",
        passage: "In my spare time, I do many things. On weekdays I go swimming after school. At weekends I enjoy hiking in the hills. My sister loves painting. We sometimes play team sports together on Sunday. We never get bored!",
        questions: [
          { q: "What does the speaker do after school?", options: ["hiking", "gardening", "swimming"], answer: 2 },
          { q: "What does the sister love?", options: ["swimming", "painting", "hiking"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: New Hobby",
        content: "Read and answer.",
        passage: "Last year, Linh started gardening as a new hobby. At first, she did not know what to do with her spare time. Now she grows tomatoes and flowers in her garden. She also joined a hiking club and meets new friends every weekend. She says hobbies make life more fun.",
        questions: [
          { q: "What new hobby did Linh start?", options: ["painting", "gardening", "swimming"], answer: 1 },
          { q: "What club did Linh join?", options: ["swimming club", "painting club", "hiking club"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Present Continuous",
        content: "We use present continuous for actions happening now or around now.",
        rule: "Subject + am/is/are + verb-ing. Example: I am reading a book. She is playing a team sport.",
        exercises: [
          { sentence: "He ___ in the pool right now.", blank: "___", options: ["swim", "is swimming", "swims"], answer: 1 },
          { sentence: "They ___ in the garden this afternoon.", blank: "___", options: ["are gardening", "gardening", "garden"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write About Your Hobby",
        content: "Write about what you do in your spare time.",
        prompt: "Write 4-5 sentences about your hobbies. When do you do them? Why do you enjoy them? Example: In my spare time I enjoy...",
      },
    ],
  },
  {
    id: "il_17",
    title: "Clothes",
    titleVi: "Quần áo",
    level: "a2",
    topic: "clothes_and_accessories",
    steps: [
      {
        type: "vocab",
        title: "Clothes Words",
        content: "Learn these clothes and shopping words.",
        words: [
          { en: "jacket", vi: "áo khoác" },
          { en: "trousers", vi: "quần dài" },
          { en: "try on", vi: "thử (quần áo)" },
          { en: "size", vi: "kích cỡ" },
          { en: "fitting room", vi: "phòng thử đồ" },
          { en: "fashion", vi: "thời trang" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Shopping for Clothes",
        content: "Listen and answer the questions.",
        passage: "Customer: Excuse me, can I try on this jacket? Shop assistant: Of course! The fitting room is over there. What size are you? Customer: I'm a medium. The jacket is nice but the trousers don't fit. Shop assistant: We have fashion items in many sizes. Let me find you a larger size.",
        questions: [
          { q: "What does the customer want to try on?", options: ["trousers", "a jacket", "a dress"], answer: 1 },
          { q: "What size is the customer?", options: ["small", "medium", "large"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Online Shopping",
        content: "Read and answer.",
        passage: "Many people now buy clothes online. It is easy to choose your size and add items to your cart. However, you cannot try on the clothes before buying. Some people order the wrong size and have to return them. It is important to check the size guide before you buy fashion items online.",
        questions: [
          { q: "What is a problem with buying clothes online?", options: ["They are expensive", "You cannot try them on", "The fashion is bad"], answer: 1 },
          { q: "What should you check before buying online?", options: ["the colour", "the size guide", "the fitting room"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Shopping Phrases!",
        content: "Practice shopping for clothes.",
        phrase: "Can I try this on, please? Do you have this in a larger size? Where is the fitting room?",
      },
      {
        type: "write",
        title: "Write About Shopping",
        content: "Write about a time you went shopping for clothes.",
        prompt: "Write 4-5 sentences about shopping for clothes. What did you buy? What size? Did you try it on? Use past tense.",
      },
    ],
  },
  {
    id: "il_18",
    title: "Feelings",
    titleVi: "Cảm xúc",
    level: "a2",
    topic: "feelings_and_opinions",
    steps: [
      {
        type: "vocab",
        title: "Feelings Words",
        content: "Learn these emotion and personality words.",
        words: [
          { en: "excited", vi: "hứng khởi / phấn khích" },
          { en: "nervous", vi: "lo lắng / hồi hộp" },
          { en: "proud", vi: "tự hào" },
          { en: "disappointed", vi: "thất vọng" },
          { en: "confident", vi: "tự tin" },
          { en: "mood", vi: "tâm trạng" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Before the Exam",
        content: "Listen and answer the questions.",
        passage: "Hoa: How are you feeling before the exam? Tuan: I'm very nervous. I'm not confident at all. Hoa: Don't worry! You studied hard. You should feel proud. Tuan: What if I'm disappointed by my score? Hoa: Just do your best. I'm excited for both of us. Being in a good mood helps!",
        questions: [
          { q: "How does Tuan feel before the exam?", options: ["excited and proud", "nervous and not confident", "happy and relaxed"], answer: 1 },
          { q: "How does Hoa feel?", options: ["nervous", "disappointed", "excited"], answer: 2 },
        ],
      },
      {
        type: "read",
        title: "Read: A Big Day",
        content: "Read and answer.",
        passage: "Yesterday was Nam's first day at his new job. He felt very nervous in the morning but also excited. When he arrived, his colleagues were friendly and he became more confident. At the end of the day, his boss said he did well. Nam felt proud and his mood was great.",
        questions: [
          { q: "How did Nam feel in the morning?", options: ["confident and proud", "nervous and excited", "disappointed and sad"], answer: 1 },
          { q: "How did Nam feel at the end of the day?", options: ["nervous", "disappointed", "proud"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Adjectives after 'feel'",
        content: "We use adjectives (not adverbs) after the verb 'feel'.",
        rule: "Subject + feel/feels + adjective. Example: I feel nervous. She feels confident. They felt disappointed.",
        exercises: [
          { sentence: "He ___ very proud after winning.", blank: "___", options: ["feel", "feels", "feeling"], answer: 1 },
          { sentence: "They ___ nervous before the exam.", blank: "___", options: ["feels", "feel", "felt"], answer: 2 },
        ],
      },
      {
        type: "write",
        title: "Write About a Feeling",
        content: "Write about a time you had a strong feeling.",
        prompt: "Write 4-5 sentences about a time you felt excited, nervous, or proud. What happened? How did you feel? Why?",
      },
    ],
  },

  // ── B1 Lessons (il_19 – il_22) ──

  {
    id: "il_19",
    title: "Environment",
    titleVi: "Môi trường",
    level: "b1",
    topic: "environment",
    steps: [
      {
        type: "vocab",
        title: "Environment Words",
        content: "Learn these environment words.",
        words: [
          { en: "pollution", vi: "ô nhiễm" },
          { en: "recycling", vi: "tái chế" },
          { en: "renewable energy", vi: "năng lượng tái tạo" },
          { en: "deforestation", vi: "phá rừng" },
          { en: "carbon footprint", vi: "dấu chân carbon" },
          { en: "sustainable", vi: "bền vững" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Saving the Planet",
        content: "Listen and answer the questions.",
        passage: "The problem of pollution is getting worse every year. Deforestation destroys habitats and increases our carbon footprint. However, there are solutions. Many countries are switching to renewable energy. Recycling helps reduce waste. If we all make sustainable choices, we can protect the environment for future generations.",
        questions: [
          { q: "What does deforestation increase?", options: ["recycling", "carbon footprint", "renewable energy"], answer: 1 },
          { q: "What helps reduce waste?", options: ["deforestation", "pollution", "recycling"], answer: 2 },
        ],
      },
      {
        type: "read",
        title: "Read: A City Goes Green",
        content: "Read and answer.",
        passage: "The city of Da Nang has introduced several sustainable programmes. Solar panels now generate renewable energy for public buildings. Citizens are encouraged to reduce their carbon footprint by cycling instead of driving. A new recycling scheme means that less waste goes to landfill. Pollution levels have dropped by fifteen percent in three years.",
        questions: [
          { q: "How does Da Nang generate renewable energy?", options: ["wind turbines", "solar panels", "hydropower"], answer: 1 },
          { q: "By how much has pollution dropped?", options: ["five percent", "ten percent", "fifteen percent"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Say Your Opinion!",
        content: "Practice giving your opinion about the environment.",
        phrase: "I think recycling is very important. We should all reduce our carbon footprint to protect the environment.",
      },
      {
        type: "write",
        title: "Write About the Environment",
        content: "Write your opinion about an environmental issue.",
        prompt: "Write a short paragraph (5-6 sentences) about pollution or recycling. What is the problem? What can people do? Use words like 'should', 'must', and 'because'.",
      },
    ],
  },
  {
    id: "il_20",
    title: "Work & Career",
    titleVi: "Công việc và sự nghiệp",
    level: "b1",
    topic: "work_and_jobs",
    steps: [
      {
        type: "vocab",
        title: "Work Vocabulary",
        content: "Learn these work and career words.",
        words: [
          { en: "interview", vi: "phỏng vấn" },
          { en: "salary", vi: "lương" },
          { en: "colleague", vi: "đồng nghiệp" },
          { en: "promotion", vi: "thăng chức" },
          { en: "deadline", vi: "hạn chót" },
          { en: "remote work", vi: "làm việc từ xa" },
        ],
      },
      {
        type: "listen",
        title: "Listen: The Job Interview",
        content: "Listen and answer the questions.",
        passage: "Interviewer: Why do you want this position? Candidate: I am looking for a better salary and the chance of a promotion. I also enjoy working with colleagues in a team. Interviewer: Are you comfortable with remote work? Candidate: Yes, but I prefer the office. I always meet my deadlines and work hard under pressure.",
        questions: [
          { q: "What two things is the candidate looking for?", options: ["salary and promotion", "remote work and deadline", "colleagues and office"], answer: 0 },
          { q: "What does the candidate always meet?", options: ["colleagues", "deadlines", "interviews"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: The Modern Workplace",
        content: "Read and answer.",
        passage: "The modern workplace has changed significantly. Remote work is now common, allowing people to work from home and avoid long commutes. Many employees value a good salary but also a positive relationship with their colleagues. Companies that offer promotion opportunities and flexible deadlines tend to keep their staff for longer.",
        questions: [
          { q: "What does remote work allow people to do?", options: ["earn more salary", "work from home", "get a promotion"], answer: 1 },
          { q: "What helps companies keep staff longer?", options: ["strict deadlines", "promotion opportunities", "remote interviews"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Present Perfect",
        content: "We use present perfect to talk about past experiences relevant to now.",
        rule: "Subject + have/has + past participle. Example: I have worked here for three years. She has received a promotion.",
        exercises: [
          { sentence: "He ___ for this company since 2020.", blank: "___", options: ["works", "has worked", "worked"], answer: 1 },
          { sentence: "They ___ three job interviews this week.", blank: "___", options: ["have had", "had", "has had"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write About a Job",
        content: "Write about your job or a job you would like.",
        prompt: "Write a paragraph (5-6 sentences) about your current or dream job. What are the responsibilities? What is the salary like? Do you work with colleagues? Use present perfect where possible.",
      },
    ],
  },
  {
    id: "il_21",
    title: "Education",
    titleVi: "Giáo dục",
    level: "b1",
    topic: "education",
    steps: [
      {
        type: "vocab",
        title: "Education Words",
        content: "Learn these education and university words.",
        words: [
          { en: "lecture", vi: "bài giảng" },
          { en: "assignment", vi: "bài tập / nhiệm vụ" },
          { en: "campus", vi: "khuôn viên trường" },
          { en: "scholarship", vi: "học bổng" },
          { en: "graduate", vi: "tốt nghiệp" },
          { en: "tuition fee", vi: "học phí" },
        ],
      },
      {
        type: "listen",
        title: "Listen: University Life",
        content: "Listen and answer the questions.",
        passage: "Going to university is a big step. Students attend lectures every day and complete many assignments. Campus life is exciting with clubs and activities. However, tuition fees can be very high. Many students apply for a scholarship to help pay for their studies. Most people feel proud when they finally graduate.",
        questions: [
          { q: "What can be very high at university?", options: ["campus size", "tuition fees", "lecture time"], answer: 1 },
          { q: "How do many students pay for studies?", options: ["with a scholarship", "by working on campus", "with assignments"], answer: 0 },
        ],
      },
      {
        type: "read",
        title: "Read: Study Abroad",
        content: "Read and answer.",
        passage: "Studying abroad is a popular choice for Vietnamese students. Living on a foreign campus improves language skills quickly. Students attend lectures in English and write assignments in their second language. Although tuition fees abroad can be high, many scholarships are available. Students who graduate abroad often find better job opportunities.",
        questions: [
          { q: "What does living on a foreign campus improve?", options: ["cooking skills", "language skills", "scholarship chances"], answer: 1 },
          { q: "What helps students afford studying abroad?", options: ["part-time lectures", "scholarships", "cheaper tuition fees"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Talk About Studies!",
        content: "Practice talking about your education.",
        phrase: "I am studying at university. I attend lectures three times a week and I have a lot of assignments.",
      },
      {
        type: "write",
        title: "Write About Education",
        content: "Write about your education or study goals.",
        prompt: "Write a paragraph (5-6 sentences) about your studies. What do you study? What are the challenges (e.g. tuition fees, assignments)? Would you like to study abroad?",
      },
    ],
  },
  {
    id: "il_22",
    title: "Communication",
    titleVi: "Giao tiếp và công nghệ",
    level: "b1",
    topic: "communication_and_technology",
    steps: [
      {
        type: "vocab",
        title: "Tech & Comms Words",
        content: "Learn these communication and technology words.",
        words: [
          { en: "social media", vi: "mạng xã hội" },
          { en: "upload", vi: "tải lên" },
          { en: "influencer", vi: "người có ảnh hưởng" },
          { en: "bandwidth", vi: "băng thông" },
          { en: "connection", vi: "kết nối" },
          { en: "privacy", vi: "quyền riêng tư" },
        ],
      },
      {
        type: "listen",
        title: "Listen: Social Media Debate",
        content: "Listen and answer the questions.",
        passage: "Student A: Social media has changed the way we communicate. Influencers can upload content and reach millions of people instantly. Student B: But there are serious privacy risks. Many apps collect personal data without permission. Student A: True, but a strong internet connection and good bandwidth make it easy to stay informed. We just need better privacy rules.",
        questions: [
          { q: "What can influencers do on social media?", options: ["upload content and reach millions", "protect privacy", "improve bandwidth"], answer: 0 },
          { q: "What concern does Student B raise?", options: ["slow bandwidth", "privacy risks", "bad connection"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: The Internet Age",
        content: "Read and answer.",
        passage: "The internet has transformed communication worldwide. Social media platforms allow people to upload photos, share news, and connect instantly. Influencers now shape public opinion. However, privacy remains a key concern as companies collect user data. Without a reliable connection and sufficient bandwidth, many people are left out of this digital world.",
        questions: [
          { q: "How do social media platforms allow people to connect?", options: ["through bandwidth only", "instantly", "by protecting privacy"], answer: 1 },
          { q: "What remains a key concern online?", options: ["influencers", "connection speed", "privacy"], answer: 2 },
        ],
      },
      {
        type: "grammar",
        title: "Reported Speech (statements)",
        content: "We use reported speech to tell someone what another person said.",
        rule: "Direct: She said, 'I upload videos every day.' Reported: She said that she uploaded videos every day. (Tense shifts back.)",
        exercises: [
          { sentence: "He said that he ___ social media every morning.", blank: "___", options: ["check", "checked", "checking"], answer: 1 },
          { sentence: "She said she ___ worried about her privacy.", blank: "___", options: ["was", "is", "were"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write About Social Media",
        content: "Write your opinion on social media.",
        prompt: "Write a paragraph (5-6 sentences) about social media. What are the benefits? What are the risks (privacy, influencers)? Do you use it? Use reported speech at least once.",
      },
    ],
  },

  // ── B2 Lessons (il_23 – il_26) ──

  {
    id: "il_23",
    title: "Society",
    titleVi: "Xã hội",
    level: "b2",
    topic: "society_and_community",
    steps: [
      {
        type: "vocab",
        title: "Society Words",
        content: "Learn these social issues vocabulary.",
        words: [
          { en: "inequality", vi: "bất bình đẳng" },
          { en: "discrimination", vi: "phân biệt đối xử" },
          { en: "poverty", vi: "đói nghèo" },
          { en: "welfare", vi: "phúc lợi xã hội" },
          { en: "integration", vi: "hội nhập" },
          { en: "civic duty", vi: "nghĩa vụ công dân" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Community Forum",
        content: "Listen and answer the questions.",
        passage: "Speaker: Our community faces growing inequality and poverty. Discrimination continues to prevent many people from accessing education and jobs. We must strengthen welfare systems and promote integration so that everyone has equal opportunities. Participation in civic duty — such as voting and volunteering — is essential to creating a fair society.",
        questions: [
          { q: "What prevents people from accessing education and jobs?", options: ["poverty", "discrimination", "welfare"], answer: 1 },
          { q: "What does the speaker say is essential?", options: ["integration only", "civic duty", "discrimination"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Bridging the Gap",
        content: "Read and answer.",
        passage: "Social inequality remains one of the most complex challenges facing modern societies. Despite advances in welfare provision and anti-discrimination legislation, poverty persists in both urban and rural areas. Successful integration of marginalised groups requires sustained government investment and active civic duty from citizens. Without collective action, inequality is likely to deepen.",
        questions: [
          { q: "What does successful integration require?", options: ["discrimination laws alone", "government investment and civic action", "welfare reduction"], answer: 1 },
          { q: "What happens without collective action?", options: ["inequality decreases", "welfare improves", "inequality deepens"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Share Your View!",
        content: "Practice expressing your opinion on a social issue.",
        phrase: "In my opinion, reducing inequality requires both stronger welfare systems and greater civic participation from all members of society.",
      },
      {
        type: "write",
        title: "Write About a Social Issue",
        content: "Write a structured opinion paragraph about a social issue.",
        prompt: "Choose one issue: inequality, poverty, or discrimination. Write a paragraph (6-8 sentences) explaining the problem, its causes, and at least two solutions. Use formal vocabulary.",
      },
    ],
  },
  {
    id: "il_24",
    title: "Science",
    titleVi: "Khoa học",
    level: "b2",
    topic: "science_and_research",
    steps: [
      {
        type: "vocab",
        title: "Science Words",
        content: "Learn these science and research words.",
        words: [
          { en: "hypothesis", vi: "giả thuyết" },
          { en: "experiment", vi: "thí nghiệm" },
          { en: "peer review", vi: "phản biện đồng nghiệp" },
          { en: "breakthrough", vi: "đột phá" },
          { en: "evidence", vi: "bằng chứng" },
          { en: "methodology", vi: "phương pháp luận" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Research Discovery",
        content: "Listen and answer the questions.",
        passage: "Scientists at a university announced a major breakthrough this week. Their experiment began with a simple hypothesis about cancer cell behaviour. After years of research, the evidence was overwhelming. Their methodology was rigorous and the findings passed peer review. The discovery could lead to new treatments within a decade.",
        questions: [
          { q: "What was the breakthrough about?", options: ["cancer cell behaviour", "a new methodology", "peer review processes"], answer: 0 },
          { q: "What confirmed the findings were valid?", options: ["the hypothesis", "peer review", "the experiment alone"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: The Scientific Method",
        content: "Read and answer.",
        passage: "The scientific method is the foundation of all research. A scientist begins with a hypothesis and designs an experiment to test it. The methodology must be clear and repeatable. Results are analysed and the evidence is compared with existing knowledge. Before findings are accepted, they undergo peer review to ensure accuracy. Breakthroughs only become widely accepted after this rigorous process.",
        questions: [
          { q: "What must be clear and repeatable?", options: ["the hypothesis", "the methodology", "the breakthrough"], answer: 1 },
          { q: "What happens before findings are widely accepted?", options: ["they are published immediately", "they undergo peer review", "a new experiment begins"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Passive Voice (academic)",
        content: "Academic writing heavily uses passive voice to emphasise findings over researchers.",
        rule: "Be + past participle. Example: The experiment was conducted over three years. The evidence has been reviewed by experts.",
        exercises: [
          { sentence: "The hypothesis ___ by two independent labs.", blank: "___", options: ["tested", "was tested", "is testing"], answer: 1 },
          { sentence: "New evidence ___ in the latest peer review.", blank: "___", options: ["has been found", "find", "found"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write About a Discovery",
        content: "Describe a scientific discovery you find interesting.",
        prompt: "Write a paragraph (6-8 sentences) about a scientific discovery or experiment. Explain the hypothesis, methodology, and what evidence was found. Use passive voice at least twice.",
      },
    ],
  },
  {
    id: "il_25",
    title: "Entertainment",
    titleVi: "Giải trí",
    level: "b2",
    topic: "entertainment_and_media",
    steps: [
      {
        type: "vocab",
        title: "Entertainment Words",
        content: "Learn these film and music review words.",
        words: [
          { en: "narrative", vi: "cốt truyện / tường thuật" },
          { en: "soundtrack", vi: "nhạc phim" },
          { en: "critique", vi: "phê bình" },
          { en: "plot twist", vi: "tình tiết bất ngờ" },
          { en: "genre", vi: "thể loại" },
          { en: "streaming", vi: "xem trực tuyến" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Film Review",
        content: "Listen and answer the questions.",
        passage: "Critic: This film is a masterpiece of the thriller genre. The narrative keeps you on edge from start to finish. The plot twist in the final act is genuinely shocking. The soundtrack perfectly supports the tension. While some critics offered a harsh critique of the slow opening, streaming audiences gave it an average of 4.8 stars.",
        questions: [
          { q: "What genre is the film?", options: ["comedy", "thriller", "romance"], answer: 1 },
          { q: "What did some critics dislike?", options: ["the soundtrack", "the plot twist", "the slow opening"], answer: 2 },
        ],
      },
      {
        type: "read",
        title: "Read: The Rise of Streaming",
        content: "Read and answer.",
        passage: "The rise of streaming platforms has fundamentally changed the entertainment industry. Films and series from every genre are now available instantly. Critics argue that the sheer volume of content makes it harder to deliver a strong narrative. However, streaming has also enabled independent creators to reach global audiences without needing major studio backing. The best productions combine compelling plot twists, memorable soundtracks, and thoughtful critique of society.",
        questions: [
          { q: "What has streaming enabled independent creators to do?", options: ["earn more money", "reach global audiences", "avoid critique"], answer: 1 },
          { q: "What do critics argue about streaming content?", options: ["it lacks genre variety", "there is too much to maintain quality narratives", "soundtracks are poor"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Give a Review!",
        content: "Practice reviewing a film or song.",
        phrase: "I recently watched a thriller on a streaming platform. The narrative was gripping and the plot twist completely surprised me.",
      },
      {
        type: "write",
        title: "Write a Review",
        content: "Write a film or music review.",
        prompt: "Write a review (6-8 sentences) of a film or album. Include: genre, narrative or themes, soundtrack or plot twists, and your overall critique. Use formal vocabulary.",
      },
    ],
  },
  {
    id: "il_26",
    title: "Travel",
    titleVi: "Du lịch",
    level: "b2",
    topic: "travel_and_transport",
    steps: [
      {
        type: "vocab",
        title: "Travel Words",
        content: "Learn these cultural travel and airport words.",
        words: [
          { en: "itinerary", vi: "lịch trình chuyến đi" },
          { en: "customs", vi: "hải quan" },
          { en: "departure lounge", vi: "phòng chờ sân bay" },
          { en: "cultural immersion", vi: "đắm chìm vào văn hóa" },
          { en: "jet lag", vi: "chứng lệch múi giờ" },
          { en: "visa", vi: "thị thực" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Long-Haul Flight",
        content: "Listen and answer the questions.",
        passage: "Traveller: I finally have my visa and my itinerary is ready. I'll be flying to Japan tomorrow. The flight departs from the international departure lounge at midnight. I'm prepared to deal with jet lag when I arrive. I'm especially excited about cultural immersion — eating local food and visiting temples. I hope customs won't take too long.",
        questions: [
          { q: "Where is the traveller flying to?", options: ["Korea", "Japan", "China"], answer: 1 },
          { q: "What is the traveller most excited about?", options: ["the departure lounge", "cultural immersion", "getting a visa"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Responsible Tourism",
        content: "Read and answer.",
        passage: "Modern travellers are increasingly concerned about the impact of tourism on local communities. Cultural immersion — staying in local homes and learning the language — is seen as a more respectful alternative to mass tourism. Travellers should research visa requirements and customs regulations before departure. Managing jet lag through hydration and sleep adjustment ensures a more enjoyable trip.",
        questions: [
          { q: "What is seen as a respectful alternative to mass tourism?", options: ["visiting departure lounges", "cultural immersion", "dealing with customs quickly"], answer: 1 },
          { q: "How can travellers manage jet lag?", options: ["by flying business class", "through hydration and sleep adjustment", "by planning a detailed itinerary"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Future Forms (will / going to / present continuous)",
        content: "We use different forms to talk about future travel plans.",
        rule: "Going to: planned decisions. Will: spontaneous decisions/predictions. Present continuous: fixed arrangements. Example: I'm flying to Tokyo tomorrow. I think I'll visit Kyoto too.",
        exercises: [
          { sentence: "We ___ the museum tomorrow — it's already booked.", blank: "___", options: ["are visiting", "visit", "visited"], answer: 0 },
          { sentence: "I think she ___ get over her jet lag quickly.", blank: "___", options: ["will", "is going to", "has"], answer: 0 },
        ],
      },
      {
        type: "write",
        title: "Write Your Travel Plan",
        content: "Write about a trip you are planning or dream of taking.",
        prompt: "Write a paragraph (6-8 sentences) about a planned or dream trip. Include: destination, itinerary highlights, how you will manage customs/visa/jet lag, and what cultural immersion you hope for. Use at least two future forms.",
      },
    ],
  },

  // ── C1 Lessons (il_27 – il_28) ──

  {
    id: "il_27",
    title: "Academic Writing",
    titleVi: "Viết học thuật",
    level: "c1",
    topic: "science_and_research",
    steps: [
      {
        type: "vocab",
        title: "Academic Language",
        content: "Learn these academic writing and research words.",
        words: [
          { en: "thesis statement", vi: "luận điểm chính" },
          { en: "counterargument", vi: "lập luận phản biện" },
          { en: "empirical", vi: "dựa trên thực nghiệm" },
          { en: "synthesise", vi: "tổng hợp" },
          { en: "citation", vi: "trích dẫn" },
          { en: "rhetorical", vi: "thuộc về hùng biện" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Research Seminar",
        content: "Listen and answer the questions.",
        passage: "Professor: A strong academic essay begins with a clear thesis statement. You must synthesise empirical evidence from multiple sources and cite each one correctly using a recognised citation format. Anticipate counterarguments and address them with logical rebuttals. Rhetorical strategies, such as ethos and pathos, can strengthen your argument when used judiciously. The goal is precision, not verbosity.",
        questions: [
          { q: "What must students do with empirical evidence?", options: ["ignore counterarguments", "synthesise and cite it", "use rhetorical questions only"], answer: 1 },
          { q: "What is the professor's stated goal for academic writing?", options: ["verbosity", "precision", "rhetoric"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: The Crisis of Reproducibility",
        content: "Read and answer.",
        passage: "A significant challenge facing contemporary science is the reproducibility crisis: a large proportion of empirical studies cannot be replicated by independent researchers. Critics argue that weak thesis statements, poor methodology, and selective citation of evidence contribute to this problem. To restore trust, journals are now requiring open data and pre-registration of hypotheses. Synthesising evidence from multiple studies — known as meta-analysis — has emerged as a more robust rhetorical and empirical tool. Addressing counterarguments transparently remains essential to credible scholarship.",
        questions: [
          { q: "What is the reproducibility crisis?", options: ["a lack of citations", "studies that cannot be replicated", "poor rhetorical writing"], answer: 1 },
          { q: "What method synthesises evidence from multiple studies?", options: ["pre-registration", "meta-analysis", "open citation"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Defend Your Argument!",
        content: "Practice presenting and defending an academic argument.",
        phrase: "My thesis statement argues that empirical evidence strongly supports this claim. However, I acknowledge the counterargument that further research is needed.",
      },
      {
        type: "write",
        title: "Write an Academic Paragraph",
        content: "Write a structured academic paragraph on a research topic.",
        prompt: "Write a well-structured academic paragraph (8-10 sentences) on a topic of your choice. Include: a clear thesis statement, at least two pieces of empirical evidence with citations, one counterargument and rebuttal, and rhetorical coherence. Synthesise your sources rather than listing them.",
      },
    ],
  },
  {
    id: "il_28",
    title: "Global Issues",
    titleVi: "Vấn đề toàn cầu",
    level: "c1",
    topic: "society_and_community",
    steps: [
      {
        type: "vocab",
        title: "Global Issues Vocabulary",
        content: "Learn these global issues and policy words.",
        words: [
          { en: "geopolitical", vi: "địa chính trị" },
          { en: "systemic", vi: "mang tính hệ thống" },
          { en: "mitigation", vi: "giảm thiểu" },
          { en: "disproportionate", vi: "không cân xứng" },
          { en: "accountability", vi: "trách nhiệm giải trình" },
          { en: "multilateral", vi: "đa phương" },
        ],
      },
      {
        type: "listen",
        title: "Listen: A Policy Panel",
        content: "Listen and answer the questions.",
        passage: "Panellist A: Climate change is not merely an environmental issue — it is a geopolitical crisis. Its consequences are disproportionate: poorer nations suffer most despite contributing least. Panellist B: Agreed. Systemic inequality means mitigation efforts are underfunded. We need multilateral agreements with genuine accountability mechanisms, not vague pledges. Panellist A: Without enforceable commitments, wealthy states will continue to externalise the costs of their emissions.",
        questions: [
          { q: "Who suffers most from climate change according to Panellist A?", options: ["wealthy states", "poorer nations", "multilateral organisations"], answer: 1 },
          { q: "What does Panellist B say mitigation efforts lack?", options: ["accountability", "funding", "geopolitical support"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Inequality in the Anthropocene",
        content: "Read and answer.",
        passage: "The Anthropocene epoch is defined by humanity's disproportionate impact on planetary systems. Systemic economic inequality determines which populations are most exposed to climate risk, and which have the resources for mitigation and adaptation. Geopolitical rivalries frequently undermine multilateral efforts to address these intertwined crises. Meaningful accountability requires that states — particularly high-emission economies — accept binding obligations rather than voluntary targets. Critics argue that without structural reform, climate agreements reproduce the very inequalities they claim to address.",
        questions: [
          { q: "What determines exposure to climate risk according to the passage?", options: ["geopolitical rivalry", "systemic economic inequality", "multilateral agreements"], answer: 1 },
          { q: "What do critics argue climate agreements risk reproducing?", options: ["mitigation strategies", "the very inequalities they claim to address", "binding obligations"], answer: 1 },
        ],
      },
      {
        type: "grammar",
        title: "Concession Clauses (advanced)",
        content: "Sophisticated arguments use concession clauses to acknowledge complexity.",
        rule: "Although / Even though / While / Despite + clause or noun phrase. Example: Although mitigation is costly, the long-term benefits are undeniable. Despite multilateral agreements, systemic inequality persists.",
        exercises: [
          { sentence: "___ wealthy nations contribute most to emissions, they rarely bear the worst consequences.", blank: "___", options: ["Despite", "Although", "Because"], answer: 1 },
          { sentence: "___ their pledges, accountability mechanisms remain weak.", blank: "___", options: ["Although", "Despite", "Even though"], answer: 1 },
        ],
      },
      {
        type: "write",
        title: "Write on a Global Issue",
        content: "Write a sophisticated analytical paragraph on climate and inequality.",
        prompt: "Write an analytical paragraph (8-10 sentences) on either climate change or global inequality. Incorporate: geopolitical context, systemic causes, mitigation strategies, accountability mechanisms, and at least two concession clauses. Aim for precision and nuance — avoid unsupported generalisations.",
      },
    ],
  },
  // ── Kids Lessons (Pre-A1) ──
  {
    id: "il_29",
    title: "My ABC",
    titleVi: "Bảng chữ cái của con",
    level: "kids",
    topic: "education",
    steps: [
      {
        type: "vocab",
        title: "School Words",
        content: "Learn these school words.",
        words: [
          { en: "book", vi: "quyển sách" },
          { en: "pen", vi: "cây bút" },
          { en: "school", vi: "trường học" },
          { en: "teacher", vi: "cô giáo / thầy giáo" },
          { en: "bag", vi: "cái túi / cặp sách" },
          { en: "desk", vi: "cái bàn học" },
        ],
      },
      {
        type: "listen",
        title: "Listen: At School",
        content: "Listen and answer the questions.",
        passage: "My name is Lily. I go to school. I have a bag. In my bag I have a book and a pen. My teacher is kind. I love school!",
        questions: [
          { q: "What is in Lily's bag?", options: ["a toy and a ball", "a book and a pen", "a cake and a cup"], answer: 1 },
          { q: "How is Lily's teacher?", options: ["sad", "kind", "tired"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: My Classroom",
        content: "Read and answer.",
        passage: "This is my classroom. I have a desk. My book is on the desk. My pen is red. My bag is blue. I like my school.",
        questions: [
          { q: "Where is the book?", options: ["in the bag", "on the desk", "on the floor"], answer: 1 },
          { q: "What color is the pen?", options: ["blue", "green", "red"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying this sentence.",
        phrase: "I have a book and a pen.",
      },
      {
        type: "write",
        title: "Write School Words",
        content: "Copy these words in your notebook.",
        prompt: "Write these words: book, pen, bag, school. Example: This is my book.",
      },
    ],
  },
  {
    id: "il_30",
    title: "Colors & Shapes",
    titleVi: "Màu sắc và hình dạng",
    level: "kids",
    topic: "colours_and_shapes",
    steps: [
      {
        type: "vocab",
        title: "Colors and Shapes",
        content: "Learn these color and shape words.",
        words: [
          { en: "red", vi: "màu đỏ" },
          { en: "blue", vi: "màu xanh dương" },
          { en: "yellow", vi: "màu vàng" },
          { en: "circle", vi: "hình tròn" },
          { en: "square", vi: "hình vuông" },
          { en: "star", vi: "ngôi sao" },
        ],
      },
      {
        type: "listen",
        title: "Listen: My Favorite Colors",
        content: "Listen and answer the questions.",
        passage: "I like colors! My favorite color is blue. The sky is blue. The sun is yellow. An apple is red. I can draw a big red circle and a yellow star.",
        questions: [
          { q: "What is the child's favorite color?", options: ["red", "yellow", "blue"], answer: 2 },
          { q: "What color is the sun?", options: ["red", "yellow", "blue"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Shapes Around Us",
        content: "Read and answer.",
        passage: "Look around you! The sun is a circle. A box is a square. A cookie can be a star. I can see red, blue, and yellow things. Colors and shapes are fun!",
        questions: [
          { q: "What shape is the sun?", options: ["square", "star", "circle"], answer: 2 },
          { q: "What shape can a cookie be?", options: ["circle", "star", "square"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying this sentence.",
        phrase: "I see a big red circle.",
      },
      {
        type: "write",
        title: "Write Colors",
        content: "Copy these color words.",
        prompt: "Write these words: red, blue, yellow, green. Example: The apple is red.",
      },
    ],
  },
  {
    id: "il_31",
    title: "Animals I Know",
    titleVi: "Các con vật con biết",
    level: "kids",
    topic: "animals_and_nature",
    steps: [
      {
        type: "vocab",
        title: "Animal Words",
        content: "Learn these animal words.",
        words: [
          { en: "cat", vi: "con mèo" },
          { en: "dog", vi: "con chó" },
          { en: "bird", vi: "con chim" },
          { en: "fish", vi: "con cá" },
          { en: "rabbit", vi: "con thỏ" },
          { en: "duck", vi: "con vịt" },
        ],
      },
      {
        type: "listen",
        title: "Listen: My Pets",
        content: "Listen and answer the questions.",
        passage: "I have two pets. I have a cat and a fish. My cat is black. My fish is orange. I love my cat. It is soft and cute. My fish lives in a bowl.",
        questions: [
          { q: "What color is the cat?", options: ["orange", "black", "white"], answer: 1 },
          { q: "Where does the fish live?", options: ["in a box", "in a bowl", "in a bag"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: Animals on the Farm",
        content: "Read and answer.",
        passage: "On the farm there are many animals. I can see a dog, a duck, and a rabbit. The dog says woof! The duck says quack! The rabbit is white and soft. I like animals.",
        questions: [
          { q: "What does the dog say?", options: ["quack", "woof", "meow"], answer: 1 },
          { q: "What color is the rabbit?", options: ["black", "orange", "white"], answer: 2 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying this sentence.",
        phrase: "I have a cat. It is soft and cute.",
      },
      {
        type: "write",
        title: "Write Animal Names",
        content: "Copy these animal words.",
        prompt: "Write these words: cat, dog, bird, fish. Example: I see a dog.",
      },
    ],
  },
  {
    id: "il_32",
    title: "Yummy Food",
    titleVi: "Thức ăn ngon",
    level: "kids",
    topic: "food_and_drink",
    steps: [
      {
        type: "vocab",
        title: "Food Words",
        content: "Learn these food words.",
        words: [
          { en: "apple", vi: "quả táo" },
          { en: "milk", vi: "sữa" },
          { en: "cake", vi: "bánh ngọt" },
          { en: "banana", vi: "quả chuối" },
          { en: "water", vi: "nước" },
          { en: "egg", vi: "quả trứng" },
        ],
      },
      {
        type: "listen",
        title: "Listen: My Lunch",
        content: "Listen and answer the questions.",
        passage: "It is lunchtime! I am hungry. I eat rice and an egg. I drink milk. My mom gives me a banana. It is sweet and yummy! I love lunch.",
        questions: [
          { q: "What does the child drink?", options: ["water", "juice", "milk"], answer: 2 },
          { q: "What does mom give the child?", options: ["cake", "banana", "apple"], answer: 1 },
        ],
      },
      {
        type: "read",
        title: "Read: My Favorite Food",
        content: "Read and answer.",
        passage: "I like fruit. I eat an apple every day. Apples are red. I also like bananas. Bananas are yellow and sweet. I drink water with my food. Water is good for me!",
        questions: [
          { q: "What color are apples?", options: ["yellow", "green", "red"], answer: 2 },
          { q: "What do apples and bananas have in common?", options: ["they are both vegetables", "they are both fruit", "they are both drinks"], answer: 1 },
        ],
      },
      {
        type: "speak",
        title: "Say It!",
        content: "Practice saying this sentence.",
        phrase: "I like apples. They are red and yummy.",
      },
      {
        type: "write",
        title: "Write Food Words",
        content: "Copy these food words.",
        prompt: "Write these words: apple, milk, cake, egg. Example: I eat an egg.",
      },
    ],
  },
];

// ── Level badge colors ──

const LEVEL_COLORS: Record<string, string> = {
  kids: "bg-pink-100 text-pink-700 border-pink-200",
  a1: "bg-green-100 text-green-700 border-green-200",
  a2: "bg-blue-100 text-blue-700 border-blue-200",
  b1: "bg-purple-100 text-purple-700 border-purple-200",
  b2: "bg-orange-100 text-orange-700 border-orange-200",
};

const STEP_ICONS: Record<StepType, typeof BookOpen> = {
  vocab: BookOpen,
  listen: Ear,
  read: BookOpen,
  grammar: GraduationCap,
  speak: Mic,
  write: PenLine,
};

const STEP_COLORS: Record<StepType, string> = {
  vocab: "bg-amber-500",
  listen: "bg-blue-500",
  read: "bg-green-500",
  grammar: "bg-rose-500",
  speak: "bg-teal-500",
  write: "bg-violet-500",
};

// ── Props ──

interface Props {
  student: Student;
  onBackHome: () => void;
}

// ── Component ──

export function IntegratedLessonPage({ student, onBackHome }: Props) {
  const [selectedLesson, setSelectedLesson] = useState<IntegratedLesson | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stepScores, setStepScores] = useState<Record<number, number>>({});

  // Filter lessons appropriate for student level
  const filteredLessons = useMemo(() => {
    const levelOrder = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const studentIdx = levelOrder.indexOf(student.level);
    if (studentIdx < 0) return LESSONS; // show all if level not in list
    return LESSONS.filter((l) => {
      const li = levelOrder.indexOf(l.level);
      return li >= 0 && li <= studentIdx + 1; // show current level and one above
    });
  }, [student.level]);

  const startLesson = useCallback((lesson: IntegratedLesson) => {
    setSelectedLesson(lesson);
    setStepIndex(0);
    setCompleted(false);
    setStepScores({});
  }, []);

  const nextStep = useCallback((score?: number) => {
    if (!selectedLesson) return;
    if (score !== undefined) {
      setStepScores((prev) => ({ ...prev, [stepIndex]: score }));
    }
    if (stepIndex < selectedLesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setCompleted(true);
      // Save result to DB
      const allScores = { ...stepScores, ...(score !== undefined ? { [stepIndex]: score } : {}) };
      const scored = Object.values(allScores);
      const avg = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0;
      import("@/services/api").then(({ apiRequest }) => {
        apiRequest(`/api/students/${student.id}/word-progress`, {
          method: "POST",
          body: { wordId: `il_${selectedLesson.id}`, skill: "reading", correct: avg >= 60, sourceType: "core", sourceRef: selectedLesson.title },
        }).catch(() => {});
      });
    }
  }, [selectedLesson, stepIndex, stepScores, student.id]);

  const exitLesson = useCallback(() => {
    setSelectedLesson(null);
    setStepIndex(0);
    setCompleted(false);
    setStepScores({});
  }, []);

  // ── Lesson list ──
  if (!selectedLesson) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40">
        <div className="px-4 pt-4 pb-6 space-y-4">
          <SessionHeader title="Bài học tích hợp" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBackHome} />

          <p className="text-sm text-muted-foreground">
            Mỗi bài kết hợp nhiều kỹ năng: Từ vựng, Nghe, Đọc, Ngữ pháp, Nói, Viết quanh 1 chủ đề.
          </p>

          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => startLesson(lesson)}
                className="w-full text-left"
              >
                <Card className="transition-all hover:shadow-lg active:scale-[0.98]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1.5 pt-0.5">
                        <span className={cn("rounded-lg border px-2 py-0.5 text-xs font-black uppercase", LEVEL_COLORS[lesson.level] || "bg-gray-100 text-gray-600")}>
                          {lesson.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-extrabold truncate">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground">{lesson.titleVi}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {lesson.steps.map((step, i) => {
                            const Icon = STEP_ICONS[step.type];
                            return (
                              <span key={i} className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white", STEP_COLORS[step.type])}>
                                <Icon className="h-3 w-3" />
                                {step.type}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-muted-foreground">{lesson.steps.length} bước</span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Completion screen ──
  if (completed) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40">
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
          {(() => {
            const scored = Object.values(stepScores);
            const avg = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 100;
            const grade = avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B" : avg >= 60 ? "C" : avg >= 50 ? "D" : "F";
            const gc = avg >= 80 ? "text-green-600" : avg >= 60 ? "text-amber-600" : "text-red-600";
            const rc = avg >= 80 ? "border-green-500" : avg >= 60 ? "border-amber-500" : "border-red-500";
            return (
              <div className={cn("flex h-24 w-24 items-center justify-center rounded-full border-4", rc)}>
                <div className="text-center">
                  <p className={cn("text-2xl font-black", gc)}>{grade}</p>
                  <p className="text-xs font-bold text-muted-foreground">{avg}%</p>
                </div>
              </div>
            );
          })()}
          <h2 className="text-2xl font-black">Hoàn thành!</h2>
          <p className="text-muted-foreground">Bài <span className="font-bold text-foreground">{selectedLesson.title}</span></p>
          <div className="rounded-2xl border border-border/60 bg-muted/50 p-4 w-full max-w-xs">
            <p className="text-sm font-bold mb-2">Chi tiết:</p>
            <ul className="space-y-1.5 text-sm text-left">
              {selectedLesson.steps.map((step, i) => {
                const s = stepScores[i];
                return (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="truncate">{step.title}</span>
                    </div>
                    {s !== undefined && (
                      <span className={cn("text-xs font-bold", s >= 80 ? "text-green-600" : s >= 60 ? "text-amber-600" : "text-red-600")}>{s}%</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exitLesson}>Danh sách bài</Button>
            <Button onClick={onBackHome}>Về trang chủ</Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Lesson player ──
  const step = selectedLesson.steps[stepIndex];
  const progressPct = Math.round(((stepIndex + 1) / selectedLesson.steps.length) * 100);
  const StepIcon = STEP_ICONS[step.type];

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40">
      <div className="px-4 pt-4 pb-6 space-y-4">
        <SessionHeader
          title={selectedLesson.title}
          icon={<StepIcon className="h-4 w-4" />}
          iconBg={STEP_COLORS[step.type]}
          onClose={exitLesson}
          progress={progressPct}
          right={<span className="text-xs font-bold text-muted-foreground">{stepIndex + 1}/{selectedLesson.steps.length}</span>}
        />

        <StepRenderer step={step} onNext={nextStep} />
      </div>
    </main>
  );
}

// ── Step Renderers ──

function StepRenderer({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  switch (step.type) {
    case "vocab": return <VocabStep step={step} onNext={() => onNext(100)} />;
    case "listen": return <ListenStep step={step} onNext={onNext} />;
    case "read": return <ReadStep step={step} onNext={onNext} />;
    case "grammar": return <GrammarStep step={step} onNext={onNext} />;
    case "speak": return <SpeakStep step={step} onNext={onNext} />;
    case "write": return <WriteStep step={step} onNext={onNext} />;
    default: return <div>Unknown step type</div>;
  }
}

// ── Vocab Step (flashcards) ──

function VocabStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const words = step.words || [];

  const currentWord = words[cardIndex];
  if (!currentWord) return null;

  const flip = () => setFlipped((f) => !f);
  const nextCard = () => {
    if (cardIndex < words.length - 1) {
      setCardIndex((i) => i + 1);
      setFlipped(false);
    }
  };
  const allSeen = cardIndex >= words.length - 1 && flipped;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      <button type="button" onClick={flip} className="w-full">
        <Card className="min-h-[180px] flex items-center justify-center transition-all hover:shadow-lg active:scale-[0.98]">
          <CardContent className="flex flex-col items-center gap-4 p-8 sm:p-10 text-center">
            {!flipped ? (
              <>
                <span className="text-3xl font-black">{currentWord.en}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); speakText(currentWord.en); }}
                  className="flex items-center gap-1 text-xs text-primary font-bold"
                >
                  <Volume2 className="h-4 w-4" /> Nghe
                </button>
                <span className="text-xs text-muted-foreground">Nhấn để xem nghĩa</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-primary">{currentWord.vi}</span>
                <span className="text-lg text-muted-foreground">{currentWord.en}</span>
              </>
            )}
          </CardContent>
        </Card>
      </button>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground">{cardIndex + 1} / {words.length}</span>
        {!allSeen ? (
          <Button size="sm" onClick={flipped ? nextCard : flip} disabled={!flipped && cardIndex >= words.length - 1}>
            {flipped ? "Từ tiếp" : "Lật"} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => onNext(100)}>
            Tiếp theo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Listen Step ──

function ListenStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const questions = step.questions || [];

  const playPassage = () => {
    if (step.passage) {
      speakText(step.passage);
      setPlayCount((c) => c + 1);
    }
  };

  const pick = (qi: number, oi: number) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const check = () => { setChecked(true); setShowText(true); };
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold flex items-center gap-2">
        <Ear className="h-5 w-5 text-blue-500" /> {step.title}
      </h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="p-5 text-center space-y-3">
          <button type="button" onClick={playPassage}
            className="flex items-center justify-center gap-2 mx-auto h-16 w-16 rounded-full bg-blue-500 text-white shadow-lg transition-all active:scale-95 hover:bg-blue-600">
            <Play className="h-7 w-7" />
          </button>
          <p className="text-xs font-bold text-blue-600">{playCount === 0 ? "Nhấn để nghe" : `Đã nghe ${playCount} lần`}</p>
          {!showText && playCount > 0 && (
            <button type="button" onClick={() => setShowText(true)}
              className="text-[10px] text-muted-foreground underline">Xem nội dung</button>
          )}
          {showText && step.passage && (
            <p className="font-reading text-sm leading-relaxed text-left border-l-2 border-blue-300 pl-3 text-muted-foreground mt-2">{step.passage}</p>
          )}
        </CardContent>
      </Card>

      {playCount > 0 && (
        <>
          {questions.map((q, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm font-bold">{q.q}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  const isCorrect = oi === q.answer;
                  let cls = "border-border";
                  if (checked && selected && isCorrect) cls = "border-green-500 bg-green-50";
                  else if (checked && selected && !isCorrect) cls = "border-red-500 bg-red-50";
                  else if (checked && isCorrect) cls = "border-green-300 bg-green-50/50";
                  else if (selected) cls = "border-primary bg-primary/5";
                  return (
                    <button key={oi} type="button" onClick={() => pick(qi, oi)}
                      className={cn("rounded-xl border-2 px-4 py-2.5 text-left text-sm font-semibold transition-all active:scale-[0.98]", cls)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-2">
            {!checked ? (
              <Button onClick={check} disabled={!allAnswered}>Kiểm tra</Button>
            ) : (
              <div className="flex items-center gap-3 w-full justify-between">
                <span className="text-sm font-bold">{score}/{questions.length} đúng</span>
                <Button onClick={() => onNext(questions.length ? Math.round(score / questions.length * 100) : 100)}>Tiếp theo <ArrowRight className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Read Step ──

function ReadStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const questions = step.questions || [];

  const pick = (qi: number, oi: number) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const check = () => setChecked(true);
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      <Card className="bg-amber-50/30 dark:bg-amber-950/10">
        <CardContent className="p-4 sm:p-5">
          <p className="font-reading text-sm lg:text-base leading-relaxed whitespace-pre-line">{step.passage}</p>
        </CardContent>
      </Card>

      {questions.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-sm font-bold">{q.q}</p>
          <div className="grid gap-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = oi === q.answer;
              let cls = "border-border";
              if (checked && selected && isCorrect) cls = "border-green-500 bg-green-50";
              else if (checked && selected && !isCorrect) cls = "border-red-500 bg-red-50";
              else if (checked && isCorrect) cls = "border-green-300 bg-green-50/50";
              else if (selected) cls = "border-primary bg-primary/5";
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => pick(qi, oi)}
                  className={cn("rounded-xl border-2 px-4 py-2.5 text-left text-sm font-semibold transition-all active:scale-[0.98]", cls)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        {!checked ? (
          <Button onClick={check} disabled={!allAnswered}>Kiểm tra</Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-sm font-bold">{score}/{questions.length} đúng</span>
            <Button onClick={() => onNext(questions.length ? Math.round(score / questions.length * 100) : 100)}>Tiếp theo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Grammar Step ──

function GrammarStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const exercises = step.exercises || [];

  const pick = (ei: number, oi: number) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [ei]: oi }));
  };

  const check = () => setChecked(true);
  const allAnswered = exercises.every((_, i) => answers[i] !== undefined);
  const score = exercises.filter((e, i) => answers[i] === e.answer).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      {step.rule && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <p className="text-sm font-semibold leading-relaxed">{step.rule}</p>
          </CardContent>
        </Card>
      )}

      {exercises.map((ex, ei) => (
        <div key={ei} className="space-y-2">
          <p className="text-sm font-bold">{ex.sentence}</p>
          <div className="grid grid-cols-3 gap-2">
            {ex.options.map((opt, oi) => {
              const selected = answers[ei] === oi;
              const isCorrect = oi === ex.answer;
              let cls = "border-border";
              if (checked && selected && isCorrect) cls = "border-green-500 bg-green-50";
              else if (checked && selected && !isCorrect) cls = "border-red-500 bg-red-50";
              else if (checked && isCorrect) cls = "border-green-300 bg-green-50/50";
              else if (selected) cls = "border-primary bg-primary/5";
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => pick(ei, oi)}
                  className={cn("rounded-xl border-2 px-3 py-2 text-center text-sm font-semibold transition-all active:scale-[0.98]", cls)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        {!checked ? (
          <Button onClick={check} disabled={!allAnswered}>Kiểm tra</Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-sm font-bold">{score}/{exercises.length} đúng</span>
            <Button onClick={() => onNext(exercises.length ? Math.round(score / exercises.length * 100) : 100)}>Tiếp theo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Speak Step ──

function SpeakStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [phase, setPhase] = useState<"idle" | "recording" | "scoring" | "result">("idle");
  const [score, setScore] = useState<number | null>(null);
  const phrase = step.phrase || "";
  const canMic = typeof window !== "undefined" && window.isSecureContext;
  const recorderRef = useRef<any>(null);

  const playPhrase = () => speakText(phrase);

  const startRecording = async () => {
    if (!canMic) return;
    setPhase("recording");
    setScore(null);
    try {
      const { startRecording: start } = await import("@/services/audioRecorder");
      recorderRef.current = await start();
    } catch {
      setPhase("idle");
    }
  };

  const stopAndScore = async () => {
    if (!recorderRef.current) { setPhase("idle"); return; }
    setPhase("scoring");
    try {
      const blob = await recorderRef.current.stop();
      const { assessPronunciation } = await import("@/services/pronunciationService");
      const result = await assessPronunciation(blob, phrase);
      setScore(result.score);
    } catch {
      setScore(null);
    }
    setPhase("result");
  };

  const verdict = score === null ? "Không chấm được" : score >= 80 ? "Xuất sắc!" : score >= 60 ? "Khá tốt!" : "Thử lại nhé!";
  const verdictColor = score === null ? "border-gray-300" : score >= 80 ? "border-green-500 bg-green-50" : score >= 60 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold flex items-center gap-2">
        <Mic className="h-5 w-5 text-teal-500" /> {step.title}
      </h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      <Card className="border-teal-200 bg-teal-50/30 dark:border-teal-800 dark:bg-teal-950/20">
        <CardContent className="p-5 text-center space-y-4">
          <p className="text-xl font-bold">{phrase}</p>
          <Button variant="outline" size="sm" onClick={playPhrase}>
            <Volume2 className="h-4 w-4" /> Nghe mẫu
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3">
        {phase === "idle" && (
          <>
            <button type="button" onClick={startRecording}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition-all active:scale-95 hover:bg-teal-600">
              <Mic className="h-7 w-7" />
            </button>
            <span className="text-xs text-muted-foreground">Nhấn để thu âm</span>
          </>
        )}
        {phase === "recording" && (
          <>
            <button type="button" onClick={stopAndScore}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg animate-pulse">
              <span className="h-6 w-6 rounded bg-white" />
            </button>
            <span className="text-xs font-bold text-red-500">Đang ghi âm... Nhấn để dừng</span>
          </>
        )}
        {phase === "scoring" && (
          <div className="flex flex-col items-center gap-2 py-4">
            <RotateCcw className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-bold text-muted-foreground">Đang chấm phát âm...</span>
          </div>
        )}
        {phase === "result" && (
          <>
            <div className={cn("w-full rounded-xl border-2 p-4 text-center", verdictColor)}>
              {score !== null && (
                <p className="text-3xl font-black mb-1">{score}%</p>
              )}
              <p className="text-sm font-bold">{verdict}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setPhase("idle"); setScore(null); }}>
              <RotateCcw className="h-4 w-4" /> Thử lại
            </Button>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onNext(score ?? undefined)}>Tiếp theo <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

// ── Write Step ──

function WriteStep({ step, onNext }: { step: LessonStep; onNext: (score?: number) => void }) {
  const [text, setText] = useState("");
  const [grading, setGrading] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; corrections: string[] } | null>(null);

  const gradeWriting = async () => {
    if (text.trim().length < 3) return;
    setGrading(true);
    try {
      const { apiRequest } = await import("@/services/api");
      const result = await apiRequest<{ score: number; feedback: string; corrections: string[] }>("/api/grade-writing", {
        method: "POST",
        body: { text: text.trim(), prompt: step.prompt || step.content, level: "a1" },
      });
      setFeedback(result);
    } catch {
      setFeedback({ score: 0, feedback: "Không thể chấm bài. Vui lòng thử lại.", corrections: [] });
    }
    setGrading(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold flex items-center gap-2">
        <PenLine className="h-5 w-5 text-violet-500" /> {step.title}
      </h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      {step.prompt && (
        <Card className="border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/30">
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm lg:text-base font-semibold leading-relaxed">{step.prompt}</p>
          </CardContent>
        </Card>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Viết câu trả lời của bạn ở đây..."
        rows={5}
        className="w-full rounded-xl border-2 border-border bg-background p-4 text-sm focus:border-primary focus:outline-none resize-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{wordCount} từ</span>
        {!feedback ? (
          <Button onClick={gradeWriting} disabled={wordCount < 3 || grading}>
            {grading ? <><RotateCcw className="h-4 w-4 animate-spin" /> Đang chấm...</> : <><CheckCircle2 className="h-4 w-4" /> Chấm bài</>}
          </Button>
        ) : (
          <Button onClick={() => onNext(feedback?.score)}>Tiếp theo <ArrowRight className="h-4 w-4" /></Button>
        )}
      </div>

      {feedback && (
        <Card className={cn("border-2", feedback.score >= 70 ? "border-green-400 bg-green-50/50" : feedback.score >= 40 ? "border-amber-400 bg-amber-50/50" : "border-red-400 bg-red-50/50")}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black">{feedback.score}%</span>
              <span className="text-sm font-bold">{feedback.score >= 70 ? "Tốt lắm!" : feedback.score >= 40 ? "Khá, cần cải thiện" : "Cần luyện thêm"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
            {feedback.corrections.length > 0 && (
              <div>
                <p className="text-xs font-bold mb-1">Gợi ý sửa:</p>
                {feedback.corrections.map((c, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {c}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Simple string similarity (Dice coefficient) ──

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i++) {
    const bg = a.substring(i, i + 2);
    bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
  }
  let hits = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const bg = b.substring(i, i + 2);
    const count = bigrams.get(bg) || 0;
    if (count > 0) { bigrams.set(bg, count - 1); hits++; }
  }
  return (2 * hits) / (a.length + b.length - 2);
}
