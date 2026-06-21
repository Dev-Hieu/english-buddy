"""Microservice TTS neural — dùng Microsoft Edge TTS (miễn phí, chất lượng cao).

Chạy:  cd tts && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
API:   GET /tts?text=...&voice=us-female  -> audio/mp3 (có cache). GET /health.
"""
import asyncio
import hashlib
import os

import edge_tts
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get("TTS_CACHE", os.path.join(HERE, "cache"))
os.makedirs(CACHE, exist_ok=True)

# Giọng Edge TTS — tự nhiên, rõ ràng, đọc từ đơn chuẩn
VOICES = {
    "us-female": "en-US-JennyNeural",
    "us-male": "en-US-AndrewNeural",
    "gb-female": "en-GB-SoniaNeural",
    "gb-male": "en-GB-RyanNeural",
}
DEFAULT_VOICE = "us-female"

app = FastAPI(title="English Buddy — TTS (Edge)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "engine": "edge-tts", "voices": VOICES}


async def _synthesize(text: str, voice: str, rate: str, out_path: str):
    comm = edge_tts.Communicate(text, voice, rate=rate)
    await comm.save(out_path)


@app.get("/tts")
async def tts(text: str, voice: str = DEFAULT_VOICE, ls: float = 1.0):
    t = (text or "").strip()[:400]
    if not t:
        return Response(status_code=400)

    edge_voice = VOICES.get(voice, VOICES[DEFAULT_VOICE])
    # length_scale → Edge rate: ls=1.0 → +0%, ls=1.3 → -20%, ls=0.8 → +15%
    ls = max(0.6, min(1.6, float(ls)))
    pct = round((1.0 - ls) * 50)
    rate = f"{pct:+d}%" if pct != 0 else "+0%"

    key = hashlib.sha1(f"edge|{edge_voice}|{rate}|{t}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key + ".mp3")

    if not os.path.exists(path):
        try:
            await _synthesize(t, edge_voice, rate, path)
        except Exception:
            return Response(status_code=500)

    with open(path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/mpeg", headers={"Cache-Control": "public, max-age=86400"})
