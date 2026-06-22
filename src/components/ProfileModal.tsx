import { Save, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateMe, type AuthUser } from "@/services/authService";

interface ProfileModalProps {
  user: AuthUser & { phone?: string; birthday?: string };
  onClose: () => void;
  onUpdated: (user: AuthUser) => void;
}

export function ProfileModal({ user, onClose, onUpdated }: ProfileModalProps) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [birthday, setBirthday] = useState(user.birthday || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMsg("");
    try {
      const data: { name?: string; phone?: string; birthday?: string; password?: string } = {
        name: name.trim(),
        phone: phone.trim(),
        birthday,
      };
      if (password.trim()) data.password = password.trim();
      const updated = await updateMe(data);
      onUpdated(updated);
      setMsg("Đã lưu!");
      setPassword("");
      setTimeout(() => onClose(), 800);
    } catch {
      setMsg("Lỗi khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full rounded-xl border-2 border-border bg-card px-3 py-2.5 text-sm font-bold outline-none focus:border-primary";
  const roleLabel: Record<string, string> = { parent: "Phụ huynh", teacher: "Giáo viên", student: "Học sinh", admin: "Quản trị viên" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-card p-5 shadow-xl space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Thông tin cá nhân</h2>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-1 text-sm">
          <span className="font-bold text-muted-foreground">Vai trò:</span>{" "}
          <span className="font-extrabold">{roleLabel[user.role] || user.role}</span>
          {user.email && <p className="text-muted-foreground font-semibold">Email: {user.email}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground">Họ tên</label>
            <input className={inp + " mt-1"} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Số điện thoại</label>
            <input type="tel" className={inp + " mt-1"} placeholder="VD: 0901234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Ngày sinh</label>
            <input type="date" className={inp + " mt-1"} value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Đổi mật khẩu</label>
            <input type="password" className={inp + " mt-1"} placeholder="Để trống nếu không đổi" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        {msg && <p className={`text-sm font-bold ${msg.includes("Lỗi") ? "text-red-600" : "text-emerald-600"}`}>{msg}</p>}

        <div className="flex gap-2">
          <Button type="button" onClick={handleSave} disabled={saving || !name.trim()} className="flex-1">
            <Save className="h-4 w-4" /> {saving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Huỷ</Button>
        </div>
      </div>
    </div>
  );
}
