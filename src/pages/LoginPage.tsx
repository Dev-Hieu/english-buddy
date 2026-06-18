import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { login } from "@/services/authService";
import { Button } from "@/components/ui/button";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-secondary text-5xl shadow-card">🦉</div>
        <h1 className="text-3xl font-black tracking-tight">English Buddy</h1>
        <p className="mt-2 font-semibold text-muted-foreground">Phụ huynh đăng nhập để mở khoá việc học của hai bé.</p>
      </header>

      <form className="space-y-4 rounded-3xl border border-border/70 bg-card p-6 shadow-card" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm font-extrabold" htmlFor="pw">Mật khẩu phụ huynh</label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-white px-3 focus-within:border-primary">
            <KeyRound className="h-5 w-5 text-muted-foreground" />
            <input
              id="pw"
              type="password"
              autoFocus
              className="h-12 flex-1 bg-transparent text-lg font-bold outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>
        </div>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={loading || !password}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
          Đăng nhập
        </Button>
      </form>
    </main>
  );
}
