// Xoay vòng từ cho game: nhớ các từ đã chơi (localStorage), ưu tiên từ chưa chơi;
// đi hết một vòng thì reset để bắt đầu vòng mới -> mỗi lần mở ít lặp lại.
const KEY = "english-buddy:recent-words";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as string[];
  } catch {
    return [];
  }
}
function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids.slice(-200)));
}

function shuffle<T>(s: T[]): T[] {
  return s.slice().sort(() => Math.random() - 0.5);
}

/**
 * Chọn `count` từ từ pool, ưu tiên từ chưa chơi gần đây.
 * Hết từ chưa chơi -> reset vòng (cho phép lặp lại nhưng theo thứ tự mới).
 */
export function pickWords<T extends { id: string }>(pool: T[], count: number): T[] {
  if (pool.length === 0) return [];
  let recent = read();
  let available = pool.filter((w) => !recent.includes(w.id));
  if (available.length < count) {
    recent = []; // hết vòng -> làm mới
    available = pool.slice();
  }
  const chosen = shuffle(available).slice(0, Math.min(count, pool.length));
  write([...recent, ...chosen.map((c) => c.id)]);
  return chosen;
}
