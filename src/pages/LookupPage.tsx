import { ArrowLeft, BookmarkPlus, Loader2, Search, Volume2 } from "lucide-react";
import { useState } from "react";
import type { DictionaryResult, ImageResult, Student } from "@/types";
import { getWordDefinition } from "@/services/dictionaryService";
import { getWordImages } from "@/services/imageService";
import { translateToVi } from "@/services/translateService";
import { saveLookup } from "@/services/progressService";
import { speakText } from "@/services/speechService";
import { normalizeWord } from "@/utils/normalizeWord";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LookupPageProps {
  student: Student;
  onBackHome: () => void;
}

interface Result {
  query: string;
  dict: DictionaryResult | null;
  vi: string;
  images: ImageResult[];
}

export function LookupPage({ student, onBackHome }: LookupPageProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = normalizeWord(query);
    if (!q) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    // Gọi song song; mỗi nguồn lỗi riêng không chặn các nguồn khác.
    const [dict, vi, images] = await Promise.all([
      getWordDefinition(q).catch(() => null),
      translateToVi(q).catch(() => ""),
      getWordImages(q).catch(() => [] as ImageResult[]),
    ]);
    setLoading(false);
    if (!dict && !vi && images.length === 0) {
      setError(`Không tìm thấy dữ liệu cho "${q}".`);
      return;
    }
    setResult({ query: q, dict, vi, images });
  };

  const save = async () => {
    if (!result) return;
    await saveLookup({
      studentId: student.id,
      query: result.query,
      type: "word",
      saved: true,
      createdAt: Date.now(),
    }).catch(() => {});
    setSaved(true);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6">
      <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
        <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </Button>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Tra từ nhanh</h1>
      </header>

      <form className="flex gap-2" onSubmit={search}>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-white px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="h-11 flex-1 bg-transparent outline-none"
            placeholder="Nhập từ tiếng Anh..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          Tra
        </Button>
      </form>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      {result ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            {result.images[0] ? (
              <img src={result.images[0].url} alt="" className="h-48 w-full rounded-md object-cover" />
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black capitalize">{result.query}</h2>
                {result.dict?.phonetic ? <p className="text-muted-foreground">{result.dict.phonetic}</p> : null}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => speakText(result.query, result.dict?.audioUrl)}
                aria-label="Nghe"
              >
                <Volume2 className="h-5 w-5" /> Nghe
              </Button>
            </div>

            {result.vi ? (
              <p className="text-xl font-bold text-primary">🇻🇳 {result.vi}</p>
            ) : null}

            {result.dict?.meanings.slice(0, 3).map((m, i) => (
              <div key={i} className="rounded-md bg-muted p-3">
                <p className="text-sm font-bold text-muted-foreground">{m.partOfSpeech}</p>
                <p className="font-semibold">{m.definitions[0]}</p>
                {m.examples[0] ? <p className="mt-1 text-sm italic text-muted-foreground">“{m.examples[0]}”</p> : null}
              </div>
            ))}

            <Button type="button" className="w-full" onClick={save} disabled={saved}>
              <BookmarkPlus className="h-5 w-5" />
              {saved ? "Đã lưu vào My Words" : "Lưu vào My Words"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
