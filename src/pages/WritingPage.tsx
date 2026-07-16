import { PenLine, Keyboard, MessageSquareText, FileText, Volume2, CheckCircle2, XCircle, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import type { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { speakText } from "@/services/speechService";
import { apiRequest } from "@/services/api";

interface Props { student: Student; onBackHome: () => void; }

type Mode = "word-dictation" | "sentence-dictation" | "essay";
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const MODES: { key: Mode; icon: typeof PenLine; label: string; desc: string; color: string }[] = [
  { key: "word-dictation", icon: Keyboard, label: "Nghe từ viết lại", desc: "Nghe phát âm → viết đúng từ", color: "bg-purple-100 text-purple-600" },
  { key: "sentence-dictation", icon: MessageSquareText, label: "Nghe câu viết lại", desc: "Nghe câu → viết lại đầy đủ", color: "bg-blue-100 text-blue-600" },
  { key: "essay", icon: FileText, label: "Viết đoạn văn", desc: "Viết theo chủ đề · AI chấm điểm", color: "bg-amber-100 text-amber-600" },
];

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/* Map UI CEFRLevel to vocabulary Level type */
const CEFR_TO_LEVEL: Record<CEFRLevel, string> = {
  A1: "a1", A2: "a2", B1: "b1", B2: "b2", C1: "c1", C2: "c1",
};

/* Shuffle helper */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Normalize text for comparison */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

/* Sentence templates per level */
const SENTENCE_TEMPLATES: Record<CEFRLevel, ((w: string) => string)[]> = {
  A1: [
    (w) => `I have a ${w}.`,
    (w) => `The ${w} is on the table.`,
    (w) => `She likes ${w}.`,
    (w) => `We go to the ${w}.`,
    (w) => `My ${w} is very big.`,
    (w) => `I like ${w}.`,
    (w) => `This is a ${w}.`,
    (w) => `I see a ${w}.`,
    (w) => `He wants a ${w}.`,
    (w) => `The ${w} is here.`,
  ],
  A2: [
    (w) => `I went to the ${w} yesterday.`,
    (w) => `She is looking at the ${w}.`,
    (w) => `We need to buy some ${w}.`,
    (w) => `He has been reading about ${w}.`,
    (w) => `They enjoy playing with the ${w}.`,
    (w) => `She likes the ${w} very much.`,
    (w) => `We need a new ${w} today.`,
    (w) => `He can see the ${w} from here.`,
    (w) => `They want to buy a ${w}.`,
    (w) => `The ${w} is on the table.`,
  ],
  B1: [
    (w) => `If I had a ${w}, I would be very happy.`,
    (w) => `The ${w} that she bought was expensive.`,
    (w) => `Although the ${w} was difficult, he managed to finish it.`,
    (w) => `She has been interested in ${w} since childhood.`,
    (w) => `I have been thinking about the ${w} all day.`,
    (w) => `She decided to learn more about ${w}.`,
    (w) => `The ${w} was more interesting than I expected.`,
    (w) => `We should talk about the ${w} later.`,
    (w) => `He always finds the ${w} fascinating.`,
    (w) => `They would have enjoyed the ${w} if they had come.`,
  ],
  B2: [
    (w) => `The significance of ${w} in modern society cannot be overstated.`,
    (w) => `Had it not been for the ${w}, the outcome would have been different.`,
    (w) => `It is widely believed that ${w} plays a crucial role in development.`,
    (w) => `The concept of ${w} has changed over the years.`,
    (w) => `Understanding ${w} requires careful attention.`,
    (w) => `Many people underestimate the importance of ${w}.`,
    (w) => `She gave a presentation about ${w} yesterday.`,
    (w) => `The research on ${w} has been quite promising.`,
    (w) => `Not only does ${w} affect individuals, but it also shapes communities.`,
    (w) => `The debate surrounding ${w} has intensified in recent years.`,
  ],
  C1: [
    (w) => `The implications of ${w} extend far beyond what was initially anticipated.`,
    (w) => `A nuanced understanding of ${w} requires careful consideration of multiple perspectives.`,
    (w) => `The significance of ${w} cannot be overstated.`,
    (w) => `Recent developments regarding ${w} have sparked debate.`,
    (w) => `The relationship between ${w} and society deserves attention.`,
    (w) => `A thorough understanding of ${w} is essential for progress.`,
    (w) => `The implications of ${w} are far-reaching and complex.`,
    (w) => `Were it not for ${w}, the trajectory of progress would have been markedly different.`,
    (w) => `The extent to which ${w} influences policy decisions remains a matter of contention.`,
    (w) => `One cannot fully appreciate the role of ${w} without examining its historical context.`,
  ],
  C2: [
    (w) => `The nuanced understanding of ${w} distinguishes experts from novices.`,
    (w) => `Scholarly discourse on ${w} has evolved considerably.`,
    (w) => `The multifaceted nature of ${w} warrants further investigation.`,
    (w) => `Contemporary perspectives on ${w} challenge traditional assumptions.`,
    (w) => `The interplay between ${w} and cultural norms remains contentious.`,
    (w) => `A comprehensive analysis of ${w} reveals layers of complexity hitherto unexplored.`,
    (w) => `The epistemological implications of ${w} demand a rigorous interdisciplinary approach.`,
    (w) => `Insofar as ${w} underpins contemporary thought, its reexamination is long overdue.`,
    (w) => `The dialectical relationship between ${w} and societal evolution merits sustained scholarly attention.`,
    (w) => `Any reductive interpretation of ${w} fails to account for its profound structural significance.`,
  ],
};

/* Word count hints per level */
const WORD_COUNT_HINT: Record<CEFRLevel, string> = {
  A1: "30\u201350 words",
  A2: "50\u201380 words",
  B1: "80\u2013120 words",
  B2: "120\u2013180 words",
  C1: "180\u2013250 words",
  C2: "250\u2013350 words",
};

/* Essay prompts per level */
const ESSAY_PROMPTS: Record<CEFRLevel, string[]> = {
  A1: [
    "Describe your family. Who are they? What do they look like?",
    "Write about your favorite food. Why do you like it?",
    "Describe your house or apartment. What rooms does it have?",
    "Write about your best friend. What do you like about them?",
    "What do you do every day? Describe your daily routine.",
    "Write about your favorite animal. What does it look like?",
    "Describe your classroom. What is in it?",
    "What is your favorite color? Why do you like it?",
    "Write about the weather today. Is it hot or cold?",
    "Describe what you eat for breakfast, lunch, and dinner.",
  ],
  A2: [
    "Write about your last holiday. Where did you go?",
    "Describe your school or workplace. What is it like?",
    "What are your hobbies? Why do you enjoy them?",
    "Write about your favorite season and what you do during it.",
    "Describe a typical weekend for you.",
    "Write about a sport you like to play or watch. Why do you like it?",
    "Describe your favorite place in your town or city.",
    "Write about a gift you received. Who gave it to you and why was it special?",
    "What did you do last weekend? Describe your activities.",
    "Write about a person you admire. What do they do?",
  ],
  B1: [
    "Do you think it is better to learn online or in a classroom? Compare the two and give your opinion.",
    "Do you think technology makes life better or worse? Explain your view.",
    "Describe a memorable trip you have taken. What made it special?",
    "Write about the advantages and disadvantages of living in a big city.",
    "What would you do if you had a whole day with no responsibilities?",
    "Should children have mobile phones? Give reasons for your opinion.",
    "Write about a skill you would like to learn and explain why.",
    "Do you prefer working alone or in a team? Explain your preference.",
    "Describe an event that changed your life. What happened and how did it affect you?",
    "Write about the importance of exercise and a healthy lifestyle.",
  ],
  B2: [
    "Some people believe that social media has more negative effects than positive. Do you agree?",
    "Write about a book or movie that changed your perspective on something.",
    "Discuss the importance of learning a foreign language in today's world.",
    "Should students be required to wear school uniforms? Give your opinion.",
    "How has technology changed the way people communicate?",
    "Is it better to travel independently or with a tour group? Discuss both sides.",
    "To what extent do you think advertising influences consumer behavior?",
    "Should governments invest more in renewable energy? Why or why not?",
    "Discuss the pros and cons of remote work compared to working in an office.",
    "How important is it to preserve endangered languages? Give your view.",
  ],
  C1: [
    "To what extent should governments regulate artificial intelligence? Discuss.",
    "Analyze the impact of globalization on local cultures and traditions.",
    "Is it more important to focus on space exploration or solving problems on Earth?",
    "Discuss the ethical implications of genetic engineering in humans.",
    "How does the media influence public opinion? Provide examples.",
    "Evaluate the argument that universal basic income would reduce poverty and inequality.",
    "To what extent has social media undermined traditional journalism?",
    "Discuss the tension between national sovereignty and international cooperation on climate change.",
    "Should higher education be free for all citizens? Analyze the potential consequences.",
    "Examine how urbanization affects mental health and propose potential solutions.",
  ],
  C2: [
    "Critically evaluate the notion that economic growth is always beneficial for society.",
    "To what extent is the concept of free will compatible with modern neuroscience?",
    "Analyze the role of education in perpetuating or reducing social inequality.",
    "Discuss whether democracy is truly the best form of governance for all nations.",
    "Examine the philosophical implications of artificial consciousness.",
    "To what extent can language shape thought, and what are the implications for multilingual societies?",
    "Critically assess the claim that technological progress is inherently value-neutral.",
    "Analyze the paradox of tolerance and its implications for free speech in liberal democracies.",
    "Evaluate the assertion that post-truth politics represents a fundamental shift in democratic discourse.",
    "Discuss the ethical ramifications of predictive algorithms in criminal justice systems.",
  ],
};

/* ─── Word Dictation Component ─── */
function WordDictation({ level, onBack }: { level: CEFRLevel; onBack: () => void }) {
  const words = useMemo(() => {
    const vocabLevel = CEFR_TO_LEVEL[level];
    const filtered = SEED_VOCABULARY.filter((v) => v.level === vocabLevel);
    return shuffle(filtered).slice(0, 10);
  }, [level]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentWord = words[index];

  const handlePlay = useCallback(() => {
    if (currentWord) speakText(currentWord.word);
  }, [currentWord]);

  const handleCheck = () => {
    if (!currentWord || checked) return;
    const isCorrect = normalize(input) === normalize(currentWord.word);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= words.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setChecked(false);
    setCorrect(false);
  };

  if (words.length === 0) {
    return (
      <>
        <SessionHeader title="Nghe từ viết lại" onClose={onBack} />
        <Card><CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Không có từ vựng cho trình độ {level}</p>
        </CardContent></Card>
      </>
    );
  }

  if (finished) {
    return (
      <>
        <SessionHeader title="Nghe từ viết lại" onClose={onBack} />
        <Card><CardContent className="p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="text-lg font-black">Hoàn thành!</h2>
          <p className="text-2xl font-extrabold text-primary">{score}/{words.length}</p>
          <p className="text-sm text-muted-foreground">
            {score === words.length ? "Xuất sắc! Bạn đúng hết!" : `Bạn đúng ${score} trên ${words.length} từ.`}
          </p>
          <Button onClick={onBack} className="mt-2"><RotateCcw className="mr-2 h-4 w-4" />Quay lại</Button>
        </CardContent></Card>
      </>
    );
  }

  return (
    <>
      <SessionHeader title="Nghe từ viết lại" onClose={onBack} />
      <p className="mb-2 text-xs font-bold text-muted-foreground text-center">
        Từ {index + 1}/{words.length} · Điểm: {score}
      </p>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={handlePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-all active:scale-95 hover:bg-purple-200">
              <Volume2 className="h-8 w-8" />
            </button>
            <p className="text-xs text-muted-foreground">Nhấn để nghe từ</p>
          </div>

          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") checked ? handleNext() : handleCheck(); }}
            disabled={checked} placeholder="Gõ từ bạn nghe được..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-bold outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60" />

          {checked && (
            <div className={cn("flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold",
              correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
              {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {correct ? "Chính xác!" : <>Sai. Đáp án: <span className="font-extrabold ml-1">{currentWord.word}</span></>}
            </div>
          )}

          <div className="flex justify-center gap-2">
            {!checked ? (
              <Button onClick={handleCheck} disabled={!input.trim()}>Kiểm tra</Button>
            ) : (
              <Button onClick={handleNext}>{index + 1 >= words.length ? "Xem kết quả" : "Từ tiếp theo"}</Button>
            )}
            <Button variant="outline" onClick={handlePlay}><Volume2 className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* ─── Sentence Dictation Component ─── */
function SentenceDictation({ level, onBack }: { level: CEFRLevel; onBack: () => void }) {
  const sentences = useMemo(() => {
    const vocabLevel = CEFR_TO_LEVEL[level];
    const filtered = SEED_VOCABULARY.filter((v) => v.level === vocabLevel);
    const picked = shuffle(filtered).slice(0, 5);
    const templates = SENTENCE_TEMPLATES[level];
    return picked.map((v, i) => templates[i % templates.length](v.word));
  }, [level]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentSentence = sentences[index];

  const handlePlay = useCallback(() => {
    if (currentSentence) speakText(currentSentence);
  }, [currentSentence]);

  const handleCheck = () => {
    if (!currentSentence || checked) return;
    const isCorrect = normalize(input) === normalize(currentSentence);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= sentences.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setChecked(false);
    setCorrect(false);
  };

  if (sentences.length === 0) {
    return (
      <>
        <SessionHeader title="Nghe câu viết lại" onClose={onBack} />
        <Card><CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Không có từ vựng cho trình độ {level}</p>
        </CardContent></Card>
      </>
    );
  }

  if (finished) {
    return (
      <>
        <SessionHeader title="Nghe câu viết lại" onClose={onBack} />
        <Card><CardContent className="p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="text-lg font-black">Hoàn thành!</h2>
          <p className="text-2xl font-extrabold text-primary">{score}/{sentences.length}</p>
          <p className="text-sm text-muted-foreground">
            {score === sentences.length ? "Tuyệt vời! Bạn nghe rất tốt!" : `Bạn đúng ${score} trên ${sentences.length} câu.`}
          </p>
          <Button onClick={onBack} className="mt-2"><RotateCcw className="mr-2 h-4 w-4" />Quay lại</Button>
        </CardContent></Card>
      </>
    );
  }

  return (
    <>
      <SessionHeader title="Nghe câu viết lại" onClose={onBack} />
      <p className="mb-2 text-xs font-bold text-muted-foreground text-center">
        Câu {index + 1}/{sentences.length} · Điểm: {score}
      </p>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={handlePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all active:scale-95 hover:bg-blue-200">
              <Volume2 className="h-8 w-8" />
            </button>
            <p className="text-xs text-muted-foreground">Nhấn để nghe câu</p>
          </div>

          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            disabled={checked} placeholder="Gõ câu bạn nghe được..."
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 resize-none" />

          {checked && (
            <div className={cn("rounded-xl p-3 text-sm font-bold space-y-1",
              correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
              <div className="flex items-center gap-2">
                {correct ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                {correct ? "Chính xác!" : "Chưa đúng!"}
              </div>
              {!correct && (
                <p className="text-xs mt-1">Đáp án: <span className="font-extrabold">{currentSentence}</span></p>
              )}
            </div>
          )}

          <div className="flex justify-center gap-2">
            {!checked ? (
              <Button onClick={handleCheck} disabled={!input.trim()}>Kiểm tra</Button>
            ) : (
              <Button onClick={handleNext}>{index + 1 >= sentences.length ? "Xem kết quả" : "Câu tiếp theo"}</Button>
            )}
            <Button variant="outline" onClick={handlePlay}><Volume2 className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* ─── Essay Grading Result Type ─── */
interface GradeResult {
  score: number;
  grade: string;
  grammar: string[];
  vocabulary: string;
  feedback: string;
  corrected: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-amber-500";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-success/10";
  if (score >= 60) return "bg-amber-50";
  return "bg-red-50";
}

/* ─── Essay Component ─── */
function EssayWriting({ level, onBack }: { level: CEFRLevel; onBack: () => void }) {
  const prompts = ESSAY_PROMPTS[level];
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * prompts.length));
  const [essay, setEssay] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const prompt = prompts[promptIndex];
    const gradingPrompt = `You are an English writing teacher. Grade this essay written by a ${level} CEFR level student.

Writing prompt: "${prompt}"

Student's essay:
"""
${essay}
"""

Grade the essay and respond ONLY with valid JSON (no markdown, no extra text):
{
  "score": <number 0-100>,
  "grade": "<A+/A/B/C/D/F>",
  "grammar": ["<list each grammar error with explanation in Vietnamese>"],
  "vocabulary": "<vocabulary usage feedback in Vietnamese>",
  "feedback": "<overall feedback and suggestions in Vietnamese>",
  "corrected": "<the corrected version of the essay in English>"
}`;

    setGrading(true);
    setError("");
    setGradeResult(null);

    try {
      const data = await apiRequest<{ translation: string }>("/api/translate", {
        method: "POST",
        body: { text: gradingPrompt, targetLang: "vi" },
      });

      const raw = data.translation || "";
      // Extract JSON from response (handle possible markdown wrapping)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response");

      const parsed = JSON.parse(jsonMatch[0]) as GradeResult;
      // Ensure grammar is array
      if (!Array.isArray(parsed.grammar)) parsed.grammar = [];
      setGradeResult(parsed);
    } catch {
      setError("Không thể chấm bài lúc này. Vui lòng thử lại sau.");
    } finally {
      setGrading(false);
    }
  };

  const handleNewPrompt = () => {
    setPromptIndex((i) => (i + 1) % prompts.length);
    setEssay("");
    setGradeResult(null);
    setError("");
  };

  const handleRewrite = () => {
    setGradeResult(null);
    setError("");
  };

  return (
    <>
      <SessionHeader title="Viết đoạn văn" onClose={onBack} />

      {/* Grading result view */}
      {gradeResult ? (
        <div className="space-y-3">
          {/* Score circle */}
          <Card>
            <CardContent className={cn("flex flex-col items-center gap-3 p-6", scoreBg(gradeResult.score))}>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/20" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className={scoreColor(gradeResult.score)}
                      strokeDasharray={`${gradeResult.score * 2.64} 264`} strokeLinecap="round" />
                  </svg>
                  <span className={cn("absolute text-xl font-black", scoreColor(gradeResult.score))}>{gradeResult.score}</span>
                </div>
                <div>
                  <p className={cn("text-2xl font-black", scoreColor(gradeResult.score))}>{gradeResult.grade}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {gradeResult.score >= 90 ? "Xuất sắc!" : gradeResult.score >= 80 ? "Rất tốt!" : gradeResult.score >= 60 ? "Khá tốt" : "Cần cải thiện"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grammar errors */}
          {gradeResult.grammar.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-extrabold text-red-600 uppercase">Lỗi ngữ pháp</p>
                <ul className="space-y-1">
                  {gradeResult.grammar.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Vocabulary */}
          {gradeResult.vocabulary && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-extrabold text-blue-600 uppercase">Từ vựng</p>
                <p className="text-sm">{gradeResult.vocabulary}</p>
              </CardContent>
            </Card>
          )}

          {/* Feedback */}
          {gradeResult.feedback && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-extrabold text-amber-600 uppercase">Nhận xét chung</p>
                <p className="text-sm">{gradeResult.feedback}</p>
              </CardContent>
            </Card>
          )}

          {/* Corrected essay */}
          {gradeResult.corrected && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-extrabold text-green-600 uppercase">Bài viết đã sửa</p>
                <p className="text-sm whitespace-pre-wrap bg-green-50 rounded-lg p-3">{gradeResult.corrected}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-2">
            <Button onClick={handleRewrite}><RotateCcw className="mr-2 h-4 w-4" />Viết lại</Button>
            <Button variant="outline" onClick={handleNewPrompt}>Đề khác</Button>
          </div>
        </div>
      ) : (
        /* Writing form */
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="rounded-xl bg-amber-50 p-4 text-center space-y-2">
              <p className="text-xs font-bold text-amber-600 uppercase">Trình độ {level} · Chủ đề</p>
              <p className="text-sm font-extrabold text-amber-900">{prompts[promptIndex]}</p>
              <p className="text-xs text-amber-700">Gợi ý độ dài: {WORD_COUNT_HINT[level]}</p>
            </div>

            <textarea value={essay} onChange={(e) => setEssay(e.target.value)}
              placeholder="Viết đoạn văn của bạn ở đây..."
              rows={8} disabled={grading}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-60" />

            <p className="text-xs text-muted-foreground text-right">{essay.trim().split(/\s+/).filter(Boolean).length} từ · Mục tiêu: {WORD_COUNT_HINT[level]}</p>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-center gap-2">
              <Button onClick={handleSubmit} disabled={!essay.trim() || grading}>
                {grading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang chấm...</> : "Gửi bài chấm AI"}
              </Button>
              <Button variant="outline" onClick={handleNewPrompt} disabled={grading}><RotateCcw className="mr-2 h-4 w-4" />Đề khác</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

/* ─── Main WritingPage ─── */
export function WritingPage({ student, onBackHome }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<CEFRLevel>("A1");

  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Viết" onClose={onBackHome} icon={<PenLine className="h-4 w-4" />} iconBg="bg-violet-500" />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MODES.map((m) => (
            <button key={m.key} type="button" onClick={() => setMode(m.key)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md text-left">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", m.color)}>
                <m.icon className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          Trình độ: {level} · {student.name}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      {mode === "word-dictation" && <WordDictation level={level} onBack={() => setMode(null)} />}
      {mode === "sentence-dictation" && <SentenceDictation level={level} onBack={() => setMode(null)} />}
      {mode === "essay" && <EssayWriting level={level} onBack={() => setMode(null)} />}
    </main>
  );
}
