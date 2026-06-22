import { Check, Copy, Crown, Image, Plus, Shield, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import {
  AdminUser, InviteCode,
  listUsers, createUser, deleteUser, setStudentLimit, setPremium, setImageEditor, setUserStatus,
  listInviteCodes, createInviteCode, deleteInviteCode,
} from "@/services/studentService";

interface UsersTabProps {
  onRefresh: () => void;
}

type SubTab = "all" | "pending" | "premium" | "admin";

export function UsersTab({ onRefresh }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  // Add user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [newPremium, setNewPremium] = useState(false);
  const [adding, setAdding] = useState(false);

  // Invite code form
  const [codeType, setCodeType] = useState("invite");
  const [codeMaxUses, setCodeMaxUses] = useState(10);
  const [creatingCode, setCreatingCode] = useState(false);

  const load = () => {
    listUsers().then(setUsers).catch(() => setUsers([]));
    listInviteCodes().then(setCodes).catch(() => setCodes([]));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (subTab === "pending") list = list.filter((u) => (u as any).status === "pending");
    else if (subTab === "premium") list = list.filter((u) => u.isPremium);
    else if (subTab === "admin") list = list.filter((u) => u.role === "admin");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [users, subTab, search]);

  const pendingCount = useMemo(() => users.filter((u) => (u as any).status === "pending").length, [users]);

  const markSaved = (id: string) => { setSaved(id); setTimeout(() => setSaved((s) => (s === id ? null : s)), 1500); };

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
    if (!confirm(`Xoa "${u.name}" (${u.email})?\nTat ca hoc sinh + du lieu bi xoa.`)) return;
    await deleteUser(u.id).catch(() => {});
    load(); onRefresh();
  };

  const handleAddUser = async () => {
    if (!newEmail.trim() || !newName.trim()) return;
    setAdding(true);
    try {
      await createUser({ email: newEmail.trim(), password: newPassword || "123456", name: newName.trim(), isPremium: newPremium });
      setNewName(""); setNewEmail(""); setNewPassword("123456"); setNewPremium(false);
      setShowAdd(false);
      load(); onRefresh();
    } catch { /* ignore */ } finally { setAdding(false); }
  };

  const handleCreateCode = async () => {
    setCreatingCode(true);
    try {
      await createInviteCode({ type: codeType, maxUses: codeMaxUses });
      listInviteCodes().then(setCodes).catch(() => {});
    } catch { /* ignore */ } finally { setCreatingCode(false); }
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`Xoa ma "${code}"?`)) return;
    await deleteInviteCode(code).catch(() => {});
    listInviteCodes().then(setCodes).catch(() => {});
  };

  const copyCode = (code: string) => navigator.clipboard.writeText(code).catch(() => {});

  const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: `Cho duyet${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "premium", label: "Premium" },
    { key: "admin", label: "Admin" },
  ];

  const statusBadge = (u: AdminUser) => {
    const status = (u as any).status as string | undefined;
    if (status === "pending") return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-700">CHO DUYET</span>;
    if (status === "rejected") return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-extrabold text-red-700">TU CHOI</span>;
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">Tai khoan</h2>
        <Button type="button" size="sm" onClick={() => setShowAdd((v) => !v)}>
          <Plus className="h-4 w-4" /> Them
        </Button>
      </div>

      {/* Add user form */}
      {showAdd && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="font-extrabold text-sm">Them tai khoan moi</p>
            <input className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary" placeholder="Ho ten" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary" placeholder="Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <input className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary" placeholder="Mật khẩu" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={newPremium} onChange={(e) => setNewPremium(e.target.checked)} />
              Premium
            </label>
            <div className="flex gap-2 pt-1">
              <Button type="button" size="sm" onClick={handleAddUser} disabled={adding || !newName.trim() || !newEmail.trim()}>
                {adding ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Huy</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        {SUB_TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setSubTab(t.key)}
            className={cn("flex-1 rounded-xl py-2 text-xs font-extrabold transition-colors",
              subTab === t.key ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-bold outline-none focus:border-primary"
        placeholder="Tìm theo tên, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User cards */}
      <div className="space-y-3">
        {filtered.map((u) => {
          const isAdmin = u.role === "admin";
          const isPending = (u as any).status === "pending";
          return (
            <Card key={u.id}>
              <CardContent className="p-4 space-y-3">
                {/* Avatar + info */}
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-white font-extrabold text-sm",
                    isAdmin ? "bg-red-500" : "bg-primary")}>
                    {isAdmin ? <Shield className="h-5 w-5" /> : u.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {isAdmin && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-extrabold text-red-700">ADMIN</span>}
                    {u.isPremium ? <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-extrabold text-yellow-700">PREMIUM</span> : null}
                    {statusBadge(u)}
                  </div>
                </div>

                {/* Student count */}
                <p className="text-xs font-bold text-muted-foreground">
                  Hoc sinh: {u.studentCount} / {u.studentLimit}
                </p>

                {/* Actions (not for admin) */}
                {!isAdmin && (
                  <div className="space-y-2">
                    {/* Approve/Reject for pending */}
                    {isPending && (
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => handleApprove(u)} className="flex-1">
                          <Check className="h-4 w-4" /> Duyet
                        </Button>
                        <Button type="button" size="sm" variant="destructive" onClick={() => handleReject(u)} className="flex-1">
                          <X className="h-4 w-4" /> Tu choi
                        </Button>
                      </div>
                    )}

                    {/* Student limit */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-muted-foreground w-24 flex-shrink-0">Gioi han HS:</label>
                      <input type="number" min={0} max={200}
                        className="w-16 rounded-xl border border-border px-2 py-1 text-sm font-bold text-center outline-none focus:border-primary"
                        value={u.studentLimit}
                        onChange={(e) => handleLimit(u.id, Number(e.target.value))} />
                      <Button type="button" size="sm" variant="outline" onClick={() => saveLimit(u)}>
                        {saved === u.id ? <Check className="h-4 w-4 text-green-500" /> : "Lưu"}
                      </Button>
                    </div>

                    {/* Toggles + delete */}
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => togglePremium(u)}
                        className={cn("flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-colors",
                          u.isPremium ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground")}>
                        <Crown className="h-3.5 w-3.5" /> Premium
                      </button>
                      <button type="button" onClick={() => toggleEditor(u)}
                        className={cn("flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-colors",
                          u.canEditImages ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground")}>
                        <Image className="h-3.5 w-3.5" /> Sua anh
                      </button>
                      <button type="button" onClick={() => handleDelete(u)}
                        className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto">
                        <Trash2 className="h-3.5 w-3.5" /> Xoa
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm font-bold text-muted-foreground py-6">Khong co tai khoan nao.</p>
        )}
      </div>

      {/* Invite codes section */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold">Ma moi &amp; Ma lop</h3>

        {/* Create form */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex gap-2">
              <select className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-primary bg-card"
                value={codeType} onChange={(e) => setCodeType(e.target.value)}>
                <option value="invite">Invite (dang ky)</option>
                <option value="class">Class (lop hoc)</option>
              </select>
              <input type="number" min={1} max={1000} placeholder="So luot" value={codeMaxUses}
                onChange={(e) => setCodeMaxUses(Number(e.target.value))}
                className="w-24 rounded-xl border border-border px-3 py-2 text-sm font-bold text-center outline-none focus:border-primary" />
              <Button type="button" size="sm" onClick={handleCreateCode} disabled={creatingCode}>
                <Plus className="h-4 w-4" /> Tao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Code list */}
        <div className="space-y-2">
          {codes.map((c) => (
            <Card key={c.code}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold truncate">{c.code}</span>
                    <button type="button" onClick={() => copyCode(c.code)} className="flex-shrink-0 text-muted-foreground hover:text-primary">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-extrabold flex-shrink-0",
                      c.type === "class" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.usedCount}/{c.maxUses} luot
                    {c.expiresAt ? ` · Het han ${new Date(c.expiresAt).toLocaleDateString("vi-VN")}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => handleDeleteCode(c.code)}
                  className="flex-shrink-0 rounded-xl p-1.5 text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
          {codes.length === 0 && (
            <p className="text-center text-sm font-bold text-muted-foreground py-4">Chua co ma nao.</p>
          )}
        </div>
      </div>
    </div>
  );
}
