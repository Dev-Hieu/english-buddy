import { BarChart3, BookMarked, ChevronRight, Flame, LogOut, Play, Star, UserRound } from "lucide-react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { computeBadges, levelOf } from "@/components/ui/badges";
import { avatarEmoji, topicEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";

type Nav = (view: string, topicId?: string) => void;

interface HomePageProps {
  student: Student;
  studiedWordIds: string[];
  streak: number;
  xp: number;
  learnedTotal: number;
  learnedToday: number;
  onChangeStudent: () => void;
  onLogout: () => void;
  onNavigate: Nav;
}

export function HomePage({ student, studiedWordIds, streak, xp, learnedTotal, learnedToday, onChangeStudent, onLogout, onNavigate }: HomePageProps) {
  const learned = new Set(studiedWordIds);
  const goal = student.dailyGoal || 10;
  const goalReached = learnedToday >= goal;
  const level = levelOf(xp);
  const badges = computeBadges({ learned: learnedTotal, streak, xp });
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-5">
      {/* App bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl shadow-card">
            {avatarEmoji(student.avatar)}
          </div>
          <div>
            <p className="flex items-center gap-2 text-lg font-extrabold leading-tight">
              {student.name}
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground">Lv {level}</span>
            </p>
            <p className="text-sm font-semibold text-muted-foreground">Lớp {student.grade}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 text-sm font-extrabold text-accent">
            <Flame className="h-4 w-4" /> {streak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-extrabold text-secondary-foreground">
            <Star className="h-4 w-4" /> {xp}
          </span>
          <ThemePicker />
          <Button type="button" size="icon" variant="outline" aria-label="Đổi bé" onClick={onChangeStudent}>
            <UserRound className="h-5 w-5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" aria-label="Thoát" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero: mục tiêu hôm nay */}
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
          </div>
        </div>
        <Button type="button" variant="accent" size="lg" className="mt-4 w-full" onClick={() => onNavigate("topics")}>
          <Play className="h-5 w-5" /> Học tiếp
        </Button>
      </section>

      {/* Huy hiệu */}
      <section className="mt-5">
        <h2 className="mb-2 text-xl font-extrabold">Huy hiệu {earnedBadges.length ? `(${earnedBadges.length})` : ""}</h2>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.id}
              title={b.label}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-extrabold",
                b.earned ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground opacity-50",
              )}
            >
              <span className={b.earned ? "" : "grayscale"}>{b.emoji}</span> {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Chủ đề */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Chủ đề</h2>
          <button type="button" className="flex items-center text-sm font-bold text-primary" onClick={() => onNavigate("topics")}>
            Tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SEED_TOPICS.map((topic) => {
            const words = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topic.id));
            const done = words.filter((w) => learned.has(w.id)).length;
            const pct = words.length ? Math.round((done / words.length) * 100) : 0;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onNavigate("lesson", topic.id)}
                className="rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{topicEmoji(topic.id)}</span>
                  <span className="text-xs font-extrabold text-muted-foreground">{pct}%</span>
                </div>
                <p className="mt-2 font-extrabold leading-tight">{topic.name}</p>
                <p className="text-sm font-semibold text-muted-foreground">{topic.name_vi}</p>
                <ProgressBar value={pct} className="mt-3 h-2" />
              </button>
            );
          })}
        </div>
      </section>

      {/* My Words + Báo cáo phụ huynh */}
      <section className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => onNavigate("mywords")}
          className="flex w-full items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <BookMarked className="h-5 w-5" />
          </span>
          <span className="flex-1 text-left">
            <span className="block font-extrabold">My Words</span>
            <span className="block text-sm font-semibold text-muted-foreground">Từ con đã lưu khi tra</span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex w-full items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span className="flex-1 text-left">
            <span className="block font-extrabold">Bảng theo dõi</span>
            <span className="block text-sm font-semibold text-muted-foreground">Tiến độ của các bé (phụ huynh)</span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </section>
    </main>
  );
}
