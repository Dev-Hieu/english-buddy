# NIGHT LOG — đêm 2026-06-19 → sáng 2026-06-20

Claude làm tự động xuyên đêm: kiểm tra, hoàn thiện, test, push từng giai đoạn.

## Đã hoàn thành (đều đã push lên GitHub)

| Phase | Việc | Kết quả | Commit |
|---|---|---|---|
| A | Audit + khử trùng từ vựng | Bỏ **660 bản trùng** (nhiều đợt agent sinh cùng từ/cấp). Seed nạp lại sạch (giữ ảnh). Còn **2.841 từ unique**, cân đối cấp | `b5c0a6c` |
| B | Mở rộng test API | +5 test (admin/hạn mức, quiz-results+XP, review, xóa bé). Cấu trúc từ vựng sạch (topicId/IPA/example đều OK) | `bcd2540` |
| C | Smoke test thực tế | Dựng proxy mô phỏng Caddy (same-origin): index/asset/SPA-fallback + login/me/topics/vocab/quiz/leaderboard/translate **đều PASS** | (verify) |
| D | Tách bundle | App code **1.2MB → 89KB**; vocab-data 920KB & react/vendor tách riêng (cache độc lập); hết cảnh báo | `dd78003` |
| E | Ảnh tự động | Lấp ảnh theo đợt + push xuyên đêm (xem bảng tiến độ cuối file) | `7fde9c5`… |

**Test: 35/35 pass** · **typecheck/build sạch** · app chạy thực tế OK.

## Nghiệm thu DoD (TECH_SPEC §14): 8/10 đạt
- Đạt: 1,3,4,5,6,7,8,10 (chọn bé, flashcard, tra từ, ≥3 game, test, tiến độ riêng, dashboard, UX).
- #2 (ảnh mỗi từ): đang lấp tự động (xem tiến độ). Từ trừu tượng b1–c1 giữ placeholder chữ (ảnh stock kém nghĩa).
- #9 (chạy trên điện thoại): **chỉ còn chờ thầy chạy deploy trên VPS** (cấu hình đã sẵn ở `docs/DEPLOY.md`). Em không truy cập được VPS nên không tự deploy được phần này.

## Việc cần thầy làm (sáng)
1. **Thu hồi GitHub token bị lộ** + đổi Pexels key (xem DEPLOY.md §0). Quan trọng.
2. Chạy `deploy.sh` trên VPS để lên `https://en.vev.vn` (đóng nốt DoD #9).

## Bug do thầy báo (đã vá)
- **Cập nhật hồ sơ người học "trả về như cũ":** GET `/api/students` bị trình duyệt cache → sau khi lưu (PUT đã đúng) fetch lại trả bản cũ. Vá: `cache:no-store` ở client + header `Cache-Control:no-store` ở server. (commit `2f1c438`). Đã verify server lưu đúng name/grade/level/dailyGoal.
- An toàn nội dung: rà 0 từ nhạy cảm ở cấp kids/a1/a2.

## Đêm 2 — Tính năng nâng cao (các giai đoạn sau, đều đã push)
| Phase | Tính năng | Kết quả | Commit |
|---|---|---|---|
| F | **Ngữ pháp (GĐ4)** | Module bài học + bài tập (chọn/điền/sắp xếp), chấm + giải thích tiếng Việt. **38 chủ đề / 186 bài tập** (6 cấp) do agent soạn | `b0473e0` |
| H | **Nghe & gõ (chính tả)** | Game mới: nghe TTS rồi gõ lại từ, có nghĩa gợi ý, ghi tiến độ | `b072144` |
| I | **Làm đề (GĐ5)** | Đề 20 câu theo trình độ + **phân tích lỗi sai** (từ sai kèm nghĩa/nghe), từ sai vào hàng đợi ôn | `97fb4bb` |
| G | **PWA / offline** | Cài được ra màn hình chính (installable), service worker chạy offline app-shell, không thêm dependency | `5a0420a` |

Roadmap TECH_SPEC §15: GĐ2 (phát âm) ✓, **GĐ4 (ngữ pháp) ✓, GĐ5 (làm đề) ✓**. GĐ3 (hội thoại AI) cần LLM ngoài — chưa làm (cần API key).
Test: **38 pass**; build sạch; mỗi phase đã test + push riêng.

## Tiến độ lấp ảnh (cập nhật mỗi đợt)
- Đợt 1: +150 → 788; đợt 2 (nền): +150 → 938. Worker/đợt nền tiếp tục xuyên đêm.
