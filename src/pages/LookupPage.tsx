import { ArrowLeftRight, BookmarkPlus, Languages, Loader2, Search, Volume2 } from "lucide-react";
import { useState } from "react";
import type { DictionaryResult, ImageResult, Student } from "@/types";
import { getWordDefinition } from "@/services/dictionaryService";
import { getWordImages } from "@/services/imageService";
import { translate, translateToVi, type Lang } from "@/services/translateService";
import { saveLookup } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { normalizeWord } from "@/utils/normalizeWord";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LookupPageProps {
  student: Student;
  onBackHome: () => void;
}

type Mode = "word" | "sentence";
interface WordResult { query: string; dict: DictionaryResult | null; vi: string; images: ImageResult[]; }

export function LookupPage({ student }: LookupPageProps) {
  const [mode, setMode] = useState<Mode>("word");
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6">
      <h1 className="mb-4 text-3xl font-black tracking-tight">Tra từ & Dịch câu</h1>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {(["word", "sentence"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn("flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-colors", mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground")}
          >
            {m === "word" ? <Search className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
            {m === "word" ? "Tra từ" : "Dịch câu"}
          </button>
        ))}
      </div>

      {mode === "word" ? <WordLookup student={student} /> : <SentenceTranslate student={student} />}
    </main>
  );
}

function DirToggle({ from, to, onFlip }: { from: Lang; to: Lang; onFlip: () => void }) {
  const labels: Record<Lang, string> = { en: "Anh", vi: "Việt" };
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-extrabold text-secondary-foreground">{labels[from]}</span>
      <Button type="button" size="icon" variant="outline" onClick={onFlip} aria-label="Đổi chiều"><ArrowLeftRight className="h-4 w-4" /></Button>
      <span className="rounded-full bg-secondary px-4 py-1.5 font-extrabold text-secondary-foreground">{labels[to]}</span>
    </div>
  );
}

function WordLookup({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("en");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WordResult | null>(null);
  const [saved, setSaved] = useState(false);
  const to: Lang = from === "en" ? "vi" : "en";

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;
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
    if (!englishWord) { setLoading(false); setError(`Không dịch được "${raw}".`); return; }
    const [dict, images] = await Promise.all([
      getWordDefinition(englishWord).catch(() => null),
      getWordImages(englishWord).catch(() => [] as ImageResult[]),
    ]);
    setLoading(false);
    setResult({ query: englishWord, dict, vi: viMeaning, images });
  };

  const save = async () => {
    if (!result) return;
    await saveLookup({ studentId: student.id, query: result.query, type: "word", saved: true, createdAt: Date.now() }).catch(() => {});
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <DirToggle from={from} to={to} onFlip={() => { setFrom(to); setResult(null); setError(""); }} />
      <form className="flex gap-2" onSubmit={search}>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-border bg-white px-3 focus-within:border-primary">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input className="h-12 flex-1 bg-transparent font-bold outline-none" placeholder={from === "en" ? "Từ tiếng Anh..." : "Từ tiếng Việt..."} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
        </div>
        <Button type="submit" size="lg" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        </Button>
      </form>

      {error ? <p className="font-bold text-red-600">{error}</p> : null}

      {result ? (
        <Card className="animate-pop">
          <CardContent className="space-y-4 p-5">
            {result.images[0] ? <img src={result.images[0].url} alt="" className="h-48 w-full rounded-2xl object-cover" /> : null}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black capitalize">{result.query}</h2>
                {result.dict?.phonetic ? <p className="font-bold text-muted-foreground">{result.dict.phonetic}</p> : null}
              </div>
              <Button type="button" size="icon" variant="outline" onClick={() => speakText(result.query, result.dict?.audioUrl)}><Volume2 className="h-5 w-5" /></Button>
            </div>
            {result.vi ? <p className="text-xl font-extrabold text-primary">🇻🇳 {result.vi}</p> : null}
            {result.dict?.meanings.slice(0, 3).map((m, i) => (
              <div key={i} className="rounded-2xl bg-muted p-3">
                <p className="text-sm font-extrabold text-muted-foreground">{m.partOfSpeech}</p>
                <p className="font-bold">{m.definitions[0]}</p>
                {m.examples[0] ? <p className="mt-1 text-sm font-semibold italic text-muted-foreground">"{m.examples[0]}"</p> : null}
              </div>
            ))}
            <Button type="button" className="w-full" onClick={save} disabled={saved}>
              <BookmarkPlus className="h-5 w-5" /> {saved ? "Đã lưu" : "Lưu vào My Words"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function SentenceTranslate({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("en");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const to: Lang = from === "en" ? "vi" : "en";
  const labels: Record<Lang, string> = { en: "Anh", vi: "Việt" };

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
  const save = () => { saveLookup({ studentId: student.id, query: text.trim(), type: "sentence", saved: true, createdAt: Date.now() }).catch(() => {}); };

  return (
    <form className="space-y-4" onSubmit={run}>
      <DirToggle from={from} to={to} onFlip={flip} />
      <textarea
        className="min-h-28 w-full rounded-2xl border-2 border-border bg-white p-3 font-bold outline-none focus:border-primary"
        placeholder={from === "en" ? "Nhập câu tiếng Anh..." : "Nhập câu tiếng Việt..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-full" disabled={loading || !text.trim()}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Languages className="h-5 w-5" />} Dịch {labels[from]} → {labels[to]}
      </Button>
      {out ? (
        <Card className="animate-pop">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-extrabold text-muted-foreground">Kết quả ({labels[to]})</p>
            <p className="text-xl font-extrabold text-primary">{out}</p>
            <div className="flex gap-2">
              {englishText ? <Button type="button" variant="outline" onClick={() => speakText(englishText)}><Volume2 className="h-5 w-5" /> Nghe</Button> : null}
              <Button type="button" variant="outline" onClick={save}><BookmarkPlus className="h-5 w-5" /> Lưu</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </form>
  );
}
