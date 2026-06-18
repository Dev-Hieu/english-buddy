import { createHash } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

// Auth tối giản cho app 1 gia đình: 1 mật khẩu phụ huynh (env PARENT_PASSWORD).
// Token là STATELESS (hash của mật khẩu) -> KHÔNG mất khi restart server.
const PARENT_PASSWORD = process.env.PARENT_PASSWORD || "123456";

function expectedToken(): string {
  return createHash("sha256").update("english-buddy:" + PARENT_PASSWORD).digest("hex");
}

export function login(password: string): string | null {
  return password === PARENT_PASSWORD ? expectedToken() : null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.header("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token && token === expectedToken()) {
    next();
    return;
  }
  res.status(401).json({ error: "unauthorized" });
}
