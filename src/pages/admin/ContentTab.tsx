import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { getTopics, getVocabulary } from "@/services/contentService";
import { GRAMMAR_TOPICS } from "@/data/grammar";
import type { Topic, VocabularyWord } from "@/types";
import type { GrammarTopic } from "@/types/grammar";

export interface ContentTabProps {
  onRefresh: () => void;
}

type SubTab = "topics" | "vocabulary" | "grammar";

const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
const PAGE_SIZE = 20;

// ─── Topics sub-tab ──────────────────────────────────────────────────────────

function TopicsSubTab() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .catch(() => setError("Khong tai duoc danh sach chu de."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-sm font-bold text-muted-foreground py-10">Dang tai...</p>;
  if (error) return <p className="text-center text-sm font-bold text-red-500 py-10">{error}</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-muted-foreground">{topics.length} chu de</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold truncate">{t.name}</p>
                  <p className="text-sm font-bold text-muted-foreground truncate">{t.name_vi}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary/15 px-2 py-0.5 text-xs font-extrabold text-primary">
                  {t.level.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-muted-foreground">ID: {t.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Vocabulary sub-tab ───────────────────────────────────────────────────────

function VocabularySubTab() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([getVocabulary(), getTopics()])
      .then(([w, t]) => { setWords(w); setTopics(t); })
      .catch(() => setError("Khong tai duoc du lieu."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = words.filter((w) => {
    const matchSearch = search ? w.word.toLowerCase().includes(search.toLowerCase()) : true;
    const matchTopic = filterTopic ? w.topicIds.includes(filterTopic) : true;
    const matchLevel = filterLevel ? w.level === filterLevel : true;
    return matchSearch && matchTopic && matchLevel;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageWords = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const withImages = words.filter((w) => w.imageUrl).length;
  const withoutImages = words.length - withImages;

  function handleFilterChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  if (loading) return <p className="text-center text-sm font-bold text-muted-foreground py-10">Dang tai...</p>;
  if (error) return <p className="text-center text-sm font-bold text-red-500 py-10">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black">{words.length}</p>
            <p className="text-xs font-bold text-muted-foreground">Tong so tu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-green-600">{withImages}</p>
            <p className="text-xs font-bold text-muted-foreground">Co anh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-amber-500">{withoutImages}</p>
            <p className="text-xs font-bold text-muted-foreground">Chua co anh</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Tim theo tu..."
          value={search}
          onChange={handleFilterChange(setSearch)}
        />
        <select
          className="rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none"
          value={filterTopic}
          onChange={handleFilterChange(setFilterTopic)}
        >
          <option value="">Tat ca chu de</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name_vi}</option>)}
        </select>
        <select
          className="rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none"
          value={filterLevel}
          onChange={handleFilterChange(setFilterLevel)}
        >
          <option value="">Tat ca cap do</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Word count */}
      <p className="text-sm font-bold text-muted-foreground">
        {filtered.length} tu &mdash; trang {currentPage}/{totalPages}
      </p>

      {/* Word cards */}
      {pageWords.length === 0 ? (
        <p className="text-center text-sm font-bold text-muted-foreground py-6">Khong co ket qua.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pageWords.map((w) => (
            <Card key={w.id}>
              <CardContent className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="shrink-0">
                  {w.imageUrl ? (
                    <img
                      src={w.imageUrl}
                      alt={w.word}
                      className="h-14 w-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-2xl">
                      ?
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold truncate">{w.word}</p>
                    <span className="shrink-0 rounded-lg bg-primary/15 px-1.5 py-0.5 text-xs font-extrabold text-primary">
                      {w.level.toUpperCase()}
                    </span>
                  </div>
                  {w.phonetic && (
                    <p className="text-xs font-bold text-muted-foreground">{w.phonetic}</p>
                  )}
                  <p className="text-sm font-bold truncate">{w.meaning_vi}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Truoc
          </Button>
          <span className="text-sm font-bold">{currentPage} / {totalPages}</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Grammar sub-tab ──────────────────────────────────────────────────────────

function GrammarSubTab() {
  const byLevel: Record<string, GrammarTopic[]> = {};
  for (const t of GRAMMAR_TOPICS) {
    if (!byLevel[t.level]) byLevel[t.level] = [];
    byLevel[t.level].push(t);
  }

  return (
    <div className="space-y-5">
      {LEVELS.filter((l) => byLevel[l]?.length).map((level) => (
        <div key={level}>
          <h3 className="mb-2 font-extrabold text-sm uppercase tracking-wide text-muted-foreground">
            {level.toUpperCase()} &mdash; {byLevel[level].length} bai
          </h3>
          <div className="space-y-2">
            {byLevel[level].map((t) => (
              <Card key={t.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate">{t.title}</p>
                    <p className="text-sm font-bold text-muted-foreground truncate">{t.title_vi}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-xs font-extrabold">
                    {t.exercises.length} bai tap
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ContentTab ──────────────────────────────────────────────────────────

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: "topics", label: "Topics" },
  { key: "vocabulary", label: "Tu vung" },
  { key: "grammar", label: "Ngu phap" },
];

export function ContentTab({ onRefresh: _onRefresh }: ContentTabProps) {
  const [subTab, setSubTab] = useState<SubTab>("topics");

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-black">Quan ly noi dung</h2>

      {/* Sub-tab bar */}
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        {SUB_TABS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSubTab(s.key)}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-extrabold transition-colors",
              subTab === s.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {subTab === "topics" && <TopicsSubTab />}
      {subTab === "vocabulary" && <VocabularySubTab />}
      {subTab === "grammar" && <GrammarSubTab />}
    </div>
  );
}
