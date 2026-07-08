import { BookOpen, ClipboardCheck, Ear, Flame, Gamepad2, GraduationCap, LogOut, MessageSquareText, Mic, PenLine, RotateCcw, Settings, Sparkles, Star, Trophy, Type, UserRound } from "lucide-react";
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

// ── Skill tiles — iOS app icon style: bold bg + white icon ──
const SKILL_TILES: { icon: ComponentType<{ className?: string }>; title: string; view: string; bg: string }[] = [
  { icon: Ear, title: "Nghe", view: "listening", bg: "bg-blue-500" },
  { icon: Mic, title: "Nói", view: "speak", bg: "bg-teal-500" },
  { icon: BookOpen, title: "Đọc", view: "reading", bg: "bg-green-500" },
  { icon: PenLine, title: "Viết", view: "writing", bg: "bg-violet-500" },
  { icon: Sparkles, title: "Từ mới", view: "topics", bg: "bg-amber-500" },
  { icon: GraduationCap, title: "Ngữ pháp", view: "grammar", bg: "bg-rose-500" },
  { icon: Gamepad2, title: "Game", view: "games", bg: "bg-pink-500" },
  { icon: MessageSquareText, title: "Cụm từ", view: "phrases", bg: "bg-sky-500" },
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
    <main className="mx-auto w-full max-w-md overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40 px-4 pt-4 pb-6 space-y-4">

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
                <button type="button" onClick={() => { setShowMenu(false); onNavigate("premium"); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors">
                  ⭐ Nâng cấp Premium
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

      {/* ── Thành tích ── */}
      <div className="flex gap-2">
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 shadow-sm">
          <Star className="h-4 w-4 text-primary" /><span className="text-sm font-extrabold text-secondary-foreground">{xp}</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 shadow-sm">
          <Flame className="h-4 w-4 text-primary" /><span className="text-sm font-extrabold text-secondary-foreground">{streak} ngày</span>
        </div>
        <button type="button" onClick={() => onNavigate("leaderboard")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-secondary py-2.5 shadow-sm hover:bg-primary/15 transition-colors">
          <Trophy className="h-4 w-4 text-primary" /><span className="text-sm font-extrabold text-secondary-foreground">{weekRank ? `#${weekRank}` : "—"}</span>
        </button>
      </div>

      {/* ── Biểu đồ tiến độ — bấm vào xem chi tiết ── */}
      <button type="button" onClick={() => onNavigate("dashboard")}
        className="w-full rounded-2xl bg-card border border-border/50 px-3 py-2.5 shadow-sm text-left transition-all active:scale-[0.99] hover:shadow-md hover:border-primary/30">
        <div className="flex items-end gap-1 h-10">
          {topicProgress.map((t) => (
            <div key={t.id} className="flex-1 rounded-t bg-muted overflow-hidden" style={{ height: 40 }}>
              <div className={cn("w-full rounded-t transition-all duration-500", t.pct > 0 ? "bg-primary" : "bg-transparent")}
                style={{ height: `${Math.max(t.pct, 3)}%`, marginTop: `${100 - Math.max(t.pct, 3)}%`, opacity: t.pct > 0 ? 0.5 + (t.pct / 200) : 0 }} />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1 items-center">
          {topicProgress.map((t) => (
            <span key={t.id} className="flex-1 text-center text-[7px] font-bold text-muted-foreground truncate leading-none">{t.name.split(" ")[0]}</span>
          ))}
        </div>
      </button>


      {/* ── Kiểm tra & Ôn tập ── */}
      {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0 || (pendingCount > 0 && pendingCount < 10)) && (
        <section>
          {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0) && (() => {
            const items: { label: string; sub: string; onClick: () => void }[] = [];
            if (pendingCount >= 10) items.push({ label: "Thi mới", sub: `${pendingCount} từ`, onClick: () => onStartSkillTest("new") });
            if (dueTestCount > 0) items.push({ label: "Thi lại", sub: `${dueTestCount} từ`, onClick: () => onStartSkillTest("review") });
            if (reviewDue > 0) items.push({ label: "Cần ôn", sub: `${reviewDue} từ`, onClick: () => onNavigate("review") });
            return (
              <div className={cn("grid gap-2 mx-auto max-w-sm", items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {items.map((it) => (
                  <button key={it.label} type="button" onClick={it.onClick}
                    className="flex flex-col items-center gap-0.5 rounded-2xl bg-secondary py-3 shadow-sm transition-all active:scale-95 hover:brightness-[0.97]">
                    <span className="text-xs font-extrabold text-secondary-foreground">{it.label}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{it.sub}</span>
                  </button>
                ))}
              </div>
            );
          })()}
          {pendingCount > 0 && pendingCount < 10 && (
            <p className="mt-1.5 text-center text-[10px] font-bold text-muted-foreground">
              Còn {10 - pendingCount} từ nữa để mở bài thi
            </p>
          )}
        </section>
      )}

      {/* ── Kỹ năng 3×3 ── */}
      <section>
        <h2 className="mb-3 text-base font-black">Kỹ năng</h2>
        <div className="grid grid-cols-3 gap-4">
          {SKILL_TILES.map((t) => (
            <button key={t.view} type="button" onClick={() => onNavigate(t.view)}
              className="flex flex-col items-center gap-2 transition-all duration-150 active:scale-[0.90] hover:scale-[1.05]">
              <span className={cn("flex h-14 w-14 items-center justify-center rounded-[1rem] text-white shadow-lg", t.bg)}>
                <t.icon className="h-7 w-7" />
              </span>
              <span className="text-[11px] font-bold text-foreground">{t.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Kết quả thi gần đây ── */}
      {testResults.length > 0 && (
        <section>
          <h3 className="mb-2 text-center text-sm font-black text-muted-foreground">Kết quả gần đây</h3>
          <div className={cn("grid gap-2 mx-auto max-w-xs",
            testResults.length <= 3 ? "grid-cols-3" : testResults.length <= 4 ? "grid-cols-4" : "grid-cols-5")}>
            {testResults.map((r) => {
              const grade = r.score >= 90 ? "A+" : r.score >= 80 ? "A" : r.score >= 70 ? "B" : r.score >= 60 ? "C" : r.score >= 50 ? "D" : "F";
              const color = r.score >= 80 ? "text-success" : r.score >= 60 ? "text-warning" : "text-red-500";
              return (
                <div key={r.id} className="rounded-xl bg-secondary py-2 text-center shadow-sm">
                  <p className={cn("text-lg font-black leading-none", color)}>{grade}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{r.score}%</p>
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
