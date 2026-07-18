#!/usr/bin/env node
/**
 * Import A1 video-derived content into English Buddy DB.
 * Run on VPS: cd ~/english-buddy && node server/data/import-a1-video-content.cjs
 */

const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const SCRIPT_DIR = __dirname;
const DB_PATH = path.join(SCRIPT_DIR, "..", "english_buddy.db");
const DATA_PATH = path.join(SCRIPT_DIR, "a1_video_content.json");

if (!fs.existsSync(DB_PATH)) {
  console.error("DB not found:", DB_PATH);
  process.exit(1);
}
if (!fs.existsSync(DATA_PATH)) {
  console.error("Data not found:", DATA_PATH);
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

// ── 1. Import vocabulary ──
const insertVocab = db.prepare(`
  INSERT OR IGNORE INTO vocabulary (id, word, phonetic, meaning_vi, meaning_en, example, example_vi, topicIds, level, imageUrl, audioUrl, source, createdAt)
  VALUES (?, ?, '', ?, '', ?, '', ?, 'a1', '', '', 'video', ?)
`);
const checkWord = db.prepare(`SELECT id, topicIds FROM vocabulary WHERE LOWER(word) = LOWER(?)`);
const updateTopics = db.prepare(`UPDATE vocabulary SET topicIds = ? WHERE id = ?`);

const now = Date.now();
let newWords = 0, updatedWords = 0, skippedWords = 0;

const importVocab = db.transaction(() => {
  for (const [topic, content] of Object.entries(data)) {
    const topicId = content.video.topicId;
    for (const w of content.vocabulary) {
      const word = w.word.trim();
      if (!word || word.length < 2) continue;
      const existing = checkWord.get(word);
      if (existing) {
        const current = existing.topicIds || "[]";
        if (!current.includes(topicId)) {
          try {
            const arr = JSON.parse(current);
            arr.push(topicId);
            updateTopics.run(JSON.stringify(arr), existing.id);
            updatedWords++;
          } catch { skippedWords++; }
        } else { skippedWords++; }
      } else {
        const id = `word_v_${word.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
        insertVocab.run(id, word, w.meaning_vi, w.example || "", JSON.stringify([topicId]), now);
        newWords++;
      }
    }
  }
});
importVocab();
console.log(`Vocabulary: ${newWords} new, ${updatedWords} updated, ${skippedWords} skipped`);

// ── 2. Cache video subtitles for shadowing ──
const insertCache = db.prepare(`
  INSERT OR REPLACE INTO translation_cache (cache_key, result, created_at)
  VALUES (?, ?, datetime('now'))
`);

let cached = 0;
const cacheSubtitles = db.transaction(() => {
  for (const [topic, content] of Object.entries(data)) {
    const vid = content.video.videoId;
    const segs = content.transcript_segments;
    if (!segs || !segs.length) continue;
    insertCache.run(`ytcap|${vid}`, JSON.stringify({
      level: "A1", topic, videoTitle: content.video.title,
      count: segs.length,
      sentences: segs.map(s => ({ text: s.text, start: s.start, end: s.end })),
    }));
    cached++;
  }
});
cacheSubtitles();
console.log(`Subtitles: ${cached} videos cached`);

console.log("\nA1 videos:");
for (const [topic, c] of Object.entries(data))
  console.log(`  ${topic}: ${c.video.videoId} — ${c.video.title}`);
console.log("\nDone!");
db.close();
