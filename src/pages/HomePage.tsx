import { Award, BookOpen, CheckCircle, ClipboardCheck, Compass, Ear, Flame, Gamepad2, GraduationCap, BookMarked, Layers, LogOut, Medal, MessageSquareText, Mic, PenLine, RotateCcw, Settings, Shield, Sparkles, Star, Target, Trophy, Type, UserRound, Volume2 } from "lucide-react";
import { SmartReview } from "@/components/SmartReview";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { getLeaderboard } from "@/services/studentService";
import { apiRequest } from "@/services/api";
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
import { speakText } from "@/services/speechService";

function levelOf(xp: number) { const thresholds = [0, 50, 150, 400, 800, 1500, 3000]; const lvl = thresholds.findIndex((t) => xp < t); return lvl < 0 ? thresholds.length : lvl; }
function levelLabel(xp: number) { return ["Mới bắt đầu", "Sơ cấp", "Tiền trung cấp", "Trung cấp", "Trung cao cấp", "Cao cấp", "Thành thạo"][levelOf(xp) - 1] || ""; }
const CEFR_LABEL: Record<string, string> = { kids: "Mầm non", a1: "A1", a2: "A2", b1: "B1", b2: "B2", c1: "C1" };

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
  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);

  // Streak freeze: check localStorage for active freeze (visual feature only)
  const freezeKey = `eb_streak_freeze_${student.id}`;
  const freezeTimestamp = (() => { try { return Number(localStorage.getItem(freezeKey) || 0); } catch { return 0; } })();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const isFrozenToday = freezeTimestamp >= todayStart.getTime();

  const activateFreeze = () => {
    if (xp < 50) return;
    localStorage.setItem(freezeKey, String(Date.now()));
    setShowFreezeConfirm(false);
    // Force re-render
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => { getSkillTestResults(student.id).then(r => setTestResults(r.slice(0, 5))).catch(() => {}); }, [student.id]);
  useEffect(() => { getLeaderboard("week").then((lb) => { const idx = lb.findIndex((e: any) => e.id === student.id); setWeekRank(idx >= 0 ? idx + 1 : null); }).catch(() => {}); }, [student.id]);

  const [editGoal, setEditGoal] = useState(false);
  const [goalVal, setGoalVal] = useState(student.dailyGoal || 10);
  const goal = student.dailyGoal || 10;
  const goalReached = learnedToday >= goal;
  const goalPct = Math.min(100, Math.round((learnedToday / goal) * 100));

  const saveGoal = async () => {
    if (goalVal < 1 || goalVal > 200) return;
    try {
      await apiRequest(`/api/students/${student.id}/goal`, { method: "PUT", body: { dailyGoal: goalVal } });
      student.dailyGoal = goalVal;
      setEditGoal(false);
    } catch { /* ignore */ }
  };
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

  // Word of the Day — deterministic pick based on day of year
  const wotd = useMemo(() => {
    if (SEED_VOCABULARY.length === 0) return null;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return SEED_VOCABULARY[dayOfYear % SEED_VOCABULARY.length];
  }, []);

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
              <p className="text-[10px] font-bold text-muted-foreground">{CEFR_LABEL[student.level] || "A1"} · ⭐{xp}</p>
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
                    <p className="text-[10px] font-bold text-muted-foreground">{CEFR_LABEL[student.level] || "A1"} · ⭐{xp} XP</p>
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
        <div className="flex flex-col items-center gap-1.5">
          <button type="button" onClick={() => onNavigate("dashboard")} className="transition-all active:scale-[0.90] hover:scale-[1.05]">
            <span className="flex h-12 w-12 items-center justify-center rounded-[0.875rem] bg-red-500 text-white shadow-lg relative">
              <Flame className="h-6 w-6" />
              {isFrozenToday && <Shield className="absolute -top-1 -right-1 h-4 w-4 text-cyan-300 drop-shadow" />}
            </span>
          </button>
          <span className="text-xs font-black">{streak} ngày</span>
          {isFrozenToday ? (
            <span className="text-[9px] font-bold text-cyan-600">Đã đóng băng</span>
          ) : streak > 0 ? (
            <button type="button" onClick={() => setShowFreezeConfirm(true)}
              className="text-[9px] font-bold text-cyan-600 hover:underline">Đóng băng</button>
          ) : null}
        </div>
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

      {/* Streak freeze confirm dialog */}
      {showFreezeConfirm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setShowFreezeConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowFreezeConfirm(false)}>
            <div className="bg-card rounded-2xl border border-border/60 shadow-xl p-5 max-w-xs w-full space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-500" />
                <h3 className="text-sm font-black">Đóng băng chuỗi ngày?</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Sử dụng 50 XP để bảo vệ chuỗi {streak} ngày. Nếu bạn nghỉ học 1 ngày, chuỗi sẽ không bị mất.
              </p>
              <p className="text-xs font-bold">XP hiện tại: {xp}</p>
              {xp < 50 && (
                <p className="text-xs font-bold text-red-500">Không đủ XP! Cần ít nhất 50 XP.</p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowFreezeConfirm(false)}
                  className="flex-1 rounded-xl border border-border/60 px-3 py-2 text-xs font-bold hover:bg-muted transition-colors">Huỷ</button>
                <button type="button" onClick={activateFreeze} disabled={xp < 50}
                  className="flex-1 rounded-xl bg-cyan-500 text-white px-3 py-2 text-xs font-bold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Đóng băng (-50 XP)</button>
              </div>
              <p className="text-[9px] text-muted-foreground text-center">* Đóng băng thực sự cần xử lý phía server.</p>
            </div>
          </div>
        </>
      )}

      {/* ── Tiến độ kỹ năng — thanh ngang, bấm → dashboard ── */}
      <button type="button" onClick={() => onNavigate("dashboard")}
        className="w-full rounded-[1rem] bg-card border border-border/40 px-4 py-3 shadow-md text-left transition-all active:scale-[0.98] hover:shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black">
            {learned.size} từ · {goalReached ? `Đạt ✓ (${learnedToday}/${goal})` : `${learnedToday}/${goal} hôm nay`}
            {!editGoal && <button type="button" onClick={(e) => { e.stopPropagation(); setEditGoal(true); setGoalVal(goal); }} className="ml-1 text-primary underline">đổi</button>}
          </span>
          {editGoal && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input type="number" min={1} max={200} value={goalVal} onChange={(e) => setGoalVal(Number(e.target.value) || 10)}
                className="w-14 rounded-lg border px-2 py-1 text-xs font-bold text-center" />
              <span className="text-[10px] text-muted-foreground">từ/ngày</span>
              <button type="button" onClick={saveGoal} className="rounded-lg bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">Lưu</button>
              <button type="button" onClick={() => setEditGoal(false)} className="text-[10px] text-muted-foreground">✕</button>
            </div>
          )}
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

      {/* ── Từ vựng hôm nay ── */}
      {wotd && (
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200/60 dark:border-sky-800/40 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-black text-sky-700 dark:text-sky-300">Từ vựng hôm nay</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black">{wotd.word}</span>
                <button type="button" onClick={() => speakText(wotd.word)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm transition-all active:scale-90 hover:bg-sky-600">
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {wotd.phonetic && <p className="text-[11px] text-muted-foreground font-mono">{wotd.phonetic}</p>}
              <p className="text-sm font-bold mt-1">{wotd.meaning_vi}</p>
              {wotd.example && <p className="text-xs text-muted-foreground mt-1 italic">"{wotd.example}"</p>}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {learned.has(wotd.id) ? (
              <span className="flex items-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="h-3.5 w-3.5" /> Đã biết
              </span>
            ) : (
              <button type="button" onClick={() => onNavigate("topics")}
                className="rounded-xl bg-sky-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 hover:bg-sky-600">
                Học từ này
              </button>
            )}
          </div>
        </div>
      )}

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
              <p className="text-[10px] font-bold text-white/80">Thi chứng chỉ {CEFR_LABEL[student.level] || "A1"} để lên level tiếp theo</p>
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
