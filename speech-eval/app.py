"""Microservice chấm phát âm theo từng âm (IPA) — tự host, dùng allosaurus.

Chạy:  cd speech-eval && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8788
"""
import os
import tempfile

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from ipa_align import align_score, tokenize_ipa

app = FastAPI(title="English Buddy — Pronunciation")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tải model 1 lần khi khởi động (allosaurus -> phones IPA).
_recognizer = None


def get_recognizer():
    global _recognizer
    if _recognizer is None:
        from allosaurus.app import read_recognizer
        _recognizer = read_recognizer()
    return _recognizer


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/pronounce")
async def pronounce(audio: UploadFile = File(...), ipa: str = Form(...)):
    data = await audio.read()
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(data)
        path = f.name
    try:
        predicted_str = get_recognizer().recognize(path, "eng")
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass

    predicted = predicted_str.split()
    expected = tokenize_ipa(ipa)
    return align_score(expected, predicted)
