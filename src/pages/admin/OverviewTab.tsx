import { Crown, Plus, Shield, UserPlus, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OverviewTabProps {
  stats: { users: number; students: number; premium: number; pending: number };
  adminName: string;
  onGoTab: (tab: string) => void;
  onOpenPicker: () => void;
}

export function OverviewTab({ stats, adminName, onGoTab, onOpenPicker }: OverviewTabProps) {
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer" onClick={() => onGoTab("users")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary"><Users className="h-6 w-6 text-secondary-foreground" /></span>
            <div><p className="text-2xl font-black">{stats.users}</p><p className="text-sm font-bold text-muted-foreground">Tài khoản</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => onGoTab("students")}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-2xl">👦</span>
            <div><p className="text-2xl font-black">{stats.students}</p><p className="text-sm font-bold text-muted-foreground">Học sinh</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15"><Crown className="h-6 w-6 text-accent" /></span>
            <div><p className="text-2xl font-black">{stats.premium}</p><p className="text-sm font-bold text-muted-foreground">Premium</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><Wifi className="h-6 w-6 text-muted-foreground" /></span>
            <div><p className="text-2xl font-black text-muted-foreground">—</p><p className="text-sm font-bold text-muted-foreground">Online (GĐ2)</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-2 font-extrabold">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={() => onGoTab("users")}><UserPlus className="h-4 w-4" /> Thêm tài khoản</Button>
          <Button type="button" variant="outline" onClick={() => onGoTab("students")}><Plus className="h-4 w-4" /> Tạo học sinh</Button>
          <Button type="button" variant="outline" onClick={onOpenPicker}>🖼️ Chỉnh ảnh</Button>
          <Button type="button" variant="outline" onClick={() => window.open("/picker", "_blank")}>🖼️ Picker nâng cao</Button>
        </div>
      </div>

      {/* Activity placeholder */}
      <Card>
        <CardContent className="p-4 text-center text-sm font-bold text-muted-foreground">
          📋 Hoạt động gần đây — Sắp có (GĐ2)
        </CardContent>
      </Card>
    </div>
  );
}
