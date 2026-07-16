import { BookOpen, CheckCircle2, Ear, GraduationCap, Mic, PenLine, Play, RotateCcw, Volume2, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
    titleVi: "Gia dinh cua toi",
    level: "a1",
    topic: "family",
    steps: [
      {
        type: "vocab",
        title: "Family Words",
        content: "Learn these family words.",
        words: [
          { en: "mother", vi: "me" },
          { en: "father", vi: "bo" },
          { en: "sister", vi: "chi/em gai" },
          { en: "brother", vi: "anh/em trai" },
          { en: "grandmother", vi: "ba" },
          { en: "grandfather", vi: "ong" },
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
    titleVi: "O truong hoc",
    level: "a1",
    topic: "school",
    steps: [
      {
        type: "vocab",
        title: "School Vocabulary",
        content: "Learn these school words.",
        words: [
          { en: "teacher", vi: "giao vien" },
          { en: "student", vi: "hoc sinh" },
          { en: "classroom", vi: "lop hoc" },
          { en: "book", vi: "sach" },
          { en: "pencil", vi: "but chi" },
          { en: "desk", vi: "ban hoc" },
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
    titleVi: "Di mua sam",
    level: "a2",
    topic: "shopping",
    steps: [
      {
        type: "vocab",
        title: "Shopping Phrases",
        content: "Learn these shopping phrases.",
        words: [
          { en: "How much is this?", vi: "Cai nay bao nhieu?" },
          { en: "I'd like to buy...", vi: "Toi muon mua..." },
          { en: "Do you have...?", vi: "Ban co...?" },
          { en: "receipt", vi: "hoa don" },
          { en: "discount", vi: "giam gia" },
          { en: "change", vi: "tien thua" },
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
    titleVi: "Ky nghi cua toi",
    level: "a2",
    topic: "travel",
    steps: [
      {
        type: "vocab",
        title: "Travel Vocabulary",
        content: "Learn these travel words.",
        words: [
          { en: "airport", vi: "san bay" },
          { en: "hotel", vi: "khach san" },
          { en: "suitcase", vi: "vali" },
          { en: "passport", vi: "ho chieu" },
          { en: "souvenir", vi: "qua luu niem" },
          { en: "beach", vi: "bai bien" },
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
    titleVi: "Suc khoe va the duc",
    level: "b1",
    topic: "health",
    steps: [
      {
        type: "vocab",
        title: "Health Vocabulary",
        content: "Learn these health words.",
        words: [
          { en: "symptom", vi: "trieu chung" },
          { en: "prescription", vi: "don thuoc" },
          { en: "exercise", vi: "tap the duc" },
          { en: "balanced diet", vi: "che do an can bang" },
          { en: "headache", vi: "dau dau" },
          { en: "fever", vi: "sot" },
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
    titleVi: "Cong nghe",
    level: "b1",
    topic: "technology",
    steps: [
      {
        type: "vocab",
        title: "Tech Vocabulary",
        content: "Learn these technology words.",
        words: [
          { en: "smartphone", vi: "dien thoai thong minh" },
          { en: "artificial intelligence", vi: "tri tue nhan tao" },
          { en: "software", vi: "phan mem" },
          { en: "cybersecurity", vi: "an ninh mang" },
          { en: "social media", vi: "mang xa hoi" },
          { en: "innovation", vi: "doi moi/sang tao" },
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
];

// ── Level badge colors ──

const LEVEL_COLORS: Record<string, string> = {
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

  // Filter lessons appropriate for student level
  const filteredLessons = useMemo(() => {
    const levelOrder = ["a1", "a2", "b1", "b2"];
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
  }, []);

  const nextStep = useCallback(() => {
    if (!selectedLesson) return;
    if (stepIndex < selectedLesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  }, [selectedLesson, stepIndex]);

  const exitLesson = useCallback(() => {
    setSelectedLesson(null);
    setStepIndex(0);
    setCompleted(false);
  }, []);

  // ── Lesson list ──
  if (!selectedLesson) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40">
        <div className="px-4 pt-4 pb-6 space-y-4">
          <SessionHeader title="Bai hoc tich hop" icon={<GraduationCap className="h-4 w-4" />} iconBg="bg-indigo-500" onClose={onBackHome} />

          <p className="text-sm text-muted-foreground">
            Moi bai ket hop nhieu ky nang: Tu vung, Nghe, Doc, Ngu phap, Noi, Viet quanh 1 chu de.
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
                      <span className="shrink-0 text-xs font-bold text-muted-foreground">{lesson.steps.length} buoc</span>
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
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black">Hoan thanh!</h2>
          <p className="text-muted-foreground">Ban da hoan thanh bai hoc <span className="font-bold text-foreground">{selectedLesson.title}</span></p>
          <div className="rounded-2xl border border-border/60 bg-muted/50 p-4 w-full max-w-xs">
            <p className="text-sm font-bold mb-2">Tom tat:</p>
            <ul className="space-y-1 text-sm text-left">
              {selectedLesson.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{step.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exitLesson}>Danh sach bai</Button>
            <Button onClick={onBackHome}>Ve trang chu</Button>
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

function StepRenderer({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  switch (step.type) {
    case "vocab": return <VocabStep step={step} onNext={onNext} />;
    case "listen": return <ListenStep step={step} onNext={onNext} />;
    case "read": return <ReadStep step={step} onNext={onNext} />;
    case "grammar": return <GrammarStep step={step} onNext={onNext} />;
    case "speak": return <SpeakStep step={step} onNext={onNext} />;
    case "write": return <WriteStep step={step} onNext={onNext} />;
    default: return <div>Unknown step type</div>;
  }
}

// ── Vocab Step (flashcards) ──

function VocabStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
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
        <Card className="min-h-[160px] flex items-center justify-center transition-all hover:shadow-lg active:scale-[0.98]">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
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
                <span className="text-xs text-muted-foreground">Nhan de xem nghia</span>
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
            {flipped ? "Tu tiep" : "Lat"} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onNext}>
            Tiep theo <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Listen Step ──

function ListenStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const questions = step.questions || [];

  const playPassage = () => {
    if (step.passage) speakText(step.passage);
  };

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

      <Card>
        <CardContent className="p-4 space-y-3">
          <Button variant="outline" size="sm" onClick={playPassage} className="w-full">
            <Play className="h-4 w-4" /> Nghe bai doc
          </Button>
          {step.passage && (
            <p className="text-sm leading-relaxed border-l-2 border-primary/30 pl-3 text-muted-foreground">{step.passage}</p>
          )}
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
          <Button onClick={check} disabled={!allAnswered}>Kiem tra</Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-sm font-bold">{score}/{questions.length} dung</span>
            <Button onClick={onNext}>Tiep theo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Read Step ──

function ReadStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
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

      <Card>
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed whitespace-pre-line">{step.passage}</p>
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
          <Button onClick={check} disabled={!allAnswered}>Kiem tra</Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-sm font-bold">{score}/{questions.length} dung</span>
            <Button onClick={onNext}>Tiep theo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Grammar Step ──

function GrammarStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
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
          <Button onClick={check} disabled={!allAnswered}>Kiem tra</Button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-sm font-bold">{score}/{exercises.length} dung</span>
            <Button onClick={onNext}>Tiep theo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Speak Step ──

function SpeakStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [matched, setMatched] = useState<boolean | null>(null);
  const phrase = step.phrase || "";
  const supported = isRecognitionSupported();

  const playPhrase = () => speakText(phrase);

  const startListening = async () => {
    if (!supported) return;
    setListening(true);
    setResult(null);
    setMatched(null);
    try {
      const results = await listenOnce("en-US");
      const heard = results[0]?.toLowerCase().trim() || "";
      setResult(heard);
      const target = phrase.toLowerCase().replace(/[.,!?]/g, "").trim();
      const match = heard.includes(target) || target.includes(heard) || similarity(heard, target) > 0.6;
      setMatched(match);
    } catch {
      setResult("(Khong nghe duoc, thu lai)");
      setMatched(false);
    } finally {
      setListening(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      <Card>
        <CardContent className="p-5 text-center space-y-4">
          <p className="text-xl font-bold">{phrase}</p>
          <Button variant="outline" size="sm" onClick={playPhrase}>
            <Volume2 className="h-4 w-4" /> Nghe mau
          </Button>
        </CardContent>
      </Card>

      {supported ? (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={startListening}
            disabled={listening}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full transition-all",
              listening ? "bg-red-500 animate-pulse" : "bg-primary hover:brightness-110",
            )}
          >
            <Mic className="h-7 w-7 text-white" />
          </button>
          <span className="text-xs text-muted-foreground">{listening ? "Dang nghe..." : "Nhan de noi"}</span>

          {result !== null && (
            <div className={cn("w-full rounded-xl border-2 p-4 text-center", matched ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50")}>
              <p className="text-sm font-bold">{matched ? "Rat tot!" : "Thu lai nhe!"}</p>
              <p className="text-xs text-muted-foreground mt-1">Ban noi: "{result}"</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">Trinh duyet khong ho tro nhan dang giong noi.</p>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext}>Tiep theo <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

// ── Write Step ──

function WriteStep({ step, onNext }: { step: LessonStep; onNext: () => void }) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.content}</p>

      {step.prompt && (
        <Card className="border-violet-200 bg-violet-50/50">
          <CardContent className="p-4">
            <p className="text-sm font-semibold">{step.prompt}</p>
          </CardContent>
        </Card>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Viet cau tra loi cua ban o day..."
        rows={5}
        className="w-full rounded-xl border-2 border-border bg-background p-4 text-sm focus:border-primary focus:outline-none resize-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.trim().split(/\s+/).filter(Boolean).length} tu</span>
        <Button onClick={onNext} disabled={text.trim().length < 3}>
          Tiep theo <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
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
