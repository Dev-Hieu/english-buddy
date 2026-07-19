#!/usr/bin/env node
/**
 * Fetch Pexels images for all word_bank entries that don't have images.
 * Run on VPS: cd ~/english-buddy && PEXELS_KEY=xxx node server/data/fetch-word-bank-images.cjs
 *
 * Pexels API: 200 requests/hour, we batch with delays.
 */

const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");

const PEXELS_KEY = process.env.PEXELS_KEY;
if (!PEXELS_KEY) {
  console.error("PEXELS_KEY not set. Run with: PEXELS_KEY=xxx node ...");
  process.exit(1);
}

const BATCH_SIZE = parseInt(process.argv[2] || "100", 10);
const DELAY_MS = 400; // ~150 req/min, under 200/hour limit

const update = db.prepare("UPDATE word_bank SET image = ? WHERE id = ?");

async function fetchImage(word) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(word)}&per_page=1&size=small`;
  try {
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    if (!res.ok) {
      if (res.status === 429) {
        console.log("  RATE LIMITED — waiting 60s...");
        await new Promise(r => setTimeout(r, 60000));
        return fetchImage(word); // retry
      }
      return "";
    }
    const data = await res.json();
    return data.photos?.[0]?.src?.medium || "";
  } catch {
    return "";
  }
}

async function main() {
  const noImage = db.prepare("SELECT id, word FROM word_bank WHERE image = '' OR image IS NULL ORDER BY level, word LIMIT ?").all(BATCH_SIZE);

  if (noImage.length === 0) {
    console.log("All words already have images!");
    const total = db.prepare("SELECT COUNT(*) as c FROM word_bank WHERE image != ''").get();
    console.log(`Total with images: ${total.c}`);
    db.close();
    return;
  }

  console.log(`Fetching images for ${noImage.length} words (batch size: ${BATCH_SIZE})...`);

  let success = 0, failed = 0;
  for (let i = 0; i < noImage.length; i++) {
    const { id, word } = noImage[i];
    const imageUrl = await fetchImage(word);

    if (imageUrl) {
      update.run(imageUrl, id);
      success++;
    } else {
      // Set a placeholder so we don't retry
      update.run("none", id);
      failed++;
    }

    if ((i + 1) % 20 === 0) {
      console.log(`  ${i + 1}/${noImage.length} — ${success} OK, ${failed} failed`);
    }

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`\nDone: ${success} images fetched, ${failed} failed`);

  const remaining = db.prepare("SELECT COUNT(*) as c FROM word_bank WHERE image = '' OR image IS NULL").get();
  console.log(`Remaining without images: ${remaining.c}`);

  db.close();
}

main().catch(console.error);
