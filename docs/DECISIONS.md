# DECISIONS — Nhật ký quyết định (ADR-lite)

> Mỗi quyết định đã chốt ghi 1 mục. Muốn đổi → mở DECISION mới tham chiếu mục cũ, không sửa lịch sử.
> Người chốt cuối: **anh Hiếu (phụ huynh)**.

---

## D-001 — Tech stack MVP
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
React + Vite + TypeScript · Tailwind + shadcn/ui · Firebase (Auth + Firestore + Hosting + Functions) · Free Dictionary API · Pexels (+Unsplash dự phòng) · Web Speech API.

## D-002 — Phân vai Claude/Codex theo thư mục
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
Contracts-first, rồi chia ownership: **Claude** = `services/utils/data/functions`; **Codex** = `app/components/pages`; `src/types` chung (Claude steward).
**Lý do:** ít xung đột file nhất, chạy song song được. (Thay cho chia ngang FE/BE của v0.1.)

## D-003 — Quick Lookup có nghĩa tiếng Việt qua API dịch
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
Free Dictionary API không trả tiếng Việt. Quick Lookup từ ngoài seed sẽ gọi **API dịch free (MyMemory/LibreTranslate) qua Firebase Functions**, có cache. 100 từ seed vẫn soạn nghĩa VN tay.
**Lý do:** đối tượng là bé lớp 5–7, cần hiểu nghĩa tiếng Việt.

## D-004 — Khởi tạo git làm kênh phối hợp
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
Dùng git: branch + commit làm tín hiệu bàn giao, kết hợp các file `.md` trong `docs/`.

## D-005 — Ảnh: seed duyệt sẵn + proxy key
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
100 từ seed dùng ảnh đã duyệt (URL cố định). Pexels chỉ gọi **live cho Lookup**, bắt buộc qua Functions với safe-search để giấu key và an toàn cho trẻ.

## D-006 — Phát âm ưu tiên audio người thật
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
Có `audioUrl` (Dictionary) thì phát file đó; không có mới fallback Web Speech API.

## D-007 — Auth tối giản
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
1 tài khoản phụ huynh + 2 profile cứng. Không đăng ký/nhiều parent ở MVP. Security rules chỉ khóa theo `parentId`.

## D-008 — `topicId` → `topicIds: string[]`
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt
Từ thuộc nhiều chủ đề (vd `fish`) lưu 1 document với mảng `topicIds`, tránh trùng `id`.

## D-009 — Firebase Emulator cho dev
**Ngày:** 2026-06-18 · **Trạng thái:** ⛔ Bị thay thế bởi D-010
~~Hỗ trợ chạy local bằng Firebase Emulator.~~ Không còn dùng Firebase.

## D-010 — Backend tự host (SQLite + Express API) thay cho Firebase
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt · **Thay thế:** phần backend của D-001, D-007, D-009
Theo yêu cầu "DB riêng cho chủ động". Dựng `server/` (Node + Express + better-sqlite3):
- DB SQLite (`server/data.db`), seed dùng chung nguồn với client (`src/data`).
- API: topics/vocabulary (public), students/progress/quiz/lookup (cần auth), proxy `/api/image` (Pexels) + `/api/translate` (MyMemory, cache trong DB).
- Auth tối giản: 1 mật khẩu phụ huynh (env `PARENT_PASSWORD`) → token in-memory.
- Client gọi API qua `src/services/api.ts`; **CONTRACTS chữ ký service dữ liệu giữ nguyên** → UI không đổi.
- Spaced repetition & quiz generator **dùng chung** `src/utils` giữa client và server (single source).
**Lý do:** chủ động hoàn toàn (không phụ thuộc tạo Firebase project/key) **và** có đồng bộ đa thiết bị qua server.
**Đánh đổi:** cần host server ở nơi các thiết bị truy cập được (LAN/VPS) để sync thật; key Pexels đặt ở `server/.env` (không commit).
**Đã verify:** seed 99 từ; auth/progress/quiz/translate/image (Pexels key thật) chạy OK; client+server typecheck sạch; 10 unit test pass.

---

## Đang chờ chốt
- **Đăng nhập:** đã chốt qua D-010 — dùng **1 mật khẩu phụ huynh** (đổi `PARENT_PASSWORD` trong `server/.env`). T-010 (LoginPage) gọi `authService.login(password)`.
- `M-002`: nội dung seed — Claude đã soạn nháp toàn bộ ~100 từ (chờ anh review chất lượng).
- **Hosting server:** chọn nơi host (máy ở nhà trên LAN / VPS / Railway…) để 2 bé dùng chung — chờ anh quyết khi deploy.
