import { BarChart3, Check, Crown, Image as ImageIcon, Loader2, RotateCcw, Search, Shield, Users, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listUsers, resetScores, setImageEditor, setPremium, setStudentLimit, type AdminUser } from "@/services/studentService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";

type Tab = "users" | "tools" | "data";

export function AdminPage({ onBack, onOpenPicker }: { onBack: () => void; onOpenPicker: () => void }) {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    listUsers().then((u) => alive && setUsers(u)).catch(() => alive && setUsers([]));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, premium: 0, students: 0, admins: 0 };
    return {
      total: users.length,
      premium: users.filter((u) => u.isPremium).length,
      students: users.reduce((s, u) => s + u.studentCount, 0),
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  const changeLimit = (id: string, val: number) =>
    setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, studentLimit: val } : u)) ?? null);

  const save = async (u: AdminUser) => {
    await setStudentLimit(u.id, u.studentLimit).catch(() => {});
    setSaved(u.id);
    setTimeout(() => setSaved((s) => (s === u.id ? null : s)), 1500);
  };

  const togglePremium = async (u: AdminUser) => {
    const next = u.isPremium ? 0 : 1;
    setUsers((prev) => prev?.map((x) => (x.id === u.id ? { ...x, isPremium: next } : x)) ?? null);
    await setPremium(u.id, !!next).catch(() => {});
  };

  const toggleEditor = async (u: AdminUser) => {
    const next = u.canEditImages ? 0 : 1;
    setUsers((prev) => prev?.map((x) => (x.id === u.id ? { ...x, canEditImages: next } : x)) ?? null);
    await setImageEditor(u.id, !!next).catch(() => {});
  };

  // Reset
  const RESET_ITEMS = [
    { key: "xp", label: "Điểm XP (⭐) + bảng xếp hạng", icon: "⭐" },
    { key: "streak", label: "Chuỗi ngày học (🔥 streak)", icon: "🔥" },
    { key: "progress", label: "Tiến độ học (từ đã thuộc + lịch ôn)", icon: "📚" },
    { key: "quiz", label: "Lịch sử bài test", icon: "📝" },
    { key: "lookups", label: "My Words (từ đã lưu khi tra)", icon: "🔖" },
  ] as const;
  const [resetOpts, setResetOpts] = useState<Record<string, boolean>>({});
  const [resetting, setResetting] = useState(false);
  const anySel = Object.values(resetOpts).some(Boolean);
  const doReset = async () => {
    const chosen = RESET_ITEMS.filter((i) => resetOpts[i.key]).map((i) => i.label);
    if (!chosen.length) return;
    if (!confirm("Reset cho TẤT CẢ học sinh các mục:\n- " + chosen.join("\n- ") + "\n\nKhông hoàn tác được. Tiếp tục?")) return;
    setResetting(true);
    try { await resetScores(resetOpts); alert("Đã reset xong."); setResetOpts({}); }
    catch { alert("Reset lỗi."); } finally { setResetting(false); }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "users", label: "Người dùng", icon: <Users className="h-4 w-4" /> },
    { key: "tools", label: "Công cụ", icon: <Zap className="h-4 w-4" /> },
    { key: "data", label: "Dữ liệu", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-6">
      <SessionHeader title="Quản trị" onClose={onBack} />

      {/* Stats bar */}
      {users && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-extrabold"><Users className="mr-1 inline h-3.5 w-3.5" />{stats.total} tài khoản</span>
          <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-extrabold text-accent"><Crown className="mr-1 inline h-3.5 w-3.5" />{stats.premium} premium</span>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary">👦 {stats.students} học sinh</span>
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-extrabold"><Shield className="mr-1 inline h-3.5 w-3.5" />{stats.admins} admin</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-extrabold transition-colors",
              tab === t.key ? "bg-card text-primary shadow-card" : "text-muted-foreground",
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Người dùng ── */}
      {tab === "users" && (
        <div className="space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 focus-within:border-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="h-10 flex-1 bg-transparent text-sm font-bold outline-none"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {users === null ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center font-bold text-muted-foreground">Không tìm thấy</p>
          ) : (
            filtered.map((u) => (
              <Card key={u.id} className={cn(u.role === "admin" && "border-primary/30")}>
                <CardContent className="p-4">
                  {/* Header: avatar + info */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black",
                      u.role === "admin" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground",
                    )}>
                      {u.role === "admin" ? <Shield className="h-5 w-5" /> : u.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold truncate">
                        {u.name}
                        {u.role === "admin" && <span className="ml-1.5 rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-extrabold text-primary">ADMIN</span>}
                        {u.isPremium ? <span className="ml-1.5 rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-extrabold text-accent">PREMIUM</span> : null}
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold">{u.studentCount} bé</p>
                      <p className="text-xs font-bold text-muted-foreground">hạn mức {u.studentLimit}</p>
                    </div>
                  </div>

                  {/* Actions (không hiện cho admin) */}
                  {u.role !== "admin" && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                      {/* Hạn mức */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-muted-foreground">Hạn mức:</span>
                        <input
                          type="number" min={0} max={50}
                          className="h-8 w-14 rounded-lg border border-border px-2 text-center text-sm font-extrabold outline-none focus:border-primary"
                          value={u.studentLimit}
                          onChange={(e) => changeLimit(u.id, Math.max(0, Number(e.target.value)))}
                        />
                        <Button type="button" size="sm" variant={saved === u.id ? "default" : "outline"} onClick={() => save(u)}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="flex-1" />

                      {/* Toggle Premium */}
                      <button type="button" onClick={() => togglePremium(u)}
                        className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition-colors",
                          u.isPremium ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:bg-accent/20")}>
                        <Crown className="h-3.5 w-3.5" /> {u.isPremium ? "Premium" : "Free"}
                      </button>

                      {/* Toggle Editor */}
                      <button type="button" onClick={() => toggleEditor(u)}
                        className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-extrabold transition-colors",
                          u.canEditImages ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/20")}>
                        <ImageIcon className="h-3.5 w-3.5" /> Ảnh
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── Tab: Công cụ ── */}
      {tab === "tools" && (
        <div className="space-y-3">
          {/* Chỉnh ảnh từ vựng */}
          <Card className="cursor-pointer transition-transform active:scale-[0.99]" onClick={onOpenPicker}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <ImageIcon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-extrabold">Chỉnh ảnh từ vựng</p>
                <p className="text-sm font-semibold text-muted-foreground">Tìm & chọn ảnh phù hợp cho từng từ (Pexels)</p>
              </div>
            </CardContent>
          </Card>

          {/* Link picker */}
          <Card className="cursor-pointer transition-transform active:scale-[0.99]" onClick={() => window.open("/picker", "_blank")}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                🖼️
              </span>
              <div className="flex-1">
                <p className="font-extrabold">Trình chỉnh ảnh nâng cao</p>
                <p className="text-sm font-semibold text-muted-foreground">Mở /picker — lưới 6 cột, lọc theo cấp, phân trang</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Dữ liệu ── */}
      {tab === "data" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="h-5 w-5 text-red-500" />
                <h3 className="font-extrabold">Reset dữ liệu học sinh</h3>
              </div>
              <p className="mb-3 text-sm font-semibold text-muted-foreground">Chọn mục cần reset cho <strong>TẤT CẢ</strong> học sinh. Thao tác không hoàn tác được.</p>
              <div className="space-y-2">
                {RESET_ITEMS.map((it) => (
                  <label key={it.key} className="flex cursor-pointer items-center gap-3 rounded-xl bg-muted px-3 py-2.5 transition-colors hover:bg-red-50">
                    <input type="checkbox" className="h-4 w-4 accent-red-500 rounded" checked={!!resetOpts[it.key]}
                      onChange={(e) => setResetOpts((o) => ({ ...o, [it.key]: e.target.checked }))} />
                    <span className="text-lg">{it.icon}</span>
                    <span className="text-sm font-bold">{it.label}</span>
                  </label>
                ))}
              </div>
              <Button type="button" variant="destructive" className="mt-4 w-full" disabled={!anySel || resetting} onClick={doReset}>
                {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                Reset {RESET_ITEMS.filter((i) => resetOpts[i.key]).length} mục đã chọn
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
