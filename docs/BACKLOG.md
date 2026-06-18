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
| T-004 | Setup Firebase project + `firebase.ts` + security rules | Claude | IN_REVIEW | — | `firebase.ts`, `firestore.rules`, `firebase.json` | code xong; **chờ anh Hieu tạo project + điền `.env.local`** rồi mới kết nối thật |
| T-005 | `.gitignore`, README, scripts (`dev/build/typecheck`) | Both | DONE | T-001 | root | ✅ scripts có `dev/build/typecheck/preview`, secret vẫn bị ignore |

## Sprint 1 — Khung app chạy được

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-010 | LoginPage (1 parent) + Auth flow | Codex | TODO | T-002,T-004 | đăng nhập được |
| T-011 | StudentSelectPage (chọn Bảo Ngọc/Bảo Nam) | Codex | TODO | T-010 | chọn & nhớ profile |
| T-012 | HomePage (mục tiêu hôm nay + nút điều hướng) | Codex | TODO | T-011 | điều hướng đủ 5 nút |
| T-013 | Seed data local 100 từ (cấu trúc) + seedTopics | Claude | DONE | T-003 | ✅ 10 topics + ~100 từ (nháp, chờ anh review) + seedStudents; ảnh chờ C-002 |
| T-014 | progressService + spacedRepetition util | Claude | IN_REVIEW | T-003,T-004 | ✅ typecheck + 6 unit test SR pass; `progressService` cần Firebase/emulator để chạy thật |

## Sprint 2 — Lát cắt dọc Food (học từ vựng)

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-020 | TopicListPage (hiện tiến độ mỗi chủ đề) | Codex | TODO | T-012,T-013 | list 10 chủ đề + % |
| T-021 | WordCard component (ảnh/từ/phiên âm/nghe) | Codex | TODO | T-003 | render đúng 1 từ |
| T-022 | LessonPage chủ đề Food (5–10 từ) | Codex | TODO | T-021 | học hết 1 bài |
| T-023 | speechService (audioUrl → TTS fallback) | Claude | DONE | T-003 | ✅ typecheck pass; thuần browser API |
| T-024 | Flashcard + ghi mastery qua progressService | Both | TODO | T-014,T-021 | "I know/Need review" lưu đúng |

## Sprint 3 — Quick Lookup

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-030 | dictionaryService (chuẩn hóa Dictionary API) | Claude | DONE | T-003 | ✅ typecheck pass; API không cần key |
| T-031 | Functions `/image` (Pexels proxy, safe-search) | Claude | IN_REVIEW | T-004 | code xong (`functions/index.js`); **chờ PEXELS_KEY + deploy** |
| T-032 | Functions `/translate` + cache | Claude | IN_REVIEW | T-004 | code xong (MyMemory + cache theo instance); chờ deploy |
| T-033 | imageService + translateService (gọi Functions) | Claude | IN_REVIEW | T-031,T-032 | ✅ typecheck pass; cần Functions deploy để chạy thật |
| T-034 | LookupPage + Word Card + Save to My Words | Codex | TODO | T-030,T-033 | tra & lưu được |

## Sprint 4 — Ôn tập, Game, Test

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-040 | quizGenerator util + quizService (distractor cùng chủ đề) | Claude | IN_REVIEW | T-013 | ✅ typecheck + 4 unit test buildQuiz pass; `quizService` cần Firestore để chạy |
| T-041 | ReviewPage (từ đến hạn ôn) | Codex | TODO | T-014,T-024 | hiện đúng từ due |
| T-042 | Game: Match Word + Pick Picture | Codex | TODO | T-040 | chơi & cộng XP |
| T-043 | Game: Listen & Choose + Word Builder | Codex | TODO | T-040,T-023 | chơi được |
| T-044 | TestPage (10 câu) + lưu quiz_results | Both | TODO | T-040 | nộp bài, lưu kết quả |

## Sprint 5 — Parent Dashboard & mở rộng nội dung

| ID | Task | Owner | Status | Depends | DoD |
|----|------|-------|--------|---------|-----|
| T-050 | ParentDashboard (tiến độ từng bé) | Codex | TODO | T-014,T-044 | đủ 10 mục thống kê |
| T-051 | Nhân nội dung 9 chủ đề còn lại | Hieu | TODO | T-022 | đủ 100 từ có nghĩa+ảnh+phát âm |
| T-052 | Deploy Firebase Hosting | Claude | TODO | tất cả | URL chạy trên PC+mobile |
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
