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
  const wordBankDir = path.join(__dirname, "word-bank");
  const files = fs.readdirSync(wordBankDir).filter(f => f.endsWith(".json"));

  for (const level of ["kids", "a1", "a2", "b1", "b2", "c1"]) {
    // Use topic-specific files (e.g. a1_daily_life.json) to preserve category info
    const topicFiles = files.filter(f => f.startsWith(level + "_"));

    if (topicFiles.length === 0) {
      // Fallback to combined file
      const file = path.join(wordBankDir, `${level}.json`);
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
      console.log(`${level} (combined): ${words.length} words`);
    } else {
      let levelTotal = 0;
      for (const file of topicFiles) {
        // Extract category from filename: a1_daily_life.json -> daily_life
        const category = file.replace(`${level}_`, "").replace(".json", "");
        const words = JSON.parse(fs.readFileSync(path.join(wordBankDir, file), "utf-8"));
        for (const w of words) {
          const stringify = (v) => JSON.stringify(v || []);
          insert.run(
            w.id || `${level}_${category}_${w.word}`, w.word, w.phonetic || "", w.meaning_vi || "", w.meaning_en || "",
            w.pos || "", w.level || level, JSON.stringify(w.categories && w.categories.length ? w.categories : [category]),
            w.frequency || 0, stringify(w.examples),
            stringify(w.word_family), stringify(w.collocations),
            stringify(w.synonyms), stringify(w.antonyms),
            stringify(w.common_mistakes), stringify(w.grammar_patterns),
            w.image || "", w.audio || "", w.created_at || Date.now()
          );
          levelTotal++;
          total++;
        }
      }
      console.log(`${level}: ${levelTotal} words across ${topicFiles.length} topics`);
    }
  }
});
tx();
console.log(`Total imported: ${total} words`);
db.close();
