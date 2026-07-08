import { useEffect, useState } from "react";
import { Copy, Pencil, Trash2, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import {
  type AdminClass,
  type AdminUser,
  listClasses,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClassAdmin,
  removeStudentFromClassAdmin,
  getClassStudentsAdmin,
  listUsers,
  listAllStudents,
  type AdminStudent,
} from "@/services/studentService";

interface ClassesTabProps { onRefresh: () => void; }

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];

export function ClassesTab({ onRefresh }: ClassesTabProps) {
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [allStudents, setAllStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createGrade, setCreateGrade] = useState("");
  const [createLevel, setCreateLevel] = useState("");
  const [createTeacher, setCreateTeacher] = useState("");
  const [createSaving, setCreateSaving] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  // Edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editTeacher, setEditTeacher] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Detail view
  const [detailClass, setDetailClass] = useState<AdminClass | null>(null);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [addStudentId, setAddStudentId] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [cls, users, students] = await Promise.all([
        listClasses(),
        listUsers(),
        listAllStudents(),
      ]);
      setClasses(cls);
      setTeachers(users.filter((u) => u.role === "teacher"));
      setAllStudents(students);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!createName.trim()) return;
    setCreateSaving(true);
    setCreateMsg("");
    try {
      await createClass({
        name: createName.trim(),
        teacherId: createTeacher || undefined,
        grade: createGrade ? Number(createGrade) : undefined,
        level: createLevel || undefined,
      });
      setCreateName(""); setCreateGrade(""); setCreateLevel(""); setCreateTeacher("");
      setShowCreate(false);
      await load();
      onRefresh();
    } catch (e: unknown) {
      setCreateMsg(`Lỗi: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setCreateSaving(false);
    }
  }

  function startEdit(c: AdminClass) {
    setEditId(c.id);
    setEditName(c.name);
    setEditGrade(c.grade ? String(c.grade) : "");
    setEditLevel(c.level || "");
    setEditTeacher(c.teacherId || "");
    setShowCreate(false);
    setDetailClass(null);
  }

  async function handleEditSave() {
    if (!editId || !editName.trim()) return;
    setEditSaving(true);
    try {
      await updateClass(editId, {
        name: editName.trim(),
        teacherId: editTeacher || undefined,
        grade: editGrade ? Number(editGrade) : undefined,
        level: editLevel || undefined,
      });
      setEditId(null);
      await load();
      onRefresh();
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xoá lớp "${name}"?`)) return;
    await deleteClass(id);
    await load();
    onRefresh();
  }

  async function openDetail(c: AdminClass) {
    setDetailClass(c);
    setEditId(null);
    setDetailLoading(true);
    try {
      const students = await getClassStudentsAdmin(c.id);
      setClassStudents(students);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleAddStudent() {
    if (!detailClass || !addStudentId) return;
    await addStudentToClassAdmin(detailClass.id, addStudentId);
    setAddStudentId("");
    const students = await getClassStudentsAdmin(detailClass.id);
    setClassStudents(students);
  }

  async function handleRemoveStudent(studentId: string) {
    if (!detailClass) return;
    await removeStudentFromClassAdmin(detailClass.id, studentId);
    const students = await getClassStudentsAdmin(detailClass.id);
    setClassStudents(students);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
  }

  // Student detail view
  if (detailClass) {
    const classStudentIds = new Set(classStudents.map((s) => s.id));
    const available = allStudents.filter((s) => !classStudentIds.has(s.id));
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button type="button" size="sm" variant="outline" onClick={() => setDetailClass(null)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
          <h2 className="text-xl font-black">{detailClass.name} — Học sinh</h2>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <p className="font-extrabold text-sm">Thêm học sinh vào lớp</p>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none"
                value={addStudentId}
                onChange={(e) => setAddStudentId(e.target.value)}
              >
                <option value="">-- Chọn học sinh --</option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (Lớp {s.grade}, {s.level.toUpperCase()})</option>
                ))}
              </select>
              <Button type="button" size="sm" onClick={handleAddStudent} disabled={!addStudentId}>
                Thêm
              </Button>
            </div>
          </CardContent>
        </Card>

        {detailLoading ? (
          <p className="text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
        ) : classStudents.length === 0 ? (
          <p className="text-center text-sm font-bold text-muted-foreground">Chưa có học sinh nào trong lớp.</p>
        ) : (
          <div className="space-y-2">
            {classStudents.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-sm">{s.name}</p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Lớp {s.grade} &nbsp;{s.level?.toUpperCase()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveStudent(s.id)}
                    aria-label="Xoá khỏi lớp"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Lớp học</h2>
        <Button type="button" size="sm" onClick={() => { setShowCreate((v) => !v); setEditId(null); }}>
          + Tạo lớp
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="font-extrabold">Tạo lớp mới</p>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Tên lớp"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={createGrade}
                onChange={(e) => setCreateGrade(e.target.value)}
              >
                <option value="">Khối (tuỳ chọn)</option>
                {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
              </select>
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={createLevel}
                onChange={(e) => setCreateLevel(e.target.value)}
              >
                <option value="">Cấp độ (tuỳ chọn)</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <select
                className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                value={createTeacher}
                onChange={(e) => setCreateTeacher(e.target.value)}
              >
                <option value="">Giáo viên (tuỳ chọn)</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            {createMsg && (
              <p className="text-sm font-bold text-red-500">{createMsg}</p>
            )}
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleCreate} disabled={createSaving || !createName.trim()}>
                {createSaving ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowCreate(false)}>
                Huỷ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class list */}
      {loading ? (
        <p className="text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
      ) : classes.length === 0 ? (
        <p className="text-center text-sm font-bold text-muted-foreground">Chưa có lớp nào.</p>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div key={c.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold">{c.name}</p>
                        {c.grade && (
                          <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-extrabold">
                            Lớp {c.grade}
                          </span>
                        )}
                        {c.level && (
                          <span className="rounded-lg bg-primary/15 px-2 py-0.5 text-xs font-extrabold text-primary">
                            {c.level.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Mã lớp: <span className="font-extrabold text-foreground">{c.code}</span></span>
                        <button
                          type="button"
                          className="rounded p-0.5 hover:bg-muted"
                          onClick={() => copyCode(c.code)}
                          title="Sao chép mã lớp"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                      {c.teacherName && (
                        <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                          GV: {c.teacherName}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                        {c.studentCount} học sinh
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => openDetail(c)}
                      >
                        <Users className="h-3.5 w-3.5" /> Học sinh
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(c)}
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(c.id, c.name)}
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {editId === c.id && (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <p className="font-extrabold">Sửa thông tin lớp</p>
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
                          <option value="">Khối (tuỳ chọn)</option>
                          {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                        </select>
                        <select
                          className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                          value={editLevel}
                          onChange={(e) => setEditLevel(e.target.value)}
                        >
                          <option value="">Cấp độ (tuỳ chọn)</option>
                          {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                        </select>
                        <select
                          className="rounded-xl border border-border px-2 py-2 text-sm font-bold focus:outline-none"
                          value={editTeacher}
                          onChange={(e) => setEditTeacher(e.target.value)}
                        >
                          <option value="">Giáo viên (tuỳ chọn)</option>
                          {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={handleEditSave} disabled={editSaving}>
                          {editSaving ? "Đang lưu..." : "Lưu"}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditId(null)}>
                          Huỷ
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
