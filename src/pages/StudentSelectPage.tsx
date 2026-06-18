import { SEED_STUDENTS } from "@/data/seedStudents";
import { avatarEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";

interface StudentSelectPageProps {
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
}

export function StudentSelectPage({ selectedStudentId, onSelectStudent }: StudentSelectPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-8 px-5 py-10">
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-4xl shadow-card">🦉</div>
        <h1 className="text-3xl font-black tracking-tight">Hôm nay ai học nào?</h1>
        <p className="mt-2 font-semibold text-muted-foreground">Chọn bé để tiếp tục hành trình tiếng Anh.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {SEED_STUDENTS.map((student) => {
          const selected = student.id === selectedStudentId;
          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onSelectStudent(student.id)}
              className={cn(
                "flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-6 shadow-card transition-transform active:scale-[0.97]",
                selected ? "border-primary" : "border-border/70 hover:border-primary/50",
              )}
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary/20 text-6xl">
                {avatarEmoji(student.avatar)}
              </span>
              <span className="text-2xl font-black">{student.name}</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold text-muted-foreground">
                Lớp {student.grade} · {student.dailyGoal} từ/ngày
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
