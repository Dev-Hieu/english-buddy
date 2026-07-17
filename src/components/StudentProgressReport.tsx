import { useEffect, useState } from "react";
import { getStudentProgress, getSkillTestResults, type SkillTestResult } from "@/services/progressService";
import { getQuizResults } from "@/services/quizService";
import type { StudentVocabularyProgress } from "@/types";
import type { QuizResult } from "@/types";

interface StudentProgressReportProps {
  studentId: string;
  studentName: string;
  studentXp?: number;
  studentStreak?: number;
  studentLevel?: string;
  onClose: () => void;
}

interface ReportData {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  masteryPercent: number;
  weakWords: { wordId: string; wrongCount: number; correctCount: number }[];
  recentQuizzes: QuizResult[];
  skillTests: SkillTestResult[];
  activeDays: number;
}

function computeReport(
  progress: StudentVocabularyProgress[],
  quizResults: QuizResult[],
  skillTests: SkillTestResult[],
): ReportData {
  const totalWords = progress.length;
  const masteredWords = progress.filter((p) => p.status === "mastered").length;
  const learningWords = progress.filter((p) => p.status === "learning" || p.status === "review").length;
  const masteryPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  // Weak words: sorted by most wrong answers
  const weakWords = progress
    .filter((p) => p.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 10)
    .map((p) => ({ wordId: p.wordId, wrongCount: p.wrongCount, correctCount: p.correctCount }));

  // Recent quizzes (last 5)
  const recentQuizzes = [...quizResults]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  // Active days (last 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const activeDaySet = new Set<string>();
  for (const p of progress) {
    if (p.lastReviewedAt && p.lastReviewedAt > thirtyDaysAgo) {
      activeDaySet.add(new Date(p.lastReviewedAt).toDateString());
    }
  }
  for (const q of quizResults) {
    if (q.createdAt && q.createdAt > thirtyDaysAgo) {
      activeDaySet.add(new Date(q.createdAt).toDateString());
    }
  }

  return { totalWords, masteredWords, learningWords, masteryPercent, weakWords, recentQuizzes, skillTests, activeDays: activeDaySet.size };
}

function SkillBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function getRecommendation(report: ReportData): string {
  if (report.totalWords === 0) return "Chưa có dữ liệu học tập. Hãy bắt đầu học ngay!";
  const areas: string[] = [];
  if (report.masteryPercent < 30) areas.push("ôn tập từ vựng để tăng mastery");
  if (report.weakWords.length > 5) areas.push(`tập trung vào ${report.weakWords.length} từ hay sai`);
  if (report.activeDays < 10) areas.push("học đều đặn hơn (ít nhất 15 ngày/tháng)");
  if (report.recentQuizzes.length > 0) {
    const avgScore = report.recentQuizzes.reduce((s, q) => s + q.score, 0) / report.recentQuizzes.length;
    if (avgScore < 70) areas.push("làm lại bài kiểm tra để cải thiện điểm");
  }
  if (areas.length === 0) return "Kết quả học tập tốt! Tiếp tục phát huy.";
  return "Nên " + areas.join(", ") + ".";
}

export function StudentProgressReport({ studentId, studentName, studentXp, studentStreak, studentLevel, onClose }: StudentProgressReportProps) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getStudentProgress(studentId).catch(() => [] as StudentVocabularyProgress[]),
      getQuizResults(studentId).catch(() => [] as QuizResult[]),
      getSkillTestResults(studentId).catch(() => [] as SkillTestResult[]),
    ])
      .then(([progress, quizResults, skillTests]) => {
        setReport(computeReport(progress, quizResults, skillTests));
      })
      .catch(() => setError("Không tải được dữ liệu báo cáo."))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const sectionCls = "rounded-xl border border-border bg-card p-4 space-y-2";
  const statCls = "flex flex-col items-center rounded-xl bg-muted p-3 text-center";

  return (
    <div className="print-report">
      {/* Overlay backdrop (hidden in print) */}
      <div className="fixed inset-0 z-40 bg-black/40 print:hidden" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 z-50 flex items-start justify-center overflow-y-auto print:static print:inset-auto print:z-auto print:overflow-visible">
        <div className="w-full max-w-2xl rounded-2xl bg-background p-6 shadow-xl print:max-w-none print:rounded-none print:shadow-none">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between print:mb-6">
            <div>
              <h2 className="text-xl font-black">Báo cáo tiến độ</h2>
              <p className="text-sm font-semibold text-muted-foreground">
                {studentName} {studentLevel ? `· ${studentLevel.toUpperCase()}` : ""}
              </p>
              <p className="text-xs text-muted-foreground print:block hidden">
                Ngày xuất: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                Xuất PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-muted px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-secondary"
              >
                Đóng
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm font-bold text-muted-foreground">Đang tải...</p>
          ) : error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>
          ) : report ? (
            <div className="space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={statCls}>
                  <span className="text-2xl font-black text-primary">{studentXp ?? 0}</span>
                  <span className="text-xs font-bold text-muted-foreground">XP</span>
                </div>
                <div className={statCls}>
                  <span className="text-2xl font-black text-orange-500">{studentStreak ?? 0}</span>
                  <span className="text-xs font-bold text-muted-foreground">Streak</span>
                </div>
                <div className={statCls}>
                  <span className="text-2xl font-black text-emerald-600">{report.totalWords}</span>
                  <span className="text-xs font-bold text-muted-foreground">Từ đã học</span>
                </div>
                <div className={statCls}>
                  <span className="text-2xl font-black text-purple-600">{report.masteryPercent}%</span>
                  <span className="text-xs font-bold text-muted-foreground">Mastery</span>
                </div>
              </div>

              {/* Word Status Breakdown */}
              <div className={sectionCls}>
                <h3 className="font-extrabold">Tiến độ từ vựng</h3>
                <SkillBar label="Đã thạo (Mastered)" value={report.masteredWords} max={report.totalWords} />
                <SkillBar label="Đang học (Learning/Review)" value={report.learningWords} max={report.totalWords} />
                <SkillBar label="Chưa học (New)" value={report.totalWords - report.masteredWords - report.learningWords} max={report.totalWords} />
              </div>

              {/* Skill Test Results */}
              {report.skillTests.length > 0 && (
                <div className={sectionCls}>
                  <h3 className="font-extrabold">Kiểm tra kỹ năng</h3>
                  <div className="space-y-2">
                    {report.skillTests.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                        <div>
                          <span className="font-bold">{t.mode}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{t.level.toUpperCase()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold">{t.score}%</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {t.passedSkills}/{t.totalSkills} skills
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Quiz Scores */}
              {report.recentQuizzes.length > 0 && (
                <div className={sectionCls}>
                  <h3 className="font-extrabold">Bài kiểm tra gần đây</h3>
                  <div className="space-y-2">
                    {report.recentQuizzes.map((q, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                        <div>
                          <span className="font-bold">{q.topicId || "Quiz"}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString("vi-VN") : ""}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-extrabold ${q.score >= 70 ? "text-emerald-600" : q.score >= 50 ? "text-orange-500" : "text-red-500"}`}>
                            {q.score}%
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {q.correctAnswers}/{q.totalQuestions}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weak Areas */}
              {report.weakWords.length > 0 && (
                <div className={sectionCls}>
                  <h3 className="font-extrabold">Từ hay sai nhất</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.weakWords.map((w) => (
                      <span key={w.wordId} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                        {w.wordId} ({w.wrongCount} sai)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity */}
              <div className={sectionCls}>
                <h3 className="font-extrabold">Hoạt động học tập</h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  Hoạt động <span className="font-extrabold text-primary">{report.activeDays}</span> ngày trong 30 ngày qua
                </p>
              </div>

              {/* Recommendation */}
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                <h3 className="font-extrabold text-primary">Khuyến nghị</h3>
                <p className="mt-1 text-sm font-semibold">{getRecommendation(report)}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(.print-report) { display: none !important; }
          .print-report { position: static !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:static { position: static !important; }
        }
      `}</style>
    </div>
  );
}
