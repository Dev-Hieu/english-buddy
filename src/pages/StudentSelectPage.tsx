import { Image as ImageIcon, LogOut, Pencil, Plus, Shield, Trash2, X } from "lucide-react";
import { useState } from "react";
import { LEVEL_LABELS, LEVEL_ORDER, type Student } from "@/types";
import type { AuthUser } from "@/services/authService";
import type { NewStudent } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";

interface StudentSelectPageProps {
  students: Student[];
  user: AuthUser;
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
  onAddStudent: (data: NewStudent) => Promise<void>;
  onUpdateStudent: (id: string, data: Partial<NewStudent>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenPicker: () => void;
}

type FormState = null | { mode: "add" } | { mode: "edit"; student: Student };

export function StudentSelectPage(p: StudentSelectPageProps) {
  const { students, user, selectedStudentId, onSelectStudent, onAddStudent, onUpdateStudent, onDeleteStudent, onLogout, onOpenAdmin, onOpenPicker } = p;
  const [form, setForm] = useState<FormState>(null);
  const [manage, setManage] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";
  const limit = user.studentLimit ?? 1;
  const atLimit = !isAdmin && students.length >= limit;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-6 px-5 py-10">
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-4xl shadow-card">🦉</div>
        <h1 className="text-3xl font-black tracking-tight">Chào {user.name}!</h1>
        <p className="mt-2 font-semibold text-muted-foreground">
          {isAdmin ? "Tài khoản quản trị." : `Chọn bé để học · ${students.length}/${limit} hồ sơ`}
        </p>
      </header>

      {error ? <p className="text-center text-sm font-bold text-red-600">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2">
        {students.map((s) => {
          const selected = s.id === selectedStudentId;
          return (
            <div key={s.id} className={cn("relative flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-6 shadow-card", selected ? "border-primary" : "border-border/70")}>
              {manage ? (
                <div className="absolute right-3 top-3 flex gap-1">
                  <button type="button" aria-label="Sửa" onClick={() => { setError(""); setForm({ mode: "edit", student: s }); }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button type="button" aria-label="Xoá" onClick={() => confirm(`Xoá hồ sơ "${s.name}"? Mất toàn bộ tiến độ.`) && onDeleteStudent(s.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ) : null}
              <button type="button" onClick={() => onSelectStudent(s.id)} className="flex flex-col items-center gap-3 transition-transform active:scale-[0.97]">
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary/20 text-6xl">{avatarEmoji(s.avatar)}</span>
                <span className="text-2xl font-black">{s.name}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-muted-foreground">Lớp {s.grade}</span>
              </button>
            </div>
          );
        })}

        {form ? (
          <StudentForm
            initial={form.mode === "edit" ? form.student : undefined}
            onClose={() => setForm(null)}
            onSubmit={async (data) => {
              setError("");
              try {
                if (form.mode === "edit") await onUpdateStudent(form.student.id, data);
                else await onAddStudent(data);
                setForm(null);
              } catch (e) {
                setError((e as Error).message || "Không lưu được.");
              }
            }}
          />
        ) : isAdmin ? null : atLimit ? (
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground">
            <p className="font-bold">Đã đạt giới hạn {limit} bé.</p>
            <p className="text-sm">Liên hệ admin để tăng hạn mức.</p>
          </div>
        ) : (
          <button type="button" onClick={() => { setError(""); setForm({ mode: "add" }); }} className="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-card/50 p-6 text-muted-foreground transition-colors hover:border-primary/50">
            <Plus className="h-8 w-8" /><span className="font-extrabold">Thêm bé</span>
          </button>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {students.length > 0 ? <Button type="button" variant="outline" onClick={() => setManage((m) => !m)}>{manage ? "Xong" : "Quản lý hồ sơ"}</Button> : null}
        {isAdmin ? <Button type="button" variant="secondary" onClick={onOpenAdmin}><Shield className="h-4 w-4" /> Quản trị</Button> : null}
        {isAdmin || user.canEditImages ? <Button type="button" variant="secondary" onClick={onOpenPicker}><ImageIcon className="h-4 w-4" /> Chỉnh ảnh</Button> : null}
        <Button type="button" variant="ghost" onClick={onLogout}><LogOut className="h-4 w-4" /> Đăng xuất</Button>
      </div>
    </main>
  );
}

function StudentForm({ initial, onClose, onSubmit }: { initial?: Student; onClose: () => void; onSubmit: (d: NewStudent) => Promise<void> }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [grade, setGrade] = useState(initial?.grade ?? 5);
  const [avatar, setAvatar] = useState(initial?.avatar ?? "girl_avatar_01");
  const [level, setLevel] = useState<string>(initial?.level ?? "a1");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try { await onSubmit({ name: name.trim(), grade, avatar, dailyGoal: initial?.dailyGoal ?? 10, level }); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-3xl border-2 border-dashed border-primary/50 bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="font-extrabold">{initial ? "Sửa hồ sơ bé" : "Thêm bé"}</span>
        <button type="button" onClick={onClose} aria-label="Đóng"><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <input className="h-11 rounded-2xl border-2 border-border px-3 font-bold outline-none focus:border-primary" placeholder="Tên bé" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="flex gap-2">
        <select className="h-11 flex-1 rounded-2xl border-2 border-border px-2 font-bold" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
          {[1,2,3,4,5,6,7,8,9].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
        <select className="h-11 flex-1 rounded-2xl border-2 border-border px-2 font-bold" value={avatar} onChange={(e) => setAvatar(e.target.value)}>
          <option value="girl_avatar_01">👧 Bạn gái</option>
          <option value="boy_avatar_01">👦 Bạn trai</option>
        </select>
      </div>
      <select className="h-11 rounded-2xl border-2 border-border px-2 font-bold" value={level} onChange={(e) => setLevel(e.target.value)}>
        {LEVEL_ORDER.map((lv) => <option key={lv} value={lv}>Trình độ: {LEVEL_LABELS[lv]}</option>)}
      </select>
      <Button type="submit" disabled={busy || !name.trim()}>{initial ? "Lưu" : <><Plus className="h-4 w-4" /> Tạo hồ sơ</>}</Button>
    </form>
  );
}
