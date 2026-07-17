import { Award, BookOpen, ClipboardCheck, Compass, Ear, Flame, Gamepad2, GraduationCap, Layers, LogOut, Medal, MessageSquareText, Mic, PenLine, RotateCcw, Settings, Sparkles, Star, Target, Trophy, Type, UserRound } from "lucide-react";
import { SmartReview } from "@/components/SmartReview";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/studentService";
import { getSkillTestResults, type SkillTestResult } from "@/services/progressService";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Level, Student } from "@/types";
import { topicWords, topicsWithLevel } from "@/utils/levelFilter";
import { avatarEmoji } from "@/components/ui/emoji";
import { ParrotLogo } from "@/components/ParrotLogo";
import { VoicePicker } from "@/components/ui/VoicePicker";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { cn } from "@/components/ui/cn";
import { Footer } from "@/components/layout/Footer";
import { LEVEL_ORDER } from "@/types";
import { countEarnedBadges } from "@/pages/BadgesPage";

function levelOf(xp: number) { const thresholds = [0, 50, 150, 400, 800, 1500, 3000]; const lvl = thresholds.findIndex((t) => xp < t); return lvl < 0 ? thresholds.length : lvl; }
function levelLabel(xp: number) { return ["Mới bắt đầu", "Sơ cấp", "Tiền trung cấp", "Trung cấp", "Trung cao cấp", "Cao cấp", "Thành thạo"][levelOf(xp) - 1] || ""; }

type Nav = (view: string, topicId?: string, level?: string) => void;

interface HomePageProps {
  student: Student;
  studiedWordIds: string[];
  streak: number;
  xp: number;
  learnedTotal: number;
  learnedToday: number;
  reviewDue: number;
  pendingCount: number;
  dueTestCount: number;
  onStartSkillTest: (mode: "new" | "review") => void;
  onChangeStudent: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onNavigate: Nav;
}

// ── Skill tiles — iOS app icon style: bold bg + white icon ──
const SKILL_TILES: { icon: ComponentType<{ className?: string }>; title: string; view: string; bg: string }[] = [
  { icon: Ear, title: "Nghe", view: "listening", bg: "bg-blue-500" },
  { icon: Mic, title: "Nói", view: "speak", bg: "bg-teal-500" },
  { icon: BookOpen, title: "Đọc", view: "reading", bg: "bg-green-500" },
  { icon: PenLine, title: "Viết", view: "writing", bg: "bg-violet-500" },
  { icon: Sparkles, title: "Từ mới", view: "topics", bg: "bg-amber-500" },
  { icon: MessageSquareText, title: "Câu", view: "phrases", bg: "bg-sky-500" },
  { icon: GraduationCap, title: "Ngữ pháp", view: "grammar", bg: "bg-rose-500" },
  { icon: Gamepad2, title: "Game", view: "games", bg: "bg-pink-500" },
  { icon: Type, title: "Mẫu câu", view: "conversation", bg: "bg-orange-500" },
];

export function HomePage({ student, studiedWordIds, streak, xp, learnedTotal, learnedToday, reviewDue, pendingCount, dueTestCount, onStartSkillTest, onChangeStudent, onLogout, onOpenProfile, onNavigate }: HomePageProps) {
  const learned = new Set(studiedWordIds);
  const [testResults, setTestResults] = useState<SkillTestResult[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [weekRank, setWeekRank] = useState<number | null>(null);

  useEffect(() => { getSkillTestResults(student.id).then(r => setTestResults(r.slice(0, 5))).catch(() => {}); }, [student.id]);
  useEffect(() => { getLeaderboard("week").then((lb) => { const idx = lb.findIndex((e: any) => e.id === student.id); setWeekRank(idx >= 0 ? idx + 1 : null); }).catch(() => {}); }, [student.id]);

  const goal = student.dailyGoal || 10;
  const goalReached = learnedToday >= goal;
  const goalPct = Math.min(100, Math.round((learnedToday / goal) * 100));
  const level = levelOf(xp);
  const validLevel = LEVEL_ORDER.includes(student.level as Level);
  const learnLevel = validLevel ? (student.level as string) : "all";
  const allTopics = topicsWithLevel(SEED_TOPICS, SEED_VOCABULARY, learnLevel);
  const topicsAtLevel = allTopics.slice(0, 4);
  const wordsOf = (topicId: string) => topicWords(SEED_VOCABULARY, topicId, learnLevel);

  // Topic progress for mini chart (top 6 active topics)
  const topicProgress = allTopics.slice(0, 6).map((t) => {
    const ws = wordsOf(t.id);
    const done = ws.filter((w) => learned.has(w.id)).length;
    return { id: t.id, name: t.name_vi, total: ws.length, done, pct: ws.length ? Math.round((done / ws.length) * 100) : 0 };
  });
  const totalWords = SEED_VOCABULARY.length;
  const overallPct = totalWords ? Math.round((learned.size / totalWords) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40 px-4 pt-4 pb-6 space-y-4">

      {/* ── Header ── */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ParrotLogo size={36} />
          <span className="text-xl font-black tracking-tight">English Buddy</span>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 rounded-2xl bg-card border border-border/60 px-3 py-1.5 shadow-sm transition-all active:scale-95 hover:shadow-md">
            <span className="text-xl">{avatarEmoji(student.avatar)}</span>
            <div className="text-right">
              <p className="text-sm font-black leading-tight">{student.name}</p>
              <p className="text-[10px] font-bold text-muted-foreground">Lv {level} · {levelLabel(xp)}</p>
            </div>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden">
                {/* Profile header */}
                <div className="flex items-center gap-3 bg-secondary/50 px-4 py-3">
                  <span className="text-2xl">{avatarEmoji(student.avatar)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-black truncate">{student.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">Lv {level} · {student.level?.toUpperCase?.() || "A1"}</p>
                  </div>
                </div>

                <div className="p-1.5">
                  {/* Settings */}
                  <ThemePicker />
                  <div className="border-t border-border/40 my-1" />
                  <VoicePicker />
                  <div className="border-t border-border/40 my-1" />

                  {/* Actions */}
                  {onOpenProfile && (
                    <button type="button" onClick={() => { setShowMenu(false); onOpenProfile(); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-muted transition-colors">
                      <Settings className="h-4 w-4 text-muted-foreground" /> Thông tin cá nhân
                    </button>
                  )}
                  <button type="button" onClick={() => { setShowMenu(false); onChangeStudent(); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-muted transition-colors">
                    <UserRound className="h-4 w-4 text-muted-foreground" /> Đổi hồ sơ
                  </button>
                  <button type="button" onClick={() => { setShowMenu(false); onNavigate("premium"); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-extrabold text-amber-600 hover:bg-amber-50 transition-colors">
                    <Star className="h-4 w-4" /> Nâng cấp Premium
                  </button>
                  <div className="border-t border-border/40 my-1" />
                  <button type="button" onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Thành tích — iOS icon row ── */}
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-4">
        <button type="button" onClick={() => onNavigate("dashboard")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
          <span className="flex h-12 w-12 items-center justify-center rounded-[0.875rem] bg-amber-500 text-white shadow-lg">
            <Star className="h-6 w-6" />
          </span>
          <span className="text-xs font-black">{xp} XP</span>
        </button>
        <button type="button" onClick={() => onNavigate("dashboard")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
          <span className="flex h-12 w-12 items-center justify-center rounded-[0.875rem] bg-red-500 text-white shadow-lg">
            <Flame className="h-6 w-6" />
          </span>
          <span className="text-xs font-black">{streak} ngày</span>
        </button>
        <button type="button" onClick={() => onNavigate("leaderboard")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
          <span className="flex h-12 w-12 items-center justify-center rounded-[0.875rem] bg-indigo-500 text-white shadow-lg">
            <Trophy className="h-6 w-6" />
          </span>
          <span className="text-xs font-black">{weekRank ? `#${weekRank}` : "—"}</span>
        </button>
        <button type="button" onClick={() => onNavigate("badges")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
          <span className="flex h-12 w-12 items-center justify-center rounded-[0.875rem] bg-emerald-500 text-white shadow-lg">
            <Award className="h-6 w-6" />
          </span>
          <span className="text-xs font-black">{countEarnedBadges(student, learned.size)} huy hiệu</span>
        </button>
      </div>

      {/* ── Tiến độ kỹ năng — thanh ngang, bấm → dashboard ── */}
      <button type="button" onClick={() => onNavigate("dashboard")}
        className="w-full rounded-[1rem] bg-card border border-border/40 px-4 py-3 shadow-md text-left transition-all active:scale-[0.98] hover:shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black">{learned.size} từ · {goalReached ? "Đạt ✓" : `${learnedToday}/${goal} hôm nay`}</span>
          <span className="text-[10px] font-bold text-primary">Chi tiết →</span>
        </div>
        <div className="space-y-1.5">
          {([
            { label: "Từ vựng", pct: overallPct, color: "bg-amber-500" },
            { label: "Nghe", pct: Math.min(overallPct * 1.2, 100), color: "bg-blue-500" },
            { label: "Nói", pct: Math.min(overallPct * 0.9, 100), color: "bg-teal-500" },
            { label: "Đọc", pct: Math.min(overallPct * 1.1, 100), color: "bg-green-500" },
            { label: "Viết", pct: Math.min(overallPct * 0.8, 100), color: "bg-violet-500" },
          ] as { label: string; pct: number; color: string }[]).map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-10 shrink-0 text-[9px] font-bold text-muted-foreground">{s.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-700", s.color)} style={{ width: `${Math.max(s.pct, 1)}%` }} />
              </div>
              <span className="w-7 shrink-0 text-right text-[9px] font-black text-muted-foreground">{Math.round(s.pct)}%</span>
            </div>
          ))}
        </div>
      </button>

      {/* ── Banner nâng cấp trình độ ── */}
      {learnedTotal >= 30 && (
        <button type="button" onClick={() => onNavigate("certification")}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-left text-white shadow-lg transition-all active:scale-[0.98] hover:brightness-105">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Award className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black">Sẵn sàng thi nâng cấp!</p>
              <p className="text-[10px] font-bold text-white/80">Thi chứng chỉ {(student.level || "a1").toUpperCase()} để lên level tiếp theo</p>
            </div>
            <span className="text-lg font-black">→</span>
          </div>
        </button>
      )}

      {/* ── Kiểm tra & Ôn tập — iOS icon row ── */}
      {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0) && (
        <div className="flex justify-center gap-5">
          {pendingCount >= 10 && (
            <button type="button" onClick={() => onStartSkillTest("new")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
              <span className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-emerald-500 text-white shadow-lg">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold">Thi mới</span>
            </button>
          )}
          {dueTestCount > 0 && (
            <button type="button" onClick={() => onStartSkillTest("review")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
              <span className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-blue-500 text-white shadow-lg">
                <RotateCcw className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold">Thi lại</span>
            </button>
          )}
          {reviewDue > 0 && (
            <button type="button" onClick={() => onNavigate("review")} className="flex flex-col items-center gap-1.5 transition-all active:scale-[0.90] hover:scale-[1.05]">
              <span className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-orange-500 text-white shadow-lg">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold">Cần ôn</span>
            </button>
          )}
        </div>
      )}
      {pendingCount > 0 && pendingCount < 10 && (
        <p className="text-center text-[10px] font-bold text-muted-foreground">
          Còn {10 - pendingCount} từ nữa để mở bài thi
        </p>
      )}

      {/* ── Kỹ năng 3×3 ── */}
      <section>
        <h2 className="mb-3 text-base font-black">Kỹ năng</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {SKILL_TILES.map((t) => (
            <button key={t.view} type="button" onClick={() => onNavigate(t.view)}
              className="flex flex-col items-center gap-2 transition-all duration-150 active:scale-[0.90] hover:scale-[1.05]">
              <span className={cn("flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-[1rem] text-white shadow-lg", t.bg)}>
                <t.icon className="h-7 w-7" />
              </span>
              <span className="text-[11px] font-bold text-foreground">{t.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Từ yếu tuần này ── */}
      <SmartReview studentId={student.id} onNavigate={onNavigate} />

      {/* ── Kết quả thi gần đây — iOS icon row ── */}
      {testResults.length > 0 && (
        <section>
          <h3 className="mb-3 text-center text-xs font-black text-muted-foreground">Kết quả gần đây</h3>
          <div className="flex justify-center gap-4">
            {testResults.map((r) => {
              const grade = r.score >= 90 ? "A+" : r.score >= 80 ? "A" : r.score >= 70 ? "B" : r.score >= 60 ? "C" : r.score >= 50 ? "D" : "F";
              const bg = r.score >= 80 ? "bg-emerald-500" : r.score >= 60 ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={r.id} className="flex flex-col items-center gap-1">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-[0.625rem] text-white shadow-md text-sm font-black", bg)}>
                    {grade}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground">{r.score}%</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Khám phá thêm ── */}
      <section>
        <h2 className="mb-3 text-base font-black">Khám phá thêm</h2>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onNavigate("placement")}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-3 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-indigo-500 text-white shadow-md">
              <Target className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">Xếp lớp</p>
              <p className="text-[9px] text-muted-foreground">Kiểm tra trình độ</p>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate("learning-path")}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-3 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-cyan-500 text-white shadow-md">
              <Compass className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">Lộ trình</p>
              <p className="text-[9px] text-muted-foreground">Học theo tuần</p>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate("badges")}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-3 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-yellow-500 text-white shadow-md">
              <Medal className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">Huy hiệu</p>
              <p className="text-[9px] text-muted-foreground">Thành tích</p>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate("integrated-lesson")}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-3 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-emerald-500 text-white shadow-md">
              <Layers className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">Bài tích hợp</p>
              <p className="text-[9px] text-muted-foreground">4 kỹ năng</p>
            </div>
          </button>
          <button type="button" onClick={() => onNavigate("certification")}
            className="flex items-center gap-3 rounded-2xl bg-card border border-border/40 p-3 shadow-sm transition-all active:scale-[0.97] hover:shadow-md text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-red-500 text-white shadow-md">
              <Award className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">Chứng chỉ</p>
              <p className="text-[9px] text-muted-foreground">Thi lấy bằng</p>
            </div>
          </button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
}
