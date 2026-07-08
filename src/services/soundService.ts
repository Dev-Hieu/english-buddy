// Sound effects using Web Audio API — no external files needed
const ctx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function beep(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* silent fail */ }
}

/** Correct answer — cheerful ascending */
export function playCorrect() {
  beep(523, 0.1, "sine", 0.12); // C5
  setTimeout(() => beep(659, 0.1, "sine", 0.12), 80); // E5
  setTimeout(() => beep(784, 0.15, "sine", 0.1), 160); // G5
}

/** Wrong answer — descending buzz */
export function playWrong() {
  beep(300, 0.15, "square", 0.08);
  setTimeout(() => beep(220, 0.2, "square", 0.06), 100);
}

/** Button tap — subtle click */
export function playTap() {
  beep(800, 0.03, "sine", 0.06);
}

/** Streak / combo — exciting rising */
export function playStreak() {
  beep(523, 0.08, "sine", 0.1);
  setTimeout(() => beep(659, 0.08, "sine", 0.1), 60);
  setTimeout(() => beep(784, 0.08, "sine", 0.1), 120);
  setTimeout(() => beep(1047, 0.15, "sine", 0.08), 180);
}

/** Win / complete — triumphant fanfare */
export function playWin() {
  beep(523, 0.12, "sine", 0.12);
  setTimeout(() => beep(659, 0.12, "sine", 0.12), 120);
  setTimeout(() => beep(784, 0.12, "sine", 0.12), 240);
  setTimeout(() => beep(1047, 0.3, "sine", 0.1), 360);
}

/** Lose / timeout — sad descending */
export function playLose() {
  beep(400, 0.2, "triangle", 0.08);
  setTimeout(() => beep(300, 0.2, "triangle", 0.08), 150);
  setTimeout(() => beep(200, 0.3, "triangle", 0.06), 300);
}

/** Countdown tick */
export function playTick() {
  beep(1000, 0.02, "sine", 0.04);
}
