import { Award, Lock, GraduationCap, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Student } from "@/types";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";
import { getStudentProgress } from "@/services/progressService";
import { getSkillTestResults, type SkillTestResult } from "@/services/progressService";
import { getMyGameRank } from "@/services/gameService";
import { getCertificates, type Certificate } from "@/services/certificateService";

// ── Stats collected from APIs ──
interface StudentStats {
  wordsLearned: number;
  streak: number;
  xp: number;
  listeningDone: number;
  speakingDone: number;
  readingDone: number;
  writingDone: number;
  gamesPlayed: number;
  hasSpeedTypeS: boolean;
  hasAPlus: boolean;
  hasPerfect: boolean;
  testResults: SkillTestResult[];
}

// ── Badge definition ──
interface Badge {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  condition: (stats: StudentStats) => boolean;
  tier: "bronze" | "silver" | "gold";
  progress?: (stats: StudentStats) => { current: number; target: number };
}

// ── 30 badges across categories ──
const BADGES: Badge[] = [
  // Vocabulary (4)
  { id: "vocab_10", name: "Seedling", nameVi: "Mầm non", description: "Học 10 từ đầu tiên", icon: "\uD83C\uDF31", tier: "bronze", condition: (s) => s.wordsLearned >= 10, progress: (s) => ({ current: s.wordsLearned, target: 10 }) },
  { id: "vocab_50", name: "Growing", nameVi: "Đang lớn", description: "Học 50 từ vựng", icon: "\uD83C\uDF3F", tier: "bronze", condition: (s) => s.wordsLearned >= 50, progress: (s) => ({ current: s.wordsLearned, target: 50 }) },
  { id: "vocab_200", name: "Strong roots", nameVi: "Vững vàng", description: "Học 200 từ vựng", icon: "\uD83C\uDF33", tier: "silver", condition: (s) => s.wordsLearned >= 200, progress: (s) => ({ current: s.wordsLearned, target: 200 }) },
  { id: "vocab_1000", name: "Master", nameVi: "Bậc thầy", description: "Học 1000 từ vựng", icon: "\uD83C\uDFC6", tier: "gold", condition: (s) => s.wordsLearned >= 1000, progress: (s) => ({ current: s.wordsLearned, target: 1000 }) },

  // Streak (3)
  { id: "streak_3", name: "3-day streak", nameVi: "3 ngày liên tiếp", description: "Học 3 ngày liên tiếp", icon: "\uD83D\uDD25", tier: "bronze", condition: (s) => s.streak >= 3, progress: (s) => ({ current: s.streak, target: 3 }) },
  { id: "streak_7", name: "Week warrior", nameVi: "7 ngày liên tiếp", description: "Học 7 ngày liên tiếp (1 tuần)", icon: "\uD83D\uDD25\uD83D\uDD25", tier: "silver", condition: (s) => s.streak >= 7, progress: (s) => ({ current: s.streak, target: 7 }) },
  { id: "streak_30", name: "Month master", nameVi: "30 ngày liên tiếp", description: "Học 30 ngày liên tiếp (1 tháng)", icon: "\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25", tier: "gold", condition: (s) => s.streak >= 30, progress: (s) => ({ current: s.streak, target: 30 }) },

  // Skills (4)
  { id: "listen_10", name: "Good ear", nameVi: "Nghe giỏi", description: "Hoàn thành 10 bài nghe", icon: "\uD83D\uDC42", tier: "bronze", condition: (s) => s.listeningDone >= 10, progress: (s) => ({ current: s.listeningDone, target: 10 }) },
  { id: "speak_10", name: "Good speaker", nameVi: "Nói hay", description: "Hoàn thành 10 bài nói", icon: "\uD83D\uDDE3\uFE0F", tier: "bronze", condition: (s) => s.speakingDone >= 10, progress: (s) => ({ current: s.speakingDone, target: 10 }) },
  { id: "read_10", name: "Bookworm", nameVi: "Đọc nhiều", description: "Đọc 10 bài", icon: "\uD83D\uDCD6", tier: "bronze", condition: (s) => s.readingDone >= 10, progress: (s) => ({ current: s.readingDone, target: 10 }) },
  { id: "write_5", name: "Good writer", nameVi: "Viết tốt", description: "Viết 5 bài essay", icon: "\u270D\uFE0F", tier: "silver", condition: (s) => s.writingDone >= 5, progress: (s) => ({ current: s.writingDone, target: 5 }) },

  // Games (2)
  { id: "games_20", name: "Gamer", nameVi: "Game thủ", description: "Chơi 20 game", icon: "\uD83C\uDFAE", tier: "bronze", condition: (s) => s.gamesPlayed >= 20, progress: (s) => ({ current: s.gamesPlayed, target: 20 }) },
  { id: "speed_s", name: "Speed demon", nameVi: "Tốc độ", description: "Đạt rank S trong SpeedType", icon: "\u26A1", tier: "gold", condition: (s) => s.hasSpeedTypeS },

  // Tests (2)
  { id: "test_aplus", name: "A+ student", nameVi: "Học sinh giỏi", description: "Đạt điểm A+ trong skill test", icon: "\uD83C\uDFAF", tier: "silver", condition: (s) => s.hasAPlus },
  { id: "test_perfect", name: "Perfect", nameVi: "Hoàn hảo", description: "100% trong 1 bài thi", icon: "\uD83D\uDCAF", tier: "gold", condition: (s) => s.hasPerfect },

  // XP milestones (4)
  { id: "xp_100", name: "Rising star", nameVi: "Ngôi sao mới", description: "Đạt 100 XP", icon: "\u2B50", tier: "bronze", condition: (s) => s.xp >= 100, progress: (s) => ({ current: s.xp, target: 100 }) },
  { id: "xp_500", name: "Shining star", nameVi: "Ngôi sao sáng", description: "Đạt 500 XP", icon: "\uD83C\uDF1F", tier: "silver", condition: (s) => s.xp >= 500, progress: (s) => ({ current: s.xp, target: 500 }) },
  { id: "xp_2000", name: "Superstar", nameVi: "Siêu sao", description: "Đạt 2000 XP", icon: "\uD83D\uDCAB", tier: "gold", condition: (s) => s.xp >= 2000, progress: (s) => ({ current: s.xp, target: 2000 }) },
  { id: "xp_5000", name: "Legend", nameVi: "Huyền thoại", description: "Đạt 5000 XP", icon: "\uD83D\uDC51", tier: "gold", condition: (s) => s.xp >= 5000, progress: (s) => ({ current: s.xp, target: 5000 }) },

  // More vocabulary (3)
  { id: "vocab_500", name: "Scholar", nameVi: "Học giả", description: "Học 500 từ vựng", icon: "\uD83D\uDCDA", tier: "silver", condition: (s) => s.wordsLearned >= 500, progress: (s) => ({ current: s.wordsLearned, target: 500 }) },
  { id: "vocab_2000", name: "Lexicon", nameVi: "Từ điển sống", description: "Học 2000 từ vựng", icon: "\uD83E\uDDD0", tier: "gold", condition: (s) => s.wordsLearned >= 2000, progress: (s) => ({ current: s.wordsLearned, target: 2000 }) },
  { id: "vocab_3000", name: "Oxford 3000", nameVi: "Oxford 3000", description: "Học đủ 3000 từ Oxford", icon: "\uD83C\uDF93", tier: "gold", condition: (s) => s.wordsLearned >= 3000, progress: (s) => ({ current: s.wordsLearned, target: 3000 }) },

  // More streaks (2)
  { id: "streak_14", name: "2-week streak", nameVi: "14 ngày liên tiếp", description: "Học 14 ngày liên tiếp", icon: "\uD83D\uDCC5", tier: "silver", condition: (s) => s.streak >= 14, progress: (s) => ({ current: s.streak, target: 14 }) },
  { id: "streak_100", name: "100-day streak", nameVi: "100 ngày liên tiếp", description: "Học 100 ngày liên tiếp", icon: "\uD83D\uDE80", tier: "gold", condition: (s) => s.streak >= 100, progress: (s) => ({ current: s.streak, target: 100 }) },

  // More skills (3)
  { id: "listen_30", name: "Sharp ear", nameVi: "Tai thính", description: "Hoàn thành 30 bài nghe", icon: "\uD83C\uDFA7", tier: "silver", condition: (s) => s.listeningDone >= 30, progress: (s) => ({ current: s.listeningDone, target: 30 }) },
  { id: "speak_30", name: "Eloquent", nameVi: "Hùng biện", description: "Hoàn thành 30 bài nói", icon: "\uD83C\uDFA4", tier: "silver", condition: (s) => s.speakingDone >= 30, progress: (s) => ({ current: s.speakingDone, target: 30 }) },
  { id: "read_30", name: "Avid reader", nameVi: "Mọt sách", description: "Đọc 30 bài", icon: "\uD83D\uDCDA", tier: "silver", condition: (s) => s.readingDone >= 30, progress: (s) => ({ current: s.readingDone, target: 30 }) },

  // More games (2)
  { id: "games_50", name: "Pro gamer", nameVi: "Game thủ chuyên nghiệp", description: "Chơi 50 game", icon: "\uD83D\uDD79\uFE0F", tier: "silver", condition: (s) => s.gamesPlayed >= 50, progress: (s) => ({ current: s.gamesPlayed, target: 50 }) },
  { id: "games_100", name: "Gaming legend", nameVi: "Huyền thoại game", description: "Chơi 100 game", icon: "\uD83C\uDFAE", tier: "gold", condition: (s) => s.gamesPlayed >= 100, progress: (s) => ({ current: s.gamesPlayed, target: 100 }) },
];

const TIER_COLORS: Record<Badge["tier"], { bg: string; ring: string; text: string }> = {
  bronze: { bg: "bg-amber-100 dark:bg-amber-900/30", ring: "ring-amber-400", text: "text-amber-700 dark:text-amber-300" },
  silver: { bg: "bg-slate-100 dark:bg-slate-800/40", ring: "ring-slate-400", text: "text-slate-600 dark:text-slate-300" },
  gold: { bg: "bg-yellow-100 dark:bg-yellow-900/30", ring: "ring-yellow-500", text: "text-yellow-700 dark:text-yellow-300" },
};

interface BadgesPageProps {
  student: Student;
  onBackHome: () => void;
}

export function BadgesPage({ student, onBackHome }: BadgesPageProps) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [selected, setSelected] = useState<Badge | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      const [progress, testResults, speedRank, certs] = await Promise.all([
        getStudentProgress(student.id).catch(() => []),
        getSkillTestResults(student.id).catch(() => [] as SkillTestResult[]),
        getMyGameRank("speed-type", student.id).catch(() => null),
        getCertificates(student.id).catch(() => [] as Certificate[]),
      ]);

      if (!alive) return;
      setCertificates(certs);

      const wordsLearned = progress.filter((p) => p.mastery > 0).length;
      const hasAPlus = testResults.some((r) => r.score >= 90);
      const hasPerfect = testResults.some((r) => r.score === 100);

      // Skill test results contain skill breakdown - estimate skill completions from tests
      const totalTests = testResults.length;
      const listeningDone = Math.round(totalTests * 0.8); // each test has listening
      const speakingDone = Math.round(totalTests * 0.6);
      const readingDone = Math.round(totalTests * 0.5);
      const writingDone = Math.round(totalTests * 0.3);

      // Games: estimate from speed-type rank (if rank exists, they've played)
      const gamesPlayed = speedRank?.totalPlayers ? Math.min(speedRank.rank > 0 ? 5 : 0, 100) : 0;
      const hasSpeedTypeS = (speedRank?.bestScore ?? 0) >= 100; // S rank threshold

      setStats({
        wordsLearned,
        streak: student.streak,
        xp: student.xp,
        listeningDone,
        speakingDone,
        readingDone,
        writingDone,
        gamesPlayed,
        hasSpeedTypeS,
        hasAPlus,
        hasPerfect,
        testResults,
      });
    }

    load();
    return () => { alive = false; };
  }, [student.id, student.streak, student.xp]);

  const earnedCount = stats ? BADGES.filter((b) => b.condition(stats)).length : 0;

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader
        title="Huy hiệu & Chứng chỉ"
        onClose={onBackHome}
        icon={<Award className="h-4 w-4" />}
        iconBg="bg-amber-500"
        right={
          <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:text-amber-300">
            {earnedCount}/{BADGES.length}
          </span>
        }
      />

      {!stats ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 text-center">
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{earnedCount}</p>
            <p className="text-xs font-bold text-muted-foreground">huy hiệu đã đạt</p>
            <div className="mt-2 h-2 rounded-full bg-amber-200/60 dark:bg-amber-800/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                style={{ width: `${(earnedCount / BADGES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Certificates section */}
          {certificates.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold">
                <Award className="h-4 w-4 text-amber-500" />
                Ch\u1EE9ng ch\u1EC9 \u0111\u00E3 \u0111\u1EA1t
              </h3>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10 p-3"
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                      cert.type === "placement"
                        ? "bg-indigo-100 dark:bg-indigo-900/40"
                        : "bg-red-100 dark:bg-red-900/40"
                    )}>
                      {cert.type === "placement"
                        ? <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        : <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                          {cert.level}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {cert.type === "placement" ? "X\u1EBFp l\u1EDBp" : "Ch\u1EE9ng ch\u1EC9"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {cert.score}% \u2022 {cert.totalQuestions} c\u00E2u \u2022 {new Date(cert.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <p className="text-[9px] font-mono text-muted-foreground">{cert.certId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badge grid */}
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = badge.condition(stats);
              const tier = TIER_COLORS[badge.tier];
              const prog = badge.progress?.(stats);

              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setSelected(badge)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all active:scale-95",
                    earned
                      ? cn(tier.bg, "border-transparent ring-2", tier.ring, "shadow-lg")
                      : "border-border/40 bg-muted/50 grayscale opacity-60"
                  )}
                >
                  <span className={cn("text-2xl", earned && "animate-pulse drop-shadow-lg")}>{badge.icon}</span>
                  {!earned && (
                    <span className="absolute right-1.5 top-1.5">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    </span>
                  )}
                  <span className={cn("text-[10px] font-bold text-center leading-tight", earned ? tier.text : "text-muted-foreground")}>
                    {badge.nameVi}
                  </span>
                  {!earned && prog && (
                    <div className="w-full">
                      <div className="h-1 rounded-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-muted-foreground/40 transition-all"
                          style={{ width: `${Math.min(100, (prog.current / prog.target) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-[8px] font-bold text-muted-foreground">
                        {prog.current}/{prog.target}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Badge detail popup */}
      {selected && stats && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-4 bottom-0 top-auto z-50 mx-auto max-w-md animate-slide-in rounded-t-3xl bg-card p-6 pb-10 shadow-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:pb-6">
            {(() => {
              const earned = selected.condition(stats);
              const tier = TIER_COLORS[selected.tier];
              const prog = selected.progress?.(stats);
              return (
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className={cn("text-5xl", earned && "drop-shadow-lg")}>{selected.icon}</span>
                  <h3 className={cn("text-lg font-black", earned ? tier.text : "text-muted-foreground")}>
                    {selected.nameVi}
                  </h3>
                  <p className="text-xs text-muted-foreground">{selected.name}</p>
                  <p className="text-sm font-medium">{selected.description}</p>

                  {earned ? (
                    <span className={cn("rounded-full px-4 py-1.5 text-xs font-black", tier.bg, tier.text)}>
                      Đã đạt!
                    </span>
                  ) : prog ? (
                    <div className="w-full max-w-[200px]">
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (prog.current / prog.target) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs font-bold text-muted-foreground">
                        {prog.current} / {prog.target}
                      </p>
                    </div>
                  ) : (
                    <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">
                      Chưa đạt
                    </span>
                  )}

                  <span className={cn("mt-1 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider", tier.bg, tier.text)}>
                    {selected.tier}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-extrabold text-white transition-all active:scale-95"
                  >
                    Đóng
                  </button>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </main>
  );
}

/** Count earned badges for use in other pages (e.g. HomePage avatar). */
export function countEarnedBadges(student: Pick<Student, "streak" | "xp">, wordsLearned: number): number {
  const stats: StudentStats = {
    wordsLearned,
    streak: student.streak,
    xp: student.xp,
    listeningDone: 0,
    speakingDone: 0,
    readingDone: 0,
    writingDone: 0,
    gamesPlayed: 0,
    hasSpeedTypeS: false,
    hasAPlus: false,
    hasPerfect: false,
    testResults: [],
  };
  return BADGES.filter((b) => b.condition(stats)).length;
}
