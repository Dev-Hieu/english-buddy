// Nạp seed (topics, vocabulary, students) vào SQLite. Chạy: npm run seed
// Dùng chung nguồn seed với client (src/data) -> single source of truth.
import "dotenv/config";
import { db, initSchema } from "./db.js";
import { SEED_TOPICS } from "../../src/data/seedTopics";
import { SEED_VOCABULARY } from "../../src/data/seedVocabulary";
import { SEED_STUDENTS } from "../../src/data/seedStudents";

export function seedAll(): void {
  initSchema();

  const insTopic = db.prepare(
    `INSERT OR REPLACE INTO topics (id, name, name_vi, level, "order") VALUES (@id, @name, @name_vi, @level, @order)`
  );
  const insWord = db.prepare(
    `INSERT OR REPLACE INTO vocabulary
      (id, word, phonetic, meaning_vi, meaning_en, example, example_vi, topicIds, level, imageUrl, audioUrl, source, createdAt)
     VALUES (@id, @word, @phonetic, @meaning_vi, @meaning_en, @example, @example_vi, @topicIds, @level, @imageUrl, @audioUrl, @source, @createdAt)`
  );
  const insStudent = db.prepare(
    `INSERT OR REPLACE INTO students
      (id, parentId, name, grade, level, avatar, dailyGoal, xp, streak, createdAt)
     VALUES (@id, @parentId, @name, @grade, @level, @avatar, @dailyGoal, @xp, @streak, @createdAt)`
  );

  const tx = db.transaction(() => {
    for (const t of SEED_TOPICS) insTopic.run(t);
    for (const w of SEED_VOCABULARY) {
      insWord.run({
        ...w,
        phonetic: w.phonetic ?? null,
        meaning_en: w.meaning_en ?? null,
        example: w.example ?? null,
        example_vi: w.example_vi ?? null,
        audioUrl: w.audioUrl ?? null,
        topicIds: JSON.stringify(w.topicIds),
      });
    }
    for (const s of SEED_STUDENTS) insStudent.run(s);
  });
  tx();

  const n = db.prepare("SELECT COUNT(*) AS c FROM vocabulary").get() as { c: number };
  console.log(`Seed xong: ${SEED_TOPICS.length} topics, ${n.c} từ, ${SEED_STUDENTS.length} học sinh.`);
}

// Chạy trực tiếp khi gọi `npm run seed`.
seedAll();
