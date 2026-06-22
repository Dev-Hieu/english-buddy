import { BookOpen, Crown, GraduationCap, Image, Plus, School, UserPlus, Users, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { avatarEmoji } from "@/components/ui/emoji";
import { getOnlineStudents, getReports, listClasses, type ReportData } from "@/services/studentService";

interface OverviewTabProps {
  stats: { users: number; students: number; premium: number; pending: number };
  adminName: string;
  onGoTab: (tab: string) => void;
  onOpenPicker: () => void;
}

export function OverviewTab({ stats, adminName, onGoTab, onOpenPicker }: OverviewTabProps) {
  const [online, setOnline] = useState<number | null>(null);
  const [classCount, setClassCount] = useState<number | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    getOnlineStudents().then((d) => setOnline(d.count)).catch(() => {});
    listClasses().then((c) => setClassCount(c.length)).catch(() => {});
    getReports().then(setReport).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
        <p className="text-xl font-black">Xin chào, {adminName} 👋</p>
        <p className="text-sm font-bold opacity-80">{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Pending banner */}
      {stats.pending > 0 && (
        <button type="button" onClick={() => onGoTab("users")}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-left transition-transform active:scale-[0.99]">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-extrabold text-amber-800">{stats.pending} tài khoản chờ duyệt</p>
            <p className="text-sm font-bold text-amber-600">Bấm để duyệt</p>
          </div>
        </button>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="cursor-pointer" onClick={() => onGoTab("users")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary"><Users className="h-5 w-5 text-secondary-foreground" /></span>
            <div><p className="text-2xl font-black">{stats.users}</p><p className="text-xs font-bold text-muted-foreground">Tài khoản</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => onGoTab("students")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15"><GraduationCap className="h-5 w-5 text-primary" /></span>
            <div><p className="text-2xl font-black">{stats.students}</p><p className="text-xs font-bold text-muted-foreground">Học sinh</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => onGoTab("classes")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100"><School className="h-5 w-5 text-blue-600" /></span>
            <div><p className="text-2xl font-black">{classCount ?? "—"}</p><p className="text-xs font-bold text-muted-foreground">Lớp học</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15"><Crown className="h-5 w-5 text-accent" /></span>
            <div><p className="text-2xl font-black">{stats.premium}</p><p className="text-xs font-bold text-muted-foreground">Premium</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => onGoTab("online")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
              <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" /></span>
            </span>
            <div><p className="text-2xl font-black text-green-600">{online ?? "—"}</p><p className="text-xs font-bold text-muted-foreground">Hôm nay</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => onGoTab("content")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100"><BookOpen className="h-5 w-5 text-purple-600" /></span>
            <div><p className="text-2xl font-black">{report?.totalWords ?? "—"}</p><p className="text-xs font-bold text-muted-foreground">Từ vựng</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-2 font-extrabold">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={() => onGoTab("users")}><UserPlus className="h-4 w-4" /> Thêm tài khoản</Button>
          <Button type="button" variant="outline" onClick={() => onGoTab("students")}><Plus className="h-4 w-4" /> Tạo học sinh</Button>
          <Button type="button" variant="outline" onClick={() => onGoTab("classes")}><School className="h-4 w-4" /> Tạo lớp học</Button>
          <Button type="button" variant="outline" onClick={onOpenPicker}><Image className="h-4 w-4" /> Chỉnh ảnh</Button>
        </div>
      </div>

      {/* Top 5 students */}
      {report?.topStudents && report.topStudents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold">Top học sinh</h3>
              <button type="button" onClick={() => onGoTab("reports")} className="text-xs font-bold text-primary">Xem báo cáo →</button>
            </div>
            <div className="space-y-2">
              {report.topStudents.slice(0, 5).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
                  <span className="w-6 text-center font-black text-muted-foreground">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}</span>
                  <span className="text-lg">{avatarEmoji(s.avatar || "boy")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold truncate">{s.name}</p>
                    <p className="text-xs font-bold text-muted-foreground">{(s.level || "a1").toUpperCase()} · {s.vocabCount || 0} từ</p>
                  </div>
                  <span className="text-sm font-black text-amber-600">⭐{s.xp || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active today summary */}
      {report && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-black text-green-600">{report.activeToday}</p>
              <p className="text-xs font-bold text-muted-foreground">Hoạt động hôm nay</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-black text-amber-600">{report.avgXp}</p>
              <p className="text-xs font-bold text-muted-foreground">XP trung bình</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
