#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "..", "data.db");
const CONV_BANK_DIR = path.join(__dirname, "conversation-bank");

const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];

const db = new Database(DB_PATH);

const insert = db.prepare(`
  INSERT OR REPLACE INTO conversation_bank
    (id, scenario, scenario_vi, level, category, roles, dialogue, key_phrases, key_vocab, grammar_points, created_at)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let totalInserted = 0;
let totalSkipped = 0;

for (const level of LEVELS) {
  const catFiles = fs.existsSync(CONV_BANK_DIR)
    ? fs.readdirSync(CONV_BANK_DIR).filter((f) => f.startsWith(`${level}_`) && f.endsWith(".json"))
    : [];

  if (catFiles.length === 0) {
    console.log(`[SKIP] No per-category files found for ${level} — run generate-conversation-bank.cjs ${level} first`);
    continue;
  }

  let levelInserted = 0;
  let levelSkipped = 0;

  for (const catFile of catFiles) {
    // e.g. "a1_daily_life.json" → category = "daily_life"
    const category = catFile.replace(`${level}_`, "").replace(".json", "");
    const filePath = path.join(CONV_BANK_DIR, catFile);
    const scenarios = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const runInsert = db.transaction((list) => {
      list.forEach((s, idx) => {
        if (!s.scenario || !s.scenario_vi) { levelSkipped++; return; }

        const paddedIdx = String(idx + 1).padStart(3, "0");
        const id = `cb_${level}_${category}_${paddedIdx}`;

        insert.run(
          id,
          s.scenario,
          s.scenario_vi,
          s.level || level,
          s.category || category,
          JSON.stringify(Array.isArray(s.roles) ? s.roles : []),
          JSON.stringify(Array.isArray(s.dialogue) ? s.dialogue : []),
          JSON.stringify(Array.isArray(s.key_phrases) ? s.key_phrases : []),
          JSON.stringify(Array.isArray(s.key_vocab) ? s.key_vocab : []),
          JSON.stringify(Array.isArray(s.grammar_points) ? s.grammar_points : []),
          Date.now()
        );
        levelInserted++;
      });
    });

    runInsert(scenarios);
    console.log(`  [OK] ${catFile} — ${scenarios.length} scenarios`);
  }

  console.log(`[${level.toUpperCase()}] inserted: ${levelInserted}, skipped: ${levelSkipped}`);
  totalInserted += levelInserted;
  totalSkipped += levelSkipped;
}

db.close();
console.log(`\n=== Import complete: ${totalInserted} scenarios inserted, ${totalSkipped} skipped ===`);
