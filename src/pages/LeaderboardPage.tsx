import { Flame, Loader2, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderEntry } from "@/services/studentService";
import { LEVEL_LABELS, type Level } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";

interface LeaderboardPageProps {
  currentStudentId: string | null;
  level?: string;
  onBackHome: () => void;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function LeaderboardPage({ currentStudentId, level = "", onBackHome }: LeaderboardPageProps) {
  const [period, setPeriod] = useState<"week" | "all">("week");
  const [rows, setRows] = useState<LeaderEntry[] | null>(null);
  const levelLabel = LEVEL_LABELS[level as Level];

  useEffect(() => {
    let alive = true;
    setRows(null);
    // Xếp hạng trong cùng cấp độ của con (công bằng theo trình độ).
    getLeaderboard(period, level).then((r) => alive && setRows(r)).catch(() => alive && setRows([]));
    return () => { alive = false; };
  }, [period, level]);

  const myRank = rows?.findIndex((r) => r.id === currentStudentId) ?? -1;

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={`Bảng xếp hạng${levelLabel ? ` · ${levelLabel}` : ""}`} onClose={onBackHome} />

      {/* Tab: Tuần này / Mọi thời gian */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {([["week", "Tuần này"], ["all", "Mọi thời gian"]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setPeriod(k)}
            className={cn("rounded-xl py-2 text-sm font-extrabold transition-colors", period === k ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {l}
          </button>
        ))}
      </div>

      {rows === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chưa có dữ liệu. Học để ghi điểm nào!</CardContent></Card>
      ) : (
        <>
          <div className="mb-4 flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-primary to-success p-5 text-center text-primary-foreground shadow-soft">
            <Trophy className="h-10 w-10" />
            <p className="text-lg font-black">{period === "week" ? "Top tuần này" : "Top mọi thời gian"}{levelLabel ? ` · ${levelLabel}` : ""}</p>
            {myRank >= 0 ? <p className="font-bold opacity-90">Hạng của con: #{myRank + 1}</p> : null}
          </div>

          <div className="space-y-2">
            {rows.map((r, i) => {
              const me = r.id === currentStudentId;
              return (
                <div key={r.id} className={cn("flex items-center gap-3 rounded-2xl border-2 bg-card p-3 shadow-card", me ? "border-primary" : "border-transparent")}>
                  <span className="w-8 text-center text-lg font-black">{i < 3 ? MEDAL[i] : <span className="text-muted-foreground">#{i + 1}</span>}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-xl">{avatarEmoji(r.avatar)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold">{r.name}{me ? " (con)" : ""}</span>
                    <span className="block text-xs font-bold text-muted-foreground">{LEVEL_LABELS[r.level as Level] ?? r.level}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-extrabold text-accent"><Flame className="h-4 w-4" />{r.streak}</span>
                  <span className="flex w-20 items-center justify-end gap-1 font-black text-primary"><Star className="h-4 w-4" />{r.points}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
            {period === "week" ? "Điểm tính trong tuần này, làm mới mỗi thứ Hai." : "Tổng điểm tích luỹ."} Xếp trong cùng trình độ.
          </p>
        </>
      )}
    </main>
  );
}
