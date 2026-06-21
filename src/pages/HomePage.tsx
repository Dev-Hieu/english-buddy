import { BarChart3, BookMarked, BookOpen, ChevronRight, Flame, GraduationCap, LogOut, MessageCircle, Play, RotateCcw, Star, Trophy, UserRound } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { getLeaderboard } from "@/services/studentService";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { VoicePicker } from "@/components/ui/VoicePicker";
import { computeBadges, levelOf } from "@/components/ui/badges";
import { avatarEmoji, topicEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";
import { ParrotLogo } from "@/components/ParrotLogo";
import { topicWords, topicsWithLevel } from "@/utils/levelFilter";

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
  onNavigate: Nav;
}

// Thẻ điều hướng dạng ô vuông (grid 2-3 cột).
function NavTile({ icon: Icon, iconClass, title, onClick }: {
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-3.5 shadow-card transition-transform active:scale-[0.97]"
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-extrabold text-center leading-tight">{title}</span>
    </button>
  );
}

export function HomePage({ student, studiedWordIds, streak, xp, learnedTotal, learnedToday, reviewDue, pendingCount, dueTestCount, onStartSkillTest, onChangeStudent, onLogout, onNavigate }: HomePageProps) {
  const learned = new Set(studiedWordIds);
  const goal = student.dailyGoal || 10;
  const goalReached = learnedToday >= goal;
  const level = levelOf(xp);
  // Lọc chủ đề theo trình độ đã chọn của bé (chủ đề có chứa từ ở cấp đó). Level lạ -> "all".
  const validLevel = LEVEL_ORDER.includes(student.level as Level);
  const learnLevel = validLevel ? (student.level as string) : "all";
  const levelLabel = validLevel ? LEVEL_LABELS[student.level as Level] : null;
  const wordsOf = (topicId: string) => topicWords(SEED_VOCABULARY, topicId, learnLevel);
  const topicsAtLevel = topicsWithLevel(SEED_TOPICS, SEED_VOCABULARY, learnLevel);
  const earnedBadges = computeBadges({ learned: learnedTotal, streak, xp }).filter((b) => b.earned);

  // Hạng tuần (trong cùng cấp) để hiện trên hero — khích lệ.
  const [weekRank, setWeekRank] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    getLeaderboard("week", student.level)
      .then((rows) => { if (alive) { const i = rows.findIndex((r) => r.id === student.id); setWeekRank(i >= 0 ? i + 1 : null); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [student.id, student.level]);

  // "Học tiếp": ưu tiên chủ đề đang học dở; nếu chưa có thì chủ đề đầu tiên.
  const resumeTopic =
    topicsAtLevel.find((t) => {
      const ws = wordsOf(t.id);
      const done = ws.filter((w) => learned.has(w.id)).length;
      return done > 0 && done < ws.length;
    }) ?? topicsAtLevel[0];
  const resumeStarted = resumeTopic ? wordsOf(resumeTopic.id).some((w) => learned.has(w.id)) : false;
  const startLearning = () =>
    resumeTopic ? onNavigate("lesson", resumeTopic.id, learnLevel) : onNavigate("topics");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-5">
      {/* App bar */}
      <header className="flex items-center justify-between">
        <ParrotLogo size={38} />
        <div className="flex items-center gap-2">
          <VoicePicker />
          <ThemePicker />
          <Button type="button" size="icon" variant="outline" aria-label="Đổi bé" onClick={onChangeStudent}>
            <UserRound className="h-5 w-5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" aria-label="Thoát" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-success p-4 text-primary-foreground shadow-soft">
        {/* Hàng 1: thành tích (trái) — tài khoản (phải) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-sm font-extrabold" title="XP"><Star className="h-4 w-4" />{xp}</span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-sm font-extrabold" title="Streak"><Flame className="h-4 w-4" />{streak}</span>
            <button type="button" onClick={() => onNavigate("leaderboard")} title="Xếp hạng" className="flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-sm font-extrabold hover:bg-white/40">
              <Trophy className="h-4 w-4" />{weekRank ? `#${weekRank}` : "—"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-black leading-tight">{student.name}</p>
              <p className="text-xs font-bold opacity-75">Lv {level}{levelLabel ? ` · ${levelLabel}` : ""}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl">
              {avatarEmoji(student.avatar)}
            </div>
          </div>
        </div>
        {/* Hàng 2: mục tiêu hôm nay + tổng vốn từ + nút học */}
        <div className="mt-3 flex items-center gap-3">
          <ProgressRing value={learnedToday} max={goal} size={60} stroke={7}>
            <span className="text-xl font-black leading-none">{learnedToday}</span>
            <span className="text-xs font-bold opacity-80">/{goal}</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <p className="text-base font-black leading-tight">
              {goalReached ? "Đạt mục tiêu 🎉" : `Cần học ${goal - learnedToday} từ`}
            </p>
            <p className="text-sm font-bold opacity-75">Vốn từ: {learnedTotal}</p>
          </div>
          <Button type="button" variant="accent" className="shrink-0" onClick={startLearning}>
            <Play className="h-5 w-5" /> {resumeStarted ? "Học tiếp" : "Bắt đầu"}
          </Button>
        </div>
      </section>

      {/* Action cards gọn — chỉ hiện khi cần */}
      {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pendingCount >= 10 && (
            <button type="button" onClick={() => onStartSkillTest("new")}
              className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-success/50 bg-success/10 px-3 py-2.5 transition-transform active:scale-[0.98]">
              <GraduationCap className="h-4 w-4 text-success shrink-0" />
              <span className="text-sm font-extrabold">Thi lấy điểm ({pendingCount})</span>
            </button>
          )}
          {dueTestCount > 0 && (
            <button type="button" onClick={() => onStartSkillTest("review")}
              className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-primary/40 bg-primary/10 px-3 py-2.5 transition-transform active:scale-[0.98]">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-extrabold">Thi lại ({dueTestCount})</span>
            </button>
          )}
          {reviewDue > 0 && (
            <button type="button" onClick={() => onNavigate("review")}
              className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-accent/40 bg-accent/10 px-3 py-2.5 transition-transform active:scale-[0.98]">
              <RotateCcw className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm font-extrabold">Cần ôn ({reviewDue})</span>
            </button>
          )}
        </div>
      )}
      {pendingCount > 0 && pendingCount < 10 && (
        <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
          Còn {10 - pendingCount} từ nữa để mở bài thi lấy điểm
        </p>
      )}

      {/* Chủ đề */}
      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Chủ đề</h2>
          <button type="button" className="flex items-center text-sm font-bold text-primary" onClick={() => onNavigate("topics")}>
            Tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {topicsAtLevel.map((topic) => {
            const words = wordsOf(topic.id);
            const done = words.filter((w) => learned.has(w.id)).length;
            const pct = words.length ? Math.round((done / words.length) * 100) : 0;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onNavigate("lesson", topic.id, learnLevel)}
                className="rounded-2xl border border-border/70 bg-card p-3.5 text-left shadow-card transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{topicEmoji(topic.id)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-extrabold leading-tight truncate">{topic.name}</p>
                    <p className="text-sm font-semibold text-muted-foreground truncate">{topic.name_vi}</p>
                  </div>
                  <span className="text-xs font-extrabold text-muted-foreground shrink-0">{done}/{words.length}</span>
                </div>
                <ProgressBar value={pct} className="mt-2 h-2" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Thêm */}
      <section className="mt-4 mb-4">
        <h2 className="mb-2 text-xl font-extrabold">Thêm</h2>
        <div className="grid grid-cols-3 gap-2">
          <NavTile icon={BookOpen} iconClass="bg-primary/15 text-primary" title="Ngữ pháp" onClick={() => onNavigate("grammar")} />
          <NavTile icon={GraduationCap} iconClass="bg-success/15 text-success" title="Làm đề" onClick={() => onNavigate("exam")} />
          <NavTile icon={MessageCircle} iconClass="bg-accent/15 text-accent" title="Hội thoại" onClick={() => onNavigate("conversation")} />
          <NavTile icon={Trophy} iconClass="bg-accent/15 text-accent" title="Xếp hạng" onClick={() => onNavigate("leaderboard")} />
          <NavTile icon={BookMarked} iconClass="bg-secondary text-secondary-foreground" title="My Words" onClick={() => onNavigate("mywords")} />
          <NavTile icon={BarChart3} iconClass="bg-secondary text-secondary-foreground" title="Theo dõi" onClick={() => onNavigate("dashboard")} />
        </div>
      </section>
    </main>
  );
}
