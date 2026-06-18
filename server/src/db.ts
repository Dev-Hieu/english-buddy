import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(dir, "..", "data.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT UNIQUE, passwordHash TEXT, name TEXT,
      role TEXT, createdAt INTEGER, studentLimit INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY, parentId TEXT, name TEXT, grade INTEGER, level TEXT,
      avatar TEXT, dailyGoal INTEGER, xp INTEGER, streak INTEGER, createdAt INTEGER,
      lastActiveDate TEXT
    );
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY, name TEXT, name_vi TEXT, level TEXT, "order" INTEGER
    );
    CREATE TABLE IF NOT EXISTS vocabulary (
      id TEXT PRIMARY KEY, word TEXT, phonetic TEXT, meaning_vi TEXT, meaning_en TEXT,
      example TEXT, example_vi TEXT, topicIds TEXT, level TEXT, imageUrl TEXT,
      audioUrl TEXT, source TEXT, createdAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS progress (
      studentId TEXT, wordId TEXT, status TEXT, mastery INTEGER,
      correctCount INTEGER, wrongCount INTEGER, lastReviewedAt INTEGER, nextReviewAt INTEGER,
      PRIMARY KEY (studentId, wordId)
    );
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT, studentId TEXT, topicId TEXT, score INTEGER,
      totalQuestions INTEGER, correctAnswers INTEGER, wrongAnswers INTEGER,
      wrongWordIds TEXT, durationSeconds INTEGER, createdAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS lookup_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT, studentId TEXT, query TEXT, type TEXT,
      saved INTEGER, createdAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS translation_cache (text TEXT PRIMARY KEY, translation TEXT);
  `);
  // Migration cho DB cũ: thêm cột nếu chưa có.
  try { db.exec("ALTER TABLE students ADD COLUMN lastActiveDate TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN studentLimit INTEGER DEFAULT 1"); } catch { /* đã có */ }
  // Lưu nghĩa/phiên âm/ảnh khi tra để My Words hiển thị + học được.
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN meaning TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN phonetic TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN imageUrl TEXT"); } catch { /* đã có */ }
}
