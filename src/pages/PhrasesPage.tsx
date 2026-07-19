import { ArrowLeft, Eye, EyeOff, MessageSquareText, Shuffle, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Student } from "@/types";
import type { Level } from "@/types/student";
import { LEVEL_ORDER } from "@/types/student";
import { SEED_PHRASES } from "@/data/seedPhrases";
import type { Phrase } from "@/data/seedPhrases";
import { TOPIC_TO_CATEGORY } from "@/data/seedTopics";
import { getPhraseBank } from "@/services/phraseBankService";
import { speakText } from "@/services/speechService";
import { matchesLevel } from "@/utils/levelFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; topicId?: string; onBackHome: () => void; }

type Screen = "categories" | "phrases" | "practice";

const LEVEL_FILTERS = [...LEVEL_ORDER, "all"] as const;
type LevelFilter = (typeof LEVEL_FILTERS)[number];

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const BANK_PHRASE_CATEGORIES = [
  { id: "animals_and_nature", name: "Animals & Nature", name_vi: "Động vật", emoji: "🐾" },
  { id: "clothes_and_accessories", name: "Clothes", name_vi: "Quần áo", emoji: "👔" },
  { id: "colours_and_shapes", name: "Colours", name_vi: "Màu sắc", emoji: "🎨" },
  { id: "communication_and_technology", name: "Technology", name_vi: "Công nghệ", emoji: "📱" },
  { id: "daily_life", name: "Daily Life", name_vi: "Sinh hoạt", emoji: "☀️" },
  { id: "education", name: "Education", name_vi: "Giáo dục", emoji: "📚" },
  { id: "entertainment_and_media", name: "Entertainment", name_vi: "Giải trí", emoji: "🎬" },
  { id: "environment", name: "Environment", name_vi: "Môi trường", emoji: "🌍" },
  { id: "family_and_friends", name: "Family", name_vi: "Gia đình", emoji: "👨‍👩‍👧" },
  { id: "feelings_and_opinions", name: "Feelings", name_vi: "Cảm xúc", emoji: "😊" },
  { id: "food_and_drink", name: "Food & Drink", name_vi: "Đồ ăn", emoji: "🍽️" },
  { id: "health_and_body", name: "Health", name_vi: "Sức khỏe", emoji: "🏥" },
  { id: "hobbies_and_leisure", name: "Hobbies", name_vi: "Sở thích", emoji: "⚽" },
  { id: "house_and_home", name: "Home", name_vi: "Nhà ở", emoji: "🏠" },
  { id: "measurements_and_numbers", name: "Numbers", name_vi: "Số", emoji: "🔢" },
  { id: "places", name: "Places", name_vi: "Địa điểm", emoji: "🏛️" },
  { id: "services", name: "Services", name_vi: "Dịch vụ", emoji: "🏪" },
  { id: "shopping", name: "Shopping", name_vi: "Mua sắm", emoji: "🛒" },
  { id: "society_and_community", name: "Society", name_vi: "Xã hội", emoji: "🤝" },
  { id: "sport", name: "Sport", name_vi: "Thể thao", emoji: "🏆" },
  { id: "science_and_research", name: "Science", name_vi: "Khoa học", emoji: "🔬" },
  { id: "travel_and_transport", name: "Travel", name_vi: "Du lịch", emoji: "✈️" },
  { id: "weather_and_seasons", name: "Weather", name_vi: "Thời tiết", emoji: "🌤️" },
  { id: "work_and_jobs", name: "Work", name_vi: "Công việc", emoji: "💼" },
];

export function PhrasesPage({ student, topicId, onBackHome }: Props) {
  const initialCategory = topicId ? TOPIC_TO_CATEGORY[topicId] ?? null : null;
  const [screen, setScreen] = useState<Screen>(initialCategory ? "phrases" : "categories");
  const [level, setLevel] = useState<LevelFilter>(student.level);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategory);

  const [bankPhrases, setBankPhrases] = useState<Phrase[]>([]);
  const loadedLevelRef = useRef<string | null>(null);

  useEffect(() => {
    const lvl = level === "all" ? undefined : level;
    const key = lvl ?? "all";
    if (loadedLevelRef.current === key) return;
    loadedLevelRef.current = key;
    getPhraseBank(lvl)
      .then((data) => {
        const mapped: Phrase[] = data.map((b) => ({
          id: b.id,
          en: b.phrase,
          vi: b.meaning_vi,
          category: b.category,
          level: b.level,
        }));
        setBankPhrases(mapped);
      })
      .catch(() => {});
  }, [level]);

  const activeCategory = BANK_PHRASE_CATEGORIES.find((c) => c.id === activeCategoryId) ?? null;

  const phraseSource = bankPhrases.length > 0 ? bankPhrases : SEED_PHRASES;

  const filteredPhrases = useMemo(() => {
    if (!activeCategoryId) return [];
    return phraseSource.filter(
      (p) => p.category === activeCategoryId && (level === "all" || matchesLevel(p.level, level)),
    );
  }, [activeCategoryId, level, phraseSource]);

  function openCategory(id: string) {
    setActiveCategoryId(id);
    setScreen("phrases");
  }

  function backToCategories() {
    setScreen("categories");
    setActiveCategoryId(null);
  }

  // ── Category list ──
  if (screen === "categories") {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Cụm từ thông dụng" onClose={onBackHome} icon={<MessageSquareText className="h-4 w-4" />} iconBg="bg-sky-500" />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVEL_FILTERS.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l === "kids" ? "Kids" : l === "all" ? "All" : l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BANK_PHRASE_CATEGORIES.map((cat) => {
            const count = phraseSource.filter(
              (p) => p.category === cat.id && (level === "all" || matchesLevel(p.level, level)),
            ).length;
            return (
              <button key={cat.id} type="button" onClick={() => openCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-center">
                <span className="text-2xl">{cat.emoji}</span>
                <p className="text-sm font-extrabold leading-tight">{cat.name_vi}</p>
                <p className="text-[11px] font-bold text-muted-foreground">{count} câu</p>
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  // ── Phrase list ──
  if (screen === "phrases" && activeCategory) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader
          title={activeCategory.name_vi}
          onClose={backToCategories}
          right={
            filteredPhrases.length > 0 ? (
              <Button type="button" size="sm" variant="accent" onClick={() => setScreen("practice")}>
                Luyện tập
              </Button>
            ) : undefined
          }
        />

        {filteredPhrases.length === 0 ? (
          <p className="mt-8 text-center text-sm font-bold text-muted-foreground">
            Không có câu nào ở cấp độ này.
          </p>
        ) : (
          <div className="space-y-2.5">
            {filteredPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
        )}
      </main>
    );
  }

  // ── Practice mode ──
  if (screen === "practice" && activeCategory) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <PracticeView
          phrases={filteredPhrases}
          categoryName={activeCategory.name_vi}
          onClose={() => setScreen("phrases")}
        />
      </main>
    );
  }

  return null;
}

// ════════════════════════════════════════════
// Phrase card (expandable)
// ════════════════════════════════════════════

function PhraseCard({ phrase }: { phrase: Phrase }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
            <p className="text-sm font-extrabold">{phrase.en}</p>
            {expanded && (
              <p className="mt-1 text-xs font-bold text-muted-foreground">{phrase.vi}</p>
            )}
            {!expanded && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">Nhan de xem nghia</p>
            )}
          </div>
          <button type="button" onClick={() => speakText(phrase.en)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:scale-95">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ════════════════════════════════════════════
// Practice mode (flashcards)
// ════════════════════════════════════════════

type PracticeDirection = "vi-to-en" | "en-to-vi";

function PracticeView({ phrases, categoryName, onClose }: { phrases: Phrase[]; categoryName: string; onClose: () => void }) {
  const [direction, setDirection] = useState<PracticeDirection>("vi-to-en");
  const [deck, setDeck] = useState(() => shuffle(phrases));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const card = index < deck.length ? deck[index] : null;
  const total = deck.length;

  function reveal() {
    setRevealed(true);
    if (direction === "en-to-vi" && card) speakText(card.en);
  }

  function next() {
    setRevealed(false);
    setReviewed((r) => r + 1);
    setIndex((i) => i + 1);
  }

  function reshuffle() {
    setDeck(shuffle(phrases));
    setIndex(0);
    setRevealed(false);
    setReviewed(0);
  }

  // ── Done ──
  if (!card) {
    return (
      <>
        <SessionHeader title="Luyện tập" onClose={onClose} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <Eye className="h-8 w-8 text-success" />
            </span>
            <p className="text-3xl font-black text-primary">{reviewed}/{total}</p>
            <p className="text-sm font-extrabold text-success">Hoàn thành!</p>
            <p className="text-xs text-muted-foreground">Ban da xem het {total} cau trong "{categoryName}"</p>
            <Button type="button" size="lg" className="w-full" onClick={reshuffle}>
              <Shuffle className="h-4 w-4" /> Luyện lại
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <SessionHeader title="Luyện tập" onClose={onClose} progress={Math.round((index / total) * 100)} />

      {/* Direction toggle */}
      <div className="mb-3 flex justify-center gap-1.5">
        <button type="button" onClick={() => setDirection("vi-to-en")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
            direction === "vi-to-en" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
          Viet → Anh
        </button>
        <button type="button" onClick={() => setDirection("en-to-vi")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
            direction === "en-to-vi" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
          Anh → Viet
        </button>
      </div>

      <p className="mb-2 text-center text-xs font-bold text-muted-foreground">
        {index + 1}/{total} · Đã xem: {reviewed}
      </p>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-6">
          {/* Prompt */}
          <p className="text-center text-lg font-extrabold">
            {direction === "vi-to-en" ? card.vi : card.en}
          </p>

          {direction === "en-to-vi" && !revealed && (
            <button type="button" onClick={() => speakText(card.en)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 active:scale-95">
              <Volume2 className="h-6 w-6" />
            </button>
          )}

          {/* Reveal area */}
          {!revealed ? (
            <Button type="button" size="lg" className="w-full" onClick={reveal}>
              <Eye className="h-5 w-5" /> Xem đáp án
            </Button>
          ) : (
            <div className="w-full space-y-4">
              <div className="rounded-2xl bg-muted/50 p-4 text-center">
                <p className="text-base font-extrabold text-primary">
                  {direction === "vi-to-en" ? card.en : card.vi}
                </p>
              </div>

              {direction === "vi-to-en" && (
                <button type="button" onClick={() => speakText(card.en)}
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 active:scale-95">
                  <Volume2 className="h-5 w-5" />
                </button>
              )}

              <Button type="button" size="lg" className="w-full" onClick={next}>
                Tiếp theo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
