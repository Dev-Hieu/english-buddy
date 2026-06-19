import { BarChart3, BookMarked, BookOpen, ChevronRight, Flame, GraduationCap, LogOut, MessageCircle, Play, RotateCcw, Star, Trophy, UserRound } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { getLeaderboard } from "@/services/studentService";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { LEVEL_LABELS, LEVEL_ORDER, type Level, type Student } from "@/types";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { ThemePicker } from "@/components/ui/ThemePicker";
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
  onChangeStudent: () => void;
  onLogout: () => void;
  onNavigate: Nav;
}

// Thẻ điều hướng dạng hàng (dùng lại cho Xếp hạng / My Words / Bảng theo dõi).
function NavRow({ icon: Icon, iconClass, title, subtitle, onClick }: {
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", iconClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-left">
        <span className="block font-extrabold">{title}</span>
        <span className="block text-sm font-semibold text-muted-foreground">{subtitle}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

export function HomePage({ student, studiedWordIds, streak, xp, learnedTotal, learnedToday, reviewDue, onChangeStudent, onLogout, onNavigate }: HomePageProps) {
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
        <div className="flex items-center gap-3">
          <ParrotLogo size={44} />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl shadow-card">
            {avatarEmoji(student.avatar)}
          </div>
          <div>
            <p className="flex items-center gap-2 text-lg font-extrabold leading-tight">
              {student.name}
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground">Lv {level}</span>
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Lớp {student.grade}{levelLabel ? <> · <span className="font-extrabold text-primary">{levelLabel}</span></> : null}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemePicker />
          <Button type="button" size="icon" variant="outline" aria-label="Đổi bé" onClick={onChangeStudent}>
            <UserRound className="h-5 w-5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" aria-label="Thoát" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero: mục tiêu hôm nay + streak/XP */}
      <section className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-success p-5 text-primary-foreground shadow-soft">
        <div className="flex items-center gap-5">
          <ProgressRing value={learnedToday} max={goal} size={92} stroke={10}>
            <span className="text-2xl font-black leading-none">{learnedToday}</span>
            <span className="text-[11px] font-bold opacity-90">/{goal}</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm font-bold opacity-90">Mục tiêu hôm nay</p>
            <h1 className="text-2xl font-black leading-tight">
              {goalReached ? "Hoàn thành rồi! 🎉" : `Học ${goal - learnedToday} từ nữa nào`}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-sm font-extrabold" title="Chuỗi ngày học">
                <Flame className="h-4 w-4" /> {streak}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-sm font-extrabold" title="Điểm XP">
                <Star className="h-4 w-4" /> {xp}
              </span>
              <button
                type="button"
                onClick={() => onNavigate("leaderboard")}
                title="Hạng tuần này — xem bảng xếp hạng"
                className="flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-sm font-extrabold transition-colors hover:bg-white/40"
              >
                <Trophy className="h-4 w-4" /> {weekRank ? `#${weekRank}` : "—"}
              </button>
            </div>
          </div>
        </div>
        <Button type="button" variant="accent" size="lg" className="mt-4 w-full" onClick={startLearning}>
          <Play className="h-5 w-5" /> {resumeStarted ? "Học tiếp" : "Bắt đầu học"}
        </Button>
      </section>

      {/* Cần ôn hôm nay (chỉ hiện khi có từ đến hạn) */}
      {reviewDue > 0 ? (
        <button
          type="button"
          onClick={() => onNavigate("review")}
          className="mt-4 flex w-full items-center gap-3 rounded-3xl border-2 border-accent/40 bg-accent/10 p-4 shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent">
            <RotateCcw className="h-5 w-5" />
          </span>
          <span className="flex-1 text-left">
            <span className="block font-extrabold">Cần ôn hôm nay</span>
            <span className="block text-sm font-semibold text-muted-foreground">{reviewDue} từ đã đến hạn ôn tập</span>
          </span>
          <ChevronRight className="h-5 w-5 text-accent" />
        </button>
      ) : null}

      {/* Chủ đề */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Chủ đề</h2>
          <button type="button" className="flex items-center text-sm font-bold text-primary" onClick={() => onNavigate("topics")}>
            Tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {topicsAtLevel.map((topic) => {
            const words = wordsOf(topic.id);
            const done = words.filter((w) => learned.has(w.id)).length;
            const pct = words.length ? Math.round((done / words.length) * 100) : 0;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onNavigate("lesson", topic.id, learnLevel)}
                className="rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{topicEmoji(topic.id)}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-extrabold text-secondary-foreground">{words.length} từ</span>
                </div>
                <p className="mt-2 font-extrabold leading-tight">{topic.name}</p>
                <p className="text-sm font-semibold text-muted-foreground">{topic.name_vi}</p>
                <ProgressBar value={pct} className="mt-3 h-2" />
                <p className="mt-1 text-xs font-bold text-muted-foreground">Đã học {done}/{words.length}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Huy hiệu đã đạt (thu gọn) */}
      {earnedBadges.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-extrabold">Huy hiệu ({earnedBadges.length})</h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((b) => (
              <span key={b.id} title={b.label} className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 text-sm font-extrabold text-accent">
                <span>{b.emoji}</span> {b.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Ngữ pháp + Xếp hạng + My Words + Báo cáo phụ huynh */}
      <section className="mt-6 space-y-3">
        <NavRow icon={BookOpen} iconClass="bg-primary/15 text-primary" title="Ngữ pháp" subtitle="Bài học ngắn + bài tập theo cấp" onClick={() => onNavigate("grammar")} />
        <NavRow icon={GraduationCap} iconClass="bg-success/15 text-success" title="Làm đề" subtitle="Đề 20 câu theo trình độ + phân tích lỗi" onClick={() => onNavigate("exam")} />
        <NavRow icon={MessageCircle} iconClass="bg-accent/15 text-accent" title="Luyện hội thoại" subtitle="Trò chuyện theo tình huống (AI cho bản nâng cấp)" onClick={() => onNavigate("conversation")} />
        <NavRow icon={Trophy} iconClass="bg-accent/15 text-accent" title="Bảng xếp hạng" subtitle="Thi đua điểm XP với các bạn" onClick={() => onNavigate("leaderboard")} />
        <NavRow icon={BookMarked} iconClass="bg-secondary text-secondary-foreground" title="My Words" subtitle="Từ con đã lưu khi tra" onClick={() => onNavigate("mywords")} />
        <NavRow icon={BarChart3} iconClass="bg-secondary text-secondary-foreground" title="Bảng theo dõi" subtitle="Tiến độ của các bé (phụ huynh)" onClick={() => onNavigate("dashboard")} />
      </section>
    </main>
  );
}
