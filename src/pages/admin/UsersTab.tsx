import { Check, Crown, Image, Pencil, Plus, Search, Shield, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import {
  AdminUser,
  listUsers, createUser, deleteUser, updateUser, setStudentLimit, setPremium, setImageEditor, setUserStatus,
} from "@/services/studentService";

interface UsersTabProps {
  onRefresh: () => void;
}

type SubTab = "stats" | "all" | "admin" | "teacher" | "parent" | "student" | "class" | "pending";

interface EditState {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  password: string;
  studentLimit: number;
  isPremium: boolean;
  canEditImages: boolean;
  phone: string;
  birthday: string;
}

export function UsersTab({ onRefresh }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [subTab, setSubTab] = useState<SubTab>("stats");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  // Add user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [newPremium, setNewPremium] = useState(false);
  const [newRole, setNewRole] = useState("parent");
  const [newPhone, setNewPhone] = useState("");
  const [newBirthday, setNewBirthday] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => {
    listUsers().then(setUsers).catch(() => setUsers([]));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (subTab === "pending") list = list.filter((u) => u.status === "pending");
    else if (subTab === "admin") list = list.filter((u) => u.role === "admin");
    else if (subTab === "teacher") list = list.filter((u) => u.role === "teacher");
    else if (subTab === "parent") list = list.filter((u) => u.role === "parent");
    else if (subTab === "student") list = list.filter((u) => u.role === "student");
    else if (subTab === "class") list = list.filter((u) => u.role === "class");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.username ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, subTab, search]);

  const pendingCount = useMemo(() => users.filter((u) => u.status === "pending").length, [users]);
  const roleCounts = useMemo(() => {
    const c = { total: users.length, admin: 0, teacher: 0, parent: 0, student: 0, class: 0 };
    for (const u of users) {
      if (u.role === "admin") c.admin++;
      else if (u.role === "teacher") c.teacher++;
      else if (u.role === "parent") c.parent++;
      else if (u.role === "student") c.student++;
      else if (u.role === "class") c.class++;
    }
    return c;
  }, [users]);

  const markSaved = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved((s) => (s === id ? null : s)), 1500);
  };

  const handleLimit = (id: string, val: number) =>
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, studentLimit: val } : u));

  const saveLimit = async (u: AdminUser) => {
    await setStudentLimit(u.id, u.studentLimit).catch(() => {});
    markSaved(u.id);
    onRefresh();
  };

  const togglePremium = async (u: AdminUser) => {
    const next = u.isPremium ? 0 : 1;
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, isPremium: next } : x));
    await setPremium(u.id, !!next).catch(() => {});
    onRefresh();
  };

  const toggleEditor = async (u: AdminUser) => {
    const next = u.canEditImages ? 0 : 1;
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, canEditImages: next } : x));
    await setImageEditor(u.id, !!next).catch(() => {});
  };

  const handleApprove = async (u: AdminUser) => {
    await setUserStatus(u.id, "active").catch(() => {});
    load(); onRefresh();
  };

  const handleReject = async (u: AdminUser) => {
    await setUserStatus(u.id, "rejected").catch(() => {});
    load(); onRefresh();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Xoá "${u.name}" (${u.email})?\nTất cả học sinh và dữ liệu sẽ bị xoá.`)) return;
    await deleteUser(u.id).catch(() => {});
    load(); onRefresh();
  };

  const openEdit = (u: AdminUser) => {
    setEditState({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username || "",
      role: u.role || "parent",
      password: "",
      studentLimit: u.studentLimit,
      isPremium: !!u.isPremium,
      canEditImages: !!u.canEditImages,
      phone: u.phone || "",
      birthday: u.birthday || "",
    });
  };

  const cancelEdit = () => setEditState(null);

  const saveEdit = async () => {
    if (!editState) return;
    setSaving(true);
    try {
      const payload: Parameters<typeof updateUser>[1] = {
        name: editState.name,
        email: editState.email,
        username: editState.username,
        role: editState.role,
        studentLimit: editState.studentLimit,
        isPremium: editState.isPremium,
        canEditImages: editState.canEditImages,
        phone: editState.phone,
        birthday: editState.birthday,
      };
      if (editState.password.trim()) payload.password = editState.password.trim();
      await updateUser(editState.id, payload).catch(() => {});
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editState.id
            ? {
                ...u,
                name: editState.name,
                email: editState.email,
                role: editState.role,
                studentLimit: editState.studentLimit,
                isPremium: editState.isPremium ? 1 : 0,
                canEditImages: editState.canEditImages ? 1 : 0,
              }
            : u
        )
      );
      markSaved(editState.id);
      setEditState(null);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async () => {
    if (!newEmail.trim() || !newName.trim()) return;
    setAdding(true);
    try {
      await createUser({
        email: newEmail.trim(),
        password: newPassword || "123456",
        name: newName.trim(),
        isPremium: newPremium,
        role: newRole,
        phone: newPhone.trim() || undefined,
        birthday: newBirthday || undefined,
      });
      setNewName(""); setNewEmail(""); setNewPassword("123456"); setNewPremium(false); setNewRole("parent"); setNewPhone(""); setNewBirthday("");
      setShowAdd(false);
      load(); onRefresh();
    } catch { /* bỏ qua */ } finally { setAdding(false); }
  };

  const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "stats", label: "Thống kê" },
    { key: "all", label: "Tất cả" },
    { key: "admin", label: "Admin" },
    { key: "teacher", label: "Giáo viên" },
    { key: "parent", label: "Phụ huynh" },
    { key: "student", label: "Học sinh" },
    { key: "class", label: "Lớp học" },
    { key: "pending", label: `Chờ duyệt${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
  ];

  const statusBadge = (u: AdminUser) => {
    if (u.status === "pending") return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-700">CHỜ DUYỆT</span>
    );
    if (u.status === "rejected") return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-extrabold text-red-700">TỪ CHỐI</span>
    );
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-extrabold text-green-700">HOẠT ĐỘNG</span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">Tài khoản</h2>
        <Button type="button" size="sm" onClick={() => setShowAdd((v) => !v)}>
          <Plus className="h-4 w-4" /> Thêm
        </Button>
      </div>

      {/* Form thêm tài khoản */}
      {showAdd && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="font-extrabold text-sm">Thêm tài khoản mới</p>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
              placeholder="Họ tên"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
              placeholder="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
              placeholder="Số điện thoại"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <div>
              <label className="text-xs font-bold text-muted-foreground">Ngày sinh</label>
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
                type="date"
                value={newBirthday}
                onChange={(e) => setNewBirthday(e.target.value)}
              />
            </div>
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary"
              placeholder="Mật khẩu"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <select
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary bg-card"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="parent">Phụ huynh</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học sinh</option>
                        <option value="admin">Quản trị viên</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={newPremium}
                onChange={(e) => setNewPremium(e.target.checked)}
              />
              Premium
            </label>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleAddUser}
                disabled={adding || !newName.trim() || !newEmail.trim()}
              >
                {adding ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Huỷ</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-2xl bg-muted p-1 overflow-x-auto">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSubTab(t.key)}
            className={cn(
              "shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors whitespace-nowrap",
              subTab === t.key ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab thống kê */}
      {subTab === "stats" && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-bold text-muted-foreground mb-3">Tổng quan tài khoản</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { label: "Tổng cộng", count: roleCounts.total, tab: "all" as SubTab, color: "bg-slate-100 text-slate-700" },
                  { label: "Admin", count: roleCounts.admin, tab: "admin" as SubTab, color: "bg-red-100 text-red-700" },
                  { label: "Giáo viên", count: roleCounts.teacher, tab: "teacher" as SubTab, color: "bg-blue-100 text-blue-700" },
                  { label: "Phụ huynh", count: roleCounts.parent, tab: "parent" as SubTab, color: "bg-green-100 text-green-700" },
                  { label: "Học sinh", count: roleCounts.student, tab: "student" as SubTab, color: "bg-purple-100 text-purple-700" },
                  { label: "Lớp học", count: roleCounts.class, tab: "class" as SubTab, color: "bg-amber-100 text-amber-700" },
                  { label: "Chờ duyệt", count: pendingCount, tab: "pending" as SubTab, color: pendingCount > 0 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground" },
                ]).map((item) => (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => setSubTab(item.tab)}
                    className={cn("flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:ring-2 hover:ring-primary/30", item.color)}
                  >
                    <span className="text-sm font-bold">{item.label}</span>
                    <span className="text-xl font-black">{item.count}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tìm kiếm + Danh sách (ẩn khi tab thống kê) */}
      {subTab !== "stats" && <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full rounded-2xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm font-bold outline-none focus:border-primary"
          placeholder="Tìm theo tên, email, tên đăng nhập..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map((u) => {
          const isAdmin = u.role === "admin";
          const isPending = u.status === "pending";
          const isEditing = editState?.id === u.id;

          return (
            <Card key={u.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white font-extrabold text-sm", isAdmin ? "bg-red-500" : "bg-primary")}>
                    {isAdmin ? <Shield className="h-5 w-5" /> : u.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email} {u.username ? `· ${u.username}` : ""} · HS: {u.studentCount}/{u.studentLimit}</p>
                  </div>
                  {/* Badges + actions cùng hàng */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isAdmin && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-extrabold text-red-700">ADMIN</span>}
                    {u.isPremium ? <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-extrabold text-yellow-700">PREMIUM</span> : null}
                    {statusBadge(u)}
                    {!isAdmin && (
                      <>
                        <button type="button" onClick={() => isEditing ? cancelEdit() : openEdit(u)} title={isEditing ? "Huỷ" : "Sửa"}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                          {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                        </button>
                        <button type="button" onClick={() => handleDelete(u)} title="Xoá"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Form sửa inline */}
                {isEditing && editState && (
                  <div className="space-y-2 rounded-xl bg-muted/50 p-3 border border-border">
                    <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Chỉnh sửa</p>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Họ tên</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        value={editState.name}
                        onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Email</label>
                      <input
                        type="email"
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        value={editState.email}
                        onChange={(e) => setEditState({ ...editState, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Số điện thoại</label>
                      <input
                        type="tel"
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        placeholder="VD: 0901234567"
                        value={editState.phone}
                        onChange={(e) => setEditState({ ...editState, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Ngày sinh</label>
                      <input
                        type="date"
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        value={editState.birthday}
                        onChange={(e) => setEditState({ ...editState, birthday: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Tên đăng nhập</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        value={editState.username}
                        onChange={(e) => setEditState({ ...editState, username: e.target.value })}
                        placeholder="VD: PH000001"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Vai trò</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        value={editState.role}
                        onChange={(e) => setEditState({ ...editState, role: e.target.value })}
                      >
                        <option value="parent">Phụ huynh</option>
                        <option value="teacher">Giáo viên</option>
                        <option value="student">Học sinh</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground">Đổi mật khẩu</label>
                      <input
                        type="password"
                        className="mt-1 w-full rounded-xl border border-border px-3 py-1.5 text-sm font-bold outline-none focus:border-primary bg-card"
                        placeholder="Để trống nếu không đổi"
                        value={editState.password}
                        onChange={(e) => setEditState({ ...editState, password: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-muted-foreground w-28 flex-shrink-0">Giới hạn HS:</label>
                      <input
                        type="number"
                        min={0}
                        max={200}
                        className="w-20 rounded-xl border border-border px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-primary bg-card"
                        value={editState.studentLimit}
                        onChange={(e) => setEditState({ ...editState, studentLimit: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-primary"
                          checked={editState.isPremium}
                          onChange={(e) => setEditState({ ...editState, isPremium: e.target.checked })}
                        />
                        <Crown className="h-3.5 w-3.5 text-yellow-600" /> Premium
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 accent-primary"
                          checked={editState.canEditImages}
                          onChange={(e) => setEditState({ ...editState, canEditImages: e.target.checked })}
                        />
                        <Image className="h-3.5 w-3.5 text-blue-600" /> Sửa ảnh
                      </label>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button type="button" size="sm" onClick={saveEdit} disabled={saving}>
                        {saving ? "Đang lưu..." : <><Check className="h-4 w-4" /> Lưu</>}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>Huỷ</Button>
                    </div>
                  </div>
                )}

                {/* Duyệt / Từ chối (chỉ hiện cho pending) */}
                {!isAdmin && !isEditing && isPending && (
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={() => handleApprove(u)} className="flex-1">
                      <Check className="h-3.5 w-3.5" /> Duyệt
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => handleReject(u)} className="flex-1">
                      <X className="h-3.5 w-3.5" /> Từ chối
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm font-bold text-muted-foreground py-6">Không có tài khoản nào.</p>
        )}
      </div>
      </>}
    </div>
  );
}
