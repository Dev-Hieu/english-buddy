import { KeyRound, Loader2, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { login, register, type AuthUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

interface AuthPageProps {
  onAuthed: (user: AuthUser) => void;
}

export function AuthPage({ onAuthed }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = mode === "login" ? await login(email, password) : await register(name, email, password);
      onAuthed(user);
    } catch (err) {
      setError((err as Error).message?.includes("email") ? "Email đã dùng hoặc sai thông tin." : "Sai email/mật khẩu, hoặc server chưa chạy.");
    } finally {
      setLoading(false);
    }
  };

  const field = "flex items-center gap-2 rounded-2xl border-2 border-border bg-white px-3 focus-within:border-primary";
  const input = "h-12 flex-1 bg-transparent font-bold outline-none";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
      <header className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-secondary text-5xl shadow-card">🦉</div>
        <h1 className="text-3xl font-black tracking-tight">English Buddy</h1>
        <p className="mt-2 font-semibold text-muted-foreground">Học tiếng Anh vui cho cả nhà</p>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {(["login", "register"] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setError(""); }}
            className={cn("rounded-xl py-2.5 text-sm font-extrabold transition-colors", mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {m === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        ))}
      </div>

      <form className="space-y-3 rounded-3xl border border-border/70 bg-card p-6 shadow-card" onSubmit={submit}>
        {mode === "register" ? (
          <div className={field}>
            <UserRound className="h-5 w-5 text-muted-foreground" />
            <input className={input} placeholder="Tên phụ huynh" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        ) : null}
        <div className={field}>
          <Mail className="h-5 w-5 text-muted-foreground" />
          <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <div className={field}>
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          <input className={input} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={loading || !email || !password}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
          {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
        Tài khoản demo: phuhuynh@buddy.vn · mật khẩu 123456
      </p>
    </main>
  );
}
