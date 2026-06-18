import { apiRequest, clearToken, getToken, setToken } from "./api";

// Auth tối giản: 1 mật khẩu phụ huynh -> token (DECISIONS D-010).
export async function login(password: string): Promise<void> {
  const { token } = await apiRequest<{ token: string }>("/api/login", {
    method: "POST",
    body: { password },
    auth: false,
  });
  setToken(token);
}

export function logout(): void {
  clearToken();
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
