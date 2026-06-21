"""Microservice TTS neural tự host bằng Piper — đọc từ/câu tiếng Anh tự nhiên.

Chạy:  cd tts && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
Giọng: tải model .onnx (+ .onnx.json) vào tts/voices/ — xem README.
API:   GET /tts?text=...  -> audio/wav (có cache theo nội dung). GET /health.
"""
import hashlib
import os
import struct
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
    region = (voice or "").split("-")[0]
    same = [v for k, v in VOICES.items() if k.startswith(region) and os.path.exists(v)]
    return same[0] if same else next((v for v in VOICES.values() if os.path.exists(v)), m)


def _auto_ls(text: str, base_ls: float) -> float:
    """Từ ngắn Piper đọc quá nhanh → tự kéo dài để rõ hơn."""
    words = text.split()
    if len(words) == 1 and len(text) <= 4:
        return max(base_ls, 1.5)   # 3-4 ký tự: cat, dog, pen, bus
    if len(words) == 1 and len(text) <= 6:
        return max(base_ls, 1.35)  # 5-6 ký tự: apple, water, bread
    if len(words) == 1 and len(text) <= 8:
        return max(base_ls, 1.15)  # 7-8 ký tự: chicken, teacher
    return base_ls


def _add_silence_padding(wav_path: str, ms: int = 150):
    """Thêm khoảng lặng đầu và cuối WAV để tránh bị cắt/rè khi phát."""
    with open(wav_path, "rb") as f:
        data = f.read()
    if len(data) < 44:
        return
    # Đọc sample rate từ header (byte 24-27)
    sr = struct.unpack_from("<I", data, 24)[0]
    pad_samples = int(sr * ms / 1000)
    silence = b"\x00\x00" * pad_samples  # 16-bit silence
    audio = data[44:]
    new_audio = silence + audio + silence
    # Cập nhật header
    header = bytearray(data[:44])
    struct.pack_into("<I", header, 4, 36 + len(new_audio))
    struct.pack_into("<I", header, 40, len(new_audio))
    with open(wav_path, "wb") as f:
        f.write(bytes(header))
        f.write(new_audio)


app = FastAPI(title="English Buddy — TTS (Piper)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "voices": {k: os.path.exists(v) for k, v in VOICES.items()}}


@app.get("/tts")
def tts(text: str, voice: str = DEFAULT_VOICE, ls: float = 1.0):
    t = (text or "").strip()[:400]
    if not t:
        return Response(status_code=400)
    model = pick_model(voice)
    ls = max(0.6, min(1.6, float(ls)))
    ls = _auto_ls(t, ls)

    key = hashlib.sha1(f"v3|{os.path.basename(model)}|{ls}|{t}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key + ".wav")

    if not os.path.exists(path):
        try:
            subprocess.run(
                [PIPER, "-m", model, "-f", path, "--length-scale", str(ls)],
                input=t.encode("utf-8"), check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            # Thêm silence padding để tránh rè/cắt đầu cuối trên mobile
            _add_silence_padding(path, ms=120)
        except Exception:
            return Response(status_code=500)

    with open(path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/wav", headers={"Cache-Control": "public, max-age=31536000"})
