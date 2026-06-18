import { BookOpen, CheckCircle2 } from "lucide-react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

interface StudentSelectPageProps {
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
}

export function StudentSelectPage({ selectedStudentId, onSelectStudent }: StudentSelectPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm font-bold text-primary">English Buddy</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hôm nay ai học tiếng Anh?</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Chọn một profile để app nhớ mục tiêu, tiến độ bài Food và các bài ôn tiếp theo.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {SEED_STUDENTS.map((student) => {
          const selected = student.id === selectedStudentId;
          return (
            <Card key={student.id} className={cn("overflow-hidden", selected && "border-primary/60 bg-primary/5")}>
              <CardContent className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary text-2xl font-black text-secondary-foreground">
                      {student.name.slice(-1)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">{student.name}</h2>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Lớp {student.grade} · {student.dailyGoal} từ/ngày
                      </p>
                    </div>
                  </div>
                  {selected ? <CheckCircle2 className="h-6 w-6 text-primary" /> : null}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-md bg-muted p-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">XP</p>
                    <p className="text-xl font-black">{student.xp}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Streak</p>
                    <p className="text-xl font-black">{student.streak} ngày</p>
                  </div>
                </div>

                <Button type="button" size="lg" className="w-full" onClick={() => onSelectStudent(student.id)}>
                  <BookOpen className="h-5 w-5" />
                  Vào học với {student.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
