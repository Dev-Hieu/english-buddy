"""Microservice chấm phát âm theo từng âm (IPA) — tự host, dùng wav2vec2-phoneme.

Chạy:  cd speech-eval && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8788
Model: facebook/wav2vec2-lv-60-espeak-cv-ft (nhận âm vị IPA-eSpeak). Tải ~1GB lần đầu.
"""
import os
import tempfile

import numpy as np
import soundfile as sf
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from ipa_align import align_score, tokenize_ipa

MODEL_ID = os.environ.get("PHONEME_MODEL", "bookbot/wav2vec2-ljspeech-gruut")

app = FastAPI(title="English Buddy — Pronunciation")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

_processor = None
_model = None


def get_model():
    global _processor, _model
    if _model is None:
        import torch  # noqa: F401
        from transformers import AutoModelForCTC, AutoProcessor
        _processor = AutoProcessor.from_pretrained(MODEL_ID)
        _model = AutoModelForCTC.from_pretrained(MODEL_ID)
        _model.eval()
    return _processor, _model


def recognize_phonemes(path: str) -> str:
    import torch
    audio, sr = sf.read(path, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    if sr != 16000:  # resample tuyến tính về 16kHz
        n = max(1, int(len(audio) * 16000 / sr))
        audio = np.interp(np.linspace(0, len(audio), n, endpoint=False), np.arange(len(audio)), audio).astype("float32")
    processor, model = get_model()
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    with torch.no_grad():
        logits = model(inputs.input_values).logits
    ids = torch.argmax(logits, dim=-1)
    return processor.batch_decode(ids)[0]


@app.on_event("startup")
def _warmup():
    # Nạp model ngay khi khởi động để lần chấm đầu KHÔNG bị chậm/timeout (cold start).
    try:
        get_model()
        print("[speech-eval] model đã nạp sẵn, sẵn sàng chấm.")
    except Exception as e:  # noqa: BLE001
        print("[speech-eval] warmup lỗi (sẽ nạp lại khi có request):", e)


@app.get("/health")
def health():
    return {"ok": True, "modelReady": _model is not None}


@app.post("/pronounce")
async def pronounce(audio: UploadFile = File(...), ipa: str = Form(...)):
    data = await audio.read()
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(data)
        path = f.name
    try:
        predicted_str = recognize_phonemes(path)
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass

    predicted = predicted_str.split() if " " in predicted_str.strip() else tokenize_ipa(predicted_str)
    expected = tokenize_ipa(ipa)
    return align_score(expected, predicted)
