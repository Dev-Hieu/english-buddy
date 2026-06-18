import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { login } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(password);
      onLogin();
    } catch {
      setError("Sai mật khẩu, hoặc server chưa chạy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <header className="mb-6 text-center">
        <p className="text-sm font-bold text-primary">English Buddy 🦉</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Phụ huynh đăng nhập</h1>
        <p className="mt-2 text-muted-foreground">Nhập mật khẩu để mở khoá việc học của hai bé.</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold" htmlFor="pw">Mật khẩu phụ huynh</label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <input
                  id="pw"
                  type="password"
                  autoFocus
                  className="h-11 flex-1 bg-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
            <Button type="submit" size="lg" className="w-full" disabled={loading || !password}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
