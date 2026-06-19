# BACKLOG — Bảng công việc English Buddy MVP

> Quy tắc cập nhật: xem [AGENT_PROTOCOL.md](./AGENT_PROTOCOL.md) §2.
> Trạng thái: `TODO · CLAIMED · IN_PROGRESS · IN_REVIEW · DONE · BLOCKED`
> Owner: `Claude` (services/data) · `Codex` (UI) · `Both` · `Hieu` (nội dung/quyết định)

**Chiến lược:** làm chủ đề **Food chạy end-to-end (Sprint 1–2)** trước, rồi mới nhân rộng.

---

## Sprint 0 — Khung & hợp đồng *(làm trước, chặn mọi thứ)*

| ID | Task | Owner | Status | Depends | Files | DoD |
|----|------|-------|--------|---------|-------|-----|
| T-001 | Init project React+Vite+TS | Codex | DONE | — | root, `src/app` | ✅ `npm run dev` chạy, Vite phục vụ HTTP 200 |
| T-002 | Cài Tailwind + shadcn/ui + layout gốc | Codex | DONE | T-001 | `src/app`, config | ✅ Tailwind + shadcn-style UI render trong layout gốc |
| T-003 | Khóa `src/types/*` theo CONTRACTS v1 | Claude | DONE | — | `src/types` | ✅ 7 file types khớp CONTRACTS v1 |
| T-004 | ~~Firebase~~ → **API server tự host + DB** (`server/`, D-010) | Claude | DONE | — | `server/**`, `api.ts`, `authService` | ✅ Express+SQLite; seed 99 từ; auth/progress/quiz/translate/image verified live |
| T-005 | `.gitignore`, README, scripts (`dev/build/typecheck`) | Both | DONE | T-001 | root | ✅ scripts có `dev/build/typecheck/preview`, secret vẫn bị ignore |

## Sprint 1 — Khung app chạy được

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-010 | LoginPage (1 parent) + Auth flow | Claude | DONE | T-004 | ✅ `LoginPage` gọi `authService.login`; App gate toàn bộ sau đăng nhập; logout ở Home |
| T-011 | StudentSelectPage (chọn Bảo Ngọc/Bảo Nam) | Codex | DONE | T-010 | ✅ chọn & nhớ profile bằng `localStorage` |
| T-012 | HomePage (mục tiêu hôm nay + nút điều hướng) | Codex | DONE | T-011 | ✅ hiện profile, mục tiêu ngày, 5 nút điều hướng |
| T-013 | Seed data local 100 từ (cấu trúc) + seedTopics | Claude | DONE | T-003 | ✅ 10 topics + ~100 từ (nháp, chờ anh review) + seedStudents; ảnh chờ C-002 |
| T-014 | progressService + spacedRepetition util | Claude | DONE | T-003,T-004 | ✅ progressService gọi API; SR dùng chung client+server; 6 unit test + endpoint verified |

## Sprint 2 — Lát cắt dọc Food (học từ vựng)

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-020 | TopicListPage (hiện tiến độ mỗi chủ đề) | Codex | DONE | T-012,T-013 | ✅ list 10 chủ đề + % tiến độ local theo profile |
| T-021 | WordCard component (ảnh/từ/phiên âm/nghe) | Codex | DONE | T-003 | ✅ render `VocabularyWord`, nút nghe gọi `speakText` |
| T-022 | LessonPage chủ đề Food (5–10 từ) | Codex | DONE | T-021 | ✅ lướt 10 từ Food, đánh dấu đã xem, progress local |
| T-023 | speechService (audioUrl → TTS fallback) | Claude | DONE | T-003 | ✅ typecheck pass; thuần browser API |
| T-024 | Flashcard + ghi mastery qua progressService | Claude | DONE | T-014,T-021 | ✅ `Flashcard`+`DeckRunner`+`FlashcardPage`; "nhớ rồi/cần ôn" → `recordAnswer` API |

## Sprint 3 — Quick Lookup

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-030 | dictionaryService (chuẩn hóa Dictionary API) | Claude | DONE | T-003 | ✅ typecheck pass; API không cần key |
| T-031 | `/api/image` (Pexels proxy) trong server | Claude | DONE | T-004 | ✅ verified: Pexels key thật trả 5 ảnh |
| T-032 | `/api/translate` + cache (DB) trong server | Claude | DONE | T-004 | ✅ verified: "butterfly" → "con bướm", cache trong SQLite |
| T-033 | imageService + translateService (gọi API) | Claude | DONE | T-031,T-032 | ✅ gọi `/api/image`, `/api/translate`; typecheck sạch |
| T-034 | LookupPage + Word Card + Save to My Words | Claude | DONE | T-030,T-033 | ✅ tra (dictionary+dịch VN+ảnh song song) + nghe + Save to My Words |

## Sprint 4 — Ôn tập, Game, Test

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-040 | quizGenerator util + quizService (distractor cùng chủ đề) | Claude | DONE | T-013 | ✅ `/api/quiz` verified (5 câu, đáp án đúng ∈ options); 4 unit test pass |
| T-041 | ReviewPage (từ đến hạn ôn) | Claude | DONE | T-014,T-024 | ✅ `getDueReviews` → DeckRunner; rỗng thì báo "không có từ cần ôn" |
| T-042 | Game: Match Word + Pick Picture | Claude | DONE | T-040 | ✅ 2 game trong GamesPage, ghi `recordAnswer` |
| T-043 | Game: Listen & Choose (+ Word Builder để sau) | Claude | DONE | T-040,T-023 | ✅ Listen&Choose chơi được; đủ 3 game (DoD ≥3) |
| T-044 | TestPage (10 câu) + lưu quiz_results | Claude | DONE | T-040 | ✅ `generateQuiz`→làm bài→`submitQuiz`; verified GET quiz-results |

## Sprint 5 — Parent Dashboard & mở rộng nội dung

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-050 | ParentDashboard (tiến độ từng bé) | Claude | DONE | T-014,T-044 | ✅ DashboardPage: đã học/cần ôn/thành thạo, điểm test gần nhất, từ hay sai theo từng bé |
| T-051 | Nhân nội dung 9 chủ đề còn lại | Hieu | TODO | T-022 | đủ 100 từ có nghĩa+ảnh+phát âm |
| T-052 | Deploy: host server (`server/`) + static frontend | Claude | IN_REVIEW | tất cả | Cấu hình đầy đủ (Caddy+systemd+deploy.sh+DEPLOY.md) cho en.vev.vn. Chờ chạy trên VPS |
| T-053 | Nghiệm thu theo DoD (TECH_SPEC §14) | Both+Hieu | IN_PROGRESS | T-052 | 8/10 đạt; còn #2 (ảnh đang tự fill) & #9 (chờ deploy VPS). **38 test pass**; smoke same-origin PASS; bundle tách (app 89KB) |

## Sprint 6 — Tính năng nâng cao (roadmap §15)

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-060 | Ngữ pháp (GĐ4): trang học + bài tập chọn/điền/sắp xếp | Claude | DONE | — | ✅ 38 chủ đề/186 bài tập (6 cấp); util chấm + 3 unit test; vào từ Home |
| T-061 | Làm đề (GĐ5): đề theo trình độ + phân tích lỗi | Claude | DONE | T-040 | ✅ ExamPage 20 câu/cấp; từ sai vào hàng đợi ôn; lưu quiz_results |
| T-062 | Game Nghe & gõ (chính tả) | Claude | DONE | T-043 | ✅ nghe TTS -> gõ lại; ghi recordAnswer |
| T-063 | PWA: installable + offline app-shell | Claude | DONE | — | ✅ manifest + service worker (không thêm dependency); đăng ký ở production |
| T-064 | Worker ảnh tự động (Pexels) | Claude | DONE | T-031 | ✅ server/imageWorker + đợt nền; lấp ảnh dần, đồng bộ seedImages.ts |
| T-065 | Hội thoại AI (GĐ3) | Claude | BLOCKED | LLM API | chờ thầy chọn nhà cung cấp LLM |

---

## Hạng mục nội dung (song song, owner: Hieu)
| ID | Task | Status |
|----|------|--------|
| C-001 | Soạn `meaning_vi` + `example_vi` cho 100 từ | TODO |
| C-002 | Chọn ảnh an toàn (URL cố định) cho 100 từ | IN_REVIEW | Pexels tự fill 99/99; **trang chọn ảnh cho phụ huynh tại `http://localhost:8787/picker`** — xem nhiều ứng viên, bấm chọn, app tự cập nhật |

---

## Nhật ký hoàn thành (changelog ngắn)
- 2026-06-18 — Khởi tạo backlog, repo, bộ docs phối hợp (Claude).
- 2026-06-18 — T-003 DONE: `src/types` (user/student/vocabulary/progress/quiz/service + index) khớp CONTRACTS v1 (Claude).
- 2026-06-18 — T-013/T-014 tiến hành: `spacedRepetition.ts`, `normalizeWord.ts`, `seedTopics.ts`, `seedVocabulary.ts` (Food) (Claude).
- 2026-06-18 — Hoàn tất lớp service Claude (code, chờ verify): `firebase.ts`, `progressService`, `speechService`, `dictionaryService`, `imageService`, `translateService`, `quizService`, `quizGenerator`, `functions/` (image+translate), `firestore.rules`, `firebase.json`, `.env.example` (Claude).
- 2026-06-18 — T-001/T-002/T-005 DONE: React+Vite+TS, Tailwind, shadcn-style UI primitives, layout gốc, scripts và lockfile; `typecheck` + `build` pass (Codex).
- 2026-06-18 — T-013 DONE: nháp ~100 từ/10 chủ đề + `seedStudents`; Firebase Emulator (D-009); vitest + 10 unit test (SR + quiz) pass; `tsc -b` sạch (Claude).
- 2026-06-18 — T-021/T-022 DONE: `WordCard` có phát âm qua `speechService`; `LessonPage` Food lướt 10 từ + progress local; `typecheck/build/test` pass (Codex).
- 2026-06-18 — T-011/T-012/T-020 DONE: chọn profile, Home theo bé, TopicList 10 chủ đề + progress local; T-010 BLOCKED chờ quyết định login (Codex).
- 2026-06-18 — **PIVOT D-010:** backend Firebase → **server tự host (Express+SQLite)** trong `server/`. T-004/T-014/T-031/T-032/T-033/T-040 DONE & verified live (auth, progress, quiz, image với Pexels key, translate). Client service đấu vào `api.ts`, gỡ Firebase. CONTRACTS v2 (+authService, +contentService, chữ ký cũ giữ nguyên). T-010 hết BLOCKED (Claude).
- 2026-06-18 — Trang chọn ảnh `/picker` (C-002 IN_REVIEW); ~100 từ có ảnh Pexels.
- 2026-06-18 — **Claude tiếp quản UI (D-011):** dựng nốt Login, Flashcard/DeckRunner, Review, Lookup, Test, 3 Games, Dashboard + router/auth trong App. T-010/024/034/041/042/043/044/050 DONE. typecheck/build/test sạch; quiz-results endpoint verified. **App đã đủ vòng học end-to-end** (Claude).
- 2026-06-19 — Mở rộng nội dung ~3.500 từ/18 chủ đề/6 cấp (CEFR); chọn trình độ end-to-end; đa người dùng + hạn mức; xếp hạng; phát âm wav2vec2; My Words học được; worker ảnh nền tự cập nhật (Claude).
- 2026-06-19 — **T-053 nghiệm thu (đang làm):** chấm DoD 8/10 (còn #2 ảnh đang tự fill, #9 chưa deploy). Thêm test tự động: 12 test tích hợp API (auth/hạn mức/cô lập/tiến độ/quiz+lọc cấp/My Words/leaderboard) + 8 unit test util lọc cấp; tổng **30 test pass** (Claude).
- 2026-06-19 — **Deploy (T-052) cấu hình xong:** Caddy (auto HTTPS en.vev.vn) + systemd + `deploy.sh` + `docs/DEPLOY.md`; `.env.production` same-origin; `seed:content` không reset tài khoản. Chờ chạy trên VPS.
- 2026-06-19 — **Sửa lỗi:** PUT student lưu cả `level`; chuẩn hoá level cũ "beginner"→a1; cache `no-store` (sửa "cập nhật trả về như cũ"); speech-eval warm-up model (sửa cold-start "chưa chấm được"); dedupe 660 từ trùng (còn 2841 unique).
- 2026-06-19 — **Sprint 6 tính năng nâng cao:** T-060 Ngữ pháp (38 chủ đề/186 bài tập), T-061 Làm đề + phân tích lỗi, T-062 game Nghe&gõ, T-063 PWA offline, T-064 worker ảnh. **38 test pass**, mỗi phase test + push riêng (Claude).
