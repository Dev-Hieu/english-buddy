import { useCallback, useEffect, useMemo, useState } from "react";
import { listUsers, listAllStudents, type AdminUser, type AdminStudent } from "@/services/studentService";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { AdminTab } from "@/components/admin/AdminSidebar";
import { OverviewTab } from "./admin/OverviewTab";
import { UsersTab } from "./admin/UsersTab";
import { StudentsTab } from "./admin/StudentsTab";

interface AdminPageProps {
  onBack: () => void;
  onOpenPicker: () => void;
  onLoginAsStudent?: (studentId: string) => void;
  adminName?: string;
}

export function AdminPage({ onBack, onOpenPicker, onLoginAsStudent, adminName = "Quản trị viên" }: AdminPageProps) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);

  const loadData = useCallback(() => {
    listUsers().then(setUsers).catch(() => setUsers([]));
    listAllStudents().then(setStudents).catch(() => setStudents([]));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => ({
    users: users.length,
    students: students.length,
    premium: users.filter((u) => u.isPremium).length,
    pending: users.filter((u) => u.status === "pending").length,
  }), [users, students]);

  const handleTabChange = (t: AdminTab) => setTab(t);

  let content: React.ReactNode;
  switch (tab) {
    case "overview":
      content = <OverviewTab stats={stats} adminName={adminName} onGoTab={(t) => setTab(t as AdminTab)} onOpenPicker={onOpenPicker} />;
      break;
    case "users":
      content = <UsersTab onRefresh={loadData} />;
      break;
    case "students":
      content = <StudentsTab onRefresh={loadData} onLoginAsStudent={onLoginAsStudent} />;
      break;
    default:
      content = (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="text-5xl">🚧</span>
          <p className="text-lg font-extrabold">Tính năng đang phát triển</p>
          <p className="text-sm font-bold text-muted-foreground">Sẽ có trong các giai đoạn tiếp theo</p>
        </div>
      );
  }

  return (
    <AdminLayout activeTab={tab} onTabChange={handleTabChange} adminName={adminName} onLogout={onBack}>
      {content}
    </AdminLayout>
  );
}
