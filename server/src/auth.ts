import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

// Auth tối giản cho app 1 gia đình: 1 mật khẩu phụ huynh (env PARENT_PASSWORD).
// Đăng nhập đúng -> cấp token (lưu in-memory). Khởi động lại server thì cần đăng nhập lại.
const PARENT_PASSWORD = process.env.PARENT_PASSWORD || "bao-ngoc-bao-nam";
const tokens = new Set<string>();

export function login(password: string): string | null {
  if (password !== PARENT_PASSWORD) return null;
  const token = randomUUID();
  tokens.add(token);
  return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (!token || !tokens.has(token)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
}
