// Phát âm — TECH_SPEC §7.4 / DECISIONS D-006.
// Ưu tiên audioUrl (giọng người thật từ Dictionary); không có thì fallback Web Speech.

function speakWithTTS(text: string, lang: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel(); // dừng câu đang đọc dở
  window.speechSynthesis.speak(utterance);
}

export function speakText(text: string, audioUrl?: string, lang = "en-US"): void {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    // Nếu file lỗi -> fallback TTS để bé vẫn nghe được.
    audio.play().catch(() => speakWithTTS(text, lang));
    return;
  }
  speakWithTTS(text, lang);
}
