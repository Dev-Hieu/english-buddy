import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getReports, type ReportData } from "@/services/studentService";

export interface ReportsTabProps {}

const LEVEL_LABELS: Record<string, string> = {
  kids: "Kids",
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
};

const LEVEL_COLORS: Record<string, string> = {
  kids: "bg-pink-400",
  a1: "bg-green-400",
  a2: "bg-emerald-500",
  b1: "bg-blue-400",
  b2: "bg-indigo-500",
  c1: "bg-purple-500",
};

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ReportsTab(_props: ReportsTabProps) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReports()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Không tải được báo cáo"); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm font-bold text-muted-foreground">Đang tải báo cáo…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm font-bold text-destructive">{error ?? "Lỗi không xác định"}</p>
      </div>
    );
  }

  const maxLevelCount = Math.max(1, ...data.levelDist.map((r: any) => r.count));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black">Báo cáo</h2>
        <p className="text-sm font-bold text-muted-foreground">Thống kê tổng quan hệ thống</p>
      </div>

      {/* Summary cards 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-black">{data.totalStudents}</p>
            <p className="text-sm font-bold text-muted-foreground">Tổng học sinh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-black text-green-600">{data.activeToday}</p>
            <p className="text-sm font-bold text-muted-foreground">Hoạt động hôm nay</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-black text-blue-600">{data.totalWords}</p>
            <p className="text-sm font-bold text-muted-foreground">Tổng từ vựng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-black text-amber-600">{data.avgXp}</p>
            <p className="text-sm font-bold text-muted-foreground">XP trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 students */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-extrabold">Top 10 học sinh</h3>
          {data.topStudents.length === 0 ? (
            <p className="text-sm font-bold text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-extrabold text-muted-foreground w-8">#</th>
                    <th className="pb-2 text-left font-extrabold text-muted-foreground">Học sinh</th>
                    <th className="pb-2 text-right font-extrabold text-muted-foreground">XP</th>
                    <th className="pb-2 text-right font-extrabold text-muted-foreground">Chuỗi</th>
                    <th className="pb-2 text-right font-extrabold text-muted-foreground">Từ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topStudents.map((s: any, i: number) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-2 font-extrabold text-muted-foreground">
                        {RANK_MEDALS[i + 1] ?? <span className="text-xs">{i + 1}</span>}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{s.avatar || "👤"}</span>
                          <div>
                            <p className="font-bold leading-tight">{s.name}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase">{LEVEL_LABELS[s.level] ?? s.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-right font-extrabold text-amber-600">{s.xp ?? 0}</td>
                      <td className="py-2 text-right font-bold">{s.streak ?? 0} 🔥</td>
                      <td className="py-2 text-right font-bold text-blue-600">{s.vocabCount ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level distribution bar chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 font-extrabold">Phân bố trình độ</h3>
          {data.levelDist.length === 0 ? (
            <p className="text-sm font-bold text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {data.levelDist.map((row: any) => (
                <div key={row.level} className="flex items-center gap-3">
                  <span className="w-10 text-right text-xs font-extrabold text-muted-foreground uppercase">
                    {LEVEL_LABELS[row.level] ?? row.level}
                  </span>
                  <div className="flex-1 rounded-full bg-muted h-6 overflow-hidden">
                    <div
                      className={`h-6 rounded-full ${LEVEL_COLORS[row.level] ?? "bg-primary"} transition-all`}
                      style={{ width: `${(row.count / maxLevelCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-left text-xs font-extrabold">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent quizzes */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 font-extrabold">Bài test gần đây</h3>
          {data.recentQuizzes.length === 0 ? (
            <p className="text-sm font-bold text-muted-foreground text-center py-4">Chưa có bài test nào</p>
          ) : (
            <div className="space-y-2">
              {data.recentQuizzes.map((q: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-bold">{q.studentName}</p>
                    <p className="text-xs font-bold text-muted-foreground">{formatDate(q.createdAt)}</p>
                  </div>
                  <span
                    className={`text-sm font-extrabold ${
                      q.score >= 80 ? "text-green-600" : q.score >= 50 ? "text-amber-600" : "text-red-500"
                    }`}
                  >
                    {q.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export placeholder */}
      <Card>
        <CardContent className="p-4 text-center text-sm font-bold text-muted-foreground">
          Xuất Excel/PDF — Sắp có
        </CardContent>
      </Card>
    </div>
  );
}
