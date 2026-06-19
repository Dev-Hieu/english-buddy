import { ArrowLeft, Check, ImageOff, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { getWordImages, pickImage } from "@/services/imageService";
import type { ImageResult, VocabularyWord } from "@/types";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface ImagePickerPageProps {
  onBackHome: () => void;
}

const MAX_ROWS = 80;

export function ImagePickerPage({ onBackHome }: ImagePickerPageProps) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [missingOnly, setMissingOnly] = useState(true);

  const [active, setActive] = useState<VocabularyWord | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [cands, setCands] = useState<ImageResult[] | null>(null);
  const [saving, setSaving] = useState("");

  const imgOf = (w: VocabularyWord) => overrides[w.id] ?? w.imageUrl;

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const arr = SEED_VOCABULARY.filter((w) => {
      if (missingOnly && imgOf(w)) return false;
      if (kw && !w.word.toLowerCase().includes(kw) && !w.meaning_vi.toLowerCase().includes(kw)) return false;
      return true;
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, missingOnly, overrides]);

  const totalMissing = useMemo(() => SEED_VOCABULARY.filter((w) => !imgOf(w)).length, [overrides]);

  const doSearch = async (query: string, pg: number) => {
    setCands(null);
    const r = await getWordImages(query.trim() || "object", 12, pg).catch(() => []);
    setCands(r);
  };
  const openSearch = (w: VocabularyWord) => { setActive(w); setSearchQ(w.word); setPage(1); void doSearch(w.word, 1); };
  const choose = async (w: VocabularyWord, url: string) => {
    setSaving(url);
    try { await pickImage(w.id, url); setOverrides((o) => ({ ...o, [w.id]: url })); setActive(null); }
    catch { /* lỗi quyền/admin */ }
    finally { setSaving(""); }
  };

  // ── Panel tìm & chọn ảnh cho 1 từ ──
  if (active) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4">
        <SessionHeader title={`Ảnh cho "${active.word}"`} onClose={() => setActive(null)} />
        <button type="button" onClick={() => setActive(null)} className="mb-3 flex items-center gap-1 text-sm font-bold text-primary">
          <ArrowLeft className="h-4 w-4" /> Về danh sách
        </button>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">{active.word} — {active.meaning_vi}</p>
        <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); setPage(1); void doSearch(searchQ, 1); }}>
          <input className="h-11 flex-1 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary"
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Từ khoá tìm ảnh..." />
          <Button type="submit"><Search className="h-4 w-4" /> Tìm</Button>
        </form>

        {cands === null ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : cands.length === 0 ? (
          <p className="py-8 text-center font-bold text-muted-foreground">Không tìm thấy ảnh. Thử từ khoá khác.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cands.map((im) => (
                <button key={im.id} type="button" disabled={!!saving} onClick={() => choose(active, im.url)}
                  className="relative overflow-hidden rounded-2xl border-2 border-border transition-all hover:border-primary active:scale-[0.98]">
                  <img src={im.thumbUrl || im.url} alt="" className="h-28 w-full object-cover" />
                  {saving === im.url ? <span className="absolute inset-0 flex items-center justify-center bg-black/40"><Loader2 className="h-6 w-6 animate-spin text-white" /></span> : null}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <Button type="button" variant="outline" disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); void doSearch(searchQ, p); }}>Trang trước</Button>
              <span className="flex items-center font-bold text-muted-foreground">Trang {page}</span>
              <Button type="button" variant="outline" onClick={() => { const p = page + 1; setPage(p); void doSearch(searchQ, p); }}>Trang sau</Button>
            </div>
          </>
        )}
      </main>
    );
  }

  // ── Danh sách từ ──
  return (
    <main className="mx-auto w-full max-w-2xl px-4">
      <SessionHeader title="Chỉnh ảnh từ vựng" onClose={onBackHome} />
      <p className="mb-3 text-sm font-semibold text-muted-foreground">Còn <b className="text-primary">{totalMissing}</b> từ thiếu ảnh. Bấm một từ để tìm & chọn ảnh.</p>

      <div className="mb-3 flex gap-2">
        <input className="h-11 flex-1 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary"
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm từ trong danh sách..." />
        <button type="button" onClick={() => setMissingOnly((v) => !v)}
          className={cn("shrink-0 rounded-2xl px-3 text-sm font-extrabold", missingOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
          {missingOnly ? "Chỉ thiếu ảnh" : "Tất cả"}
        </button>
      </div>

      <ul className="space-y-2">
        {list.slice(0, MAX_ROWS).map((w) => {
          const url = imgOf(w);
          return (
            <li key={w.id}>
              <button type="button" onClick={() => openSearch(w)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 text-left shadow-card transition-transform active:scale-[0.99]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <ImageOff className="h-5 w-5 text-muted-foreground" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-extrabold capitalize">{w.word} <span className="text-xs font-bold uppercase text-muted-foreground">{w.level}</span></span>
                  <span className="block truncate text-sm font-semibold text-muted-foreground">{w.meaning_vi}</span>
                </span>
                {url ? <Check className="h-5 w-5 shrink-0 text-success" /> : <Search className="h-5 w-5 shrink-0 text-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
      {list.length > MAX_ROWS ? <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">Hiện {MAX_ROWS}/{list.length} từ — gõ để lọc bớt.</p> : null}
    </main>
  );
}
