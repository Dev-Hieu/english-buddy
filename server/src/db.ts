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
    -- Sổ cái điểm: mỗi lần cộng XP ghi 1 dòng -> minh bạch, kiểm tra/khôi phục được.
    CREATE TABLE IF NOT EXISTS xp_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, studentId TEXT, type TEXT, points INTEGER,
      refId TEXT, createdAt INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_xp_student ON xp_events(studentId);
    CREATE INDEX IF NOT EXISTS idx_xp_created ON xp_events(createdAt);
    -- Phiên thi kỹ năng: server giữ đáp án để chấm (không tin client).
    CREATE TABLE IF NOT EXISTS skill_test_sessions (
      id TEXT PRIMARY KEY, studentId TEXT, mode TEXT, level TEXT,
      itemsJson TEXT, keyJson TEXT, createdAt INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_sts_student ON skill_test_sessions(studentId);
    -- Mã mời / mã lớp: admin tạo, user dùng khi đăng ký để auto-active.
    CREATE TABLE IF NOT EXISTS invite_codes (
      code TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      classId TEXT,
      maxUses INTEGER DEFAULT 1,
      usedCount INTEGER DEFAULT 0,
      createdBy TEXT,
      createdAt INTEGER,
      expiresAt INTEGER
    );
    -- Lớp học: GV quản lý nhiều lớp, mỗi lớp có mã riêng.
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      teacherId TEXT,
      code TEXT UNIQUE,
      grade INTEGER,
      level TEXT,
      createdAt INTEGER
    );
    -- Bé thuộc lớp nào (many-to-many: 1 bé có thể ở nhiều lớp).
    CREATE TABLE IF NOT EXISTS class_students (
      classId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      joinedAt INTEGER,
      PRIMARY KEY (classId, studentId)
    );
    CREATE TABLE IF NOT EXISTS my_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT,
      level TEXT,
      topic TEXT,
      progress INTEGER DEFAULT 0,
      totalSentences INTEGER DEFAULT 0,
      bestScore INTEGER DEFAULT 0,
      lastPlayedAt INTEGER,
      createdAt INTEGER,
      UNIQUE(studentId, videoId)
    );
    CREATE TABLE IF NOT EXISTS skill_test_results (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      mode TEXT,
      level TEXT,
      totalWords INTEGER,
      totalSkills INTEGER,
      passedSkills INTEGER,
      score INTEGER,
      xpDelta INTEGER,
      details TEXT,
      createdAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      createdBy TEXT,
      createdAt INTEGER,
      expiresAt INTEGER
    );
  `);
  // Migration cho DB cũ: thêm cột nếu chưa có.
  try { db.exec("ALTER TABLE students ADD COLUMN lastActiveDate TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN studentLimit INTEGER DEFAULT 1"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN isPremium INTEGER DEFAULT 0"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN canEditImages INTEGER DEFAULT 0"); } catch { /* đã có */ }
  // Lưu nghĩa/phiên âm/ảnh khi tra để My Words hiển thị + học được.
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN meaning TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN phonetic TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN imageUrl TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE lookup_history ADD COLUMN examples TEXT"); } catch { /* đã có */ }
  // Thi kỹ năng: cột kỹ năng đang qua của mỗi từ (JSON mảng). Điểm từ = độ dài mảng.
  try { db.exec("ALTER TABLE progress ADD COLUMN skillsPassed TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'"); } catch { /* đã có */ }
  // userId = TK đăng nhập riêng của bé (role=student), tách biệt parentId (PH quản lý)
  try { db.exec("ALTER TABLE students ADD COLUMN userId TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN username TEXT"); } catch { /* đã có */ }
  try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL"); } catch { /* đã có */ }
  // Thêm phone, birthday cho users + birthday cho students
  try { db.exec("ALTER TABLE users ADD COLUMN phone TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE users ADD COLUMN birthday TEXT"); } catch { /* đã có */ }
  try { db.exec("ALTER TABLE students ADD COLUMN birthday TEXT"); } catch { /* đã có */ }
  // Fix: student-role users có username PH (backfill cũ) → đổi sang HS
  {
    const wrongRows = db.prepare("SELECT id FROM users WHERE role = 'student' AND UPPER(username) LIKE 'PH%'").all() as { id: string }[];
    for (const r of wrongRows) {
      const max = ((db.prepare("SELECT MAX(CAST(SUBSTR(username, 3) AS INTEGER)) AS n FROM users WHERE UPPER(username) LIKE 'HS%'").get() as any)?.n || 0) + 1;
      const uname = `HS${String(max).padStart(6, "0")}`;
      db.prepare("UPDATE users SET username = ? WHERE id = ?").run(uname, r.id);
    }
  }
  // Backfill username theo role: AD01, GV001, PH000001, HS000001
  try {
    const prefixes: Record<string, { prefix: string; pad: number }> = { admin: { prefix: "AD", pad: 2 }, teacher: { prefix: "GV", pad: 3 }, parent: { prefix: "PH", pad: 6 }, student: { prefix: "HS", pad: 6 } };
    const rows = db.prepare("SELECT id, role FROM users WHERE username IS NULL AND role != 'system'").all() as { id: string; role: string }[];
    for (const r of rows) {
      const cfg = prefixes[r.role] || prefixes.parent;
      const max = ((db.prepare(`SELECT MAX(CAST(SUBSTR(username, ${cfg.prefix.length + 1}) AS INTEGER)) AS n FROM users WHERE UPPER(username) LIKE '${cfg.prefix}%'`).get() as any)?.n || 0) + 1;
      const uname = `${cfg.prefix}${String(max).padStart(cfg.pad, "0")}`;
      db.prepare("UPDATE users SET username = ? WHERE id = ?").run(uname, r.id);
    }
  } catch { /* bỏ qua */ }
  // Chuẩn hoá level cũ ("beginner"... ) về tập CEFR hợp lệ để bộ lọc theo cấp hoạt động.
  try { db.exec("UPDATE students SET level='a1' WHERE level IS NULL OR level NOT IN ('kids','a1','a2','b1','b2','c1')"); } catch { /* bỏ qua */ }
  // Backfill sổ cái: giữ nguyên XP cũ của bé (1 dòng 'legacy') để không mất quyền lợi.
  try {
    db.exec(`INSERT INTO xp_events (studentId, type, points, refId, createdAt)
             SELECT id, 'legacy', xp, NULL, COALESCE(createdAt, 0) FROM students
             WHERE COALESCE(xp,0) > 0 AND id NOT IN (SELECT DISTINCT studentId FROM xp_events)`);
  } catch { /* bỏ qua */ }
  try { db.exec("INSERT OR IGNORE INTO users (id, email, passwordHash, name, role, createdAt, studentLimit) VALUES ('classroom', 'classroom@system', '', 'Lớp học', 'system', 0, 999)"); } catch {}
}
