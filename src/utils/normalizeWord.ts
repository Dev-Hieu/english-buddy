/**
 * Chuẩn hóa từ/cụm người dùng nhập ở Quick Lookup trước khi gọi API.
 * trim · lowercase · gộp khoảng trắng · bỏ ký tự không phải chữ ở đầu/cuối.
 * Giữ khoảng trắng giữa các từ (vd "ice cream").
 */
export function normalizeWord(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
}
