"""Microservice TTS neural tự host bằng Piper — đọc từ/câu tiếng Anh tự nhiên.

Chạy:  cd tts && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
Giọng: tải model .onnx (+ .onnx.json) vào tts/voices/ — xem README.
API:   GET /tts?text=...  -> audio/mp3 (có cache theo nội dung). GET /health.
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
FFMPEG = os.environ.get("FFMPEG_BIN", "ffmpeg")
os.makedirs(CACHE, exist_ok=True)


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
        return max(base_ls, 1.5)
    if len(words) == 1 and len(text) <= 6:
        return max(base_ls, 1.35)
    if len(words) == 1 and len(text) <= 8:
        return max(base_ls, 1.15)
    return base_ls


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

    key = hashlib.sha1(f"v4|{os.path.basename(model)}|{ls}|{t}".encode("utf-8")).hexdigest()
    mp3_path = os.path.join(CACHE, key + ".mp3")

    if not os.path.exists(mp3_path):
        wav_path = mp3_path.replace(".mp3", ".wav")
        try:
            # Piper → WAV 22050Hz
            subprocess.run(
                [PIPER, "-m", model, "-f", wav_path, "--length-scale", str(ls)],
                input=t.encode("utf-8"), check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            # WAV → MP3 44100Hz (tương thích mobile, nhẹ hơn, không rè)
            subprocess.run(
                [FFMPEG, "-y", "-i", wav_path,
                 "-ar", "44100",       # resample lên 44.1kHz
                 "-af", "adelay=100|100,apad=pad_dur=0.1",  # pad 100ms đầu + cuối
                 "-b:a", "128k",       # bitrate đủ rõ
                 mp3_path],
                check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        except Exception:
            return Response(status_code=500)
        finally:
            try:
                os.unlink(wav_path)
            except OSError:
                pass

    with open(mp3_path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=31536000"})
