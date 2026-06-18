// Nhận dạng giọng nói bằng Web Speech API (SpeechRecognition) — chạy ở trình duyệt.
// Hỗ trợ tốt trên Chrome & Safari. Không cần server.

/* eslint-disable @typescript-eslint/no-explicit-any */
function getRecognition(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  return SR ? new SR() : null;
}

export function isRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/** Nghe 1 lần, trả về danh sách phương án nghe được (tốt nhất xếp trước). */
export function listenOnce(lang = "en-US"): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const rec = getRecognition();
    if (!rec) {
      reject(new Error("unsupported"));
      return;
    }
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let done = false;

    rec.onresult = (e: any) => {
      done = true;
      const res = e.results[0];
      const alts: string[] = [];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      resolve(alts);
    };
    rec.onerror = (e: any) => {
      if (!done) reject(new Error(e.error || "error"));
    };
    rec.onend = () => {
      if (!done) reject(new Error("no-speech"));
    };

    try {
      rec.start();
    } catch {
      reject(new Error("start-failed"));
    }
  });
}
