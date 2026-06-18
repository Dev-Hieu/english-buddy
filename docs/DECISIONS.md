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

---

## Đang chờ chốt
- (none) — `M-002` đang hỏi anh Hieu về phạm vi điền nội dung seed.
