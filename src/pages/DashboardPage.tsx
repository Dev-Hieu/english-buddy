import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { QuizResult, StudentVocabularyProgress } from "@/types";
import { getStudentProgress } from "@/services/progressService";
import { getQuizResults } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardPageProps {
  onBackHome: () => void;
}

interface StudentStats {
  id: string;
  name: string;
  learned: number;
  due: number;
  mastered: number;
  lastScore: number | null;
  testCount: number;
  weakWords: string[];
}

const wordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w.word]));

async function loadStats(id: string, name: string): Promise<StudentStats> {
  const [progress, quizzes] = await Promise.all([
    getStudentProgress(id).catch(() => [] as StudentVocabularyProgress[]),
    getQuizResults(id).catch(() => [] as QuizResult[]),
  ]);
  const now = Date.now();
  const weak = progress
    .filter((p) => p.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5)
    .map((p) => wordById.get(p.wordId) ?? p.wordId);
  return {
    id,
    name,
    learned: progress.filter((p) => p.mastery > 0).length,
    due: progress.filter((p) => p.mastery > 0 && p.nextReviewAt <= now).length,
    mastered: progress.filter((p) => p.mastery >= 5).length,
    lastScore: quizzes[0]?.score ?? null,
    testCount: quizzes.length,
    weakWords: weak,
  };
}

export function DashboardPage({ onBackHome }: DashboardPageProps) {
  const [stats, setStats] = useState<StudentStats[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(SEED_STUDENTS.map((s) => loadStats(s.id, s.name)))
      .then((r) => alive && setStats(r))
      .catch(() => alive && setStats([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <header className="rounded-lg border border-border bg-white/85 p-5 shadow-soft">
        <Button type="button" variant="ghost" className="-ml-3" onClick={onBackHome}>
          <ArrowLeft className="h-4 w-4" /> Trang chủ
        </Button>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Theo dõi học tập</h1>
        <p className="text-muted-foreground">Tiến độ của từng bé (cần server đang chạy).</p>
      </header>

      {stats === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((s) => (
            <Card key={s.id}>
              <CardContent className="space-y-4 p-5">
                <h2 className="text-2xl font-black">{s.name}</h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat label="Đã học" value={s.learned} />
                  <Stat label="Cần ôn" value={s.due} />
                  <Stat label="Thành thạo" value={s.mastered} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <Stat label="Điểm test gần nhất" value={s.lastScore === null ? "—" : s.lastScore + "%"} />
                  <Stat label="Số bài test" value={s.testCount} />
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-bold">Từ hay sai</p>
                  <p className="text-muted-foreground">{s.weakWords.length ? s.weakWords.join(", ") : "Chưa có"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-secondary p-3 text-secondary-foreground">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}
