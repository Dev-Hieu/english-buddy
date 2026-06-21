"""Microservice TTS neural tự host bằng Piper — đọc từ/câu tiếng Anh tự nhiên.

Chạy:  cd tts && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
Giọng: tải model .onnx (+ .onnx.json) vào tts/voices/ — xem README.
API:   GET /tts?text=...  -> audio/wav (có cache theo nội dung). GET /health.
"""
import hashlib
import os
import subprocess
import sys

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get("TTS_CACHE", os.path.join(HERE, "cache"))
PIPER = os.environ.get("PIPER_BIN", os.path.join(os.path.dirname(sys.executable), "piper"))
os.makedirs(CACHE, exist_ok=True)

# Giọng theo Vùng (Anh-Mỹ us / Anh-Anh gb) × Giới (nữ female / nam male). Đổi qua env nếu muốn.
def _v(name):
    return os.path.join(HERE, "voices", name)

VOICES = {
    "us-female": os.environ.get("PIPER_VOICE_US_F", _v("en_US-amy-medium.onnx")),
    "us-male": os.environ.get("PIPER_VOICE_US_M", _v("en_US-ryan-medium.onnx")),
    "gb-female": os.environ.get("PIPER_VOICE_GB_F", _v("en_GB-jenny_dioco-medium.onnx")),
    "gb-male": os.environ.get("PIPER_VOICE_GB_M", _v("en_GB-alan-medium.onnx")),
}
DEFAULT_VOICE = "us-female"


def pick_model(voice: str) -> str:
    m = VOICES.get(voice) or VOICES[DEFAULT_VOICE]
    if os.path.exists(m):
        return m
    # giọng chọn chưa tải -> ưu tiên cùng vùng, rồi giọng nào có sẵn
    region = (voice or "").split("-")[0]
    same = [v for k, v in VOICES.items() if k.startswith(region) and os.path.exists(v)]
    return same[0] if same else next((v for v in VOICES.values() if os.path.exists(v)), m)


app = FastAPI(title="English Buddy — TTS (Piper)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "voices": {k: os.path.exists(v) for k, v in VOICES.items()}}


@app.get("/tts")
def tts(text: str, voice: str = DEFAULT_VOICE, ls: float = 1.0):
    t = (text or "").strip()[:400]  # giới hạn để tránh lạm dụng
    if not t:
        return Response(status_code=400)
    model = pick_model(voice)
    ls = max(0.6, min(1.6, float(ls)))  # >1 chậm hơn, <1 nhanh hơn
    # Cache theo (giọng + tốc độ + nội dung): lần sau phát ngay, gần như miễn phí.
    key = hashlib.sha1(f"{os.path.basename(model)}|{ls}|{t}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key + ".wav")
    if not os.path.exists(path):
        try:
            subprocess.run(
                [PIPER, "-m", model, "-f", path, "--length-scale", str(ls)],
                input=t.encode("utf-8"), check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        except Exception:
            return Response(status_code=500)
    with open(path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/wav", headers={"Cache-Control": "public, max-age=31536000"})
