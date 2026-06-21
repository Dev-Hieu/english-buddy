# tts — Đọc từ/câu tiếng Anh tự nhiên (Piper, tự host)

Microservice neural TTS chạy CPU. Client gọi `/tts?text=...` (same-origin qua Caddy/vite),
nhận WAV và phát. Có **cache** theo nội dung nên mỗi từ/câu chỉ tổng hợp 1 lần.

## Cài & chạy
```bash
cd tts
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Tải 4 giọng: Anh-Mỹ (nữ amy, nam ryan) + Anh-Anh (nữ jenny_dioco, nam alan) — ~60MB/giọng:
.venv/bin/python -m piper.download_voices \
  en_US-amy-medium en_US-ryan-medium en_GB-jenny_dioco-medium en_GB-alan-medium --data-dir voices
#   (nếu lệnh trên không có, tải thủ công .onnx + .onnx.json từ
#    https://huggingface.co/rhasspy/piper-voices vào tts/voices/)

.venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
```
Kiểm tra: `curl "localhost:8789/health"` → `{"ok":true,"voices":{"us-female":true,...}}`.
Thử:     `curl "localhost:8789/tts?text=Good%20morning&voice=gb-male&ls=1.3" -o test.wav`

## Tham số /tts
- `voice`: `us-female` | `us-male` | `gb-female` | `gb-male` (mặc định `us-female`).
- `ls` (length-scale): `>1` chậm hơn, `<1` nhanh hơn (client gửi 1.3 chậm / 1.0 vừa / 0.82 nhanh).
- Đổi model cho mỗi giọng qua env: `PIPER_VOICE_US_F/US_M/GB_F/GB_M=/đường/dẫn.onnx`.

## Triển khai (VPS)
```bash
cd /var/www/english-buddy/tts
python3.11 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m piper.download_voices en_US-amy-medium en_US-ryan-medium en_GB-jenny_dioco-medium en_GB-alan-medium --data-dir voices
sudo cp ../deploy/english-buddy-tts.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now english-buddy-tts
```
Caddy đã proxy `/tts*` → `127.0.0.1:8789`. Nếu service KHÔNG chạy, app tự fallback giọng
Web Speech của trình duyệt (không lỗi).

## Lưu ý
- Nhẹ hơn speech-eval nhiều (không cần torch); RAM ~vài trăm MB.
- `cache/` chứa WAV đã tạo — có thể xoá để dọn, sẽ tạo lại khi cần.
