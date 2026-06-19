# Thiết kế: Học tự do – Điểm từ Thi kỹ năng (Vocabulary Skill Test + SRS)

Ngày: 2026-06-20 · Trạng thái: ĐÃ DUYỆT (chờ triển khai)

## 1. Mục tiêu
Điểm số phải phản ánh **thực lực hiện tại** của người học, chống gian lận nghiêm ngặt:
- Học bằng mọi hình thức (flashcard / học / game) **không tạo điểm** — chỉ để học.
- Muốn có điểm **phải thi**; bài thi **chấm ở server** (không tin client).
- Điểm có thể **lên/xuống** theo trí nhớ hiện tại (thi lại quên thì trừ).

## 2. Nguyên tắc điểm cốt lõi
> **Điểm 1 từ = số kỹ năng từ đó ĐANG qua**, đo lại mỗi lần thi/thi lại.
> **Tổng điểm học sinh = tổng điểm hiện tại trên mọi từ.**

- Mỗi kỹ năng qua = **+1đ**; thi lại rớt kỹ năng nào = **−1đ kỹ năng đó**; cải thiện (qua thêm) = **+1đ**.
- Trần điểm CỘNG = **500đ/ngày**; phần TRỪ luôn áp dụng (không trần).
- Mọi thay đổi ghi **sổ cái `xp_events`** (cộng & trừ) để truy vết.

## 3. Kỹ năng theo cấp
| Cấp | Kỹ năng | Tối đa đ/từ |
|---|---|---|
| **kids** (Trẻ em) | `listen_word` (nghe → chọn chữ), `image_word` (nhìn hình → chọn chữ) | 2 |
| **a1..c1** | `listen_word` (nghe → chọn/gõ), `speak` (nói → chấm phát âm), `write` (gõ đúng chính tả) | 3 |

`SKILLS_BY_LEVEL`: kids → `["listen_word","image_word"]`; còn lại → `["listen_word","speak","write"]`.

## 4. Vòng đời 1 từ (trạng thái lưu trong `progress`)
Trạng thái (`status`):
- `learning` — đang học, chưa báo thuộc.
- `pending_test` — đã báo "Thuộc", vào **kho Chờ thi**.
- `scored` — đã thi, có điểm; nằm trong **kho Ôn ngắt quãng** (có `nextReviewAt`).
- `relearn` — **Cần ôn** (bấm "Cần ôn", trả lời sai, hoặc rớt kỹ năng khi thi lại). Lặp đến khi báo "Thuộc".

Chuyển trạng thái:
```
learning ──"Thuộc"──► pending_test ──(thi)──► scored
learning ──"Cần ôn"/sai──► relearn ──"Thuộc"──► pending_test
scored ──(đến hạn) thi lại──► qua: scored (giãn lịch) | rớt kỹ năng: relearn (trừ điểm)
relearn ──"Thuộc"──► pending_test (thi lại để lấy/khôi phục điểm)
```

Quy tắc:
- Đủ **10 từ** ở `pending_test` (cùng diện thi) → app nhắc "Thi 10 từ này". **Có nút Bỏ qua** (thi sau).
- `relearn` lặp lại trong các mục học đến khi người học bấm "Thuộc".

## 5. Mô hình dữ liệu (DB)
Bảng `progress` thêm cột (migration ALTER, mặc định cũ vẫn chạy):
- `skillsPassed TEXT` — JSON mảng kỹ năng đang qua, vd `["listen_word","write"]`. Điểm từ = độ dài mảng.
- `status` — dùng các giá trị ở §4 (hiện đang là learning/review...; migrate giá trị cũ về `learning`/`scored` hợp lý).
- (đã có) `mastery`, `nextReviewAt`, `lastReviewedAt`, `correctCount`, `wrongCount`.

Sổ cái `xp_events` (đã có): thêm `type` mới: `skill_pass`, `skill_lose`. `points` âm cho phần trừ.

Lịch ôn `nextReviewAt` khi `scored`: dùng `nextReview()` hiện có theo `mastery` (giãn 1→3→7→14 ngày). Thi lại qua → mastery+1 (giãn xa hơn); rớt → mastery giảm, về `relearn`.

## 6. Hợp đồng API (server) — cố định để chia việc
Tất cả dưới `requireAuth` + `canAccessStudent`.

### 6.1 Báo "Thuộc"/"Cần ôn" khi học (thay luồng answer hiện tại)
`POST /api/students/:id/mark` body `{ wordId, known: boolean }`
- `known=true`: nếu từ chưa `scored` → set `status=pending_test`. Nếu đang `scored` → giữ nguyên (không hạ).
- `known=false`: set `status=relearn`, đưa vào Cần ôn.
- **Không cộng/không trừ điểm.** Trả `{ ok, status }`.
- (Giữ `POST /api/students/:id/answer` tương thích cũ nhưng chỉ cập nhật tiến độ, 0 điểm — hoặc thay bằng `/mark`.)

### 6.2 Lấy kho
`GET /api/students/:id/pending` → `{ words: [{wordId, level}], count }` (status=pending_test).
`GET /api/students/:id/relearn` → các từ status=relearn.
`GET /api/students/:id/due-tests?now=ms` → các từ status=scored và nextReviewAt<=now (cần thi lại).

### 6.3 Bắt đầu bài thi (server tạo đề + giữ đáp án)
`POST /api/students/:id/skill-test/start` body `{ mode: "new"|"review", wordIds?: string[] }`
- `new`: lấy tối đa 10 từ `pending_test`. `review`: lấy các từ `due-tests`.
- Server tạo **phiên thi** lưu DB (`skill_test_sessions`: id, studentId, wordsJson, answersKeyJson, createdAt) + trả:
  `{ sessionId, level, skills: [...], items: [{wordId, word, prompt, options?, audioWord, imageUrl}] }`
  - `listen_word`: phát `audioWord`, đưa `options` (4 lựa chọn chữ) — **đáp án giữ ở server**.
  - `image_word`: hiện `imageUrl`, `options` 4 chữ.
  - `write`: hiện nghĩa/ảnh, người học gõ.
  - `speak`: hiện chữ, người học đọc → ghi âm.

### 6.4 Nộp bài → server chấm + cập nhật điểm
`POST /api/students/:id/skill-test/submit` body
`{ sessionId, answers: [{wordId, skill, value, audioUrl?}] }`
- Server chấm từng (wordId, skill):
  - `listen_word`/`image_word`: `value` == đáp án phiên → pass.
  - `write`: chuẩn hoá (lowercase, trim, bỏ khoảng trắng thừa) == từ đúng → pass.
  - `speak`: gọi dịch vụ phát âm (`/pronounce` wav2vec2); điểm ≥ **60** → pass. Nếu dịch vụ không khả dụng → kỹ năng này **bỏ qua** (không tính pass/fail, không trừ; ghi `skipped`).
- Với mỗi từ: tập kỹ năng qua mới `newPassed`. So với `skillsPassed` cũ:
  - kỹ năng mới qua (chưa từng) → `awardXp(skill_pass, +1)` (chịu trần ngày).
  - kỹ năng từng qua mà nay rớt → `awardXp(skill_lose, −1)`.
  - cập nhật `skillsPassed = newPassed`.
- Cập nhật trạng thái từ:
  - đủ kỹ năng yêu cầu của cấp → `scored`, set `nextReviewAt` (mastery+1).
  - thiếu ≥1 kỹ năng → `relearn`.
- Xoá phiên. Trả `{ results: [{wordId, passed:[...], lost:[...], pointsDelta}], totalDelta }`.

### 6.5 Bảng xếp hạng (giữ endpoint cũ)
`GET /api/leaderboard?period=week|all&level=` — vẫn cộng từ `xp_events` (giờ gồm cả ±).

## 7. UI (client)
- **Nhắc thi**: Home + sau khi học, nếu `pending count >= 10` → banner "Con có 10 từ sẵn sàng thi! [Thi ngay] [Để sau]".
- **Trang SkillTestPage** (mới): chạy lần lượt từng từ × từng kỹ năng theo `items`/`skills`; thu đáp án; nộp; hiện kết quả (mỗi từ +mấy đ, từ nào về Cần ôn). Trẻ em chỉ 2 kỹ năng nhận diện (không mic).
- **Flashcard/Học/Game**: nút "Thuộc"/"Cần ôn" gọi `/mark` (bỏ recordAnswer cũ về điểm).
- **Trang Cần ôn / Chờ thi** (có thể gộp vào Review): liệt kê, cho học lại, cho thi.
- **Thi lại đến hạn**: Review/Home hiện "N từ cần ôn lại (thi)" → mode `review`.
- **Leaderboard/Home chip**: giữ, dữ liệu từ điểm thi.

## 8. Gỡ bỏ
- Thưởng hoàn-thành-bộ (`/deck-complete`), điểm test trắc nghiệm cũ (`/quiz-results` cộng điểm), điểm streak.
- Giữ hiển thị 🔥 streak (không cộng điểm). Giữ `quiz-results` để lưu lịch sử (không điểm) nếu cần.

## 9. Chống gian lận (tóm tắt)
- Học/tự báo thuộc = 0 điểm. Chấm 100% ở server (đáp án không gửi xuống ở dạng lộ với write/speak; listen/image có options nhưng server giữ key).
- Thi lại giãn cách theo ngày; trần cộng 500đ/ngày; trừ luôn áp dụng.
- Sổ cái ± minh bạch; reset admin theo mục (đã có).

## 10. Kiểm thử (vitest, server/test/api.test.ts)
- `/mark` không đổi điểm; chuyển status đúng.
- pending đủ 10 → start trả 10 item + skills theo cấp (kids 2 / khác 3).
- submit: listen/image/write chấm đúng; pass +1, lose −1; trạng thái scored/relearn đúng; trần ngày.
- thi lại rớt kỹ năng → trừ điểm + relearn; qua → giãn lịch.
- speak khi dịch vụ off → skipped (không trừ).
- leaderboard phản ánh tổng ± .

## 11. Giai đoạn triển khai
1. **Nền (server)**: migration `skillsPassed`/status; endpoints §6; chấm điểm; bỏ nguồn điểm cũ. + test.
2. **UI thi**: SkillTestPage + nhắc thi + nút Thuộc/Cần ôn.
3. **Kho & thi lại**: Chờ thi/Cần ôn/đến hạn + luồng review.
4. **Dọn & xếp hạng**: gỡ điểm cũ, cập nhật Home/Leaderboard, tài liệu DECISIONS.
