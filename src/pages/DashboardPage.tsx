import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { QuizResult, StudentVocabularyProgress } from "@/types";
import { getStudentProgress } from "@/services/progressService";
import { getQuizResults } from "@/services/quizService";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { avatarEmoji } from "@/components/ui/emoji";

interface DashboardPageProps {
  onBackHome: () => void;
}

interface StudentStats {
  id: string; name: string; avatar: string;
  learned: number; due: number; mastered: number;
  lastScore: number | null; testCount: number; weakWords: string[];
}

const wordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w.word]));

async function loadStats(id: string, name: string, avatar: string): Promise<StudentStats> {
  const [progress, quizzes] = await Promise.all([
    getStudentProgress(id).catch(() => [] as StudentVocabularyProgress[]),
    getQuizResults(id).catch(() => [] as QuizResult[]),
  ]);
  const now = Date.now();
  const weak = progress.filter((p) => p.wrongCount > 0).sort((a, b) => b.wrongCount - a.wrongCount).slice(0, 5).map((p) => wordById.get(p.wordId) ?? p.wordId);
  return {
    id, name, avatar,
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
    Promise.all(SEED_STUDENTS.map((s) => loadStats(s.id, s.name, s.avatar)))
      .then((r) => alive && setStats(r)).catch(() => alive && setStats([]));
    return () => { alive = false; };
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-4">
      <SessionHeader title="Bảng theo dõi" onClose={onBackHome} />
      {stats === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {stats.map((s) => (
            <Card key={s.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">{avatarEmoji(s.avatar)}</span>
                  <h2 className="text-2xl font-black">{s.name}</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Đã học" value={s.learned} tone="primary" />
                  <Stat label="Cần ôn" value={s.due} tone="accent" />
                  <Stat label="Thành thạo" value={s.mastered} tone="success" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Điểm test gần nhất" value={s.lastScore === null ? "—" : s.lastScore + "%"} />
                  <Stat label="Số bài test" value={s.testCount} />
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <p className="text-sm font-extrabold">Từ hay sai</p>
                  <p className="font-semibold text-muted-foreground">{s.weakWords.length ? s.weakWords.join(", ") : "Chưa có"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string | number; tone?: "primary" | "accent" | "success" | "muted" }) {
  const bg = { primary: "bg-secondary text-secondary-foreground", accent: "bg-accent/15 text-accent", success: "bg-success/15 text-success", muted: "bg-muted text-foreground" }[tone];
  return (
    <div className={`rounded-2xl p-3 text-center ${bg}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold opacity-90">{label}</p>
    </div>
  );
}
