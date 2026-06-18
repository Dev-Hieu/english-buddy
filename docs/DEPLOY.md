# Triển khai English Buddy lên VPS (en.vev.vn)

Kiến trúc production:

```
Trình duyệt ──HTTPS──> Caddy (en.vev.vn, tự cấp TLS)
                         ├─ /api/*       → 127.0.0.1:8787  (Node/Express + SQLite)
                         ├─ /pronounce*  → 127.0.0.1:8788  (Python/FastAPI, tùy chọn)
                         └─ còn lại       → /var/www/english-buddy/dist (frontend tĩnh)
```

Client build **same-origin** (file `.env.production` để rỗng `VITE_API_BASE_URL`), nên không cần CORS và phát âm chạy được trên điện thoại (secure context HTTPS).

---

## 0. ⚠️ Bảo mật làm NGAY

1. **Thu hồi GitHub token đang lộ.** Remote git hiện nhúng token `ghp_...` (plaintext trong `.git/config`, đã lộ ra chat). Vào GitHub → *Settings → Developer settings → Personal access tokens* → **Revoke**. Dùng **SSH deploy key** thay thế (mục 2).
2. **Đổi Pexels key** (đã từng dán trong chat). Cập nhật vào `server/.env` mới.
3. **Sinh AUTH_SECRET ngẫu nhiên** cho production: `openssl rand -hex 32`.

> Không bao giờ commit `server/.env`, `*.db`, `.venv`, `node_modules` (đã nằm trong `.gitignore`).

---

## 1. Chuẩn bị VPS (Ubuntu 22.04+)

```bash
# Node 20 + công cụ build cho better-sqlite3
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential python3 git

# Caddy (reverse proxy + auto HTTPS)
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy
```

DNS: tạo bản ghi **A** `en.vev.vn` → IP VPS, mở cổng **80** và **443**.

---

## 2. Lấy code bằng SSH deploy key (an toàn)

```bash
# Trên VPS: tạo key, thêm public key vào GitHub repo (Settings → Deploy keys, chỉ cần read)
ssh-keygen -t ed25519 -C "vps-en.vev.vn" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub   # dán vào GitHub Deploy keys

sudo mkdir -p /var/www && sudo chown "$USER" /var/www
git clone git@github.com:Dev-Hieu/english-buddy.git /var/www/english-buddy
cd /var/www/english-buddy
```

---

## 3. Cấu hình `server/.env`

```bash
cp server/.env.example server/.env
nano server/.env
```

Điền:

```
PORT=8787
AUTH_SECRET=<chuỗi từ openssl rand -hex 32>
PEXELS_KEY=<key Pexels MỚI>
DB_PATH=/var/lib/english-buddy/data.db
IMAGE_WORKER=off
```

```bash
sudo mkdir -p /var/lib/english-buddy && sudo chown www-data /var/lib/english-buddy
```

> **Ảnh từ vựng:** để `IMAGE_WORKER=off` trên VPS. Worker chạy ở máy dev sẽ tự lấy ảnh và ghi `src/data/seedImages.ts`; commit + push → deploy mang ảnh lên (tránh xung đột git trên server). Xem mục 7.

---

## 4. Lần đầu: build + nạp dữ liệu

```bash
cd /var/www/english-buddy
npm ci && npm run build                 # tạo dist/ (same-origin)
( cd server && npm ci && npm run seed )  # seed ĐẦY ĐỦ lần đầu (tài khoản demo + ~3500 từ)
sudo chown -R www-data /var/www/english-buddy /var/lib/english-buddy
```

Tài khoản demo: `phuhuynh@buddy.vn` / `admin@buddy.vn` — mật khẩu `123456` (đổi/khóa sau khi thật).

---

## 5. Chạy API bằng systemd

```bash
sudo cp deploy/english-buddy-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now english-buddy-api
sudo systemctl status english-buddy-api      # kiểm tra
curl -s localhost:8787/api/health             # {"ok":true}
```

---

## 6. Caddy (HTTPS + proxy)

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Mở `https://en.vev.vn` — Caddy tự xin chứng chỉ Let's Encrypt.

---

## 7. Cập nhật phiên bản (sau này)

Luồng: phát triển ở máy dev → `git push` → trên VPS chạy script.

```bash
# Trên VPS:
cd /var/www/english-buddy && bash deploy.sh
```

`deploy.sh` sẽ: pull code → build frontend → `npm run seed:content` (chỉ cập nhật **chủ đề + từ vựng**, KHÔNG reset tài khoản/tiến độ) → restart API + reload Caddy.

> Muốn thêm ảnh: ở máy dev để imageWorker chạy (hoặc `cd server && npx tsx src/fetchImages.ts 200`), rồi `git add src/data/seedImages.ts && git commit && git push`. Lần deploy sau ảnh sẽ lên.

---

## 8. (Tùy chọn) Chấm phát âm wav2vec2

Nặng (~vài GB RAM). Chỉ bật nếu VPS đủ tài nguyên:

```bash
sudo apt-get install -y python3.11-venv
cd /var/www/english-buddy/speech-eval
python3.11 -m venv .venv && .venv/bin/pip install -r requirements.txt
sudo cp ../deploy/english-buddy-speech.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now english-buddy-speech
```

Nếu KHÔNG chạy: phần "chấm phát âm chi tiết" sẽ báo lỗi gọi `/pronounce` — app vẫn dùng được phần "nghe & nhắc lại".

---

## 9. (Tùy chọn) Tự động deploy khi push

Cách đơn giản: cron kéo định kỳ, hoặc GitHub Actions SSH vào VPS chạy `deploy.sh`.
Mẫu Actions cần secrets `SSH_HOST`, `SSH_USER`, `SSH_KEY`:

```yaml
# .github/workflows/deploy.yml
name: deploy
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: cd /var/www/english-buddy && bash deploy.sh
```
