import { Check, Crown, Image as ImageIcon, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { listUsers, setPremium, setStudentLimit, type AdminUser } from "@/services/studentService";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";

export function AdminPage({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    listUsers().then((u) => alive && setUsers(u)).catch(() => alive && setUsers([]));
    return () => { alive = false; };
  }, []);

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

  return (
    <main className="mx-auto w-full max-w-2xl px-4">
      <SessionHeader title="Quản trị người dùng" onClose={onBack} />

      <a
        href="/picker"
        target="_blank"
        rel="noreferrer"
        className="mb-4 flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <ImageIcon className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-extrabold">Chỉnh ảnh từ vựng</span>
          <span className="block text-sm font-semibold text-muted-foreground">Tìm & chọn ảnh phù hợp cho từng từ (mở tab mới)</span>
        </span>
      </a>

      {users === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <p className="mb-3 font-bold text-muted-foreground">{users.length} tài khoản · cấp hạn mức số bé cho từng phụ huynh</p>
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex flex-wrap items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    {u.role === "admin" ? <Shield className="h-5 w-5" /> : u.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold">{u.name} {u.role === "admin" ? <span className="text-primary">· Admin</span> : null}</span>
                    <span className="block truncate text-sm font-semibold text-muted-foreground">{u.email} · {u.studentCount} bé</span>
                  </span>
                  {u.role !== "admin" ? (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold text-muted-foreground">Hạn mức</label>
                      <input
                        type="number" min={0} max={50}
                        className="h-10 w-16 rounded-xl border-2 border-border px-2 text-center font-extrabold outline-none focus:border-primary"
                        value={u.studentLimit}
                        onChange={(e) => changeLimit(u.id, Math.max(0, Number(e.target.value)))}
                      />
                      <Button type="button" size="icon" variant={saved === u.id ? "default" : "outline"} aria-label="Lưu" onClick={() => save(u)}>
                        <Check className="h-5 w-5" />
                      </Button>
                      <button type="button" onClick={() => togglePremium(u)}
                        className={cn("flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-extrabold", u.isPremium ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                        <Crown className="h-4 w-4" /> {u.isPremium ? "Premium" : "Free"}
                      </button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
