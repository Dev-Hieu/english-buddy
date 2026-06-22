import { BarChart3, Check, Crown, Edit3, GraduationCap, Image as ImageIcon, Loader2, LogIn, Plus, RotateCcw, Search, Shield, Trash2, UserPlus, Users, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  listUsers, resetScores, setImageEditor, setPremium, setStudentLimit,
  createUser, deleteUser, listAllStudents, createStudentDirect, deleteStudentAdmin, updateStudentAdmin,
  type AdminUser, type AdminStudent, type CreateStudentDirectPayload,
} from "@/services/studentService";
import { avatarEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";

type Tab = "users" | "students" | "tools";

interface AdminPageProps {
  onBack: () => void;
  onOpenPicker: () => void;
  onLoginAsStudent?: (studentId: string) => void;
}

export function AdminPage({ onBack, onOpenPicker, onLoginAsStudent }: AdminPageProps) {
  const [tab, setTab] = useState<Tab | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [students, setStudents] = useState<AdminStudent[] | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);

  const loadUsers = () => listUsers().then(setUsers).catch(() => setUsers([]));
  const loadStudents = () => listAllStudents().then(setStudents).catch(() => setStudents([]));
  useEffect(() => { loadUsers(); loadStudents(); }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q) || (s.parentName || "").toLowerCase().includes(q));
  }, [students, search]);

  const stats = useMemo(() => ({
    users: users?.length || 0,
    premium: users?.filter((u) => u.isPremium).length || 0,
    students: students?.length || 0,
    admins: users?.filter((u) => u.role === "admin").length || 0,
  }), [users, students]);

  // User actions
  const changeLimit = (id: string, val: number) =>
    setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, studentLimit: val } : u)) ?? null);
  const save = async (u: AdminUser) => {
    await setStudentLimit(u.id, u.studentLimit).catch(() => {});
    setSaved(u.id); setTimeout(() => setSaved((s) => (s === u.id ? null : s)), 1500);
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
  const handleDeleteUser = async (u: AdminUser) => {
    if (!confirm(`Xoá "${u.name}" (${u.email})?\nTất cả học sinh + dữ liệu bị xoá.`)) return;
    await deleteUser(u.id).catch(() => {}); loadUsers(); loadStudents();
  };
  const handleDeleteStudent = async (s: AdminStudent) => {
    if (!confirm(`Xoá học sinh "${s.name}"?\nDữ liệu học bị xoá.`)) return;
    await deleteStudentAdmin(s.id).catch(() => {}); loadStudents(); loadUsers();
  };
  const handleSaveStudent = async (s: AdminStudent, data: Partial<AdminStudent>) => {
    await updateStudentAdmin(s.id, data).catch(() => {});
    loadStudents(); setEditingStudent(null);
  };

  // Reset
  const RESET_ITEMS = [
    { key: "xp", label: "Điểm XP + xếp hạng", icon: "⭐" },
    { key: "streak", label: "Chuỗi ngày học", icon: "🔥" },
    { key: "progress", label: "Tiến độ học", icon: "📚" },
    { key: "quiz", label: "Lịch sử test", icon: "📝" },
    { key: "lookups", label: "My Words", icon: "🔖" },
  ] as const;
  const [resetOpts, setResetOpts] = useState<Record<string, boolean>>({});
  const [resetting, setResetting] = useState(false);
  const doReset = async () => {
    const chosen = RESET_ITEMS.filter((i) => resetOpts[i.key]).map((i) => i.label);
    if (!chosen.length || !confirm("Reset TẤT CẢ:\n- " + chosen.join("\n- "))) return;
    setResetting(true);
    try { await resetScores(resetOpts); alert("Đã reset."); setResetOpts({}); }
    catch { alert("Lỗi."); } finally { setResetting(false); }
  };

  const tabList: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "users", label: "Tài khoản", icon: <Users className="h-4 w-4" /> },
    { key: "students", label: "Học sinh", icon: <GraduationCap className="h-4 w-4" /> },
    { key: "tools", label: "Công cụ", icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-6">
      <SessionHeader title="Quản trị" onClose={onBack} />

      {/* Dashboard chào */}
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
        <p className="text-lg font-black">Xin chào, Quản trị viên 👋</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-extrabold"><Users className="mr-1 inline h-3.5 w-3.5" />{stats.users} tài khoản</span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-extrabold">👦 {stats.students} học sinh</span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-extrabold"><Crown className="mr-1 inline h-3.5 w-3.5" />{stats.premium} premium</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
        {tabList.map((t) => (
          <button key={t.key} type="button" onClick={() => { setTab(t.key); setSearch(""); }}
            className={cn("flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-extrabold transition-colors",
              tab === t.key ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Chưa chọn tab → quick actions + reset */}
      {tab === null && (
        <div className="space-y-3">
          <h3 className="font-extrabold">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => { setTab("users"); setShowAddUser(true); }}><UserPlus className="h-4 w-4" /> Thêm tài khoản</Button>
            <Button type="button" variant="outline" onClick={() => { setTab("students"); setShowAddStudent(true); }}><Plus className="h-4 w-4" /> Tạo học sinh</Button>
            <Button type="button" variant="outline" onClick={onOpenPicker}><ImageIcon className="h-4 w-4" /> Chỉnh ảnh</Button>
            <Button type="button" variant="outline" onClick={() => window.open("/picker", "_blank")}>🖼️ Picker nâng cao</Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="flex items-center gap-2 font-extrabold mb-2"><RotateCcw className="h-4 w-4 text-red-500" /> Reset dữ liệu</h3>
              <div className="space-y-1.5">
                {RESET_ITEMS.map((it) => (
                  <label key={it.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-bold hover:bg-red-50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 accent-red-500" checked={!!resetOpts[it.key]}
                      onChange={(e) => setResetOpts((o) => ({ ...o, [it.key]: e.target.checked }))} />
                    {it.icon} {it.label}
                  </label>
                ))}
              </div>
              <Button type="button" variant="destructive" size="sm" className="mt-2" disabled={!Object.values(resetOpts).some(Boolean) || resetting} onClick={doReset}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search bar */}
      {(tab === "users" || tab === "students") && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="h-10 flex-1 bg-transparent text-sm font-bold outline-none" placeholder="Tìm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" onClick={() => setSearch("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>
      )}

      {/* ── Tài khoản ── */}
      {tab === "users" && (
        <div className="space-y-3">
          <Button type="button" className="w-full" onClick={() => setShowAddUser(true)}><UserPlus className="h-4 w-4" /> Thêm tài khoản</Button>
          {showAddUser && <AddUserForm onDone={() => { setShowAddUser(false); loadUsers(); }} onCancel={() => setShowAddUser(false)} />}
          {users === null ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          : filtered.map((u) => (
            <Card key={u.id} className={cn(u.role === "admin" && "border-primary/30")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-black",
                    u.role === "admin" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground")}>
                    {u.role === "admin" ? <Shield className="h-5 w-5" /> : u.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold truncate">{u.name}
                      {u.role === "admin" && <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">ADMIN</span>}
                      {u.isPremium ? <span className="ml-1 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-extrabold text-accent">PREMIUM</span> : null}
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground truncate">{u.email} · {u.studentCount} bé</p>
                  </div>
                  {u.role !== "admin" && <button type="button" onClick={() => handleDeleteUser(u)} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
                </div>
                {u.role !== "admin" && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-2">
                    <span className="text-xs font-bold text-muted-foreground">Hạn mức:</span>
                    <input type="number" min={0} max={50} className="h-7 w-12 rounded-lg border border-border px-1 text-center text-xs font-extrabold outline-none focus:border-primary"
                      value={u.studentLimit} onChange={(e) => changeLimit(u.id, Math.max(0, Number(e.target.value)))} />
                    <Button type="button" size="sm" variant={saved === u.id ? "default" : "outline"} onClick={() => save(u)} className="h-7 px-2"><Check className="h-3 w-3" /></Button>
                    <div className="flex-1" />
                    <button type="button" onClick={() => togglePremium(u)} className={cn("rounded-lg px-2 py-1 text-xs font-extrabold", u.isPremium ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                      <Crown className="mr-0.5 inline h-3 w-3" />{u.isPremium ? "Premium" : "Free"}
                    </button>
                    <button type="button" onClick={() => toggleEditor(u)} className={cn("rounded-lg px-2 py-1 text-xs font-extrabold", u.canEditImages ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <ImageIcon className="mr-0.5 inline h-3 w-3" />Ảnh
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Học sinh ── */}
      {tab === "students" && (
        <div className="space-y-3">
          <Button type="button" className="w-full" onClick={() => setShowAddStudent(true)}><Plus className="h-4 w-4" /> Tạo học sinh mới</Button>
          {showAddStudent && <AddStudentForm onDone={() => { setShowAddStudent(false); loadStudents(); loadUsers(); }} onCancel={() => setShowAddStudent(false)} />}
          {editingStudent && <EditStudentForm student={editingStudent} onSave={(d) => handleSaveStudent(editingStudent, d)} onCancel={() => setEditingStudent(null)} />}
          {students === null ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          : filteredStudents.length === 0 ? <p className="py-8 text-center font-bold text-muted-foreground">Chưa có học sinh</p>
          : filteredStudents.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-xl">
                    {avatarEmoji(s.avatar || "boy")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold truncate">{s.name}</p>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Lớp {s.grade} · {(s.level || "a1").toUpperCase()} · ⭐{s.xp || 0} · 🔥{s.streak || 0}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground truncate">
                      👤 {s.parentName || "Lớp học"} {s.parentEmail && s.parentEmail !== "classroom@system" ? `(${s.parentEmail})` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {onLoginAsStudent && (
                      <button type="button" onClick={() => onLoginAsStudent(s.id)} title="Học thử"
                        className="flex items-center gap-1 rounded-lg bg-primary/15 px-2 py-1 text-xs font-extrabold text-primary hover:bg-primary/25">
                        <LogIn className="h-3 w-3" /> Học thử
                      </button>
                    )}
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setEditingStudent(s)} title="Sửa" className="text-muted-foreground hover:text-primary"><Edit3 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => handleDeleteStudent(s)} title="Xoá" className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Công cụ ── */}
      {tab === "tools" && (
        <div className="space-y-3">
          <Card className="cursor-pointer active:scale-[0.99]" onClick={onOpenPicker}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><ImageIcon className="h-6 w-6" /></span>
              <div><p className="font-extrabold">Chỉnh ảnh từ vựng</p><p className="text-sm font-semibold text-muted-foreground">Tìm & chọn ảnh cho từng từ</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer active:scale-[0.99]" onClick={() => window.open("/picker", "_blank")}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">🖼️</span>
              <div><p className="font-extrabold">Picker nâng cao</p><p className="text-sm font-semibold text-muted-foreground">Lưới 6 cột, lọc cấp, phân trang</p></div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

// ── Form thêm tài khoản ──
function AddUserForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true); setError("");
    try { await createUser({ name: name.trim(), email: email.trim(), password, isPremium }); onDone(); }
    catch { setError("Email có thể đã tồn tại."); } finally { setLoading(false); }
  };
  return (
    <Card className="border-primary/30"><CardContent className="p-4">
      <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold text-primary">Thêm tài khoản</h3><button type="button" onClick={onCancel}><X className="h-4 w-4 text-muted-foreground" /></button></div>
      <form className="space-y-2" onSubmit={submit}>
        <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" className="h-4 w-4 accent-accent" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} /><Crown className="h-3.5 w-3.5 text-accent" /> Premium</label>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !name.trim() || !email.trim()}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Tạo</Button>
      </form>
    </CardContent></Card>
  );
}

// ── Form tạo học sinh ──
function AddStudentForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [level, setLevel] = useState("a1");
  const [avatar, setAvatar] = useState("boy");
  const [withAccount, setWithAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const payload: CreateStudentDirectPayload = { name: name.trim(), grade, level, avatar };
      if (withAccount && email.trim()) { payload.email = email.trim(); payload.password = password; }
      const res = await createStudentDirect(payload);
      setResult(res.user ? `✓ ${res.student.name} — ${res.user.email} / ${password}` : `✓ ${res.student.name} (Lớp học)`);
      setTimeout(onDone, 1500);
    } catch { setError("Email có thể trùng."); } finally { setLoading(false); }
  };
  return (
    <Card className="border-primary/30"><CardContent className="p-4">
      <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold text-primary">Tạo học sinh</h3><button type="button" onClick={onCancel}><X className="h-4 w-4 text-muted-foreground" /></button></div>
      <form className="space-y-2" onSubmit={submit}>
        <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Tên bé" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2">
          <select className="h-10 flex-1 rounded-xl border-2 border-border px-2 text-sm font-bold" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
          </select>
          <select className="h-10 flex-1 rounded-xl border-2 border-border px-2 text-sm font-bold" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["kids","a1","a2","b1","b2","c1"].map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <select className="h-10 rounded-xl border-2 border-border px-2 text-sm font-bold" value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option value="boy">👦 Nam</option>
            <option value="girl">👧 Nữ</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" className="h-4 w-4 accent-primary" checked={withAccount} onChange={(e) => setWithAccount(e.target.checked)} />
          Tạo tài khoản đăng nhập riêng
        </label>
        {withAccount && (
          <div className="space-y-2 rounded-xl bg-muted p-3">
            <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" placeholder="Mật khẩu (mặc định 123456)" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        {result && <p className="text-sm font-bold text-emerald-600">{result}</p>}
        <Button type="submit" className="w-full" disabled={loading || !name.trim()}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Tạo</Button>
      </form>
    </CardContent></Card>
  );
}

// ── Form sửa học sinh ──
function EditStudentForm({ student, onSave, onCancel }: { student: AdminStudent; onSave: (data: Partial<AdminStudent>) => void; onCancel: () => void }) {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [level, setLevel] = useState(student.level || "a1");
  const [avatar, setAvatar] = useState(student.avatar || "boy");
  return (
    <Card className="border-accent/30"><CardContent className="p-4">
      <div className="flex items-center justify-between mb-3"><h3 className="font-extrabold text-accent">Sửa: {student.name}</h3><button type="button" onClick={onCancel}><X className="h-4 w-4 text-muted-foreground" /></button></div>
      <div className="space-y-2">
        <input className="h-10 w-full rounded-xl border-2 border-border px-3 text-sm font-bold outline-none focus:border-primary" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2">
          <select className="h-10 flex-1 rounded-xl border-2 border-border px-2 text-sm font-bold" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
          </select>
          <select className="h-10 flex-1 rounded-xl border-2 border-border px-2 text-sm font-bold" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["kids","a1","a2","b1","b2","c1"].map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <select className="h-10 rounded-xl border-2 border-border px-2 text-sm font-bold" value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option value="boy">👦 Nam</option>
            <option value="girl">👧 Nữ</option>
          </select>
        </div>
        <Button type="button" className="w-full" onClick={() => onSave({ name, grade, level, avatar })}><Check className="h-4 w-4" /> Lưu</Button>
      </div>
    </CardContent></Card>
  );
}
