import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  type Notification,
  listNotifications,
  createNotification,
  deleteNotification,
} from "@/services/studentService";

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    listNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const activeCount = notifications.filter(
    (n) => !n.expiresAt || n.expiresAt > Date.now()
  ).length;

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) { setMsg("Vui lòng nhập tiêu đề và nội dung."); return; }
    setSaving(true);
    setMsg("");
    try {
      const expiresAt = expiryDate ? new Date(expiryDate).getTime() : undefined;
      await createNotification({ title: title.trim(), message: message.trim(), expiresAt });
      setTitle("");
      setMessage("");
      setExpiryDate("");
      setMsg("Đã gửi thông báo.");
      load();
    } catch {
      setMsg("Lỗi khi tạo thông báo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa thông báo này?")) return;
    await deleteNotification(id).catch(() => null);
    load();
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="space-y-6 p-4 max-w-2xl">
      {/* Header + badge */}
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-black">Thông báo</h2>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground">
            {activeCount} đang hiển thị
          </span>
        )}
      </div>

      {/* Create form */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <p className="text-sm font-extrabold text-muted-foreground">Tạo thông báo mới</p>
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Tiêu đề *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Nội dung thông báo *"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-extrabold text-muted-foreground block mb-1">Hết hạn (tuỳ chọn)</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <Button
              className="mt-5"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </div>
          {msg && <p className="text-xs font-bold text-primary">{msg}</p>}
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <p className="text-sm font-bold text-muted-foreground">Đang tải...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm font-bold text-muted-foreground">Chưa có thông báo nào.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const expired = n.expiresAt != null && n.expiresAt <= Date.now();
            return (
              <Card key={n.id} className={expired ? "opacity-50" : ""}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold truncate">{n.title}</p>
                      <p className="text-sm font-bold text-muted-foreground mt-1 whitespace-pre-wrap">{n.message}</p>
                      <p className="text-xs font-bold text-muted-foreground mt-2">
                        {formatDate(n.createdAt)}
                        {n.expiresAt && (
                          <span className="ml-2">
                            · Hết hạn: {formatDate(n.expiresAt)}
                            {expired && <span className="ml-1 text-destructive">(đã hết hạn)</span>}
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
