import { apiRequest, clearToken, getToken, setToken } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "parent" | "admin" | "teacher" | "student";
  status?: "active" | "pending" | "rejected";
  createdAt: number;
  studentLimit: number;
  isPremium?: boolean;
  canEditImages?: boolean;
}

const USER_KEY = "eb_user";

function store(token: string, user: AuthUser): AuthUser {
  setToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function register(name: string, email: string, password: string, inviteCode?: string, role?: string): Promise<AuthUser> {
  const r = await apiRequest<{ token: string; user: AuthUser }>("/api/register", {
    method: "POST", body: { name, email, password, ...(inviteCode ? { inviteCode } : {}), ...(role ? { role } : {}) }, auth: false,
  });
  return store(r.token, r.user);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const r = await apiRequest<{ token: string; user: AuthUser }>("/api/login", {
    method: "POST", body: { email, password }, auth: false,
  });
  return store(r.token, r.user);
}

export function logout(): void {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getUser(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

// Làm tươi thông tin tài khoản (vd hạn mức admin vừa đổi).
export async function refreshMe(): Promise<AuthUser | null> {
  try {
    const u = await apiRequest<AuthUser>("/api/me");
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  } catch {
    return null;
  }
}
