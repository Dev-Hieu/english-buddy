import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { db } from "./db.js";

// Bí mật ký token — ĐỔI khi deploy (env AUTH_SECRET).
const SECRET = process.env.AUTH_SECRET || "english-buddy-dev-secret-change-me";

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string; // "parent" | "admin" | "teacher"
  status: string; // "active" | "pending" | "rejected"
  createdAt: number;
  studentLimit: number;
  isPremium: boolean;
  canEditImages: boolean;
}

const publicUser = (r: any): User => ({
  id: r.id, email: r.email, username: r.username || "", name: r.name, role: r.role,
  status: r.status || "active",
  phone: r.phone || "", birthday: r.birthday || "",
  createdAt: r.createdAt,
  studentLimit: r.studentLimit ?? 1,
  isPremium: !!r.isPremium || r.role === "admin",
  canEditImages: !!r.canEditImages || r.role === "admin",
});

const USERNAME_PREFIX: Record<string, { prefix: string; pad: number }> = {
  parent: { prefix: "PH", pad: 6 },
  teacher: { prefix: "GV", pad: 3 },
  admin: { prefix: "AD", pad: 2 },
  student: { prefix: "HS", pad: 6 },
};

export function generateUsername(role: string = "parent"): string {
  const cfg = USERNAME_PREFIX[role] || USERNAME_PREFIX.parent;
  const max = ((db.prepare(`SELECT MAX(CAST(SUBSTR(username, ${cfg.prefix.length + 1}) AS INTEGER)) AS n FROM users WHERE UPPER(username) LIKE '${cfg.prefix}%'`).get() as any)?.n || 0) + 1;
  return `${cfg.prefix}${String(max).padStart(cfg.pad, "0")}`;
}

// Sinh username cho học sinh (dùng khi tạo tài khoản riêng cho bé)
export function generateStudentUsername(): string {
  const max = ((db.prepare("SELECT MAX(CAST(SUBSTR(username, 3) AS INTEGER)) AS n FROM users WHERE UPPER(username) LIKE 'HS%'").get() as any)?.n || 0) + 1;
  return `HS${String(max).padStart(6, "0")}`;
}

// ── Mật khẩu (scrypt) ──
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${key}`;
}
export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, key] = (stored || "").split(":");
  if (!salt || !key) return false;
  const calc = scryptSync(pw, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  return keyBuf.length === calc.length && timingSafeEqual(keyBuf, calc);
}

// ── Token stateless (HMAC) — sống qua restart, hết hạn 7 ngày ──
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 ngày

function sign(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  return `${payload}.${createHmac("sha256", SECRET).update(payload).digest("hex")}`;
}
export function verifyToken(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  const expected = Buffer.from(createHmac("sha256", SECRET).update(payload).digest("hex"));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  // Token mới: "userId:timestamp.hmac" — check expiry
  const colonIdx = payload.lastIndexOf(":");
  if (colonIdx >= 0) {
    const ts = Number(payload.slice(colonIdx + 1));
    if (!isNaN(ts) && ts > 1700000000000) { // timestamp hợp lệ (sau 2023)
      if (Date.now() - ts > TOKEN_MAX_AGE) return null;
      return payload.slice(0, colonIdx);
    }
  }
  // Token cũ (không có timestamp) → hết hạn, buộc đăng nhập lại
  return null;
}

// ── Tài khoản ──
export function registerUser(email: string, password: string, name: string, inviteCode?: string, role?: string): { token: string; user: User } | { error: string } {
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "email không hợp lệ" };
  if (!password || password.length < 4) return { error: "mật khẩu tối thiểu 4 ký tự" };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return { error: "email đã được dùng" };

  const allowedRoles = ["parent", "teacher", "student"];
  const r = allowedRoles.includes(role || "") ? role! : "parent";

  let status = "pending";
  if (inviteCode) {
    const ic = db.prepare("SELECT * FROM invite_codes WHERE code = ? AND usedCount < maxUses AND (expiresAt IS NULL OR expiresAt > ?)").get(inviteCode, Date.now()) as any;
    if (!ic) return { error: "Mã không hợp lệ hoặc hết lượt" };
    status = "active";
    db.prepare("UPDATE invite_codes SET usedCount = usedCount + 1 WHERE code = ?").run(inviteCode);
  }

  const id = randomUUID();
  const displayName = (name || "").trim() || email.split("@")[0];
  const username = generateUsername(r);
  db.prepare("INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)")
    .run(id, email, username, hashPassword(password), displayName, r, Date.now(), status);

  // Student tự đăng ký → tạo student record luôn
  if (r === "student") {
    const sid = "student_" + randomUUID().slice(0, 8);
    db.prepare("INSERT INTO students (id, parentId, userId, name, grade, level, avatar, dailyGoal, xp, streak, createdAt) VALUES (?, ?, ?, ?, 1, 'a1', 'boy_avatar_01', 10, 0, 0, ?)")
      .run(sid, id, id, displayName, Date.now());
  }

  return { token: sign(id), user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) };
}

export function loginUser(login: string, password: string): { token: string; user: User } | null {
  login = String(login || "").trim().toLowerCase();
  // Tìm theo email hoặc username (không phân biệt hoa/thường)
  const row = (db.prepare("SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?").get(login, login)) as any;
  if (!row || !verifyPassword(password, row.passwordHash)) return null;
  if (row.status === "rejected") return null;
  return { token: sign(row.id), user: publicUser(row) };
}

export function getUserById(id: string): User | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
  return row ? publicUser(row) : null;
}

// ── Middleware ──
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.header("authorization") || "").replace(/^Bearer\s+/i, "");
  const userId = token ? verifyToken(token) : null;
  const user = userId ? getUserById(userId) : null;
  if (!user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  (req as any).user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if ((req as any).user?.role !== "admin") {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    next();
  });
}
