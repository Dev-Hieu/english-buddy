import type { ServiceError } from "../types";

export function serviceError(
  code: ServiceError["code"],
  message: string
): ServiceError {
  const err = new Error(message) as ServiceError;
  err.code = code;
  return err;
}

/** GET JSON với map lỗi về ServiceError. 404 -> not_found, 429 -> rate_limit. */
export async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw serviceError("network", `Không gọi được: ${url}`);
  }
  if (res.status === 404) throw serviceError("not_found", `Không tìm thấy: ${url}`);
  if (res.status === 429) throw serviceError("rate_limit", "Quá nhiều yêu cầu, thử lại sau");
  if (!res.ok) throw serviceError("unknown", `Lỗi ${res.status}: ${url}`);
  return (await res.json()) as T;
}
