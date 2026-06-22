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
  createdAt: r.createdAt,
  studentLimit: r.studentLimit ?? 1,
  isPremium: !!r.isPremium || r.role === "admin",
  canEditImages: !!r.canEditImages || r.role === "admin",
});

export function generateUsername(): string {
  const count = ((db.prepare("SELECT MAX(CAST(SUBSTR(username,3) AS INTEGER)) AS n FROM users WHERE username LIKE 'hs%'").get() as any)?.n || 0) + 1;
  return `hs${String(count).padStart(3, "0")}`;
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

// ── Token stateless (HMAC) — sống qua restart ──
function sign(userId: string): string {
  return `${userId}.${createHmac("sha256", SECRET).update(userId).digest("hex")}`;
}
function verifyToken(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const userId = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  const expected = Buffer.from(createHmac("sha256", SECRET).update(userId).digest("hex"));
  return sig.length === expected.length && timingSafeEqual(sig, expected) ? userId : null;
}

// ── Tài khoản ──
export function registerUser(email: string, password: string, name: string, inviteCode?: string): { token: string; user: User } | { error: string } {
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "email không hợp lệ" };
  if (!password || password.length < 4) return { error: "mật khẩu tối thiểu 4 ký tự" };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return { error: "email đã được dùng" };

  let status = "pending";
  if (inviteCode) {
    const ic = db.prepare("SELECT * FROM invite_codes WHERE code = ? AND usedCount < maxUses AND (expiresAt IS NULL OR expiresAt > ?)").get(inviteCode, Date.now()) as any;
    if (!ic) return { error: "Mã không hợp lệ hoặc hết lượt" };
    status = "active";
    db.prepare("UPDATE invite_codes SET usedCount = usedCount + 1 WHERE code = ?").run(inviteCode);
  }

  const id = randomUUID();
  const username = generateUsername();
  db.prepare("INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, status) VALUES (?, ?, ?, ?, ?, 'parent', ?, 1, ?)")
    .run(id, email, username, hashPassword(password), (name || "").trim() || email.split("@")[0], Date.now(), status);
  return { token: sign(id), user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) };
}

export function loginUser(login: string, password: string): { token: string; user: User } | null {
  login = String(login || "").trim().toLowerCase();
  // Tìm theo email hoặc username
  const row = (db.prepare("SELECT * FROM users WHERE email = ? OR username = ?").get(login, login)) as any;
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
