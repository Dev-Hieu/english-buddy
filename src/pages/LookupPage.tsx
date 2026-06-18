import { ArrowLeft, ArrowLeftRight, BookmarkPlus, Languages, Loader2, Search, Volume2 } from "lucide-react";
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

interface WordResult {
  query: string;
  dict: DictionaryResult | null;
  vi: string;
  images: ImageResult[];
}

export function LookupPage({ student, onBackHome }: LookupPageProps) {
  const [mode, setMode] = useState<Mode>("word");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6">
      <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
        <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </Button>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Tra từ & Dịch câu</h1>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant={mode === "word" ? "default" : "outline"} size="lg" onClick={() => setMode("word")}>
          <Search className="h-5 w-5" /> Tra từ
        </Button>
        <Button type="button" variant={mode === "sentence" ? "default" : "outline"} size="lg" onClick={() => setMode("sentence")}>
          <Languages className="h-5 w-5" /> Dịch câu
        </Button>
      </div>

      {mode === "word" ? <WordLookup student={student} /> : <SentenceTranslate student={student} />}
    </main>
  );
}

function WordLookup({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("en"); // Anh→Việt hoặc Việt→Anh
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WordResult | null>(null);
  const [saved, setSaved] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);

    let englishWord = "";
    let viMeaning = "";
    if (from === "en") {
      englishWord = normalizeWord(raw);
      viMeaning = await translateToVi(englishWord).catch(() => "");
    } else {
      // Việt→Anh: dịch sang tiếng Anh rồi tra định nghĩa/ảnh của từ Anh đó.
      const en = await translate(raw, "vi", "en").catch(() => "");
      englishWord = normalizeWord(en);
      viMeaning = raw; // từ tiếng Việt người dùng nhập chính là nghĩa
    }
    if (!englishWord) {
      setLoading(false);
      setError(`Không dịch được "${raw}".`);
      return;
    }
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

  const to: Lang = from === "en" ? "vi" : "en";
  const labels: Record<Lang, string> = { en: "Anh", vi: "Việt" };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <span className={cn("rounded-md px-3 py-1 font-bold", from === "en" ? "bg-primary text-primary-foreground" : "bg-muted")}>{labels[from]}</span>
        <Button type="button" size="icon" variant="outline" onClick={() => { setFrom(to); setResult(null); setError(""); }} aria-label="Đổi chiều tra">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <span className={cn("rounded-md px-3 py-1 font-bold", to === "en" ? "bg-primary text-primary-foreground" : "bg-muted")}>{labels[to]}</span>
      </div>
      <form className="flex gap-2" onSubmit={search}>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-white px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="h-11 flex-1 bg-transparent outline-none" placeholder={from === "en" ? "Nhập 1 từ tiếng Anh..." : "Nhập 1 từ tiếng Việt..."} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
        </div>
        <Button type="submit" size="lg" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />} Tra
        </Button>
      </form>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      {result ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            {result.images[0] ? <img src={result.images[0].url} alt="" className="h-48 w-full rounded-md object-cover" /> : null}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black capitalize">{result.query}</h2>
                {result.dict?.phonetic ? <p className="text-muted-foreground">{result.dict.phonetic}</p> : null}
              </div>
              <Button type="button" variant="outline" onClick={() => speakText(result.query, result.dict?.audioUrl)} aria-label="Nghe">
                <Volume2 className="h-5 w-5" /> Nghe
              </Button>
            </div>
            {result.vi ? <p className="text-xl font-bold text-primary">🇻🇳 {result.vi}</p> : null}
            {result.dict?.meanings.slice(0, 3).map((m, i) => (
              <div key={i} className="rounded-md bg-muted p-3">
                <p className="text-sm font-bold text-muted-foreground">{m.partOfSpeech}</p>
                <p className="font-semibold">{m.definitions[0]}</p>
                {m.examples[0] ? <p className="mt-1 text-sm italic text-muted-foreground">“{m.examples[0]}”</p> : null}
              </div>
            ))}
            <Button type="button" className="w-full" onClick={save} disabled={saved}>
              <BookmarkPlus className="h-5 w-5" /> {saved ? "Đã lưu vào My Words" : "Lưu vào My Words"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

function SentenceTranslate({ student }: { student: Student }) {
  const [from, setFrom] = useState<Lang>("en"); // hướng dịch: en->vi hoặc vi->en
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const to: Lang = from === "en" ? "vi" : "en";

  const labels: Record<Lang, string> = { en: "Anh", vi: "Việt" };

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setOut("");
    const r = await translate(text, from, to).catch(() => "");
    setLoading(false);
    setOut(r || "(Không dịch được, thử lại)");
  };

  const flip = () => {
    setFrom(to);
    setText(out && !out.startsWith("(") ? out : text);
    setOut("");
  };

  // Đọc phần tiếng Anh (nguồn nếu en->vi, kết quả nếu vi->en).
  const englishText = from === "en" ? text : out;

  const save = () => {
    saveLookup({ studentId: student.id, query: text.trim(), type: "sentence", saved: true, createdAt: Date.now() }).catch(() => {});
  };

  return (
    <form className="space-y-4" onSubmit={run}>
      <div className="flex items-center justify-center gap-2">
        <span className={cn("rounded-md px-3 py-1 font-bold", from === "en" ? "bg-primary text-primary-foreground" : "bg-muted")}>{labels[from]}</span>
        <Button type="button" size="icon" variant="outline" onClick={flip} aria-label="Đổi chiều dịch">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <span className={cn("rounded-md px-3 py-1 font-bold", to === "en" ? "bg-primary text-primary-foreground" : "bg-muted")}>{labels[to]}</span>
      </div>

      <textarea
        className="min-h-28 w-full rounded-md border border-border bg-white p-3 outline-none"
        placeholder={from === "en" ? "Nhập câu tiếng Anh..." : "Nhập câu tiếng Việt..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <Button type="submit" size="lg" className="w-full" disabled={loading || !text.trim()}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Languages className="h-5 w-5" />} Dịch {labels[from]} → {labels[to]}
      </Button>

      {out ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-semibold text-muted-foreground">Kết quả ({labels[to]})</p>
            <p className="text-xl font-bold text-primary">{out}</p>
            <div className="flex gap-2">
              {englishText ? (
                <Button type="button" variant="outline" onClick={() => speakText(englishText)}>
                  <Volume2 className="h-5 w-5" /> Nghe (Anh)
                </Button>
              ) : null}
              <Button type="button" variant="outline" onClick={save}>
                <BookmarkPlus className="h-5 w-5" /> Lưu
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </form>
  );
}
