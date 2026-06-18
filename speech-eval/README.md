# speech-eval — Chấm phát âm theo từng âm (IPA)

Microservice tự host: nhận audio bé đọc → nhận diện âm vị bằng **allosaurus** → so với IPA chuẩn → chấm **từng âm đúng/sai** + điểm %.

## Yêu cầu
- **Python ≥ 3.10** (panphon cần 3.10+). Khuyến nghị 3.11.

## Cài & chạy
```bash
cd speech-eval
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt   # kéo torch + allosaurus (~vài trăm MB)
.venv/bin/uvicorn app:app --host 0.0.0.0 --port 8788
```
Lần chạy đầu allosaurus tự tải model (~latest).

Client trỏ tới service qua env `VITE_SPEECH_EVAL_URL` (mặc định `http://localhost:8788`).

## API
`POST /pronounce` (multipart): `audio` = WAV 16kHz mono, `ipa` = chuỗi IPA chuẩn của từ.
Trả: `{ score, phones:[{ipa, ok}], heard }`.

## Lưu ý
- Chỉ chạy ở **ngữ cảnh bảo mật** phía client (micro cần HTTPS/localhost).
- Độ chính xác: allosaurus là model phổ quát → chấm tương đối, hợp làm công cụ luyện cho bé; không bằng dịch vụ thương mại (Azure/Speechace). Có thể nâng cấp model sau.
