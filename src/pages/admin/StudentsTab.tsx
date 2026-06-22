import { LogIn, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";
import {
  type AdminStudent, type CreateStudentDirectPayload,
  listAllStudents, createStudentDirect, deleteStudentAdmin, updateStudentAdmin, setStudentAccount,
} from "@/services/studentService";

interface StudentsTabProps {
  onRefresh: () => void;
  onLoginAsStudent?: (studentId: string) => void;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];

export function StudentsTab({ onRefresh, onLoginAsStudent }: StudentsTabProps) {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", grade: "1", level: "kids", avatar: "boy", withLogin: false, email: "", password: "123456" });
  const [addMsg, setAddMsg] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  // Edit form
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", grade: "1", level: "kids", avatar: "boy", dailyGoal: "10", username: "", password: "" });
  const [editSaving, setEditSaving] = useState(false);

  const load = () => { setLoading(true); listAllStudents().then(setStudents).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => students.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterGrade && String(s.grade) !== filterGrade) return false;
    if (filterLevel && s.level !== filterLevel) return false;
    return true;
  }), [students, search, filterGrade, filterLevel]);

  const handleAdd = async () => {
    if (!addForm.name.trim()) return;
    setAddSaving(true); setAddMsg("");
    try {
      const payload: CreateStudentDirectPayload = { name: addForm.name.trim(), grade: Number(addForm.grade), level: addForm.level, avatar: addForm.avatar };
      if (addForm.withLogin && addForm.email.trim()) { payload.email = addForm.email.trim(); payload.password = addForm.password || "123456"; }
      const res = await createStudentDirect(payload);
      const cred = res.user ? ` — Đăng nhập: ${res.user.email} / ${addForm.password || "123456"}` : "";
      setAddMsg(`✓ Đã tạo: ${res.student?.name ?? addForm.name}${cred}`);
      setAddForm({ name: "", grade: "1", level: "kids", avatar: "boy", withLogin: false, email: "", password: "123456" });
      load(); onRefresh();
    } catch { setAddMsg("✗ Lỗi — email có thể đã tồn tại."); }
    finally { setAddSaving(false); }
  };

  const handleDelete = async (s: AdminStudent) => {
    if (!confirm(`Xoá học sinh "${s.name}"? Dữ liệu học sẽ bị xoá.`)) return;
    await deleteStudentAdmin(s.id).catch(() => {}); load(); onRefresh();
  };

  const startEdit = (s: AdminStudent) => {
    setEditId(s.id);
    setEditForm({ name: s.name, grade: String(s.grade), level: s.level || "a1", avatar: s.avatar || "boy", dailyGoal: String(s.dailyGoal ?? 10), username: s.parentUsername || "", password: "" });
    setShowAdd(false);
  };

  const [accountMsg, setAccountMsg] = useState("");

  const handleEditSave = async () => {
    if (!editId || !editForm.name.trim()) return;
    setEditSaving(true); setAccountMsg("");
    try {
      await updateStudentAdmin(editId, { name: editForm.name.trim(), grade: Number(editForm.grade), level: editForm.level, avatar: editForm.avatar, dailyGoal: Number(editForm.dailyGoal) });
      // Tạo hoặc cập nhật tài khoản đăng nhập
      if (editForm.username.trim() || editForm.password.trim()) {
        const accData: { username?: string; password?: string } = {};
        if (editForm.username.trim()) accData.username = editForm.username.trim();
        if (editForm.password.trim()) accData.password = editForm.password.trim();
        const res = await setStudentAccount(editId, accData).catch((e: any) => ({ ok: false, error: e?.message || "Lỗi" }));
        if ("error" in res) { setAccountMsg(`✗ ${(res as any).error}`); setEditSaving(false); return; }
        if ((res as any).created) setAccountMsg(`✓ Đã tạo TK: ${(res as any).username}`);
      }
      setEditId(null); load(); onRefresh();
    } finally { setEditSaving(false); }
  };

  const sel = "rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-bold outline-none focus:border-primary";
  const inp = "w-full rounded-xl border-2 border-border bg-card px-3 py-2.5 text-sm font-bold outline-none focus:border-primary";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Học sinh</h2>
        <Button type="button" onClick={() => { setShowAdd(!showAdd); setEditId(null); }}>
          <Plus className="h-4 w-4" /> Thêm mới
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-primary">Thêm học sinh mới</p>
              <button type="button" onClick={() => setShowAdd(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <input className={inp} placeholder="Tên học sinh" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            <div className="grid grid-cols-3 gap-2">
              <select className={sel} value={addForm.grade} onChange={(e) => setAddForm({ ...addForm, grade: e.target.value })}>
                {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
              </select>
              <select className={sel} value={addForm.level} onChange={(e) => setAddForm({ ...addForm, level: e.target.value })}>
                {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <select className={sel} value={addForm.avatar} onChange={(e) => setAddForm({ ...addForm, avatar: e.target.value })}>
                <option value="boy">👦 Nam</option>
                <option value="girl">👧 Nữ</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={addForm.withLogin} onChange={(e) => setAddForm({ ...addForm, withLogin: e.target.checked })} />
              Tạo tài khoản đăng nhập riêng
            </label>
            {addForm.withLogin && (
              <div className="space-y-2 rounded-xl bg-muted p-3">
                <input className={inp} placeholder="Email đăng nhập" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                <input className={inp} placeholder="Mật khẩu (mặc định 123456)" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
              </div>
            )}
            {addMsg && <p className={cn("text-sm font-bold", addMsg.startsWith("✗") ? "text-red-600" : "text-emerald-600")}>{addMsg}</p>}
            <div className="flex gap-2">
              <Button type="button" onClick={handleAdd} disabled={addSaving || !addForm.name.trim()}>
                {addSaving ? "Đang tạo..." : "Tạo học sinh"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Huỷ</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-border bg-card px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="h-9 flex-1 bg-transparent text-sm font-bold outline-none" placeholder="Tìm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" onClick={() => setSearch("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>
        <select className={sel} value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
          <option value="">Tất cả lớp</option>
          {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
        <select className={sel} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
          <option value="">Tất cả cấp độ</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Student list */}
      {loading ? (
        <p className="py-12 text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm font-bold text-muted-foreground">Không có học sinh nào.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-bold text-muted-foreground">{filtered.length} học sinh</p>
          {filtered.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl">
                    {avatarEmoji(s.avatar || "boy")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-extrabold">{s.name}</p>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-extrabold">Lớp {s.grade}</span>
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-extrabold text-primary">{(s.level || "a1").toUpperCase()}</span>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">⭐{s.xp || 0} · 🔥{s.streak || 0} ngày</p>
                    <p className="text-xs font-semibold text-muted-foreground truncate">
                      {s.parentEmail === "classroom@system" ? "📚 Lớp học" : `👤 ${s.parentName || ""} (${s.parentEmail || ""})`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {onLoginAsStudent && (
                      <button type="button" onClick={() => onLoginAsStudent(s.id)} title="Học thử"
                        className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20">
                        <LogIn className="h-3.5 w-3.5" /> Học thử
                      </button>
                    )}
                    <button type="button" onClick={() => startEdit(s)} title="Sửa" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(s)} title="Xoá" className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit form inline */}
                {editId === s.id && (
                  <div className="mt-3 space-y-3 border-t border-border pt-3">
                    <p className="font-extrabold text-accent">Sửa thông tin: {s.name}</p>
                    <input className={inp} placeholder="Tên học sinh" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <div className="grid grid-cols-3 gap-2">
                      <select className={sel} value={editForm.grade} onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}>
                        {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                      </select>
                      <select className={sel} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}>
                        {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                      </select>
                      <select className={sel} value={editForm.avatar} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}>
                        <option value="boy">👦 Nam</option>
                        <option value="girl">👧 Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Mục tiêu hàng ngày</label>
                      <input
                        type="number"
                        min={1}
                        max={200}
                        className={inp + " mt-1"}
                        placeholder="Mục tiêu hàng ngày"
                        value={editForm.dailyGoal}
                        onChange={(e) => setEditForm({ ...editForm, dailyGoal: e.target.value })}
                      />
                    </div>
                    {/* Tài khoản đăng nhập */}
                    <div className="space-y-2 rounded-xl bg-muted/50 border border-border p-3">
                      <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wide">
                        {s.parentEmail === "classroom@system" ? "Tạo tài khoản đăng nhập" : "Tài khoản đăng nhập"}
                      </p>
                      {s.parentEmail === "classroom@system" && (
                        <p className="text-xs font-semibold text-muted-foreground">Bé chưa có TK riêng. Nhập tên đăng nhập + mật khẩu để tạo.</p>
                      )}
                      <div>
                        <label className="text-xs font-bold text-muted-foreground">Tên đăng nhập</label>
                        <input className={inp + " mt-1"} value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder={s.parentEmail === "classroom@system" ? "Nhập tên đăng nhập (tự sinh nếu để trống)" : "VD: HS000001"} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground">
                          {s.parentEmail === "classroom@system" ? "Mật khẩu" : "Đổi mật khẩu"}
                        </label>
                        <input type="password" className={inp + " mt-1"} value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          placeholder={s.parentEmail === "classroom@system" ? "Nhập mật khẩu (bắt buộc)" : "Để trống nếu không đổi"} />
                      </div>
                      {accountMsg && <p className={cn("text-xs font-bold", accountMsg.startsWith("✗") ? "text-red-600" : "text-emerald-600")}>{accountMsg}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={handleEditSave} disabled={editSaving || !editForm.name.trim()}>
                        {editSaving ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditId(null)}>Huỷ</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
