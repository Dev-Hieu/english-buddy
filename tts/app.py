"""Microservice TTS neural tự host bằng Piper — đọc từ/câu tiếng Anh tự nhiên.

Chạy:  cd tts && .venv/bin/uvicorn app:app --host 0.0.0.0 --port 8789
Giọng: tải model .onnx (+ .onnx.json) vào tts/voices/ — xem README.
API:   GET /tts?text=...  -> audio/wav (có cache theo nội dung). GET /health.
"""
import hashlib
import io
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
    # giọng chọn chưa tải -> ưu tiên cùng vùng, rồi giọng nào có sẵn
    region = (voice or "").split("-")[0]
    same = [v for k, v in VOICES.items() if k.startswith(region) and os.path.exists(v)]
    return same[0] if same else next((v for v in VOICES.values() if os.path.exists(v)), m)


app = FastAPI(title="English Buddy — TTS (Piper)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "voices": {k: os.path.exists(v) for k, v in VOICES.items()}}


def _is_short_word(text: str) -> bool:
    """Từ đơn ngắn (1 từ, ≤6 ký tự) cần wrap trong câu để Piper phát âm chuẩn."""
    words = text.split()
    return len(words) == 1 and len(text) <= 6


def _piper_synth(text: str, model: str, ls: float, out_path: str):
    """Gọi Piper CLI tạo WAV."""
    subprocess.run(
        [PIPER, "-m", model, "-f", out_path, "--length-scale", str(ls)],
        input=text.encode("utf-8"), check=True,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def _trim_prefix_wav(full_path: str, word: str, model: str, ls: float, out_path: str):
    """Cắt WAV: tạo audio prefix ("Say, ") rồi bỏ phần đầu, giữ lại phần từ."""
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        prefix_path = tmp.name
    try:
        _piper_synth("Say,", model, ls, prefix_path)
        with open(prefix_path, "rb") as f:
            prefix_data = f.read()
        with open(full_path, "rb") as f:
            full_data = f.read()
        # Cả 2 file cùng format PCM 16-bit mono → data bắt đầu từ byte 44
        prefix_samples = len(prefix_data) - 44
        full_samples = len(full_data) - 44
        if prefix_samples > 0 and full_samples > prefix_samples:
            # Cắt bớt 70% prefix (giữ lại khoảng lặng tự nhiên trước từ)
            cut = int(prefix_samples * 0.70)
            word_data = full_data[44 + cut:]
            # Viết lại WAV header
            data_len = len(word_data)
            header = full_data[:44]
            # Cập nhật data chunk size (byte 40-43) và RIFF size (byte 4-7)
            header = bytearray(header)
            struct.pack_into("<I", header, 4, 36 + data_len)
            struct.pack_into("<I", header, 40, data_len)
            with open(out_path, "wb") as f:
                f.write(bytes(header))
                f.write(word_data)
            return
    except Exception:
        pass
    finally:
        try:
            os.unlink(prefix_path)
        except OSError:
            pass
    # Fallback: dùng file gốc
    if full_path != out_path:
        os.rename(full_path, out_path)


@app.get("/tts")
def tts(text: str, voice: str = DEFAULT_VOICE, ls: float = 1.0):
    t = (text or "").strip()[:400]
    if not t:
        return Response(status_code=400)
    model = pick_model(voice)
    ls = max(0.6, min(1.6, float(ls)))

    # Cache key dựa trên nội dung gốc (v2 = bản có trim)
    key = hashlib.sha1(f"v2|{os.path.basename(model)}|{ls}|{t}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key + ".wav")

    if not os.path.exists(path):
        try:
            if _is_short_word(t):
                # Từ ngắn: wrap trong "Say, {word}." để Piper phát âm chuẩn, rồi cắt prefix
                import tempfile
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                    full_path = tmp.name
                _piper_synth(f"Say, {t}.", model, ls, full_path)
                _trim_prefix_wav(full_path, t, model, ls, path)
                try:
                    os.unlink(full_path)
                except OSError:
                    pass
            else:
                _piper_synth(t, model, ls, path)
        except Exception:
            return Response(status_code=500)

    with open(path, "rb") as f:
        data = f.read()
    return Response(data, media_type="audio/wav", headers={"Cache-Control": "public, max-age=31536000"})
