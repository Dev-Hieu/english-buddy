import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";
import {
  type AdminStudent,
  type CreateStudentDirectPayload,
  listAllStudents,
  createStudentDirect,
  deleteStudentAdmin,
  updateStudentAdmin,
} from "@/services/studentService";

interface StudentsTabProps {
  onRefresh: () => void;
  onLoginAsStudent?: (studentId: string) => void;
}

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];

const CLASSROOM_EMAIL = "classroom@system";

export function StudentsTab({ onRefresh, onLoginAsStudent }: StudentsTabProps) {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addGrade, setAddGrade] = useState("1");
  const [addLevel, setAddLevel] = useState("kids");
  const [addAvatar, setAddAvatar] = useState("boy");
  const [addWithLogin, setAddWithLogin] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  // Edit form
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("1");
  const [editLevel, setEditLevel] = useState("kids");
  const [editAvatar, setEditAvatar] = useState("boy");
  const [editSaving, setEditSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await listAllStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchGrade = filterGrade ? String(s.grade) === filterGrade : true;
    const matchLevel = filterLevel ? s.level === filterLevel : true;
    return matchName && matchGrade && matchLevel;
  });

  async function handleAdd() {
    if (!addName.trim()) return;
    setAddSaving(true);
    setAddMsg("");
    try {
      const payload: CreateStudentDirectPayload = {
        name: addName.trim(),
        grade: Number(addGrade),
        level: addLevel,
        avatar: addAvatar,
      };
      if (addWithLogin && addEmail) {
        payload.email = addEmail;
        payload.password = addPassword;
      }
      const res = await createStudentDirect(payload);
      const cred = res.user ? ` — Email: ${res.user.email} / Mật khẩu: ${res.user.password}` : "";
      setAddMsg(`Tao thanh cong: ${res.student?.name ?? addName}${cred}`);
      setAddName(""); setAddEmail(""); setAddPassword(""); setAddWithLogin(false);
      await load();
      onRefresh();
    } catch (e: unknown) {
      setAddMsg(`Loi: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setAddSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xoa hoc sinh "${name}"?`)) return;
    await deleteStudentAdmin(id);
    await load();
    onRefresh();
  }

  function startEdit(s: AdminStudent) {
    setEditId(s.id);
    setEditName(s.name);
    setEditGrade(String(s.grade));
    setEditLevel(s.level);
    setEditAvatar(s.avatar || "boy");
    setShowAdd(false);
  }

  async function handleEditSave() {
    if (!editId || !editName.trim()) return;
    setEditSaving(true);
    try {
      await updateStudentAdmin(editId, {
        name: editName.trim(),
        grade: Number(editGrade),
        level: editLevel,
        avatar: editAvatar,
      });
      setEditId(null);
      await load();
      onRefresh();
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Hoc sinh</h2>
        <Button
          type="button"
          size="sm"
          onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
        >
          + Tao
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="font-extrabold">Them hoc sinh moi</p>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Ten hoc sinh"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={addGrade}
                onChange={(e) => setAddGrade(e.target.value)}
              >
                {GRADES.map((g) => <option key={g} value={g}>Lop {g}</option>)}
              </select>
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={addLevel}
                onChange={(e) => setAddLevel(e.target.value)}
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={addAvatar}
                onChange={(e) => setAddAvatar(e.target.value)}
              >
                <option value="boy">boy</option>
                <option value="girl">girl</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={addWithLogin}
                onChange={(e) => setAddWithLogin(e.target.checked)}
              />
              Tao tai khoan dang nhap rieng
            </label>
            {addWithLogin && (
              <div className="space-y-2">
                <input
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Email"
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Mat khau"
                  type="password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                />
              </div>
            )}
            {addMsg && (
              <p className={cn("text-sm font-bold", addMsg.startsWith("Loi") ? "text-red-500" : "text-green-600")}>
                {addMsg}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleAdd} disabled={addSaving}>
                {addSaving ? "Dang luu..." : "Luu"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Huy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Tim theo ten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none"
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
        >
          <option value="">Tat ca lop</option>
          {GRADES.map((g) => <option key={g} value={g}>Lop {g}</option>)}
        </select>
        <select
          className="rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none"
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
        >
          <option value="">Tat ca cap do</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Student list */}
      {loading ? (
        <p className="text-center text-sm font-bold text-muted-foreground">Dang tai...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm font-bold text-muted-foreground">Khong co hoc sinh nao.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id}>
              <Card>
                <CardContent className="p-4">
                  {/* Student info */}
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-2xl">
                      {avatarEmoji(s.avatar || "boy")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold">{s.name}</p>
                        <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-extrabold">
                          Lop {s.grade}
                        </span>
                        <span className="rounded-lg bg-primary/15 px-2 py-0.5 text-xs font-extrabold text-primary">
                          {s.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                        ⭐ {s.xp} XP &nbsp;🔥 {s.streak} ngay
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                        {s.parentEmail === CLASSROOM_EMAIL
                          ? "Lop hoc"
                          : `${s.parentName} (${s.parentEmail})`}
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="flex shrink-0 gap-1">
                      {onLoginAsStudent && (
                        <Button
                          type="button"
                          size="sm"
                          className="bg-primary/15 text-primary shadow-none hover:bg-primary/25"
                          onClick={() => onLoginAsStudent(s.id)}
                        >
                          Hoc thu
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(s)}
                        aria-label="Sua"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(s.id, s.name)}
                        aria-label="Xoa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {editId === s.id && (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <p className="font-extrabold">Sua thong tin</p>
                      <input
                        className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                        >
                          {GRADES.map((g) => <option key={g} value={g}>Lop {g}</option>)}
                        </select>
                        <select
                          className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                          value={editLevel}
                          onChange={(e) => setEditLevel(e.target.value)}
                        >
                          {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                        </select>
                        <select
                          className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                        >
                          <option value="boy">boy</option>
                          <option value="girl">girl</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={handleEditSave} disabled={editSaving}>
                          {editSaving ? "Dang luu..." : "Luu"}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditId(null)}>
                          Huy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
