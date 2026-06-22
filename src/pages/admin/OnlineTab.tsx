import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { avatarEmoji } from "@/components/ui/emoji";
import { getOnlineStudents } from "@/services/studentService";

interface OnlineStudent {
  id: string;
  name: string;
  avatar: string;
  level: string;
  grade: number;
  lastSeen: number;
}

function minutesAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "vừa xong";
  return `${Math.floor(diff / 60)} phút trước`;
}

export function OnlineTab() {
  const [count, setCount] = useState(0);
  const [students, setStudents] = useState<OnlineStudent[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getOnlineStudents();
      setCount(data.count);
      setStudents(data.students);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header count */}
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <span className="relative flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
          </span>
          <div>
            <p className="text-3xl font-black">{loading ? "—" : count}</p>
            <p className="text-sm font-bold text-muted-foreground">học sinh hoạt động hôm nay</p>
          </div>
        </CardContent>
      </Card>

      {/* Student list */}
      {!loading && count === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg font-extrabold text-muted-foreground">Chưa có học sinh nào hoạt động hôm nay</p>
          <p className="text-sm font-bold text-muted-foreground">Tự động cập nhật mỗi 30 giây</p>
        </div>
      )}

      {students.length > 0 && (
        <div className="space-y-2">
          {students.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="text-2xl">{avatarEmoji(s.avatar)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold truncate">{s.name}</p>
                  <p className="text-xs font-bold text-muted-foreground">
                    Lớp {s.grade} · {s.level.toUpperCase()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-extrabold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    hoạt động {minutesAgo(s.lastSeen)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
