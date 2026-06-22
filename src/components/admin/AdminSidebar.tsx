import { BarChart3, Bell, BookOpen, Crown, GraduationCap, Image, LayoutDashboard, LogOut, Settings, Users, Wifi } from "lucide-react";
import { cn } from "@/components/ui/cn";

export type AdminTab = "overview" | "users" | "students" | "classes" | "content" | "images" | "reports" | "notifications" | "online" | "settings";

interface MenuItem { key: AdminTab; label: string; icon: React.ReactNode; disabled?: boolean; }

const MENU: MenuItem[] = [
  { key: "overview", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: "users", label: "Tài khoản", icon: <Users className="h-5 w-5" /> },
  { key: "students", label: "Học sinh", icon: <GraduationCap className="h-5 w-5" /> },
  { key: "classes", label: "Lớp học", icon: <BookOpen className="h-5 w-5" /> },
  { key: "content", label: "Nội dung", icon: <BookOpen className="h-5 w-5" />, disabled: true },
  { key: "images", label: "Ảnh từ vựng", icon: <Image className="h-5 w-5" /> },
  { key: "reports", label: "Báo cáo", icon: <BarChart3 className="h-5 w-5" />, disabled: true },
  { key: "notifications", label: "Thông báo", icon: <Bell className="h-5 w-5" />, disabled: true },
  { key: "online", label: "Online", icon: <Wifi className="h-5 w-5" />, disabled: true },
  { key: "settings", label: "Cài đặt", icon: <Settings className="h-5 w-5" />, disabled: true },
];

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminName: string;
  onLogout: () => void;
  onClose?: () => void; // mobile: close sidebar
}

export function AdminSidebar({ activeTab, onTabChange, adminName, onLogout, onClose }: Props) {
  const handleClick = (item: MenuItem) => {
    if (item.disabled) return;
    onTabChange(item.key);
    onClose?.();
  };

  return (
    <aside className="flex h-full w-60 flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-black text-primary">English Buddy</h2>
        <p className="text-xs font-bold text-muted-foreground">Quản trị hệ thống</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {MENU.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleClick(item)}
            disabled={item.disabled}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
              activeTab === item.key ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.disabled && <span className="text-[10px] font-extrabold opacity-60">Sắp có</span>}
          </button>
        ))}
      </nav>

      {/* Footer: admin info + logout */}
      <div className="border-t border-border p-3">
        <p className="text-sm font-extrabold truncate">{adminName}</p>
        <p className="text-xs font-bold text-muted-foreground mb-2">Quản trị viên</p>
        <button type="button" onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
