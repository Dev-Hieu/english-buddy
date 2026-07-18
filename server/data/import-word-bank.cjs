const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");

const insert = db.prepare(`
  INSERT OR REPLACE INTO word_bank
  (id, word, phonetic, meaning_vi, meaning_en, pos, level, categories,
   frequency, examples, word_family, collocations, synonyms, antonyms,
   common_mistakes, grammar_patterns, image, audio, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let total = 0;
const tx = db.transaction(() => {
  for (const level of ["a1", "a2", "b1", "b2", "c1"]) {
    const file = path.join(__dirname, "word-bank", `${level}.json`);
    if (!fs.existsSync(file)) { console.log(`SKIP: ${level}`); continue; }
    const words = JSON.parse(fs.readFileSync(file, "utf-8"));
    for (const w of words) {
      const stringify = (v) => JSON.stringify(v || []);
      insert.run(
        w.id || randomUUID(), w.word, w.phonetic || "", w.meaning_vi || "", w.meaning_en || "",
        w.pos || "", w.level || level, stringify(w.categories),
        w.frequency || 0, stringify(w.examples),
        stringify(w.word_family), stringify(w.collocations),
        stringify(w.synonyms), stringify(w.antonyms),
        stringify(w.common_mistakes), stringify(w.grammar_patterns),
        w.image || "", w.audio || "", w.created_at || Date.now()
      );
      total++;
    }
    console.log(`${level}: ${words.length} words`);
  }
});
tx();
console.log(`Total imported: ${total} words`);
db.close();
