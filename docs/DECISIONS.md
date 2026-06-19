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

## D-011 — Claude tạm tiếp quản toàn bộ UI
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt (anh Hieu)
Để hoàn thiện app nhanh, Claude dựng nốt toàn bộ UI còn lại (Login, Flashcard, Review, Lookup, Test, Games, Dashboard) + router/auth, thay vì chờ Codex. Codex **tạm dừng** vùng `src/pages`/`src/components`/`src/app` để tránh sửa cùng file.
**Lý do:** một mình một mạch, nhanh, không phụ thuộc phiên Codex.
**Hệ quả:** trong giai đoạn này Claude sở hữu cả UI; nếu Codex quay lại, đồng bộ qua MESSAGES trước khi sửa.

---

## D-012 — Đa người dùng (giai đoạn 1): tài khoản + cô lập dữ liệu
**Ngày:** 2026-06-18 · **Trạng thái:** ✅ Chốt (anh Hieu)
Mở rộng từ "1 gia đình" sang nhiều người dùng:
- **Tài khoản**: tự đăng ký email + mật khẩu (scrypt hash). Token stateless HMAC (sống qua restart).
- **Vai trò**: `parent` (quản bé của mình) + `admin` (xem/quản mọi tài khoản qua `/api/admin/users`).
- **Cô lập dữ liệu**: mỗi `student` có `parentId = users.id`; mọi API student/progress/quiz/lookup kiểm tra quyền sở hữu (admin bỏ qua).
- **Quản lý bé động**: thêm/sửa/xoá hồ sơ bé (CRUD `/api/students`), bỏ 2 bé cứng. Seed sẵn 1 phụ huynh demo (giữ Bảo Ngọc/Bảo Nam) + 1 admin (mật khẩu 123456).
- Thay `PARENT_PASSWORD` bằng `AUTH_SECRET` (ký token).
**Đã verify:** đăng ký/đăng nhập, cô lập (user khác → 403), admin liệt kê users, phụ huynh gọi admin → 403.

---

## D-013 — Mở rộng nội dung & cá nhân hoá theo cấp (CEFR)
**Ngày:** 2026-06-19 · **Trạng thái:** ✅ Chốt
- Từ vựng ~3.500 (dedupe còn 2.841 unique) / 18 chủ đề / 6 cấp **kids→C1** (nhiều agent song song).
- Mỗi bé chọn **trình độ**; Home/Chọn chủ đề/Học/Chơi/Test/Làm đề lọc theo cấp (util `levelFilter`). Lọc chủ đề theo **từ ở cấp đó**. Chuẩn hoá level cũ "beginner"→a1; guard level lạ→"all".

## D-014 — Ảnh từ vựng: worker nền tự động
**Ngày:** 2026-06-19 · **Trạng thái:** ✅ Chốt
- `server/imageWorker` định kỳ lấy Pexels cho từ thiếu ảnh, ghi DB + đồng bộ `seedImages.ts` (merge). `mk()` áp `IMAGE_URLS` cho mọi từ.
- VPS đặt `IMAGE_WORKER=off`; ảnh sinh ở dev → commit → deploy (tránh xung đột git). Seed giữ ảnh đã có khi nạp lại.

## D-015 — Tính năng nâng cao (roadmap §15)
**Ngày:** 2026-06-19 · **Trạng thái:** ✅ Chốt
- **GĐ4 Ngữ pháp** (`src/data/grammar`) + **GĐ5 Làm đề** (phân tích lỗi) + game **Nghe&gõ** + **PWA offline**.
- **GĐ3 Hội thoại AI** hoãn — cần LLM API ngoài, chờ thầy chọn nhà cung cấp.

## D-016 — Deploy production (VPS en.vev.vn qua GitHub)
**Ngày:** 2026-06-19 · **Trạng thái:** 🔜 Sẵn sàng (chờ chạy trên VPS)
- **Caddy** auto HTTPS, proxy `/api`→8787, `/pronounce`→8788, phục vụ `dist`; client build **same-origin**. systemd cho API + speech-eval.
- Cập nhật bằng `deploy.sh` (pull→build→`seed:content` không reset tài khoản→restart). API `Cache-Control: no-store`; speech-eval warm-up model.
- ⚠️ Token GitHub từng lộ — cần thu hồi, dùng SSH deploy key (DEPLOY.md §0).

---

## Đang chờ chốt
- **Đăng nhập:** đã chốt qua D-010 — dùng **1 mật khẩu phụ huynh** (đổi `PARENT_PASSWORD` trong `server/.env`). T-010 (LoginPage) gọi `authService.login(password)`.
- `M-002`: nội dung seed — Claude đã soạn nháp toàn bộ ~100 từ (chờ anh review chất lượng).
- **Hosting server:** chọn nơi host (máy ở nhà trên LAN / VPS / Railway…) để 2 bé dùng chung — chờ anh quyết khi deploy.

## D-017 — Điểm số, xếp hạng & sổ cái (đảm bảo quyền lợi các con)
**Ngày:** 2026-06-20 · **Trạng thái:** ✅ Chốt
- **Sổ cái `xp_events`** (studentId, type, points, refId, createdAt): mọi điểm cộng đều ghi lại → minh bạch, **kiểm tra/khôi phục/sửa chính xác**. `students.xp` = tổng cộng dồn (tính lại được). Backfill giữ XP cũ (event 'legacy').
- **Luật điểm "học thật" chống cày:** từ mới +10 (1 lần/từ), thuộc hẳn +20 (1 lần/từ), ôn đúng hạn +5, luyện lại +1; test 3đ/câu đúng (1 lần/chủ đề/ngày, trần 50); mốc streak 3/7/14/30 ngày.
- **Xếp hạng:** mặc định **điểm TUẦN** (reset thứ Hai) + **tách theo cấp độ** (công bằng cho bé nhỏ/bé mới); có tab 'mọi thời gian'.

## D-018 — Điểm CHỈ từ Thi kỹ năng (chống gian lận nghiêm ngặt)
**Ngày:** 2026-06-20 · **Trạng thái:** ✅ Chốt (thay luật điểm cũ ở D-017) · Spec: `docs/superpowers/specs/2026-06-20-vocab-skill-test-scoring-design.md`
- **Học tự do KHÔNG điểm:** flashcard/học/game chỉ cập nhật tiến độ. Bé bấm "Thuộc" → kho **Chờ thi** (`pending_test`); "Cần ôn"/sai → **Cần ôn** (`relearn`, học lại đến khi Thuộc).
- **Điểm = số kỹ năng ĐANG qua mỗi từ**, server chấm (giữ đáp án trong `skill_test_sessions`): mỗi kỹ năng qua +1, thi lại quên −1, cải thiện +1. Trừ không trần; cộng trần **500đ/ngày**.
- **Kỹ năng theo cấp:** trẻ em = Nghe chọn chữ + Nhìn hình đoán chữ (≤2đ); a1..c1 = Nghe + Nói (phát âm ≥60) + Viết (≤3đ).
- **Vòng đời:** đủ 10 từ Chờ thi → nhắc thi (bỏ qua được). Đã thi đạt → kho **ôn ngắt quãng**; đến hạn **thi lại** (qua: giãn lịch; rớt kỹ năng: −điểm + về Cần ôn).
- **Gỡ** điểm flashcard/deck-complete/quiz-results/streak (giữ lịch sử + 🔥 không cộng). Sổ cái `xp_events` ghi cả ± (type `skill_pass`/`skill_lose`).
