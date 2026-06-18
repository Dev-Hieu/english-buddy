# AGENT PROTOCOL — Cơ chế phối hợp Claude ↔ Codex

> Hai agent cùng làm trên một repo. File này là **luật chơi** để hai bên không giẫm chân và bàn giao việc rõ ràng. Đọc file này đầu mỗi phiên làm việc.

Hai vai:
- **Claude** — sở hữu `src/services`, `src/utils`, `src/data`, `functions`. Steward của `src/types`.
- **Codex** — sở hữu `src/app`, `src/components`, `src/pages`, assets/UI.

Kênh giao tiếp gồm 4 file trong `docs/`:
| File | Vai trò |
|------|---------|
| [CONTRACTS.md](./CONTRACTS.md) | Hợp đồng type/interface — ranh giới FE/BE |
| [BACKLOG.md](./BACKLOG.md) | Bảng công việc + trạng thái + ai làm |
| [MESSAGES.md](./MESSAGES.md) | Hộp thư append-only giữa hai agent |
| [DECISIONS.md](./DECISIONS.md) | Nhật ký quyết định đã chốt |

Cộng với **git** làm phương tiện vận chuyển và lần vết.

---

## 1. File ownership (quy tắc số 1)

**Không sửa file ngoài thư mục mình sở hữu.** Nếu cần thay đổi vùng của agent kia → mở **REQUEST** trong MESSAGES.md, đợi agent đó làm hoặc ack cho phép.

- Vùng **SHARED** (`src/types`, `docs/CONTRACTS.md`, `package.json`, file config): bất kỳ thay đổi nào cũng phải báo trước trong MESSAGES.md.
- `src/types` do **Claude** là steward: Codex muốn thêm/đổi field → REQUEST; Claude cập nhật + tăng Contracts version.

---

## 2. Vòng đời công việc (task lifecycle)

Trạng thái trong BACKLOG.md:
```
TODO → CLAIMED → IN_PROGRESS → IN_REVIEW → DONE
                                         ↘ BLOCKED (kèm lý do + chặn bởi task nào)
```
- **CLAIMED**: ghi tên mình vào cột Owner trước khi bắt đầu, để agent kia biết.
- **IN_REVIEW**: code xong, mở message loại REVIEW nhờ agent kia / phụ huynh xem.
- **BLOCKED**: ghi rõ đang đợi gì (task id hoặc message id).

Mỗi task có: `id`, tiêu đề, owner, `depends_on`, danh sách file đụng tới, tiêu chí nghiệm thu (DoD).

---

## 3. Quy ước Git

- **Branch theo task:** `claude/<task-id>-slug` hoặc `codex/<task-id>-slug`.
  Ví dụ: `claude/T-003-dictionary-service`.
- **Commit message** mở đầu bằng task id: `[T-003] add dictionaryService + types`.
- Merge vào `main` chỉ khi **DoD đạt** và đã review.
- `git pull` đầu phiên, `git push` cuối phiên. Không commit secret/API key (xem `.gitignore`).
- Xung đột merge ở vùng SHARED → agent gây đổi type chịu trách nhiệm hợp nhất + báo trong MESSAGES.

---

## 4. Giao thức tin nhắn (MESSAGES.md)

Append-only. **Không xóa**, chỉ đổi `Status` khi xong. Mẫu một entry:

```md
### [M-007] Claude → Codex | REQUEST | 2026-06-18
**Re:** task T-012 / src/types/quiz.ts
**Status:** OPEN
Mình cần thêm field `imageOptions?: string[]` vào QuizQuestion cho game Pick Picture.
Đã cập nhật CONTRACTS v2. Bạn cập nhật UI QuizQuestion.tsx theo nhé.
```

Loại tin (TYPE): `REQUEST` (cần gì đó) · `ANSWER` · `HANDOFF` (bàn giao task) · `BLOCKER` · `REVIEW` (nhờ xem) · `FYI` · `DECISION` (đề xuất chốt → ghi sang DECISIONS.md).

Quy tắc:
- Mỗi tin có id tăng dần `M-001, M-002, ...`, ghi rõ FROM → TO, TYPE, ngày.
- Người nhận phải xử lý các tin **OPEN gửi cho mình** trước khi làm việc khác.
- Trả lời bằng tin mới tham chiếu id cũ (`Re: M-007`), rồi đổi tin gốc thành `Status: ANSWERED/CLOSED`.

---

## 5. Nghi thức đầu/cuối phiên (bắt buộc)

**Đầu phiên:**
1. `git pull`.
2. Đọc DECISIONS.md (có quyết định mới không?).
3. Quét MESSAGES.md các tin **OPEN gửi cho mình** → xử lý/ack.
4. Xem BACKLOG.md: task mình đang CLAIMED/IN_PROGRESS, có gì BLOCKED gỡ được không.

**Cuối phiên:**
1. Cập nhật trạng thái task trong BACKLOG.md.
2. Commit + push theo quy ước §3.
3. Nếu bàn giao hoặc cần agent kia làm gì → để lại tin HANDOFF/REQUEST.
4. Nếu chốt được quyết định mới → ghi DECISIONS.md.

---

## 6. Thứ tự ưu tiên & nguyên tắc chung

1. **Contracts-first:** không code feature đụng type chung trước khi type được khóa trong CONTRACTS.md.
2. **Lát cắt dọc:** ưu tiên chủ đề Food chạy end-to-end trước khi mở rộng (xem TECH_SPEC §13).
3. **Surgical changes:** chỉ sửa thứ phục vụ task; không refactor vùng người khác.
4. **Báo sớm khi nghi ngờ:** thà mở một REQUEST/BLOCKER còn hơn đoán mò rồi lệch.
5. **Phụ huynh (anh Hiếu) là người chốt cuối** cho mọi DECISION còn phân vân.

---

## 7. Định nghĩa "xong" chung (Global DoD)
Một task DONE khi: code chạy không lỗi · khớp CONTRACTS · không sửa ngoài ownership · đã build/typecheck pass · đã cập nhật BACKLOG + commit theo quy ước.
