import { ArrowLeftRight, BookmarkPlus, Check, Clock, Languages, Loader2, Search, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DictionaryResult, ImageResult, Student } from "@/types";
import { getWordDefinition } from "@/services/dictionaryService";
import { getWordImages } from "@/services/imageService";
import { translate, translateToVi, type Lang } from "@/services/translateService";
import { saveLookup, getLookupHistory } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { normalizeWord } from "@/utils/normalizeWord";
import { apiRequest } from "@/services/api";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LookupPageProps {
  student: Student;
  onBackHome: () => void;
}

type Mode = "word" | "sentence";
interface WordDetail { vi?: string[]; pos?: string[]; examples?: { en: string; vi: string }[]; synonyms?: string[]; antonyms?: string[]; note?: string; }
interface WordResult { query: string; dict: DictionaryResult | null; detail: WordDetail | null; vi: string; images: ImageResult[]; }

export function LookupPage({ student }: LookupPageProps) {
  const [mode, setMode] = useState<Mode>("word");
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-5">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {(["word", "sentence"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn("flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-colors", mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground")}
          >
            {m === "word" ? <Search className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
            {m === "word" ? "Từ điển" : "Dịch câu"}
          </button>
        ))}
      </div>

      {mode === "word" ? <WordLookup student={student} /> : <SentenceTranslate student={student} />}
    </main>
  );
}

function DirToggle({ from, to, onFlip }: { from: Lang; to: Lang; onFlip: () => void }) {
  const labels: Record<Lang, string> = { en: "🇬🇧 Anh", vi: "🇻🇳 Việt" };
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-secondary-foreground">{labels[from]}</span>
      <Button type="button" size="icon" variant="outline" onClick={onFlip} aria-label="Đổi chiều" className="h-8 w-8"><ArrowLeftRight className="h-3.5 w-3.5" /></Button>
      <span className="rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-secondary-foreground">{labels[to]}</span>
    </div>
  );
}

// ── TỪ ĐIỂN ──
function WordLookup({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("en");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WordResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const to: Lang = from === "en" ? "vi" : "en";

  // Load lịch sử tra gần đây
  useEffect(() => {
    getLookupHistory(student.id, "word", 8)
      .then((rows) => setHistory(rows.map((r) => r.query)))
      .catch(() => {});
  }, [student.id]);

  const search = async (word?: string) => {
    const raw = (word || query).trim();
    if (!raw) return;
    setQuery(raw);
    setLoading(true); setError(""); setResult(null); setSaved(false);
    let englishWord = ""; let viMeaning = "";
    if (from === "en") {
      englishWord = normalizeWord(raw);
      viMeaning = await translateToVi(englishWord).catch(() => "");
    } else {
      const en = await translate(raw, "vi", "en").catch(() => "");
      englishWord = normalizeWord(en);
      viMeaning = raw;
    }
    if (!englishWord) { setLoading(false); setError(`Không tìm thấy "${raw}".`); return; }
    const [dict, images, detail] = await Promise.all([
      getWordDefinition(englishWord).catch(() => null),
      getWordImages(englishWord).catch(() => [] as ImageResult[]),
      apiRequest<WordDetail>(`/api/word-detail?word=${encodeURIComponent(englishWord)}`, { auth: false }).catch(() => null),
    ]);
    setLoading(false);
    const richVi = detail?.vi?.length ? detail.vi.join("; ") : viMeaning;
    setResult({ query: englishWord, dict, detail, vi: richVi, images });
  };

  const save = async () => {
    if (!result) return;
    await saveLookup({
      studentId: student.id, query: result.query, type: "word", saved: true, createdAt: Date.now(),
      meaning: result.vi || undefined, phonetic: result.dict?.phonetic || undefined, imageUrl: result.images[0]?.url || undefined,
    }).catch(() => {});
    setSaved(true);
    if (!history.includes(result.query)) setHistory((h) => [result.query, ...h].slice(0, 8));
  };

  return (
    <div className="space-y-3">
      <DirToggle from={from} to={to} onFlip={() => { setFrom(to); setResult(null); setError(""); }} />

      {/* Ô tìm kiếm */}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 focus-within:border-primary transition-colors">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            className="h-12 flex-1 bg-transparent font-bold outline-none"
            placeholder={from === "en" ? "Nhập từ tiếng Anh..." : "Nhập từ tiếng Việt..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button type="button" className="text-muted-foreground text-xs font-bold" onClick={() => { setQuery(""); setResult(null); inputRef.current?.focus(); }}>✕</button>
          )}
        </div>
        <Button type="submit" size="lg" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Tra"}
        </Button>
      </form>

      {/* Lịch sử tra gần đây */}
      {!result && !loading && history.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
          {history.map((w) => (
            <button key={w} type="button" onClick={() => search(w)}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground hover:bg-primary/10 transition-colors">
              {w}
            </button>
          ))}
        </div>
      )}

      {error ? <p className="font-bold text-red-600 text-sm">{error}</p> : null}

      {/* Kết quả từ điển */}
      {result ? (
        <Card className="animate-pop overflow-hidden">
          {/* Ảnh minh hoạ */}
          {result.images[0] && (
            <div className="relative h-44 w-full bg-muted">
              <img src={result.images[0].url} alt={result.query} className="h-full w-full object-cover" />
            </div>
          )}

          <CardContent className="space-y-3 p-4">
            {/* Từ + phiên âm + nút nghe */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black capitalize leading-tight">{result.query}</h2>
                {result.dict?.phonetic && (
                  <p className="text-sm font-bold text-muted-foreground">{result.dict.phonetic}</p>
                )}
              </div>
              <Button type="button" size="icon" variant="outline" className="shrink-0 h-10 w-10 rounded-xl" onClick={() => speakText(result.query)}>
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Nghĩa tiếng Việt (từ AI — đa nghĩa) */}
            {result.vi && (
              <div className="rounded-xl bg-primary/10 px-3 py-2.5">
                <p className="text-lg font-extrabold text-primary">{result.vi}</p>
              </div>
            )}

            {/* Từ loại (từ AI — lọc nghĩa hiếm) */}
            {result.detail?.pos?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {result.detail.pos.map((p) => (
                  <span key={p} className="rounded-lg bg-muted px-2 py-0.5 text-xs font-extrabold text-muted-foreground uppercase">{p}</span>
                ))}
              </div>
            ) : null}

            {/* Ví dụ từ AI (song ngữ EN-VI) */}
            {result.detail?.examples?.length ? (
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-muted-foreground uppercase">Ví dụ</p>
                {result.detail.examples.map((ex, i) => (
                  <div key={i} className="rounded-xl bg-muted/50 px-3 py-2">
                    <p className="text-sm font-bold flex items-center gap-1">
                      {ex.en}
                      <button type="button" className="opacity-50 hover:opacity-100 shrink-0" onClick={() => speakText(ex.en)}>
                        <Volume2 className="inline h-3.5 w-3.5" />
                      </button>
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground">{ex.vi}</p>
                  </div>
                ))}
              </div>
            ) : result.dict?.meanings.map((m, i) => (
              /* Fallback: dùng Free Dictionary nếu AI không trả */
              <div key={i} className="space-y-1.5">
                <span className="inline-block rounded-lg bg-muted px-2 py-0.5 text-xs font-extrabold text-muted-foreground uppercase">{m.partOfSpeech}</span>
                {m.definitions.slice(0, 2).map((def, j) => (
                  <div key={j} className="pl-3 border-l-2 border-border">
                    <p className="text-sm font-bold">{j + 1}. {def}</p>
                  </div>
                ))}
                {m.examples.slice(0, 1).map((ex, j) => (
                  <p key={j} className="pl-3 text-sm font-semibold italic text-muted-foreground">
                    💬 "{ex}"
                    <button type="button" className="ml-1 opacity-60 hover:opacity-100" onClick={() => speakText(ex)}><Volume2 className="inline h-3.5 w-3.5" /></button>
                  </p>
                ))}
              </div>
            ))}

            {/* Từ đồng nghĩa / trái nghĩa */}
            {(result.detail?.synonyms?.length || result.detail?.antonyms?.length) ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {result.detail?.synonyms?.length ? (
                  <p><span className="font-extrabold text-muted-foreground">≈</span> {result.detail.synonyms.map((s, i) => (
                    <button key={s} type="button" onClick={() => search(s)} className="font-bold text-primary hover:underline">{s}{i < result.detail!.synonyms!.length - 1 ? ", " : ""}</button>
                  ))}</p>
                ) : null}
                {result.detail?.antonyms?.length ? (
                  <p><span className="font-extrabold text-muted-foreground">≠</span> {result.detail.antonyms.map((a, i) => (
                    <button key={a} type="button" onClick={() => search(a)} className="font-bold text-accent hover:underline">{a}{i < result.detail!.antonyms!.length - 1 ? ", " : ""}</button>
                  ))}</p>
                ) : null}
              </div>
            ) : null}

            {/* Mẹo cho người Việt */}
            {result.detail?.note && (
              <p className="rounded-xl bg-accent/10 px-3 py-2 text-sm font-bold text-accent">💡 {result.detail.note}</p>
            )}

            {/* Nút lưu */}
            <Button type="button" className="w-full" variant={saved ? "outline" : "default"} onClick={save} disabled={saved}>
              {saved ? <Check className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
              {saved ? "Đã lưu vào My Words" : "Lưu vào My Words"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

// ── DỊCH CÂU ──
function SentenceTranslate({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("vi");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const to: Lang = from === "en" ? "vi" : "en";
  const labels: Record<Lang, string> = { en: "🇬🇧 Anh", vi: "🇻🇳 Việt" };

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setOut("");
    const r = await translate(text, from, to).catch(() => "");
    setLoading(false);
    setOut(r || "(Không dịch được, thử lại)");
  };
  const flip = () => { setFrom(to); setText(out && !out.startsWith("(") ? out : text); setOut(""); };
  const englishText = from === "en" ? text : out;
  const save = () => { saveLookup({ studentId: student.id, query: text.trim(), type: "sentence", saved: true, createdAt: Date.now(), meaning: out && !out.startsWith("(") ? out : undefined }).catch(() => {}); };

  return (
    <form className="space-y-3" onSubmit={run}>
      <DirToggle from={from} to={to} onFlip={flip} />

      {/* Ô nhập */}
      <div className="rounded-2xl border-2 border-border bg-card overflow-hidden focus-within:border-primary transition-colors">
        <textarea
          className="min-h-24 w-full p-3 font-bold outline-none bg-transparent resize-none"
          placeholder={from === "en" ? "Nhập câu tiếng Anh..." : "Nhập câu tiếng Việt..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <div className="flex items-center justify-between border-t border-border/50 px-3 py-1.5">
            <span className="text-xs font-bold text-muted-foreground">{text.trim().length} ký tự</span>
            <button type="button" className="text-xs font-bold text-muted-foreground hover:text-foreground" onClick={() => { setText(""); setOut(""); }}>Xoá</button>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading || !text.trim()}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Languages className="h-5 w-5" />}
        Dịch {labels[from]} → {labels[to]}
      </Button>

      {/* Kết quả */}
      {out && !out.startsWith("(") ? (
        <Card className="animate-pop">
          <CardContent className="space-y-3 p-4">
            <p className="text-xs font-extrabold text-muted-foreground uppercase">{labels[to]}</p>
            <p className="text-lg font-extrabold text-primary leading-relaxed">{out}</p>
            <div className="flex gap-2">
              {englishText && (
                <Button type="button" variant="outline" size="sm" onClick={() => speakText(englishText)}>
                  <Volume2 className="h-4 w-4" /> Nghe
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" onClick={save}>
                <BookmarkPlus className="h-4 w-4" /> Lưu
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={flip}>
                <ArrowLeftRight className="h-4 w-4" /> Đảo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : out ? (
        <p className="text-sm font-bold text-red-600">{out}</p>
      ) : null}
    </form>
  );
}
