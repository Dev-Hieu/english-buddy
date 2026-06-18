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
| T-010 | LoginPage (1 parent) + Auth flow | Codex | TODO | T-004 | **Hết BLOCKED (D-010):** gọi `authService.login(password)`; lưu token; chặn route khi chưa đăng nhập |
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
| T-024 | Flashcard + ghi mastery qua progressService | Both | TODO | T-014,T-021 | "I know/Need review" lưu đúng |

## Sprint 3 — Quick Lookup

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-030 | dictionaryService (chuẩn hóa Dictionary API) | Claude | DONE | T-003 | ✅ typecheck pass; API không cần key |
| T-031 | `/api/image` (Pexels proxy) trong server | Claude | DONE | T-004 | ✅ verified: Pexels key thật trả 5 ảnh |
| T-032 | `/api/translate` + cache (DB) trong server | Claude | DONE | T-004 | ✅ verified: "butterfly" → "con bướm", cache trong SQLite |
| T-033 | imageService + translateService (gọi API) | Claude | DONE | T-031,T-032 | ✅ gọi `/api/image`, `/api/translate`; typecheck sạch |
| T-034 | LookupPage + Word Card + Save to My Words | Codex | TODO | T-030,T-033 | tra & lưu được |

## Sprint 4 — Ôn tập, Game, Test

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-040 | quizGenerator util + quizService (distractor cùng chủ đề) | Claude | DONE | T-013 | ✅ `/api/quiz` verified (5 câu, đáp án đúng ∈ options); 4 unit test pass |
| T-041 | ReviewPage (từ đến hạn ôn) | Codex | TODO | T-014,T-024 | hiện đúng từ due |
| T-042 | Game: Match Word + Pick Picture | Codex | TODO | T-040 | chơi & cộng XP |
| T-043 | Game: Listen & Choose + Word Builder | Codex | TODO | T-040,T-023 | chơi được |
| T-044 | TestPage (10 câu) + lưu quiz_results | Both | TODO | T-040 | nộp bài, lưu kết quả |

## Sprint 5 — Parent Dashboard & mở rộng nội dung

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-050 | ParentDashboard (tiến độ từng bé) | Codex | TODO | T-014,T-044 | đủ 10 mục thống kê |
| T-051 | Nhân nội dung 9 chủ đề còn lại | Hieu | TODO | T-022 | đủ 100 từ có nghĩa+ảnh+phát âm |
| T-052 | Deploy: host server (`server/`) + static frontend | Claude | TODO | tất cả | chờ anh chọn nơi host (LAN/VPS); URL chạy PC+mobile |
| T-053 | Nghiệm thu theo DoD (TECH_SPEC §14) | Both+Hieu | TODO | T-052 | đủ 10 tiêu chí |

---

## Hạng mục nội dung (song song, owner: Hieu)
| ID | Task | Status |
|----|------|--------|
| C-001 | Soạn `meaning_vi` + `example_vi` cho 100 từ | TODO |
| C-002 | Chọn ảnh an toàn (URL cố định) cho 100 từ | TODO |

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
