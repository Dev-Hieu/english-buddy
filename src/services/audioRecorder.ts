// Ghi âm từ micro -> WAV 16kHz mono (định dạng allosaurus đọc được).
// Cần ngữ cảnh bảo mật (HTTPS/localhost) để dùng micro.

export interface Recorder {
  stop: () => Promise<Blob>;
  cancel: () => void;
}

export function micAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export async function startRecording(): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mr = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  mr.start();

  const stopTracks = () => stream.getTracks().forEach((t) => t.stop());

  return {
    cancel: () => {
      if (mr.state !== "inactive") mr.stop();
      stopTracks();
    },
    stop: () =>
      new Promise<Blob>((resolve, reject) => {
        mr.onstop = async () => {
          stopTracks();
          try {
            const webm = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
            resolve(await toWav16k(webm));
          } catch (e) {
            reject(e);
          }
        };
        mr.stop();
      }),
  };
}

async function toWav16k(blob: Blob): Promise<Blob> {
  const buf = await blob.arrayBuffer();
  const AC: typeof AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const decoded = await ctx.decodeAudioData(buf);
  await ctx.close();

  const rate = 16000;
  const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * rate)), rate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start();
  const rendered = await offline.startRendering();
  return encodeWav(rendered.getChannelData(0), rate);
}

function encodeWav(samples: Float32Array, rate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let off = 44;
  for (let i = 0; i < samples.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([view], { type: "audio/wav" });
}
