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
MODEL = os.environ.get("PIPER_MODEL", os.path.join(HERE, "voices", "en_US-amy-medium.onnx"))
CACHE = os.environ.get("TTS_CACHE", os.path.join(HERE, "cache"))
PIPER = os.environ.get("PIPER_BIN", os.path.join(os.path.dirname(sys.executable), "piper"))
os.makedirs(CACHE, exist_ok=True)

app = FastAPI(title="English Buddy — TTS (Piper)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "model": os.path.basename(MODEL), "ready": os.path.exists(MODEL)}


@app.get("/tts")
def tts(text: str):
    t = (text or "").strip()[:400]  # giới hạn để tránh lạm dụng
    if not t:
        return Response(status_code=400)
    # Cache theo (giọng + nội dung): lần sau phát ngay, gần như miễn phí.
    key = hashlib.sha1(f"{os.path.basename(MODEL)}|{t}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key + ".wav")
    if not os.path.exists(path):
        try:
            subprocess.run(
                [PIPER, "-m", MODEL, "-f", path],
                input=t.encode("utf-8"), check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        except Exception:
            return Response(status_code=500)
    with open(path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/wav", headers={"Cache-Control": "public, max-age=31536000"})
