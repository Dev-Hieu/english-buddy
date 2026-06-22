import { useCallback, useEffect, useState } from "react";
import { LogOut, ArrowLeft, Users, Target, Trash2 } from "lucide-react";
import {
  getTeacherClasses,
  getClassStudents,
  removeStudentFromClass,
  setStudentGoal,
  type ClassInfo,
  type ClassStudent,
} from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";

interface TeacherPageProps {
  teacherName: string;
  onLogout: () => void;
  onLoginAsStudent?: (studentId: string) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  starter: "bg-sky-100 text-sky-700",
  mover: "bg-green-100 text-green-700",
  flyer: "bg-purple-100 text-purple-700",
  ket: "bg-orange-100 text-orange-700",
  pet: "bg-rose-100 text-rose-700",
};

function levelBadge(level: string) {
  const cls = LEVEL_COLORS[level.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide", cls)}>
      {level}
    </span>
  );
}

export function TeacherPage({ teacherName, onLogout, onLoginAsStudent }: TeacherPageProps) {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [goalEdit, setGoalEdit] = useState<Record<string, number>>({});
  const [savingGoal, setSavingGoal] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadClasses = useCallback(() => {
    setLoadingClasses(true);
    getTeacherClasses()
      .then(setClasses)
      .catch(() => setError("Không tải được danh sách lớp."))
      .finally(() => setLoadingClasses(false));
  }, []);

  useEffect(() => { loadClasses(); }, [loadClasses]);

  const openClass = (cls: ClassInfo) => {
    setSelectedClass(cls);
    setLoadingStudents(true);
    setError("");
    getClassStudents(cls.id)
      .then((list) => {
        setStudents(list);
        const goals: Record<string, number> = {};
        for (const s of list) goals[s.id] = s.dailyGoal;
        setGoalEdit(goals);
      })
      .catch(() => setError("Không tải được danh sách học sinh."))
      .finally(() => setLoadingStudents(false));
  };

  const handleRemoveStudent = async (classId: string, studentId: string, name: string) => {
    if (!confirm(`Xoá "${name}" khỏi lớp này?`)) return;
    try {
      await removeStudentFromClass(classId, studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch {
      setError("Không xoá được học sinh.");
    }
  };

  const handleSaveGoal = async (studentId: string) => {
    const goal = goalEdit[studentId];
    if (!goal || goal < 1) return;
    setSavingGoal(studentId);
    try {
      await setStudentGoal(studentId, goal);
      setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, dailyGoal: goal } : s));
    } catch {
      setError("Không lưu được mục tiêu.");
    } finally {
      setSavingGoal(null);
    }
  };

  // ── Class detail view ──
  if (selectedClass) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-8">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setSelectedClass(null); setStudents([]); setError(""); }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted transition-colors hover:bg-secondary"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{selectedClass.name}</h1>
            <p className="text-sm font-semibold text-muted-foreground">
              Mã: <span className="font-extrabold text-primary">{selectedClass.code}</span>
              {selectedClass.grade ? ` · Khối ${selectedClass.grade}` : ""}
              {selectedClass.level ? ` · ${selectedClass.level}` : ""}
            </p>
          </div>
        </header>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p> : null}

        {loadingStudents ? (
          <p className="py-10 text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">📭</span>
            <p className="font-extrabold">Lớp chưa có học sinh</p>
          </div>
        ) : (
          <section className="flex flex-col gap-3">
            {students.map((s) => (
              <Card key={s.id} className="rounded-2xl shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
                      {avatarEmoji(s.avatar)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold">{s.name}</span>
                        {levelBadge(s.level)}
                        <span className="text-xs font-semibold text-muted-foreground">Khối {s.grade}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span>⚡ {s.xp} XP</span>
                        <span>🔥 {s.streak} ngày</span>
                        <span>📖 {s.vocabCount} từ</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="shrink-0 text-xs font-bold text-muted-foreground">Mục tiêu/ngày:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={goalEdit[s.id] ?? s.dailyGoal}
                          onChange={(e) => setGoalEdit((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
                          className="h-8 w-16 rounded-xl border border-border bg-background px-2 text-center text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={savingGoal === s.id}
                          onClick={() => handleSaveGoal(s.id)}
                        >
                          <Target className="h-3.5 w-3.5" />
                          {savingGoal === s.id ? "..." : "Lưu"}
                        </Button>
                        {onLoginAsStudent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onLoginAsStudent(s.id)}
                            className="text-primary border-primary/30"
                          >
                            Học thử
                          </Button>
                        )}
                        <button
                          type="button"
                          aria-label="Xoá khỏi lớp"
                          onClick={() => handleRemoveStudent(selectedClass.id, s.id, s.name)}
                          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    );
  }

  // ── Class list view ──
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-5 py-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-3xl shadow-card">🏫</div>
          <h1 className="text-2xl font-black tracking-tight">Xin chào, {teacherName}!</h1>
          <p className="text-sm font-semibold text-muted-foreground">Quản lý lớp học của bạn</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </header>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p> : null}

      {loadingClasses ? (
        <p className="py-10 text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">📭</span>
          <p className="font-extrabold">Chưa có lớp học nào</p>
          <p className="text-sm text-muted-foreground">Liên hệ quản trị viên để được thêm lớp.</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={() => openClass(cls)}
              className="group flex flex-col gap-3 rounded-2xl border-2 border-border/70 bg-card p-5 shadow-card transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 text-left">
                  <p className="truncate text-base font-extrabold">{cls.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-muted-foreground">
                    Mã: <span className="font-extrabold text-primary">{cls.code}</span>
                  </p>
                </div>
                <span className="shrink-0 text-2xl">📚</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                {cls.grade ? (
                  <span className="rounded-lg bg-muted px-2 py-0.5">Khối {cls.grade}</span>
                ) : null}
                {cls.level ? (
                  <span className={cn("rounded-lg px-2 py-0.5", LEVEL_COLORS[cls.level.toLowerCase()] ?? "bg-muted text-muted-foreground")}>
                    {cls.level}
                  </span>
                ) : null}
                <span className="flex items-center gap-1 rounded-lg bg-muted px-2 py-0.5">
                  <Users className="h-3 w-3" />
                  {cls.studentCount} học sinh
                </span>
              </div>
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
