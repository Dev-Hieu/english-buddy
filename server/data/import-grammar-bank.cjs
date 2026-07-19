#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "..", "data.db");
const GRAMMAR_DIR = path.join(__dirname, "grammar-bank");
const LEVELS = ["a1", "a2", "b1", "b2", "c1"];

const db = new Database(DB_PATH);

// Ensure table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS grammar_bank (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    level TEXT NOT NULL,
    category TEXT NOT NULL,
    description_vi TEXT DEFAULT "",
    rules TEXT DEFAULT "[]",
    common_mistakes TEXT DEFAULT "[]",
    related_vocab TEXT DEFAULT "[]",
    related_phrases TEXT DEFAULT "[]",
    exercises TEXT DEFAULT "[]",
    created_at INTEGER NOT NULL
  )
`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_gb_level ON grammar_bank(level)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_gb_category ON grammar_bank(category)`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO grammar_bank
    (id, title, title_vi, level, category, description_vi, rules, common_mistakes, related_vocab, related_phrases, exercises, created_at)
  VALUES
    (@id, @title, @title_vi, @level, @category, @description_vi, @rules, @common_mistakes, @related_vocab, @related_phrases, @exercises, @created_at)
`);

let totalInserted = 0;

for (const level of LEVELS) {
  const filePath = path.join(GRAMMAR_DIR, `${level}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] ${filePath} not found`);
    continue;
  }

  const topics = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`[${level.toUpperCase()}] Importing ${topics.length} topics...`);

  const importLevel = db.transaction((topics) => {
    let count = 0;
    for (const t of topics) {
      insert.run({
        id: randomUUID(),
        title: t.title || "",
        title_vi: t.title_vi || "",
        level: t.level || level,
        category: t.category || "tenses",
        description_vi: t.description_vi || "",
        rules: JSON.stringify(t.rules || []),
        common_mistakes: JSON.stringify(t.common_mistakes || []),
        related_vocab: JSON.stringify(t.related_vocab || []),
        related_phrases: JSON.stringify(t.related_phrases || []),
        exercises: JSON.stringify(t.exercises || []),
        created_at: Date.now(),
      });
      count++;
    }
    return count;
  });

  const count = importLevel(topics);
  console.log(`  => ${count} topics inserted`);
  totalInserted += count;
}

console.log(`\nDone: ${totalInserted} total grammar topics imported.`);
db.close();
