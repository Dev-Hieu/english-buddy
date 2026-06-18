# English Buddy 🦉

Ứng dụng web học tiếng Anh cá nhân hóa cho **Bảo Ngọc** (lớp 7) và **Bảo Nam** (lớp 5).

Học từ vựng theo chủ đề · tra từ nhanh · nghe phát âm · flashcard · game · mini test · theo dõi tiến độ cho phụ huynh.

## Tech stack
React + Vite + TypeScript · Tailwind + shadcn/ui · Firebase (Auth + Firestore + Hosting + Functions) · Free Dictionary API · Pexels · Web Speech API.

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

## Chạy (sau khi T-001 xong)
```bash
npm install
npm run dev        # dev server
npm run typecheck  # kiểm tra type
npm run build      # build production
```

## Cấu hình môi trường
Tạo `.env.local` (không commit) chứa Firebase config phía client. API key Pexels/dịch đặt ở **Firebase Functions config**, không để ở frontend.
