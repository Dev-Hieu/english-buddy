// Worker nền: định kỳ lấy ảnh Pexels cho các từ còn thiếu ảnh, ghi vào DB
// và đồng bộ ra src/data/seedImages.ts để client (bundle) hiển thị được.
// Tôn trọng giới hạn Pexels (~200 request/giờ) bằng batch nhỏ + nghỉ giữa các lần.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import { IMAGE_URLS } from "../../src/data/seedImages";

const SEED_IMAGES_PATH = path.resolve(fileURLToPath(import.meta.url), "../../../src/data/seedImages.ts");
// Bản đồ ảnh trong bộ nhớ, khởi tạo từ file hiện có -> merge thêm, không mất ảnh cũ.
const imgMap: Record<string, string> = { ...IMAGE_URLS };

const KEY = process.env.PEXELS_KEY || "";
// Mặc định: 25 từ mỗi 10 phút ≈ 150/giờ (an toàn dưới 200/giờ).
const BATCH = Number(process.env.IMAGE_WORKER_BATCH || 25);
const INTERVAL_MS = Number(process.env.IMAGE_WORKER_INTERVAL_MS || 10 * 60 * 1000);
const GAP_MS = Number(process.env.IMAGE_WORKER_GAP_MS || 1500);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Nhớ các từ Pexels không tìm được ảnh để khỏi hỏi lại mỗi vòng (reset khi restart).
const noImage = new Set<string>();
let running = false;

async function fetchOne(query: string): Promise<string> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
  const r = await fetch(url, { headers: { Authorization: KEY } });
  if (!r.ok) throw new Error(`pexels ${r.status}`); // 429 -> dừng vòng này
  const d: any = await r.json();
  return d.photos?.[0]?.src?.medium ?? "";
}

// Ghi seedImages.ts từ bản đồ đã merge (giữ ảnh cũ + thêm ảnh mới) cho client bundle/HMR.
function syncSeedImages() {
  writeFileSync(SEED_IMAGES_PATH, `export const IMAGE_URLS: Record<string, string> = ${JSON.stringify(imgMap, null, 2)};\n`);
}

async function runBatch(db: Database.Database) {
  if (running) return;
  running = true;
  try {
    // Ứng viên: chưa có ảnh, là từ đơn (không khoảng trắng) -> ảnh stock sát nghĩa hơn.
    const rows = db
      .prepare(
        `SELECT id, word FROM vocabulary
         WHERE (imageUrl IS NULL OR imageUrl = '') AND word NOT LIKE '% %'
         ORDER BY id LIMIT 400`,
      )
      .all() as { id: string; word: string }[];
    const todo = rows.filter((r) => !noImage.has(r.id)).slice(0, BATCH);
    if (todo.length === 0) return;

    const upd = db.prepare("UPDATE vocabulary SET imageUrl = ? WHERE id = ?");
    let got = 0;
    for (const w of todo) {
      try {
        const u = await fetchOne(w.word);
        if (u) {
          upd.run(u, w.id);
          imgMap[w.id] = u;
          got++;
        } else {
          noImage.add(w.id);
        }
      } catch (e) {
        console.warn(`[imageWorker] dừng vòng này (${(e as Error).message}), thử lại sau.`);
        break; // gặp 429/lỗi mạng -> để vòng sau
      }
      await sleep(GAP_MS);
    }
    if (got) {
      syncSeedImages(); // đồng bộ ra file cho client
      const left = (db.prepare(
        "SELECT COUNT(*) AS c FROM vocabulary WHERE (imageUrl IS NULL OR imageUrl = '') AND word NOT LIKE '% %'",
      ).get() as { c: number }).c;
      console.log(`[imageWorker] +${got} ảnh (đã ghi seedImages.ts); còn thiếu (từ đơn): ${left}`);
    }
  } finally {
    running = false;
  }
}

export function startImageWorker(db: Database.Database) {
  if (!KEY) {
    console.log("[imageWorker] tắt: thiếu PEXELS_KEY trong server/.env");
    return;
  }
  if (process.env.IMAGE_WORKER === "off") {
    console.log("[imageWorker] tắt qua IMAGE_WORKER=off");
    return;
  }
  // Gộp ảnh sẵn có trong DB vào bản đồ (DB là superset) rồi đồng bộ file 1 lần.
  const have = db.prepare("SELECT id, imageUrl FROM vocabulary WHERE imageUrl LIKE 'http%'").all() as { id: string; imageUrl: string }[];
  for (const r of have) imgMap[r.id] = r.imageUrl;
  syncSeedImages();
  console.log(`[imageWorker] bật: ${BATCH} ảnh mỗi ${Math.round(INTERVAL_MS / 60000)} phút (đang có ${have.length} ảnh)`);
  setTimeout(() => void runBatch(db), 15_000); // chạy sớm sau khi server lên
  setInterval(() => void runBatch(db), INTERVAL_MS);
}
