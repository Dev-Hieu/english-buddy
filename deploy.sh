#!/usr/bin/env bash
# Cập nhật English Buddy trên VPS từ GitHub. Chạy: bash deploy.sh [branch]
set -euo pipefail
cd "$(dirname "$0")"
BRANCH="${1:-main}"

echo "==> Lấy code mới (branch: $BRANCH)"
# Bỏ thay đổi cục bộ của file ảnh (nếu imageWorker từng ghi) để pull không xung đột.
git checkout -- src/data/seedImages.ts 2>/dev/null || true
git fetch origin
git reset --hard "origin/$BRANCH"

echo "==> Build frontend (same-origin qua .env.production)"
npm ci
npm run build

echo "==> Server: cài deps + cập nhật NỘI DUNG (không đụng tài khoản/tiến độ)"
( cd server && npm ci && npm run seed:content )

echo "==> Khởi động lại dịch vụ"
sudo systemctl restart english-buddy
sudo systemctl reload caddy || true
# Bật dòng dưới nếu có chạy chấm phát âm:
# sudo systemctl restart english-buddy-speech
sudo systemctl restart english-buddy-tts 2>/dev/null || true

# Warm cache TTS (chạy nền): tổng hợp sẵn âm thanh để phát nhanh ngay lần đầu.
# Bỏ qua êm nếu dịch vụ tts chưa chạy. Mở rộng giọng/tốc độ nếu muốn:
#   WARM_VOICES="us-female,us-male,gb-female,gb-male" WARM_RATES="slow,normal,fast"
echo "==> Warm cache TTS (chạy nền)"
( cd server && npm run warm:tts ) >/tmp/eb-warm-tts.log 2>&1 &

echo "==> Xong → https://en.vev.vn"
