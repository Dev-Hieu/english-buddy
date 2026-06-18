import { serviceError } from "./http";

// Client gọi API server tự host (server/). Base URL từ env, mặc định localhost dev.
const BASE: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";
const TOKEN_KEY = "eb_token";

export const getToken = (): string => localStorage.getItem(TOKEN_KEY) ?? "";
export const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

interface Opts {
  method?: string;
  body?: unknown;
  auth?: boolean; // false = endpoint public (không gắn token)
}

export async function apiRequest<T>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.auth !== false) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }

  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw serviceError("network", `Không gọi được API: ${path}`);
  }

  if (res.status === 401) throw serviceError("unknown", "Chưa đăng nhập hoặc hết phiên");
  if (res.status === 404) throw serviceError("not_found", path);
  if (res.status === 429) throw serviceError("rate_limit", "Quá nhiều yêu cầu");
  if (!res.ok) throw serviceError("unknown", `Lỗi ${res.status}: ${path}`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const API_BASE_URL = BASE;
