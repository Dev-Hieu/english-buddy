import { BookOpen, ClipboardCheck, Ear, Flame, Gamepad2, GraduationCap, LogOut, MessageSquareText, Mic, PenLine, Play, RotateCcw, Settings, Sparkles, Star, Trophy, Type, UserRound } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
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
import { LEVEL_ORDER } from "@/types";

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

// ── Skill tile with gradient background ──
const SKILL_TILES: { icon: ComponentType<{ className?: string }>; title: string; view: string; gradient: string; iconColor: string }[] = [
  { icon: Ear, title: "Nghe", view: "listening", gradient: "from-blue-50 to-cyan-50", iconColor: "text-blue-600" },
  { icon: Mic, title: "Nói", view: "speak", gradient: "from-teal-50 to-emerald-50", iconColor: "text-teal-600" },
  { icon: BookOpen, title: "Đọc", view: "reading", gradient: "from-green-50 to-lime-50", iconColor: "text-green-600" },
  { icon: PenLine, title: "Viết", view: "writing", gradient: "from-purple-50 to-violet-50", iconColor: "text-purple-600" },
  { icon: Sparkles, title: "Từ mới", view: "topics", gradient: "from-amber-50 to-yellow-50", iconColor: "text-amber-600" },
  { icon: GraduationCap, title: "Ngữ pháp", view: "grammar", gradient: "from-rose-50 to-pink-50", iconColor: "text-rose-600" },
  { icon: Gamepad2, title: "Game", view: "games", gradient: "from-pink-50 to-fuchsia-50", iconColor: "text-pink-600" },
  { icon: MessageSquareText, title: "Cụm từ", view: "flashcard", gradient: "from-sky-50 to-blue-50", iconColor: "text-sky-600" },
  { icon: Type, title: "Mẫu câu", view: "conversation", gradient: "from-orange-50 to-amber-50", iconColor: "text-orange-600" },
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
  const topicsAtLevel = topicsWithLevel(SEED_TOPICS, SEED_VOCABULARY, learnLevel).slice(0, 4);
  const wordsOf = (topicId: string) => topicWords(SEED_VOCABULARY, topicId, learnLevel);
  const resumeTopic = topicsAtLevel.find((t) => {
    const ws = wordsOf(t.id);
    return ws.some((w) => !learned.has(w.id));
  }) ?? topicsAtLevel[0];
  const resumeStarted = resumeTopic ? wordsOf(resumeTopic.id).some((w) => learned.has(w.id)) : false;
  const startLearning = () => resumeTopic ? onNavigate("lesson", resumeTopic.id, learnLevel) : onNavigate("topics");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-4 pb-6 space-y-4">

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
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-2xl bg-card border border-border shadow-xl p-1.5 space-y-0.5">
                <VoicePicker />
                <ThemePicker />
                {onOpenProfile && (
                  <button type="button" onClick={() => { setShowMenu(false); onOpenProfile(); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted transition-colors">
                    <Settings className="h-4 w-4 text-muted-foreground" /> Thông tin cá nhân
                  </button>
                )}
                <button type="button" onClick={() => { setShowMenu(false); onChangeStudent(); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted transition-colors">
                  <UserRound className="h-4 w-4 text-muted-foreground" /> Đổi hồ sơ
                </button>
                <div className="border-t border-border my-1" />
                <button type="button" onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Stats + Progress Card ── */}
      <section className="rounded-3xl bg-gradient-to-br from-primary/5 via-card to-success/5 border border-border/40 p-5 shadow-card space-y-4">
        {/* Stats row — 3 badges equal width */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-amber-50 py-2.5 text-sm font-extrabold text-amber-700">
            <Star className="h-4 w-4" /> {xp} XP
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-red-50 py-2.5 text-sm font-extrabold text-red-600">
            <Flame className="h-4 w-4" /> {streak} ngày
          </div>
          <button type="button" onClick={() => onNavigate("leaderboard")}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary/10 py-2.5 text-sm font-extrabold text-primary hover:bg-primary/15 transition-colors">
            <Trophy className="h-4 w-4" /> {weekRank ? `#${weekRank}` : "Hạng"}
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-extrabold">
              {goalReached ? "Đạt mục tiêu hôm nay! 🎉" : `Hôm nay: ${learnedToday}/${goal} từ`}
            </p>
            <span className="text-xs font-bold text-muted-foreground">{goalPct}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500",
                goalReached ? "bg-gradient-to-r from-success to-emerald-400" : "bg-gradient-to-r from-primary to-success")}
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
            Vốn từ: {learnedTotal} đã thuộc · {student.level?.toUpperCase?.() || "A1"}
          </p>
        </div>

        {/* CTA */}
        <button type="button" onClick={startLearning}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-success py-3.5 text-base font-black text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] active:shadow-md hover:brightness-105">
          <Play className="h-5 w-5" /> {resumeStarted ? "Tiếp tục học" : "Bắt đầu học"}
        </button>
      </section>

      {/* ── Action badges: Thi + Ôn ── */}
      {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0) && (
        <div className="flex gap-2 overflow-x-auto">
          {pendingCount >= 10 && (
            <button type="button" onClick={() => onStartSkillTest("new")}
              className="flex items-center gap-2 shrink-0 rounded-2xl bg-success/10 border border-success/30 px-4 py-2.5 transition-all active:scale-95">
              <GraduationCap className="h-5 w-5 text-success" />
              <div className="text-left">
                <span className="text-xs font-extrabold text-success block">Thi mới</span>
                <span className="text-[10px] font-bold text-muted-foreground">{pendingCount} từ sẵn sàng</span>
              </div>
            </button>
          )}
          {dueTestCount > 0 && (
            <button type="button" onClick={() => onStartSkillTest("review")}
              className="flex items-center gap-2 shrink-0 rounded-2xl bg-primary/10 border border-primary/30 px-4 py-2.5 transition-all active:scale-95">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div className="text-left">
                <span className="text-xs font-extrabold text-primary block">Thi lại</span>
                <span className="text-[10px] font-bold text-muted-foreground">{dueTestCount} từ đến hạn</span>
              </div>
            </button>
          )}
          {reviewDue > 0 && (
            <button type="button" onClick={() => onNavigate("review")}
              className={cn("flex items-center gap-2 shrink-0 rounded-2xl bg-accent/10 border border-accent/30 px-4 py-2.5 transition-all active:scale-95",
                reviewDue > 5 && "animate-pulse")}>
              <RotateCcw className="h-5 w-5 text-accent" />
              <div className="text-left">
                <span className="text-xs font-extrabold text-accent block">Cần ôn</span>
                <span className="text-[10px] font-bold text-muted-foreground">{reviewDue} từ</span>
              </div>
            </button>
          )}
        </div>
      )}
      {pendingCount > 0 && pendingCount < 10 && (
        <p className="text-center text-xs font-bold text-muted-foreground">
          Còn {10 - pendingCount} từ nữa để mở bài thi
        </p>
      )}

      {/* ── Kỹ năng 3×3 ── */}
      <section>
        <h2 className="mb-3 text-base font-black">Kỹ năng</h2>
        <div className="grid grid-cols-3 gap-3">
          {SKILL_TILES.map((t) => (
            <button key={t.view} type="button" onClick={() => onNavigate(t.view)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br p-4 shadow-sm transition-all duration-150 active:scale-[0.95] hover:shadow-md",
                t.gradient,
              )}>
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 shadow-sm", t.iconColor)}>
                <t.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-extrabold">{t.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Kết quả thi gần đây ── */}
      {testResults.length > 0 && (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-base font-black">
            <ClipboardCheck className="h-5 w-5 text-primary" /> Kết quả gần đây
          </h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
            {testResults.map((r) => {
              const grade = r.score >= 90 ? "A+" : r.score >= 80 ? "A" : r.score >= 70 ? "B" : r.score >= 60 ? "C" : r.score >= 50 ? "D" : "F";
              const bg = r.score >= 80 ? "from-success/10 to-emerald-50" : r.score >= 60 ? "from-yellow-50 to-amber-50" : "from-red-50 to-pink-50";
              const color = r.score >= 80 ? "text-success" : r.score >= 60 ? "text-yellow-600" : "text-red-600";
              return (
                <div key={r.id} className={cn("shrink-0 w-32 rounded-2xl bg-gradient-to-br p-3.5 text-center shadow-sm", bg)}>
                  <p className={cn("text-2xl font-black", color)}>{grade}</p>
                  <p className="text-sm font-extrabold">{r.score}%</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="pb-2" />
    </main>
  );
}
