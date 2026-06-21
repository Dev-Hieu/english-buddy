# tts — Đọc từ/câu tiếng Anh tự nhiên (Piper, tự host)

Microservice neural TTS chạy CPU. Client gọi `/tts?text=...` (same-origin qua Caddy/vite),
nhận WAV và phát. Có **cache** theo nội dung nên mỗi từ/câu chỉ tổng hợp 1 lần.

## Cài & chạy
```bash
cd tts
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Tải 1 giọng tiếng Anh (amy-medium, ~60MB) -> tải cả .onnx và .onnx.json:
.venv/bin/python -m piper.download_voices en_US-amy-medium --data-dir voices
#   (nếu lệnh trên không có, tải thủ công 2 file từ:
#    https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/amy/medium
#    lưu vào tts/voices/en_US-amy-medium.onnx và .onnx.json)

.venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
```
Kiểm tra: `curl "localhost:8789/health"` → `{"ok":true,"ready":true}`.
Thử:     `curl "localhost:8789/tts?text=Good%20morning" -o test.wav`

## Đổi giọng
Đặt env `PIPER_MODEL=/đường/dẫn/voice.onnx`. Giọng khác: `en_US-lessac-medium`, `en_GB-...`, v.v.
(Anh-Anh dùng `en_GB-*`.)

## Triển khai (VPS)
```bash
cd /var/www/english-buddy/tts
python3.11 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m piper.download_voices en_US-amy-medium --data-dir voices
sudo cp ../deploy/english-buddy-tts.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now english-buddy-tts
```
Caddy đã proxy `/tts*` → `127.0.0.1:8789`. Nếu service KHÔNG chạy, app tự fallback giọng
Web Speech của trình duyệt (không lỗi).

## Lưu ý
- Nhẹ hơn speech-eval nhiều (không cần torch); RAM ~vài trăm MB.
- `cache/` chứa WAV đã tạo — có thể xoá để dọn, sẽ tạo lại khi cần.
