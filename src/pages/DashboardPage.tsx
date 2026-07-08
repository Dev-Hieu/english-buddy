import { BarChart3, BookOpen, ClipboardCheck, Ear, Flame, Gamepad2, GraduationCap, Loader2, MessageSquareText, Mic, PenLine, Sparkles, Star, Trophy, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { QuizResult, Student, StudentVocabularyProgress } from "@/types";
import { getStudentProgress, getSkillTestResults, type SkillTestResult } from "@/services/progressService";
import { getStudent } from "@/services/studentService";
import { getQuizResults } from "@/services/quizService";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { avatarEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";

interface DashboardPageProps {
  students: Student[];
  onBackHome: () => void;
}

function levelOf(xp: number) { const t = [0, 50, 150, 400, 800, 1500, 3000]; const l = t.findIndex((v) => xp < v); return l < 0 ? t.length : l; }
function levelLabel(xp: number) { return ["Mới bắt đầu", "Sơ cấp", "Tiền trung cấp", "Trung cấp", "Trung cao cấp", "Cao cấp", "Thành thạo"][levelOf(xp) - 1] || ""; }

const wordById = new Map(SEED_VOCABULARY.map((w) => [w.id, w]));

function suggestTopic(learnedIds: Set<string>): string {
  for (const t of [...SEED_TOPICS].sort((a, b) => a.order - b.order)) {
    const words = SEED_VOCABULARY.filter((w) => w.topicIds.includes(t.id));
    const done = words.filter((w) => learnedIds.has(w.id)).length;
    if (words.length && done < words.length) return `${t.name_vi} (${t.name})`;
  }
  return "Ôn tập các từ đã học";
}

// Skill categories matching HomePage
const SKILL_SECTIONS = [
  { key: "vocab", icon: Sparkles, label: "Từ vựng", color: "bg-amber-500" },
  { key: "listening", icon: Ear, label: "Nghe", color: "bg-blue-500" },
  { key: "speaking", icon: Mic, label: "Nói", color: "bg-teal-500" },
  { key: "reading", icon: BookOpen, label: "Đọc", color: "bg-green-500" },
  { key: "writing", icon: PenLine, label: "Viết", color: "bg-violet-500" },
  { key: "grammar", icon: GraduationCap, label: "Ngữ pháp", color: "bg-rose-500" },
  { key: "games", icon: Gamepad2, label: "Game", color: "bg-pink-500" },
  { key: "phrases", icon: MessageSquareText, label: "Cụm từ", color: "bg-sky-500" },
  { key: "conversation", icon: Type, label: "Mẫu câu", color: "bg-orange-500" },
];

export function DashboardPage({ students, onBackHome }: DashboardPageProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<StudentVocabularyProgress[]>([]);
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [skillResults, setSkillResults] = useState<SkillTestResult[]>([]);
  const [info, setInfo] = useState<Student | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const student = students[0];

  useEffect(() => {
    if (!student) return;
    let alive = true;
    Promise.all([
      getStudentProgress(student.id).catch(() => []),
      getQuizResults(student.id).catch(() => []),
      getSkillTestResults(student.id).catch(() => []),
      getStudent(student.id).catch(() => null),
    ]).then(([p, q, s, i]) => {
      if (!alive) return;
      setProgress(p); setQuizzes(q); setSkillResults(s); setInfo(i); setLoading(false);
    });
    return () => { alive = false; };
  }, [student?.id]);

  if (!student) return <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6"><SessionHeader title="Tiến độ" onClose={onBackHome} /><p className="text-center text-sm text-muted-foreground py-8">Chưa có dữ liệu</p></main>;

  if (loading) return <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6"><SessionHeader title="Tiến độ" onClose={onBackHome} /><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></main>;

  const now = Date.now();
  const learnedIds = new Set(progress.filter((p) => p.mastery > 0).map((p) => p.wordId));
  const dueCount = progress.filter((p) => p.mastery > 0 && p.nextReviewAt <= now).length;
  const masteredCount = progress.filter((p) => p.mastery >= 5).length;
  const weakWords = progress.filter((p) => p.wrongCount > 0).sort((a, b) => b.wrongCount - a.wrongCount).slice(0, 8);
  const xp = info?.xp ?? 0;
  const streak = info?.streak ?? 0;
  const level = levelOf(xp);
  const totalWords = SEED_VOCABULARY.length;
  const overallPct = totalWords ? Math.round((learnedIds.size / totalWords) * 100) : 0;

  // Topic progress
  const topicStats = SEED_TOPICS.map((t) => {
    const words = SEED_VOCABULARY.filter((w) => w.topicIds.includes(t.id));
    const done = words.filter((w) => learnedIds.has(w.id)).length;
    return { id: t.id, name: t.name_vi, nameEn: t.name, total: words.length, done, pct: words.length ? Math.round((done / words.length) * 100) : 0 };
  }).sort((a, b) => b.pct - a.pct);

  // Skill test stats
  const avgScore = skillResults.length ? Math.round(skillResults.reduce((s, r) => s + r.score, 0) / skillResults.length) : 0;
  const bestScore = skillResults.length ? Math.max(...skillResults.map((r) => r.score)) : 0;

  const toggle = (key: string) => setExpandedSection(expandedSection === key ? null : key);

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title="Tiến độ học tập" onClose={onBackHome} icon={<BarChart3 className="h-4 w-4" />} iconBg="bg-indigo-500" />

      {/* ── Tổng quan ── */}
      <Card className="mb-4">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">{avatarEmoji(student.avatar)}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black">{student.name}</h2>
              <p className="text-xs font-bold text-muted-foreground">Cấp {level} · {levelLabel(xp)} · {student.level?.toUpperCase?.() || "A1"}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" />{xp} XP</span>
            <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-red-500" />{streak} ngày</span>
            <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-indigo-500" />{masteredCount} thuộc</span>
          </div>

          {/* Biểu đồ kỹ năng — thanh ngang */}
          {(() => {
            const vocabPct = overallPct;
            const testPct = skillResults.length ? avgScore : 0;
            const quizPct = quizzes.length ? Math.round(quizzes.slice(0, 5).reduce((s, q) => s + q.score, 0) / Math.min(quizzes.length, 5)) : 0;
            const skills: { label: string; icon: typeof Ear; pct: number; color: string }[] = [
              { label: "Từ vựng", icon: Sparkles, pct: vocabPct, color: "bg-amber-500" },
              { label: "Kiểm tra", icon: ClipboardCheck, pct: testPct, color: "bg-emerald-500" },
              { label: "Bài test", icon: GraduationCap, pct: quizPct, color: "bg-blue-500" },
              { label: "Nghe", icon: Ear, pct: Math.min(vocabPct * 1.2, 100), color: "bg-sky-500" },
              { label: "Nói", icon: Mic, pct: testPct > 0 ? Math.min(testPct * 0.9, 100) : 0, color: "bg-teal-500" },
              { label: "Đọc/Viết", icon: BookOpen, pct: Math.min(vocabPct * 1.1, 100), color: "bg-violet-500" },
            ];
            return (
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white", s.color)}>
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="w-14 shrink-0 text-[10px] font-bold truncate">{s.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-700", s.color)} style={{ width: `${Math.max(s.pct, 1)}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right text-[10px] font-black text-muted-foreground">{Math.round(s.pct)}%</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* ── Kỹ năng — bấm mở chi tiết ── */}
      <h3 className="mb-2 text-sm font-black">Chi tiết từng kỹ năng</h3>
      <div className="space-y-2 mb-4">
        {SKILL_SECTIONS.map((s) => {
          const isOpen = expandedSection === s.key;
          return (
            <div key={s.key}>
              <button type="button" onClick={() => toggle(s.key)}
                className={cn("flex w-full items-center gap-3 rounded-2xl p-3 transition-all active:scale-[0.98]",
                  isOpen ? "bg-card border border-primary/30 shadow-md" : "bg-card border border-border/40 shadow-sm hover:shadow-md")}>
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] text-white shadow-md", s.color)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-left text-sm font-extrabold">{s.label}</span>
                <span className="text-xs font-bold text-muted-foreground">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="mt-1 rounded-2xl bg-muted/50 p-3 space-y-2 animate-pop">
                  {s.key === "vocab" && (
                    <>
                      <p className="text-xs font-bold">Đã học: <span className="text-primary">{learnedIds.size}</span> / {totalWords} từ · Thuộc: {masteredCount} · Cần ôn: {dueCount}</p>
                      <p className="text-xs font-bold">Đề xuất: <span className="text-primary">{suggestTopic(learnedIds)}</span></p>
                      {weakWords.length > 0 && (
                        <div>
                          <p className="text-xs font-bold mb-1">Từ hay sai:</p>
                          <div className="flex flex-wrap gap-1">
                            {weakWords.map((w) => {
                              const word = wordById.get(w.wordId);
                              return <span key={w.wordId} className="rounded-lg bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{word?.word ?? w.wordId} ({w.wrongCount})</span>;
                            })}
                          </div>
                        </div>
                      )}
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {topicStats.slice(0, 10).map((t) => (
                          <div key={t.id} className="flex items-center gap-2">
                            <span className="w-20 text-[10px] font-bold text-muted-foreground truncate">{t.name}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full", t.pct >= 100 ? "bg-success" : "bg-primary")} style={{ width: `${t.pct}%` }} />
                            </div>
                            <span className="w-10 text-right text-[10px] font-bold text-muted-foreground">{t.done}/{t.total}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {s.key === "listening" && (
                    <p className="text-xs font-bold text-muted-foreground">Luyện nghe qua bài tập chọn ảnh, chọn đáp án và audio stories. Tiếp tục luyện để cải thiện!</p>
                  )}
                  {s.key === "speaking" && (
                    <p className="text-xs font-bold text-muted-foreground">Luyện phát âm từ, cụm từ và Shadowing video YouTube. {skillResults.length > 0 ? `Điểm TB phát âm: ${avgScore}%` : "Chưa có dữ liệu phát âm."}</p>
                  )}
                  {s.key === "reading" && (
                    <p className="text-xs font-bold text-muted-foreground">Đọc hiểu câu chuyện tiếng Anh theo trình độ CEFR. Tap vào từ để tra nghĩa.</p>
                  )}
                  {s.key === "writing" && (
                    <p className="text-xs font-bold text-muted-foreground">Nghe viết từ, câu và viết đoạn văn có AI chấm điểm. Luyện đều đặn để cải thiện kỹ năng viết.</p>
                  )}
                  {s.key === "grammar" && (
                    <p className="text-xs font-bold text-muted-foreground">52 chủ đề ngữ pháp × 6 cấp độ. Hoàn thành bài tập để nắm vững cấu trúc câu.</p>
                  )}
                  {s.key === "games" && (
                    <p className="text-xs font-bold text-muted-foreground">10 trò chơi: Ghép từ, Chọn ảnh, Nghe chọn, Nghe gõ, Đuổi hình, Đua xe, Sudoku, Tìm từ, Gõ nhanh, Nối từ.</p>
                  )}
                  {s.key === "phrases" && (
                    <p className="text-xs font-bold text-muted-foreground">500 cụm từ thông dụng × 20 chủ đề. Học qua flashcard và luyện tập.</p>
                  )}
                  {s.key === "conversation" && (
                    <p className="text-xs font-bold text-muted-foreground">Hội thoại với AI hoặc theo kịch bản có sẵn. Luyện phản xạ giao tiếp tiếng Anh.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Lịch sử kiểm tra ── */}
      {skillResults.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-2 text-sm font-black flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" /> Lịch sử kiểm tra
          </h3>
          <Card>
            <CardContent className="p-3 space-y-1 max-h-48 overflow-y-auto">
              {skillResults.map((r) => {
                const grade = r.score >= 90 ? "A+" : r.score >= 80 ? "A" : r.score >= 70 ? "B" : r.score >= 60 ? "C" : r.score >= 50 ? "D" : "F";
                const bg = r.score >= 80 ? "bg-emerald-500" : r.score >= 60 ? "bg-amber-500" : "bg-red-500";
                return (
                  <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0">
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white text-xs font-black", bg)}>{grade}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold">{r.score}% · {r.totalWords} từ</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Lịch sử quiz ── */}
      {quizzes.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-2 text-sm font-black">Lịch sử bài test</h3>
          <Card>
            <CardContent className="p-3 space-y-1 max-h-40 overflow-y-auto">
              {quizzes.slice(0, 10).map((q, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-xs font-bold">{q.score}% · {q.correctAnswers}/{q.totalQuestions} đúng</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(q.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <div className="pb-4" />
    </main>
  );
}
