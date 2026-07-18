import { db } from "../db.js";

export function migrate001WordBank(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_vi TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      sub_topics TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS word_bank (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      phonetic TEXT DEFAULT '',
      meaning_vi TEXT NOT NULL,
      meaning_en TEXT DEFAULT '',
      pos TEXT DEFAULT '',
      level TEXT NOT NULL,
      categories TEXT NOT NULL DEFAULT '[]',
      frequency INTEGER DEFAULT 0,
      examples TEXT DEFAULT '[]',
      word_family TEXT DEFAULT '[]',
      collocations TEXT DEFAULT '[]',
      synonyms TEXT DEFAULT '[]',
      antonyms TEXT DEFAULT '[]',
      common_mistakes TEXT DEFAULT '[]',
      grammar_patterns TEXT DEFAULT '[]',
      image TEXT DEFAULT '',
      audio TEXT DEFAULT '',
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_wb_level ON word_bank(level);
    CREATE INDEX IF NOT EXISTS idx_wb_word ON word_bank(word);
  `);

  console.log("Migration 001: word_bank + categories tables created");
}
