import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Layers, List, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SEED_TOPICS, TOPIC_TO_CATEGORY } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { getVideoLesson } from "@/data/videoLessons";
import type { Level, Student, VocabularyWord } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { WordCard } from "@/components/vocabulary/WordCard";
import { topicEmoji } from "@/components/ui/emoji";
import { topicWords } from "@/utils/levelFilter";
import { getWordBank, type BankWord } from "@/services/wordBankService";

interface LessonPageProps {
  topicId?: string;
  level?: string;
  student: Student;
  studiedWordIds: string[];
  onAnswerWord: (wordId: string, correct: boolean) => void;
  onBackHome: () => void;
  onPracticeFlashcard?: () => void;
  onStartTest?: () => void;
  onViewWordList?: () => void;
}

export function LessonPage({
  topicId = "topic_food",
  level = "all",
  student,
  studiedWordIds,
  onAnswerWord,
  onBackHome,
  onPracticeFlashcard,
  onStartTest,
  onViewWordList,
}: LessonPageProps) {
  // Resolve old topic_xxx IDs to new category IDs for backward compatibility
  const categoryId = topicId.startsWith("topic_") ? (TOPIC_TO_CATEGORY[topicId] ?? topicId) : topicId;
  const topic = SEED_TOPICS.find((item) => item.id === topicId);
  const videoLesson = useMemo(() => getVideoLesson(topicId), [topicId]);

  const [bankWords, setBankWords] = useState<BankWord[]>([]);
  useEffect(() => {
    const lvParam = level === "all" ? undefined : level;
    getWordBank(lvParam, categoryId).then(setBankWords).catch(() => setBankWords([]));
  }, [categoryId, level]);

  const words = useMemo(() => {
    // Ưu tiên từ video lesson nếu có
    if (videoLesson) {
      return videoLesson.vocabulary.map((vw, i): VocabularyWord => ({
        id: `vl_${topicId}_${i}`,
        word: vw.word,
        meaning_vi: vw.meaning_vi,
        meaning_en: "",
        pos: vw.pos,
        example: vw.example,
        example_vi: "",
        phonetic: "",
        topicIds: [topicId],
        level: "a1",
        imageUrl: "",
        source: "seed",
        createdAt: 0,
      }));
    }
    if (bankWords.length > 0) {
      return bankWords.map((bw): VocabularyWord => ({
        id: bw.id,
        word: bw.word,
        phonetic: bw.phonetic,
        meaning_vi: bw.meaning_vi,
        meaning_en: bw.meaning_en,
        pos: bw.pos,
        example: bw.examples?.[0]?.en ?? "",
        example_vi: bw.examples?.[0]?.vi ?? "",
        topicIds: bw.categories,
        level: bw.level as Level,
        imageUrl: bw.image ?? "",
        source: "seed",
        createdAt: 0,
      }));
    }
    return topicWords(SEED_VOCABULARY, topicId, level);
  }, [bankWords, topicId, level, videoLesson]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  // Track self-assessment counts within this session
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionReview, setSessionReview] = useState(0);
  const studiedIds = useMemo(() => new Set(studiedWordIds), [studiedWordIds]);

  const currentWord = words[currentIndex];
  // chỉ đếm từ ĐÃ học THUỘC chủ đề này (tránh >100%)
  const studiedInTopic = words.filter((w) => studiedIds.has(w.id)).length;
  const progress = words.length === 0 ? 0 : Math.round((studiedInTopic / words.length) * 100);

  const goPrevious = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, words.length - 1));

  // Trả lời 1 từ rồi sang từ tiếp (hoặc hiển thị tóm tắt nếu là từ cuối).
  const answer = (correct: boolean) => {
    if (!currentWord) return;
    onAnswerWord(currentWord.id, correct);
    if (correct) setSessionKnown((n) => n + 1);
    else setSessionReview((n) => n + 1);
    if (currentIndex >= words.length - 1) setShowSummary(true);
    else goNext();
  };

  if (!currentWord) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Bài học" onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ vựng.</CardContent></Card>
      </main>
    );
  }

  if (showSummary) {
    const total = sessionKnown + sessionReview;
    const pct = total === 0 ? 0 : Math.round((sessionKnown / total) * 100);
    const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
    const gradeColor = pct >= 80 ? "border-green-500 bg-green-50 text-green-600" : pct >= 60 ? "border-amber-500 bg-amber-50 text-amber-600" : "border-red-500 bg-red-50 text-red-600";
    const gradeTextColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : "text-red-600";
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Kết quả tự đánh giá" onClose={onBackHome} icon={<Sparkles className="h-4 w-4" />} iconBg="bg-amber-500" />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${gradeColor}`}>
              <span className="text-2xl font-black">{grade}</span>
            </div>
            <p className="text-3xl font-black text-primary">{pct}%</p>
            <p className={`text-sm font-extrabold ${gradeTextColor}`}>
              {pct >= 80 ? "Rất tốt!" : pct >= 60 ? "Khá tốt!" : "Cần ôn thêm!"}
            </p>
            <div className="w-full rounded-xl bg-muted p-4 text-sm space-y-1">
              <p className="font-bold text-green-600">Đã biết: <span className="font-black">{sessionKnown} từ</span></p>
              <p className="font-bold text-amber-600">Cần ôn: <span className="font-black">{sessionReview} từ</span></p>
              <p className="mt-1 text-xs text-muted-foreground font-bold">
                (Tự đánh giá — điểm này phản ánh sự tự nhận thức của bạn)
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" onClick={() => { setCurrentIndex(0); setShowSummary(false); setSessionKnown(0); setSessionReview(0); }}>
            <RotateCcw className="h-4 w-4" /> Học lại
          </Button>
          <Button type="button" onClick={onBackHome}>
            <CheckCircle2 className="h-4 w-4" /> Về nhà
          </Button>
        </div>
        {(onPracticeFlashcard || onStartTest) && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {onPracticeFlashcard && (
              <Button type="button" variant="secondary" onClick={onPracticeFlashcard}>
                <Layers className="h-4 w-4" /> Flashcard
              </Button>
            )}
            {onStartTest && (
              <Button type="button" variant="secondary" onClick={onStartTest}>
                <GraduationCap className="h-4 w-4" /> Làm test
              </Button>
            )}
          </div>
        )}
      </main>
    );
  }

  const isLast = currentIndex === words.length - 1;
  // Use seed topic name if available, otherwise format categoryId nicely
  const CATEGORY_NAMES: Record<string, string> = {
    animals_and_nature: "🐾 Animals · Động vật", clothes_and_accessories: "👔 Clothes · Quần áo",
    colours_and_shapes: "🎨 Colours · Màu sắc", communication_and_technology: "📱 Technology · Công nghệ",
    daily_life: "☀️ Daily Life · Sinh hoạt", education: "📚 Education · Giáo dục",
    entertainment_and_media: "🎬 Entertainment · Giải trí", environment: "🌍 Environment · Môi trường",
    family_and_friends: "👨‍👩‍👧 Family · Gia đình", feelings_and_opinions: "😊 Feelings · Cảm xúc",
    food_and_drink: "🍽️ Food · Đồ ăn", health_and_body: "🏥 Health · Sức khỏe",
    hobbies_and_leisure: "⚽ Hobbies · Sở thích", house_and_home: "🏠 Home · Nhà ở",
    measurements_and_numbers: "🔢 Numbers · Số", places: "🏛️ Places · Địa điểm",
    services: "🏪 Services · Dịch vụ", shopping: "🛒 Shopping · Mua sắm",
    society_and_community: "🤝 Society · Xã hội", sport: "🏆 Sport · Thể thao",
    science_and_research: "🔬 Science · Khoa học", travel_and_transport: "✈️ Travel · Du lịch",
    weather_and_seasons: "🌤️ Weather · Thời tiết", work_and_jobs: "💼 Work · Công việc",
  };
  const sessionTitle = topic
    ? `${topicEmoji(topic.id)} ${topic.name} · ${topic.name_vi}`
    : CATEGORY_NAMES[categoryId] || categoryId.replace(/_/g, " ");

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title={sessionTitle} onClose={onBackHome} progress={progress} icon={<Sparkles className="h-4 w-4" />} iconBg="bg-amber-500" />

      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Từ {currentIndex + 1} / {words.length}</p>

      <WordCard
        word={currentWord}
        studied={studiedIds.has(currentWord.id)}
        onReview={() => answer(false)}
        onKnow={() => answer(true)}
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4" /> Trước
        </Button>
        <Button type="button" variant="outline" onClick={isLast ? () => { if (currentWord && !studiedIds.has(currentWord.id)) { onAnswerWord(currentWord.id, true); setSessionKnown((n) => n + 1); } setShowSummary(true); } : goNext}>
          {isLast ? (<><CheckCircle2 className="h-4 w-4" /> Hoàn thành</>) : (<>Tiếp <ArrowRight className="h-4 w-4" /></>)}
        </Button>
      </div>

      {(onPracticeFlashcard || onStartTest) ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {onPracticeFlashcard ? (
            <Button type="button" variant="secondary" onClick={onPracticeFlashcard}>
              <Layers className="h-4 w-4" /> Flashcard
            </Button>
          ) : null}
          {onStartTest ? (
            <Button type="button" variant="secondary" onClick={onStartTest}>
              <GraduationCap className="h-4 w-4" /> Làm test
            </Button>
          ) : null}
        </div>
      ) : null}

      {onViewWordList ? (
        <Button type="button" variant="ghost" className="mt-3 w-full" onClick={onViewWordList}>
          <List className="h-4 w-4" /> Xem danh sách từ chủ đề
        </Button>
      ) : null}
    </main>
  );
}
