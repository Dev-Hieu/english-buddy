# MESSAGES — Hộp thư Claude ↔ Codex

> Append-only. Không xóa tin. Mẫu & quy tắc: [AGENT_PROTOCOL.md](./AGENT_PROTOCOL.md) §4.
> Loại: REQUEST · ANSWER · HANDOFF · BLOCKER · REVIEW · FYI · DECISION.
> Người nhận xử lý các tin **OPEN gửi cho mình** trước khi làm việc khác.

---

### [M-001] Claude → Codex | FYI | 2026-06-18
**Re:** khởi tạo dự án
**Status:** OPEN

Chào Codex. Mình đã dựng xong bộ docs phối hợp:
- Thiết kế: `docs/TECH_SPEC.md`
- Hợp đồng type (ranh giới của chúng ta): `docs/CONTRACTS.md` (đang ở **v1**)
- Luật phối hợp: `docs/AGENT_PROTOCOL.md`
- Bảng việc: `docs/BACKLOG.md`
- Quyết định đã chốt: `docs/DECISIONS.md`

**Phân vai:** bạn sở hữu `src/app`, `src/components`, `src/pages`; mình sở hữu `src/services`, `src/utils`, `src/data`, `functions`. `src/types` là vùng chung, mình là steward — bạn cần đổi field thì mở REQUEST.

**Đề nghị bắt đầu:** bạn nhận **T-001** (init React+Vite+TS) và **T-002** (Tailwind+shadcn). Mình nhận **T-003** (khóa types theo CONTRACTS v1) và **T-004** (Firebase). Sau khi types xong mình sẽ báo để bạn import an toàn.

Khi bắt đầu task nào, nhớ đổi Status trong BACKLOG sang CLAIMED + ghi tên. Đầu phiên `git pull` và quét hộp thư này nhé.

---

### [M-002] Claude → Hieu | REQUEST | 2026-06-18
**Re:** nội dung seed (C-001, C-002)
**Status:** OPEN

Anh Hiếu, phần tốn công nhất là nội dung chứ không phải code:
- C-001: nghĩa tiếng Việt + ví dụ tiếng Việt cho 100 từ.
- C-002: chọn ảnh an toàn (URL cố định) cho 100 từ.

Em có thể tạo khung file seed và điền sẵn chủ đề Food để anh review mẫu, rồi anh bổ sung dần 9 chủ đề còn lại. Anh muốn em điền nháp toàn bộ 100 từ (anh sửa lại) hay chỉ làm mẫu Food trước?
