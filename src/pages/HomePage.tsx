import { BarChart3, BookMarked, BookOpen, ChevronRight, ClipboardCheck, Flame, GraduationCap, Headphones, LogOut, MessageCircle, Mic, Play, RotateCcw, Settings, Star, Trophy, UserRound } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { getLeaderboard } from "@/services/studentService";
import { getSkillTestResults, type SkillTestResult } from "@/services/progressService";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Level, Student, VocabularyWord } from "@/types";
import { topicWords, topicsWithLevel } from "@/utils/levelFilter";
import { avatarEmoji } from "@/components/ui/emoji";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ParrotLogo } from "@/components/ParrotLogo";
import { VoicePicker } from "@/components/ui/VoicePicker";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { cn } from "@/components/ui/cn";
import { LEVEL_ORDER } from "@/types";
import { SPEAK_PASS } from "@/components/speak/SpeakResult";

const topicEmoji = (id: string) => ({ topic_food: "🍎", topic_school: "📚", topic_family: "👨‍👩‍👧", topic_animals: "🐾", topic_sports: "⚽", topic_daily: "☀️", topic_feelings: "😊", topic_house: "🏠", topic_clothes: "👕", topic_travel: "✈️", topic_environment: "🌍", topic_technology: "💻", topic_health: "🏥", topic_education: "🎓", topic_work: "💼", topic_society: "🏛️", topic_science: "🔬", topic_culture: "🎭", topic_greetings: "👋", topic_weather: "🌤️", topic_numbers: "🔢", topic_colors: "🎨", topic_body: "🦴", topic_hobbies: "🎸", topic_shopping: "🛒" }[id] || "📖");

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

function NavTile({ icon: Icon, iconClass, title, badge, onClick }: {
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/50 bg-card p-3 shadow-sm transition-all active:scale-[0.96] hover:shadow-md relative">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-xs font-extrabold text-center leading-tight">{title}</span>
      {badge && <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{badge}</span>}
    </button>
  );
}

export function HomePage({ student, studiedWordIds, streak, xp, learnedTotal, learnedToday, reviewDue, pendingCount, dueTestCount, onStartSkillTest, onChangeStudent, onLogout, onOpenProfile, onNavigate }: HomePageProps) {
  const learned = new Set(studiedWordIds);
  const [testResults, setTestResults] = useState<SkillTestResult[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [weekRank, setWeekRank] = useState<number | null>(null);

  useEffect(() => { getSkillTestResults(student.id).then(r => setTestResults(r.slice(0, 3))).catch(() => {}); }, [student.id]);
  useEffect(() => { getLeaderboard("week").then((lb) => { const idx = lb.findIndex((e: any) => e.id === student.id); setWeekRank(idx >= 0 ? idx + 1 : null); }).catch(() => {}); }, [student.id]);

  const goal = student.dailyGoal || 10;
  const goalReached = learnedToday >= goal;
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
    <main className="mx-auto w-full max-w-2xl px-4 pt-4 pb-6">
      {/* ── Header: Logo + Avatar dropdown ── */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ParrotLogo size={32} />
          <span className="text-lg font-black tracking-tight">English Buddy</span>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 rounded-2xl bg-card border border-border px-3 py-1.5 shadow-sm transition-all active:scale-95">
            <span className="text-xl">{avatarEmoji(student.avatar)}</span>
            <div className="text-right">
              <p className="text-sm font-black leading-tight">{student.name}</p>
              <p className="text-[10px] font-bold text-muted-foreground">Lv {level}</p>
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

      {/* ── Hero: Stats + Goal + CTA ── */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-success p-5 text-white shadow-lg">
        {/* Stats row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-sm font-extrabold"><Star className="h-4 w-4" />{xp}</span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-sm font-extrabold"><Flame className="h-4 w-4" />{streak}</span>
            <button type="button" onClick={() => onNavigate("leaderboard")} className="flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-sm px-2.5 py-1 text-sm font-extrabold hover:bg-white/40 transition-colors">
              <Trophy className="h-4 w-4" />{weekRank ? `#${weekRank}` : "—"}
            </button>
          </div>
          <p className="text-xs font-bold opacity-75">{levelLabel(xp)}</p>
        </div>

        {/* Goal + CTA */}
        <div className="flex items-center gap-4">
          <ProgressRing value={learnedToday} max={goal} size={72} stroke={8}>
            <span className="text-2xl font-black leading-none">{learnedToday}</span>
            <span className="text-[10px] font-bold opacity-70">/{goal}</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black leading-tight">
              {goalReached ? "Đạt mục tiêu! 🎉" : `Cần ${goal - learnedToday} từ nữa`}
            </p>
            <p className="text-sm font-semibold opacity-80">Vốn từ đã thuộc: {learnedTotal}</p>
          </div>
          <Button type="button" variant="accent" size="lg" className="shrink-0 rounded-2xl shadow-md" onClick={startLearning}>
            <Play className="h-5 w-5" /> {resumeStarted ? "Tiếp" : "Học"}
          </Button>
        </div>
      </section>

      {/* ── Action cards: Thi + Ôn ── */}
      {(pendingCount >= 10 || dueTestCount > 0 || reviewDue > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {pendingCount >= 10 && (
            <button type="button" onClick={() => onStartSkillTest("new")}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-success/40 bg-success/5 p-3 transition-all active:scale-95">
              <GraduationCap className="h-6 w-6 text-success" />
              <span className="text-xs font-extrabold text-success">Thi mới</span>
              <span className="text-[10px] font-bold text-muted-foreground">{pendingCount} từ</span>
            </button>
          )}
          {dueTestCount > 0 && (
            <button type="button" onClick={() => onStartSkillTest("review")}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-primary/40 bg-primary/5 p-3 transition-all active:scale-95">
              <RotateCcw className="h-6 w-6 text-primary" />
              <span className="text-xs font-extrabold text-primary">Thi lại</span>
              <span className="text-[10px] font-bold text-muted-foreground">{dueTestCount} từ</span>
            </button>
          )}
          {reviewDue > 0 && (
            <button type="button" onClick={() => onNavigate("review")}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-accent/40 bg-accent/5 p-3 transition-all active:scale-95">
              <RotateCcw className="h-6 w-6 text-accent" />
              <span className="text-xs font-extrabold text-accent">Cần ôn</span>
              <span className="text-[10px] font-bold text-muted-foreground">{reviewDue} từ</span>
            </button>
          )}
        </div>
      )}
      {pendingCount > 0 && pendingCount < 10 && (
        <p className="mt-2 text-center text-xs font-bold text-muted-foreground">
          Còn {10 - pendingCount} từ nữa để mở bài thi
        </p>
      )}

      {/* ── Kết quả thi gần đây (chuyển lên trên) ── */}
      {testResults.length > 0 && (
        <section className="mt-4">
          <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold">
            <ClipboardCheck className="h-5 w-5 text-primary" /> Kết quả gần đây
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {testResults.map((r) => {
              const grade = r.score >= 90 ? "A+" : r.score >= 80 ? "A" : r.score >= 70 ? "B" : r.score >= 60 ? "C" : r.score >= 50 ? "D" : "F";
              const color = r.score >= 80 ? "text-success" : r.score >= 60 ? "text-yellow-600" : "text-red-600";
              return (
                <div key={r.id} className="shrink-0 w-28 rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                  <p className={cn("text-2xl font-black", color)}>{grade}</p>
                  <p className="text-sm font-extrabold">{r.score}%</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Học: Quick actions row 1 ── */}
      <section className="mt-4">
        <h2 className="mb-2 text-base font-extrabold">Luyện tập</h2>
        <div className="grid grid-cols-4 gap-2">
          <NavTile icon={BookOpen} iconClass="bg-primary/10 text-primary" title="Flashcard" onClick={() => onNavigate("flashcard")} />
          <NavTile icon={GraduationCap} iconClass="bg-success/10 text-success" title="Làm đề" onClick={() => onNavigate("exam")} />
          <NavTile icon={Mic} iconClass="bg-primary/10 text-primary" title="Luyện nói" onClick={() => onNavigate("speak")} />
          <NavTile icon={BookMarked} iconClass="bg-accent/10 text-accent" title="My Words" onClick={() => onNavigate("mywords")} badge={learnedTotal > 0 ? undefined : undefined} />
        </div>
      </section>

      {/* ── Khám phá: Quick actions row 2 ── */}
      <section className="mt-3">
        <h2 className="mb-2 text-base font-extrabold">Khám phá</h2>
        <div className="grid grid-cols-4 gap-2">
          <NavTile icon={Headphones} iconClass="bg-primary/10 text-primary" title="Shadowing" onClick={() => onNavigate("shadowing")} />
          <NavTile icon={MessageCircle} iconClass="bg-accent/10 text-accent" title="Hội thoại" onClick={() => onNavigate("conversation")} />
          <NavTile icon={Trophy} iconClass="bg-yellow-100 text-yellow-700" title="Xếp hạng" onClick={() => onNavigate("leaderboard")} />
          <NavTile icon={BarChart3} iconClass="bg-secondary text-secondary-foreground" title="Theo dõi" onClick={() => onNavigate("dashboard")} />
        </div>
      </section>

      {/* ── Chủ đề ── */}
      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-extrabold">Chủ đề</h2>
          <button type="button" className="flex items-center text-sm font-bold text-primary" onClick={() => onNavigate("topics")}>
            Tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {topicsAtLevel.map((topic) => {
            const words = wordsOf(topic.id);
            const done = words.filter((w) => learned.has(w.id)).length;
            const pct = words.length ? Math.round((done / words.length) * 100) : 0;
            return (
              <button key={topic.id} type="button" onClick={() => onNavigate("lesson", topic.id, learnLevel)}
                className="rounded-2xl border border-border/50 bg-card p-3 text-left shadow-sm transition-all active:scale-[0.97] hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{topicEmoji(topic.id)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold leading-tight truncate">{topic.name}</p>
                    <p className="text-xs font-semibold text-muted-foreground truncate">{topic.name_vi}</p>
                  </div>
                  <span className="text-xs font-extrabold text-muted-foreground">{done}/{words.length}</span>
                </div>
                <ProgressBar value={pct} className="mt-2 h-1.5" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Ngữ pháp shortcut ── */}
      <section className="mt-4 mb-4">
        <button type="button" onClick={() => onNavigate("grammar")}
          className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">📖</span>
          <div className="flex-1">
            <p className="text-sm font-extrabold">Ngữ pháp</p>
            <p className="text-xs text-muted-foreground">52 chủ đề × 6 cấp độ</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </section>
    </main>
  );
}
