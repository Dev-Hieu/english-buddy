import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { db } from "./db.js";

// Bí mật ký token — ĐỔI khi deploy (env AUTH_SECRET).
const SECRET = process.env.AUTH_SECRET || "english-buddy-dev-secret-change-me";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // "parent" | "admin"
  createdAt: number;
  studentLimit: number; // hạn mức số bé (admin cấp)
}

const publicUser = (r: any): User => ({
  id: r.id, email: r.email, name: r.name, role: r.role, createdAt: r.createdAt,
  studentLimit: r.studentLimit ?? 1,
});

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
export function registerUser(email: string, password: string, name: string): { token: string; user: User } | { error: string } {
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "email không hợp lệ" };
  if (!password || password.length < 4) return { error: "mật khẩu tối thiểu 4 ký tự" };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return { error: "email đã được dùng" };
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, passwordHash, name, role, createdAt, studentLimit) VALUES (?, ?, ?, ?, 'parent', ?, 1)")
    .run(id, email, hashPassword(password), (name || "").trim() || email.split("@")[0], Date.now());
  return { token: sign(id), user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) };
}

export function loginUser(email: string, password: string): { token: string; user: User } | null {
  email = String(email || "").trim().toLowerCase();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (!row || !verifyPassword(password, row.passwordHash)) return null;
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
