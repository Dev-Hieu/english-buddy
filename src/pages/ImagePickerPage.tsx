import { Check, ChevronLeft, ChevronRight, ImageOff, Loader2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { getWordImages, pickImage } from "@/services/imageService";
import { LEVEL_LABELS, LEVEL_ORDER, type ImageResult, type Level, type VocabularyWord } from "@/types";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface ImagePickerPageProps {
  onBackHome: () => void;
}

const PAGE_SIZE = 24;

export function ImagePickerPage({ onBackHome }: ImagePickerPageProps) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const [missingOnly, setMissingOnly] = useState(false);
  const [level, setLevel] = useState<Level | "all">("all");
  const [page, setPage] = useState(0);

  // Modal tìm ảnh
  const [active, setActive] = useState<VocabularyWord | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [cands, setCands] = useState<ImageResult[] | null>(null);
  const [saving, setSaving] = useState("");
  const [cols, setCols] = useState(6); // cỡ lưới ảnh trong modal (mặc định 6/hàng)

  const imgOf = (w: VocabularyWord) => overrides[w.id] ?? w.imageUrl;

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return SEED_VOCABULARY.filter((w) => {
      if (missingOnly && imgOf(w)) return false;
      if (level !== "all" && w.level !== level) return false;
      if (kw && !w.word.toLowerCase().includes(kw) && !w.meaning_vi.toLowerCase().includes(kw)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, missingOnly, level, overrides]);

  const haveImg = useMemo(() => SEED_VOCABULARY.filter((w) => imgOf(w)).length, [overrides]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages - 1);
  const shown = filtered.slice(cur * PAGE_SIZE, cur * PAGE_SIZE + PAGE_SIZE);

  const doSearch = async (query: string, pg: number) => {
    setCands(null);
    setCands(await getWordImages(query.trim() || "object", 36, pg).catch(() => [])); // nhiều ảnh hơn để chọn đa dạng
  };
  const COLS: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const openModal = (w: VocabularyWord) => { setActive(w); setSearchQ(w.word); setSearchPage(1); void doSearch(w.word, 1); };
  const choose = async (url: string) => {
    if (!active) return;
    setSaving(url);
    try { await pickImage(active.id, url); setOverrides((o) => ({ ...o, [active.id]: url })); setActive(null); }
    catch { /* lỗi quyền */ } finally { setSaving(""); }
  };

  const resetPage = () => setPage(0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <SessionHeader title="Chỉnh ảnh từ vựng" onClose={onBackHome} />

      {/* Thống kê */}
      <p className="mb-3 text-sm font-semibold text-muted-foreground">
        Đã có ảnh <b className="text-primary">{haveImg}</b>/{SEED_VOCABULARY.length} từ · còn <b className="text-accent">{SEED_VOCABULARY.length - haveImg}</b> thiếu
      </p>

      {/* Bộ lọc */}
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-2xl border-2 border-border pl-9 pr-3 font-bold outline-none focus:border-primary"
            placeholder="Tìm từ..." value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }}
          />
        </div>
        <button type="button" onClick={() => { setMissingOnly((v) => !v); resetPage(); }}
          className={cn("shrink-0 rounded-2xl px-3 text-sm font-extrabold", missingOnly ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
          {missingOnly ? "● Chỉ thiếu ảnh" : "○ Chỉ thiếu ảnh"}
        </button>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...LEVEL_ORDER] as const).map((lv) => (
          <button key={lv} type="button" onClick={() => { setLevel(lv); resetPage(); }}
            className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-extrabold transition-colors", level === lv ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
            {lv === "all" ? "Tất cả" : LEVEL_LABELS[lv]}
          </button>
        ))}
      </div>

      {/* Lưới thẻ */}
      {shown.length === 0 ? (
        <p className="rounded-3xl border border-border/70 bg-card p-10 text-center font-bold text-muted-foreground">Không có từ phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((w) => {
            const url = imgOf(w);
            return (
              <div key={w.id} className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card">
                <div className="flex items-baseline justify-between gap-2 px-3 pt-3">
                  <span className="truncate text-base font-black capitalize">{w.word}</span>
                  <span className="shrink-0 text-[10px] font-extrabold uppercase text-muted-foreground">{w.level}</span>
                </div>
                <p className="truncate px-3 text-xs font-semibold text-muted-foreground">{w.meaning_vi}</p>
                <div className="mt-2 flex aspect-[4/3] items-center justify-center bg-secondary">
                  {url ? <img src={url} alt={w.meaning_vi} className="h-full w-full object-cover" />
                    : <span className="flex flex-col items-center gap-1 text-muted-foreground"><ImageOff className="h-7 w-7" /><span className="text-xs font-bold">Chưa có ảnh</span></span>}
                </div>
                <Button type="button" variant={url ? "secondary" : "default"} className="m-2" onClick={() => openModal(w)}>
                  {url ? "Đổi ảnh" : "Thêm ảnh"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {pages > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button type="button" variant="outline" size="icon" disabled={cur <= 0} onClick={() => setPage(cur - 1)}><ChevronLeft className="h-5 w-5" /></Button>
          <span className="font-bold text-muted-foreground">Trang {cur + 1}/{pages}</span>
          <Button type="button" variant="outline" size="icon" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}><ChevronRight className="h-5 w-5" /></Button>
        </div>
      ) : null}

      {/* Modal tìm ảnh */}
      {active ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => setActive(null)}>
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-background sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-black capitalize">{active.word}</p>
                <p className="truncate text-sm font-semibold text-muted-foreground">{active.meaning_vi}</p>
              </div>
              <button type="button" onClick={() => setActive(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-500"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 p-3">
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setSearchPage(1); void doSearch(searchQ, 1); }}>
                <input className="h-10 flex-1 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Nhập từ khoá khác để tìm ảnh..." />
                <Button type="submit"><Search className="h-4 w-4" /> Tìm</Button>
              </form>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-muted-foreground">💡 Đổi từ khoá nếu ảnh chưa hợp (vd "ripe banana", "banana fruit", "cartoon banana").</p>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-xs font-bold text-muted-foreground">Lưới:</span>
                  {[2, 3, 4, 5, 6].map((c) => (
                    <button key={c} type="button" onClick={() => setCols(c)}
                      className={cn("h-7 w-7 rounded-lg text-xs font-extrabold", cols === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {cands === null ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : cands.length === 0 ? (
                <p className="py-10 text-center font-bold text-muted-foreground">Không có ảnh. Thử từ khoá khác.</p>
              ) : (
                <div className={cn("grid gap-2", COLS[cols])}>
                  {cands.map((im) => (
                    <button key={im.id} type="button" disabled={!!saving} onClick={() => choose(im.url)}
                      className="group relative overflow-hidden rounded-2xl border-2 border-border transition-all hover:border-primary active:scale-[0.98]">
                      <img src={im.thumbUrl || im.url} alt="" className="aspect-[4/3] w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition group-hover:bg-primary/30 group-hover:opacity-100"><Check className="h-7 w-7 text-white" /></span>
                      {saving === im.url ? <span className="absolute inset-0 flex items-center justify-center bg-black/40"><Loader2 className="h-6 w-6 animate-spin text-white" /></span> : null}
                    </button>
                  ))}
                </div>
              )}
              {cands && cands.length > 0 ? (
                <div className="mt-3 flex justify-center gap-3">
                  <Button type="button" variant="outline" disabled={searchPage <= 1} onClick={() => { const p = searchPage - 1; setSearchPage(p); void doSearch(searchQ, p); }}>Trước</Button>
                  <span className="flex items-center text-sm font-bold text-muted-foreground">Trang {searchPage}</span>
                  <Button type="button" variant="outline" onClick={() => { const p = searchPage + 1; setSearchPage(p); void doSearch(searchQ, p); }}>Sau</Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
