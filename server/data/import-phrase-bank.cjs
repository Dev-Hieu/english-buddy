#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "..", "data.db");
const PHRASE_BANK_DIR = path.join(__dirname, "phrase-bank");

const LEVELS = ["a1", "a2", "b1", "b2", "c1"];

const db = new Database(DB_PATH);

const insert = db.prepare(`
  INSERT OR REPLACE INTO phrase_bank
    (id, phrase, meaning_vi, type, level, category, examples, collocations, response, example_dialogue, created_at)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let totalInserted = 0;
let totalSkipped = 0;

for (const level of LEVELS) {
  const levelFile = path.join(PHRASE_BANK_DIR, `${level}.json`);
  if (!fs.existsSync(levelFile)) {
    console.log(`[SKIP] ${level}.json not found — run generate-phrase-bank.cjs ${level} first`);
    continue;
  }

  const allPhrases = JSON.parse(fs.readFileSync(levelFile, "utf8"));

  // Group by category by scanning per-category files to get category info
  // We need to know which category each phrase belongs to.
  // Strategy: read per-category files and import with category info.
  // allPhrases (combined) doesn't include category. Use per-category files instead.

  const catFiles = fs.readdirSync(PHRASE_BANK_DIR)
    .filter((f) => f.startsWith(`${level}_`) && f.endsWith(".json") && f !== `${level}.json`);

  if (catFiles.length === 0) {
    console.log(`[WARN] No per-category files found for ${level}, skipping`);
    continue;
  }

  let levelInserted = 0;
  let levelSkipped = 0;

  for (const catFile of catFiles) {
    // e.g. "a1_daily_life.json" → category = "daily_life"
    const category = catFile.replace(`${level}_`, "").replace(".json", "");
    const filePath = path.join(PHRASE_BANK_DIR, catFile);
    const phrases = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const runInsert = db.transaction((phraseList) => {
      phraseList.forEach((p, idx) => {
        if (!p.phrase || !p.meaning_vi) { levelSkipped++; return; }

        const paddedIdx = String(idx + 1).padStart(3, "0");
        const id = `pb_${level}_${category}_${paddedIdx}`;

        insert.run(
          id,
          p.phrase,
          p.meaning_vi,
          p.type || "expression",
          level,
          category,
          JSON.stringify(Array.isArray(p.examples) ? p.examples : []),
          JSON.stringify(Array.isArray(p.collocations) ? p.collocations : []),
          p.response || "",
          JSON.stringify(Array.isArray(p.example_dialogue) ? p.example_dialogue : []),
          Date.now()
        );
        levelInserted++;
      });
    });

    runInsert(phrases);
    console.log(`  [OK] ${catFile} — ${phrases.length} phrases`);
  }

  console.log(`[${level.toUpperCase()}] inserted: ${levelInserted}, skipped: ${levelSkipped}`);
  totalInserted += levelInserted;
  totalSkipped += levelSkipped;
}

db.close();
console.log(`\n=== Import complete: ${totalInserted} phrases inserted, ${totalSkipped} skipped ===`);
