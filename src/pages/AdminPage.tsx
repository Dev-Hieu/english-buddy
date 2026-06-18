import { Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { listUsers, type AdminUser } from "@/services/studentService";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";

export function AdminPage({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);

  useEffect(() => {
    let alive = true;
    listUsers().then((u) => alive && setUsers(u)).catch(() => alive && setUsers([]));
    return () => { alive = false; };
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-4">
      <SessionHeader title="Quản trị người dùng" onClose={onBack} />
      {users === null ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <p className="mb-3 font-bold text-muted-foreground">{users.length} tài khoản</p>
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    {u.role === "admin" ? <Shield className="h-5 w-5" /> : u.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-extrabold">{u.name}</span>
                    <span className="block truncate text-sm font-semibold text-muted-foreground">{u.email}</span>
                  </span>
                  <span className="text-right text-sm font-bold">
                    <span className={u.role === "admin" ? "text-primary" : "text-muted-foreground"}>{u.role === "admin" ? "Admin" : "Phụ huynh"}</span>
                    <span className="block text-muted-foreground">{u.studentCount} bé</span>
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
