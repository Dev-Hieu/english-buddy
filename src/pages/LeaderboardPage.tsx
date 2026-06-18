import { Flame, Loader2, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderEntry } from "@/services/studentService";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";
import { avatarEmoji } from "@/components/ui/emoji";
import { levelOf } from "@/components/ui/badges";

interface LeaderboardPageProps {
  currentStudentId: string | null;
  onBackHome: () => void;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export function LeaderboardPage({ currentStudentId, onBackHome }: LeaderboardPageProps) {
  const [rows, setRows] = useState<LeaderEntry[] | null>(null);

  useEffect(() => {
    let alive = true;
    getLeaderboard().then((r) => alive && setRows(r)).catch(() => alive && setRows([]));
    return () => { alive = false; };
  }, []);

  const myRank = rows?.findIndex((r) => r.id === currentStudentId) ?? -1;

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title="Bảng xếp hạng" onClose={onBackHome} />

      {rows === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chưa có dữ liệu. Học để ghi điểm nào!</CardContent></Card>
      ) : (
        <>
          <div className="mb-4 flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-primary to-success p-5 text-center text-primary-foreground shadow-soft">
            <Trophy className="h-10 w-10" />
            <p className="text-lg font-black">Top học viên chăm chỉ nhất</p>
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
                    <span className="block text-xs font-bold text-muted-foreground">Cấp {levelOf(r.xp)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-extrabold text-accent"><Flame className="h-4 w-4" />{r.streak}</span>
                  <span className="flex w-20 items-center justify-end gap-1 font-black text-primary"><Star className="h-4 w-4" />{r.xp}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
