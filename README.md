# English Buddy 🦉

Ứng dụng web học tiếng Anh cá nhân hóa cho **Bảo Ngọc** (lớp 7) và **Bảo Nam** (lớp 5).

Học từ vựng theo chủ đề · tra từ nhanh · nghe phát âm · flashcard · game · mini test · theo dõi tiến độ cho phụ huynh.

## Tech stack
**Frontend:** React + Vite + TypeScript · Tailwind + shadcn/ui · Free Dictionary API · Web Speech API.
**Backend (tự host, D-010):** Node + Express + SQLite (`server/`) — gồm API dữ liệu, auth (1 mật khẩu phụ huynh), proxy Pexels (ảnh) + MyMemory (dịch).

## Tài liệu (đọc theo thứ tự)
| File | Nội dung |
|------|----------|
| [docs/TECH_SPEC.md](docs/TECH_SPEC.md) | Thiết kế kỹ thuật — source of truth |
| [docs/CONTRACTS.md](docs/CONTRACTS.md) | Type & interface chung (ranh giới FE/BE) |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Các quyết định đã chốt |
| [docs/BACKLOG.md](docs/BACKLOG.md) | Bảng công việc & tiến độ |
| [docs/AGENT_PROTOCOL.md](docs/AGENT_PROTOCOL.md) | Luật phối hợp Claude ↔ Codex |
| [docs/MESSAGES.md](docs/MESSAGES.md) | Hộp thư giữa hai agent |

## Phối hợp 2 agent
Claude sở hữu `src/services · src/utils · src/data · functions`; Codex sở hữu `src/app · src/components · src/pages`. `src/types` chung. Quy trình: **contracts-first → lát cắt dọc Food → nhân rộng**. Chi tiết ở `docs/AGENT_PROTOCOL.md`.

## Chạy local
**Backend (server API + DB):**
```bash
cd server
cp .env.example .env   # điền PARENT_PASSWORD, PEXELS_KEY
npm install
npm run seed           # nạp 10 chủ đề + ~100 từ vào SQLite
npm start              # API tại http://localhost:8787
```
**Frontend:**
```bash
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:8787
npm install
npm run dev        # dev server
npm run typecheck  # tsc -b
npm run test       # vitest
npm run build      # build production
```

## Cấu hình môi trường
- Frontend `.env.local`: `VITE_API_BASE_URL`.
- Server `server/.env` (KHÔNG commit): `PARENT_PASSWORD`, `PEXELS_KEY` (và `UNSPLASH_KEY` tùy chọn). API key chỉ nằm ở server, không lộ ra frontend.
