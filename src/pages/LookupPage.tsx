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
interface WordDetail { vi?: string[]; pos?: string[]; examples?: { en: string; vi: string; pos?: string }[]; synonyms?: string[]; antonyms?: string[]; note?: string; }
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
      examples: result.detail?.examples?.slice(0, 3) || undefined,
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
        <div className="animate-pop space-y-3">
          {/* Header card: ảnh + từ + phiên âm + nghe */}
          <Card className="overflow-hidden">
            {result.images[0] && (
              <div className="relative h-40 w-full bg-muted">
                <img src={result.images[0].url} alt={result.query} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black capitalize text-white drop-shadow">{result.query}</h2>
                    {result.dict?.phonetic && <p className="text-sm font-bold text-white/80">{result.dict.phonetic}</p>}
                  </div>
                  <button type="button" onClick={() => speakText(result.query)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform active:scale-90">
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            {!result.images[0] && (
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div>
                  <h2 className="text-3xl font-black capitalize leading-tight">{result.query}</h2>
                  {result.dict?.phonetic && <p className="text-sm font-bold text-muted-foreground">{result.dict.phonetic}</p>}
                </div>
                <button type="button" onClick={() => speakText(result.query)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-90">
                  <Volume2 className="h-5 w-5" />
                </button>
              </CardContent>
            )}
          </Card>

          {/* Nghĩa tiếng Việt + từ loại */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">🇻🇳</span>
                <div className="flex-1 space-y-1.5">
                  {result.detail?.vi?.length ? (
                    result.detail.vi.map((v, i) => (
                      <p key={i} className="text-base font-extrabold text-primary leading-snug">
                        <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[11px] font-black text-primary">{i + 1}</span>
                        {v}
                      </p>
                    ))
                  ) : result.vi ? (
                    <p className="text-lg font-extrabold text-primary">{result.vi}</p>
                  ) : null}
                </div>
              </div>
              {result.detail?.pos?.length ? (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {result.detail.pos.map((p) => (
                    <span key={p} className="rounded-md border border-border px-2 py-0.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide">{p}</span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Ví dụ song ngữ */}
          {result.detail?.examples?.length ? (
            <Card>
              <CardContent className="p-4 space-y-0 divide-y divide-border/50">
                <p className="pb-2 text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Ví dụ</p>
                {result.detail.examples.map((ex, i) => (
                  <div key={i} className="py-2.5 flex gap-3">
                    <span className="mt-0.5 text-base opacity-40">❝</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-relaxed">
                        {ex.en}
                        <button type="button" className="ml-1.5 align-middle opacity-40 hover:opacity-100 transition-opacity" onClick={() => speakText(ex.en)}>
                          <Volume2 className="inline h-3.5 w-3.5" />
                        </button>
                        {ex.pos && <span className="ml-1.5 rounded border border-border px-1.5 py-px text-[10px] font-extrabold text-muted-foreground uppercase">{ex.pos}</span>}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{ex.vi}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : result.dict?.meanings.length ? (
            <Card>
              <CardContent className="p-4 space-y-3">
                {result.dict.meanings.slice(0, 3).map((m, i) => (
                  <div key={i}>
                    <span className="inline-block rounded-md border border-border px-2 py-0.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide mb-1.5">{m.partOfSpeech}</span>
                    {m.definitions.slice(0, 2).map((def, j) => (
                      <p key={j} className="pl-3 border-l-2 border-primary/30 text-sm font-bold mb-1">{j + 1}. {def}</p>
                    ))}
                    {m.examples.slice(0, 1).map((ex, j) => (
                      <p key={j} className="pl-3 mt-1 text-sm font-semibold italic text-muted-foreground">
                        ❝ {ex}
                        <button type="button" className="ml-1 opacity-40 hover:opacity-100" onClick={() => speakText(ex)}><Volume2 className="inline h-3.5 w-3.5" /></button>
                      </p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* Đồng nghĩa / Trái nghĩa */}
          {(result.detail?.synonyms?.length || result.detail?.antonyms?.length) ? (
            <Card>
              <CardContent className="p-4 space-y-2.5">
                {result.detail?.synonyms?.length ? (
                  <div>
                    <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1">Đồng nghĩa</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detail.synonyms.map((s) => (
                        <button key={s} type="button" onClick={() => search(s)}
                          className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-extrabold text-primary hover:bg-primary/15 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {result.detail?.antonyms?.length ? (
                  <div>
                    <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1">Trái nghĩa</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detail.antonyms.map((a) => (
                        <button key={a} type="button" onClick={() => search(a)}
                          className="rounded-full border border-accent/30 bg-accent/5 px-2.5 py-0.5 text-xs font-extrabold text-accent hover:bg-accent/15 transition-colors">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {/* Mẹo */}
          {result.detail?.note && (
            <div className="flex gap-2.5 rounded-2xl bg-accent/8 border border-accent/20 px-4 py-3">
              <span className="text-lg">💡</span>
              <p className="text-sm font-bold text-accent leading-relaxed">{result.detail.note}</p>
            </div>
          )}

          {/* Nút lưu */}
          <Button type="button" className="w-full" size="lg" variant={saved ? "outline" : "default"} onClick={save} disabled={saved}>
            {saved ? <Check className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
            {saved ? "Đã lưu vào My Words" : "Lưu vào My Words"}
          </Button>
        </div>
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
