import cors from "cors";
import express from "express";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";
import { db, initSchema } from "./db.js";
import { loginUser, registerUser, requireAdmin, requireAuth } from "./auth.js";
import { nextReview } from "../../src/utils/spacedRepetition";
import { buildQuiz } from "../../src/utils/quizGenerator";
import type { VocabularyWord } from "../../src/types";

const dir = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(dir, "..", "public");
const SEED_IMAGES_PATH = path.join(dir, "..", "..", "src", "data", "seedImages.ts");

function rowToWord(r: any): VocabularyWord {
  return { ...r, topicIds: JSON.parse(r.topicIds) };
}

function dayStr(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Trần điểm mỗi ngày (chống farm bằng script). Đổi qua env DAILY_XP_CAP.
const DAILY_XP_CAP = Number(process.env.DAILY_XP_CAP || 500);
function startOfToday(): number { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }

// Ghi 1 sự kiện điểm vào sổ cái + cập nhật tổng XP (cộng dồn tính lại được từ sổ cái).
// Có TRẦN/ngày: vượt trần thì không cộng thêm (số điểm khủng bất thường -> bị chặn).
function awardXp(studentId: string, type: string, points: number, refId: string | null = null): void {
  if (points <= 0) return;
  const today = (db.prepare("SELECT COALESCE(SUM(points),0) AS c FROM xp_events WHERE studentId=? AND createdAt>=?").get(studentId, startOfToday()) as any).c;
  if (today >= DAILY_XP_CAP) return;
  const grant = Math.min(points, DAILY_XP_CAP - today);
  db.prepare("INSERT INTO xp_events (studentId, type, points, refId, createdAt) VALUES (?, ?, ?, ?, ?)")
    .run(studentId, type, grant, refId, Date.now());
  db.prepare("UPDATE students SET xp = COALESCE(xp, 0) + ? WHERE id = ?").run(grant, studentId);
}

// Cập nhật chuỗi ngày học liên tiếp (chỉ để hiển thị 🔥 khích lệ — KHÔNG cộng điểm).
function bumpStreak(studentId: string): void {
  const s = db.prepare("SELECT streak, lastActiveDate FROM students WHERE id = ?").get(studentId) as any;
  if (!s) return;
  const today = dayStr(new Date());
  if (s.lastActiveDate === today) return; // hôm nay đã tính
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = dayStr(y);
  const streak = s.lastActiveDate === yesterday ? (s.streak || 0) + 1 : 1;
  db.prepare("UPDATE students SET streak = ?, lastActiveDate = ? WHERE id = ?").run(streak, today, studentId);
}

// ── Thi kỹ năng (điểm = số kỹ năng đang qua mỗi từ) ──
const SKILLS_BY_LEVEL: Record<string, string[]> = {
  kids: ["listen_word", "image_word"],
};
const DEFAULT_SKILLS = ["listen_word", "speak", "write"];
function skillsForLevel(level: string): string[] {
  return SKILLS_BY_LEVEL[level] || DEFAULT_SKILLS;
}
const SPEAK_PASS = Number(process.env.SPEAK_PASS || 60);

// Trừ điểm (quên khi thi lại): ghi sự kiện âm vào sổ cái, hạ tổng (sàn 0). Không bị trần ngày.
function deductXp(studentId: string, type: string, points: number, refId: string | null = null): void {
  if (points <= 0) return;
  const cur = (db.prepare("SELECT COALESCE(xp,0) AS c FROM students WHERE id=?").get(studentId) as any)?.c ?? 0;
  const dec = Math.min(points, cur); // không để tổng âm
  if (dec <= 0) return;
  db.prepare("INSERT INTO xp_events (studentId, type, points, refId, createdAt) VALUES (?, ?, ?, ?, ?)")
    .run(studentId, type, -dec, refId, Date.now());
  db.prepare("UPDATE students SET xp = COALESCE(xp,0) - ? WHERE id = ?").run(dec, studentId);
}

const normWrite = (s: string): string => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
// Chấm 1 kỹ năng ở SERVER (không tin client). value: lựa chọn/chữ gõ; speak: điểm phát âm 0-100.
function gradeSkill(skill: string, value: any, correctWord: string): boolean {
  if (skill === "write") return normWrite(value) === normWrite(correctWord);
  if (skill === "speak") return Number(value) >= SPEAK_PASS;
  // listen_word / image_word: chọn đúng từ
  return String(value) === String(correctWord);
}

// 4 lựa chọn chữ (1 đúng + 3 nhiễu) cho câu nghe/nhìn hình.
function buildOptions(correct: string, pool: string[]): string[] {
  const others = pool.filter((w) => w !== correct);
  const picks: string[] = [];
  while (picks.length < 3 && others.length) {
    const i = Math.floor(Math.random() * others.length);
    picks.push(others.splice(i, 1)[0]);
  }
  const opts = [correct, ...picks];
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  return opts;
}

// Mốc đầu tuần (thứ 2, 00:00 giờ máy chủ) cho bảng xếp hạng theo tuần.
function startOfWeek(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0 = thứ 2
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

// Kiểm tra học sinh thuộc tài khoản đang đăng nhập (admin xem được tất cả).
function canAccessStudent(req: Request, res: Response, studentId: string): boolean {
  const user = (req as any).user;
  if (user?.role === "admin") return true;
  const s = db.prepare("SELECT parentId FROM students WHERE id = ?").get(studentId) as any;
  if (!s || s.parentId !== user?.id) {
    res.status(403).json({ error: "forbidden" });
    return false;
  }
  return true;
}

// Ghi lại src/data/seedImages.ts từ imageUrl hiện tại trong DB -> app tự cập nhật (Vite HMR).
function regenerateSeedImages(): void {
  const rows = db.prepare("SELECT id, imageUrl FROM vocabulary").all() as any[];
  const map: Record<string, string> = {};
  for (const r of rows) map[r.id] = r.imageUrl || "";
  const body = `// Ảnh minh họa cho seed words — chỉnh qua trang /picker hoặc sửa tay (C-002).
// key = word id; rỗng -> WordCard hiện placeholder chữ cái.
export const IMAGE_URLS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
  writeFileSync(SEED_IMAGES_PATH, body);
}

export function createApp() {
  initSchema();
  const app = express();
  app.use(cors());
  app.use(express.json());
  // Không cache phản hồi API -> client luôn nhận dữ liệu mới sau khi sửa hồ sơ/tiến độ.
  app.use("/api", (_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.use(express.static(PUBLIC_DIR));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Trang chọn ảnh cho phụ huynh.
  app.get("/picker", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "picker.html")));

  // ── Auth (đa người dùng: email + mật khẩu) ──
  app.post("/api/register", (req, res) => {
    const { email, password, name } = req.body || {};
    const result = registerUser(email, password, name);
    if ("error" in result) return res.status(400).json(result);
    res.json(result);
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body || {};
    const result = loginUser(String(email || ""), String(password || ""));
    if (!result) return res.status(401).json({ error: "sai email hoặc mật khẩu" });
    res.json(result);
  });

  app.get("/api/me", requireAuth, (req, res) => res.json((req as any).user));

  // ── Admin: quản lý người dùng ──
  app.get("/api/admin/users", requireAdmin, (_req, res) => {
    const rows = db.prepare(`
      SELECT u.id, u.email, u.name, u.role, u.createdAt, u.studentLimit, u.isPremium, u.canEditImages,
             (SELECT COUNT(*) FROM students s WHERE s.parentId = u.id) AS studentCount
      FROM users u ORDER BY u.createdAt DESC
    `).all();
    res.json(rows);
  });

  // Admin chọn reset MỤC NÀO cho mọi học sinh (mỗi cờ độc lập). Không chọn gì -> không làm gì.
  app.post("/api/admin/reset-scores", requireAdmin, (req, res) => {
    const o = req.body || {};
    const done: string[] = [];
    if (o.xp) { db.exec("DELETE FROM xp_events"); db.prepare("UPDATE students SET xp = 0").run(); done.push("xp"); }
    if (o.streak) { db.prepare("UPDATE students SET streak = 0, lastActiveDate = NULL").run(); done.push("streak"); }
    if (o.progress) { db.exec("DELETE FROM progress"); done.push("progress"); }
    if (o.quiz) { db.exec("DELETE FROM quiz_results"); done.push("quiz"); }
    if (o.lookups) { db.exec("DELETE FROM lookup_history"); done.push("lookups"); }
    res.json({ ok: true, done });
  });

  // Admin đặt hạn mức số bé và/hoặc cấp premium (chat AI) cho 1 phụ huynh.
  app.put("/api/admin/users/:id", requireAdmin, (req, res) => {
    const body = req.body || {};
    if (body.studentLimit !== undefined) {
      const limit = Math.max(0, Math.min(50, Number(body.studentLimit)));
      if (Number.isNaN(limit)) return res.status(400).json({ error: "studentLimit không hợp lệ" });
      db.prepare("UPDATE users SET studentLimit = ? WHERE id = ?").run(limit, req.params.id);
    }
    if (body.isPremium !== undefined) {
      db.prepare("UPDATE users SET isPremium = ? WHERE id = ?").run(body.isPremium ? 1 : 0, req.params.id);
    }
    if (body.canEditImages !== undefined) {
      db.prepare("UPDATE users SET canEditImages = ? WHERE id = ?").run(body.canEditImages ? 1 : 0, req.params.id);
    }
    const row = db.prepare("SELECT id, studentLimit, isPremium, canEditImages FROM users WHERE id = ?").get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: "không có user" });
    res.json({ ok: true, studentLimit: row.studentLimit, isPremium: !!row.isPremium, canEditImages: !!row.canEditImages });
  });

  // ── Bảng xếp hạng: điểm TUẦN (mặc định) hoặc mọi thời gian, lọc theo cấp ──
  app.get("/api/leaderboard", requireAuth, (req, res) => {
    const period = String(req.query.period || "week");
    const level = String(req.query.level || "");
    const levelFilter = ["kids", "a1", "a2", "b1", "b2", "c1"].includes(level) ? "AND s.level = @level" : "";
    if (period === "all") {
      res.json(db.prepare(
        `SELECT s.id, s.name, s.avatar, s.level, COALESCE(s.xp,0) AS points, COALESCE(s.streak,0) AS streak
         FROM students s WHERE 1=1 ${levelFilter} ORDER BY points DESC, streak DESC, s.name LIMIT 50`
      ).all({ level }));
    } else {
      // Điểm kiếm trong tuần (từ sổ cái) -> bé mới vẫn có cơ hội đua.
      res.json(db.prepare(
        `SELECT s.id, s.name, s.avatar, s.level, COALESCE(s.streak,0) AS streak,
                COALESCE((SELECT SUM(points) FROM xp_events e WHERE e.studentId = s.id AND e.createdAt >= @wk), 0) AS points
         FROM students s WHERE 1=1 ${levelFilter}
         ORDER BY points DESC, streak DESC, s.name LIMIT 50`
      ).all({ wk: startOfWeek(), level }));
    }
  });

  // ── Nội dung (public) ──
  app.get("/api/topics", (_req, res) => {
    res.json(db.prepare(`SELECT * FROM topics ORDER BY "order"`).all());
  });
  app.get("/api/vocabulary", (req, res) => {
    const topicId = req.query.topicId ? String(req.query.topicId) : null;
    const rows = db.prepare("SELECT * FROM vocabulary").all() as any[];
    const words = rows.map(rowToWord);
    res.json(topicId ? words.filter((w) => w.topicIds.includes(topicId)) : words);
  });

  // ── Học sinh (theo tài khoản) ──
  app.get("/api/students", requireAuth, (req, res) => {
    const user = (req as any).user;
    const rows = user.role === "admin"
      ? db.prepare("SELECT * FROM students ORDER BY createdAt").all()
      : db.prepare("SELECT * FROM students WHERE parentId = ? ORDER BY createdAt").all(user.id);
    res.json(rows);
  });

  app.post("/api/students", requireAuth, (req, res) => {
    const user = (req as any).user;
    const { name, grade, avatar, dailyGoal, level } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "thiếu tên bé" });
    const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const lv = LEVELS.includes(level) ? level : "a1";
    if (user.role !== "admin") {
      const count = (db.prepare("SELECT COUNT(*) AS c FROM students WHERE parentId = ?").get(user.id) as any).c;
      if (count >= (user.studentLimit ?? 1)) {
        return res.status(403).json({ error: `Đã đạt giới hạn ${user.studentLimit ?? 1} bé. Liên hệ admin để tăng hạn mức.` });
      }
    }
    const row = {
      id: "student_" + randomUUID().slice(0, 8), parentId: user.id, name: String(name).trim(),
      grade: Number(grade) || 1, level: lv, avatar: avatar || "girl_avatar_01",
      dailyGoal: Number(dailyGoal) || 10, xp: 0, streak: 0, createdAt: Date.now(), lastActiveDate: null,
    };
    db.prepare(`INSERT INTO students (id,parentId,name,grade,level,avatar,dailyGoal,xp,streak,createdAt,lastActiveDate)
      VALUES (@id,@parentId,@name,@grade,@level,@avatar,@dailyGoal,@xp,@streak,@createdAt,@lastActiveDate)`).run(row);
    res.json(row);
  });

  app.put("/api/students/:id", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const { name, grade, avatar, dailyGoal, level } = req.body || {};
    const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const lv = LEVELS.includes(level) ? level : null;
    db.prepare("UPDATE students SET name=COALESCE(?,name), grade=COALESCE(?,grade), avatar=COALESCE(?,avatar), dailyGoal=COALESCE(?,dailyGoal), level=COALESCE(?,level) WHERE id=?")
      .run(name ?? null, grade ?? null, avatar ?? null, dailyGoal ?? null, lv, req.params.id);
    res.json(db.prepare("SELECT * FROM students WHERE id=?").get(req.params.id));
  });

  app.delete("/api/students/:id", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const id = req.params.id;
    db.prepare("DELETE FROM progress WHERE studentId=?").run(id);
    db.prepare("DELETE FROM quiz_results WHERE studentId=?").run(id);
    db.prepare("DELETE FROM lookup_history WHERE studentId=?").run(id);
    db.prepare("DELETE FROM students WHERE id=?").run(id);
    res.json({ ok: true });
  });

  app.get("/api/students/:id/progress", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    res.json(db.prepare("SELECT * FROM progress WHERE studentId = ?").all(req.params.id));
  });

  // HỌC TỰ DO: bé tự báo "Thuộc" / "Cần ôn" — KHÔNG cộng/trừ điểm, chỉ xếp từ vào diện thi.
  // (Giữ tên /answer + body {wordId, correct} để client cũ vẫn chạy; correct=true nghĩa là "Thuộc".)
  app.post("/api/students/:id/answer", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const studentId = req.params.id;
    const { wordId, correct } = req.body || {};
    if (!wordId) return res.status(400).json({ error: "thiếu wordId" });
    const known = !!correct;
    const prev = db.prepare("SELECT * FROM progress WHERE studentId = ? AND wordId = ?").get(studentId, wordId) as any;
    const now = Date.now();
    // Đã có điểm (scored) mà bé xem lại & báo thuộc -> giữ nguyên (thi lại theo lịch ôn, không hạ).
    const status = known ? (prev?.status === "scored" ? "scored" : "pending_test") : "relearn";
    const row = {
      studentId, wordId, status,
      mastery: known ? Math.max(1, prev?.mastery || 0) : (prev?.mastery || 0),
      correctCount: (prev?.correctCount || 0) + (known ? 1 : 0),
      wrongCount: (prev?.wrongCount || 0) + (known ? 0 : 1),
      lastReviewedAt: now,
      nextReviewAt: prev?.nextReviewAt || now,
      skillsPassed: prev?.skillsPassed || null,
    };
    db.prepare(
      `INSERT OR REPLACE INTO progress
        (studentId, wordId, status, mastery, correctCount, wrongCount, lastReviewedAt, nextReviewAt, skillsPassed)
       VALUES (@studentId, @wordId, @status, @mastery, @correctCount, @wrongCount, @lastReviewedAt, @nextReviewAt, @skillsPassed)`
    ).run(row);
    bumpStreak(studentId);
    res.json(row);
  });

  // Kho CHỜ THI (đã báo thuộc, chưa thi). Đủ 10 -> client nhắc thi.
  app.get("/api/students/:id/pending", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const rows = db.prepare("SELECT wordId FROM progress WHERE studentId=? AND status='pending_test' ORDER BY lastReviewedAt").all(req.params.id) as any[];
    res.json({ words: rows.map((r) => r.wordId), count: rows.length });
  });

  // Kho CẦN ÔN (bấm cần ôn / sai / rớt thi lại) — lặp học đến khi báo thuộc.
  app.get("/api/students/:id/relearn", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const rows = db.prepare("SELECT wordId FROM progress WHERE studentId=? AND status='relearn' ORDER BY lastReviewedAt").all(req.params.id) as any[];
    res.json({ words: rows.map((r) => r.wordId), count: rows.length });
  });

  // Từ đã có điểm tới hạn ôn -> cần THI LẠI kiểm tra trí nhớ.
  app.get("/api/students/:id/due-tests", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const now = req.query.now ? Number(req.query.now) : Date.now();
    const rows = db.prepare("SELECT wordId FROM progress WHERE studentId=? AND status='scored' AND nextReviewAt<=? ORDER BY nextReviewAt").all(req.params.id, now) as any[];
    res.json({ words: rows.map((r) => r.wordId), count: rows.length });
  });

  // Bắt đầu bài thi: server chọn từ + tạo đề + GIỮ đáp án trong phiên (không gửi đáp án write/speak).
  app.post("/api/students/:id/skill-test/start", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const studentId = req.params.id;
    const student = db.prepare("SELECT * FROM students WHERE id=?").get(studentId) as any;
    if (!student) return res.status(404).json({ error: "không có học sinh" });
    const mode = req.body?.mode === "review" ? "review" : "new";
    const now = Date.now();
    const picked = mode === "review"
      ? db.prepare("SELECT wordId FROM progress WHERE studentId=? AND status='scored' AND nextReviewAt<=? ORDER BY nextReviewAt LIMIT 10").all(studentId, now) as any[]
      : db.prepare("SELECT wordId FROM progress WHERE studentId=? AND status='pending_test' ORDER BY lastReviewedAt LIMIT 10").all(studentId) as any[];
    if (!picked.length) return res.status(400).json({ error: "chưa có từ để thi" });
    const ids = picked.map((r) => r.wordId);
    const rows = db.prepare(`SELECT * FROM vocabulary WHERE id IN (${ids.map(() => "?").join(",")})`).all(...ids) as any[];
    const allWords = (db.prepare("SELECT word FROM vocabulary").all() as any[]).map((r) => r.word);
    const skills = skillsForLevel(student.level);
    const needOptions = skills.some((s) => s === "listen_word" || s === "image_word");
    const items = rows.map((w) => ({
      wordId: w.id, word: w.word, phonetic: w.phonetic, meaning_vi: w.meaning_vi,
      imageUrl: w.imageUrl, audioUrl: w.audioUrl,
      options: needOptions ? buildOptions(w.word, allWords) : undefined,
    }));
    const key: Record<string, string> = {};
    for (const w of rows) key[w.id] = w.word;
    const sessionId = randomUUID();
    db.prepare("INSERT INTO skill_test_sessions (id, studentId, mode, level, itemsJson, keyJson, createdAt) VALUES (?,?,?,?,?,?,?)")
      .run(sessionId, studentId, mode, student.level, JSON.stringify(items), JSON.stringify(key), now);
    res.json({ sessionId, level: student.level, skills, items });
  });

  // Nộp bài: server chấm từng (từ, kỹ năng); kỹ năng mới qua +1, kỹ năng quên -1; cập nhật trạng thái.
  app.post("/api/students/:id/skill-test/submit", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const studentId = req.params.id;
    const { sessionId, answers } = req.body || {};
    const sess = db.prepare("SELECT * FROM skill_test_sessions WHERE id=? AND studentId=?").get(sessionId, studentId) as any;
    if (!sess) return res.status(404).json({ error: "phiên thi không tồn tại" });
    const key = JSON.parse(sess.keyJson) as Record<string, string>;
    const skills = skillsForLevel(sess.level);
    const ans: any[] = Array.isArray(answers) ? answers : [];
    const find = (wordId: string, skill: string) => ans.find((a) => a.wordId === wordId && a.skill === skill);
    const now = Date.now();
    const results: any[] = [];
    let totalDelta = 0;
    for (const wordId of Object.keys(key)) {
      const prev = db.prepare("SELECT * FROM progress WHERE studentId=? AND wordId=?").get(studentId, wordId) as any;
      const old: string[] = prev?.skillsPassed ? JSON.parse(prev.skillsPassed) : [];
      const newPassed: string[] = [];
      for (const skill of skills) {
        const a = find(wordId, skill);
        // Kỹ năng "nói" không có dịch vụ chấm (không gửi value) -> bỏ qua: giữ nguyên trạng thái cũ.
        const pass = (skill === "speak" && (a == null || a.value == null || a.value === "skip"))
          ? old.includes(skill)
          : gradeSkill(skill, a?.value, key[wordId]);
        if (pass) newPassed.push(skill);
      }
      const passed: string[] = [], lost: string[] = [];
      for (const skill of skills) {
        const isNew = newPassed.includes(skill);
        if (isNew && !old.includes(skill)) { awardXp(studentId, "skill_pass", 1, `${wordId}_${skill}`); passed.push(skill); totalDelta += 1; }
        else if (!isNew && old.includes(skill)) { deductXp(studentId, "skill_lose", 1, `${wordId}_${skill}`); lost.push(skill); totalDelta -= 1; }
      }
      const full = newPassed.length >= skills.length;
      const nr = nextReview(prev?.mastery ?? 0, full, now);
      db.prepare("UPDATE progress SET status=?, mastery=?, nextReviewAt=?, lastReviewedAt=?, skillsPassed=? WHERE studentId=? AND wordId=?")
        .run(full ? "scored" : "relearn", nr.mastery, nr.nextReviewAt, now, JSON.stringify(newPassed), studentId, wordId);
      results.push({ wordId, passed, lost, points: newPassed.length });
    }
    db.prepare("DELETE FROM skill_test_sessions WHERE id=?").run(sessionId);
    bumpStreak(studentId);
    res.json({ results, totalDelta });
  });

  app.get("/api/students/:id", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const s = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
    if (!s) return res.status(404).json({ error: "không có học sinh" });
    res.json(s);
  });

  app.get("/api/students/:id/reviews", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const now = req.query.now ? Number(req.query.now) : Date.now();
    res.json(
      db.prepare("SELECT * FROM progress WHERE studentId = ? AND nextReviewAt <= ?").all(req.params.id, now)
    );
  });

  app.get("/api/students/:id/lookups", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const rows = db.prepare(
      "SELECT query, type, meaning, phonetic, imageUrl, MAX(createdAt) AS createdAt FROM lookup_history WHERE studentId = ? AND saved = 1 GROUP BY query ORDER BY createdAt DESC LIMIT 100"
    ).all(req.params.id);
    res.json(rows);
  });

  app.post("/api/lookup", requireAuth, (req, res) => {
    const { studentId, query, type, saved, createdAt, meaning, phonetic, imageUrl } = req.body || {};
    if (!canAccessStudent(req, res, studentId)) return;
    db.prepare(
      `INSERT INTO lookup_history (studentId, query, type, saved, createdAt, meaning, phonetic, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(studentId, query, type, saved ? 1 : 0, createdAt ?? Date.now(), meaning ?? null, phonetic ?? null, imageUrl ?? null);
    res.json({ ok: true });
  });

  // ── Quiz ──
  app.get("/api/quiz", requireAuth, (req, res) => {
    const topicId = String(req.query.topicId || "");
    const count = Number(req.query.count || 10);
    const level = String(req.query.level || "");
    const ORDER = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const lr = ORDER.indexOf(level); // kế thừa: lấy từ ở cấp ≤ cấp chọn
    const rows = db.prepare("SELECT * FROM vocabulary").all() as any[];
    const words = rows
      .map(rowToWord)
      .filter((w) => w.topicIds.includes(topicId) && (!level || lr < 0 ? true : ORDER.indexOf(w.level) <= lr));
    res.json(buildQuiz(words, count));
  });

  app.get("/api/students/:id/quiz-results", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    res.json(
      db.prepare("SELECT * FROM quiz_results WHERE studentId = ? ORDER BY createdAt DESC").all(req.params.id)
    );
  });

  app.post("/api/quiz-results", requireAuth, (req, res) => {
    const r = req.body || {};
    if (!canAccessStudent(req, res, r.studentId)) return;
    db.prepare(
      `INSERT INTO quiz_results
        (studentId, topicId, score, totalQuestions, correctAnswers, wrongAnswers, wrongWordIds, durationSeconds, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      r.studentId, r.topicId, r.score, r.totalQuestions, r.correctAnswers, r.wrongAnswers,
      JSON.stringify(r.wrongWordIds ?? []), r.durationSeconds, r.createdAt ?? Date.now()
    );
    // Lưu lịch sử luyện tập (KHÔNG cộng điểm — điểm chỉ đến từ bài Thi kỹ năng).
    if (r.studentId) bumpStreak(r.studentId);
    res.json({ ok: true });
  });

  // ── Proxy ảnh (Pexels + fallback Unsplash) ──
  app.get("/api/image", async (req, res) => {
    const query = String(req.query.query || "").trim();
    const count = Math.min(Number(req.query.count || 5), 80); // Pexels per_page tối đa 80
    const page = Math.max(1, Number(req.query.page || 1));
    if (!query) return res.status(400).json({ error: "thiếu query" });
    try {
      let images = await fromPexels(query, count, page);
      if (images.length === 0) images = await fromUnsplash(query, count, page);
      res.json(images);
    } catch {
      res.status(502).json({ error: "image proxy lỗi" });
    }
  });

  // Bản đồ ảnh hiện tại từ DB (id -> url) để client áp đè ảnh build sẵn -> ảnh đổi hiện cho MỌI người.
  app.get("/api/images", (_req, res) => {
    const rows = db.prepare("SELECT id, imageUrl FROM vocabulary WHERE imageUrl IS NOT NULL AND imageUrl != ''").all() as { id: string; imageUrl: string }[];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.id] = r.imageUrl;
    res.json(map);
  });

  // ── Chọn/đổi ảnh cho 1 từ (admin hoặc user được cấp quyền sửa ảnh) ──
  app.post("/api/image-pick", requireAuth, (req, res) => {
    const u = (req as any).user;
    if (!u.canEditImages) return res.status(403).json({ error: "Bạn chưa được cấp quyền sửa ảnh." });
    const { wordId, url } = req.body || {};
    if (!wordId) return res.status(400).json({ error: "thiếu wordId" });
    const r = db.prepare("UPDATE vocabulary SET imageUrl = ? WHERE id = ?").run(url ?? "", wordId);
    if (r.changes === 0) return res.status(404).json({ error: "không có wordId" });
    regenerateSeedImages(); // cập nhật src/data/seedImages.ts -> app tự reload
    res.json({ ok: true, wordId, url: url ?? "" });
  });

  // ── Proxy dịch (MyMemory) 2 chiều + cache trong DB ──
  app.get("/api/translate", async (req, res) => {
    const text = String(req.query.text || "").trim();
    const from = String(req.query.from || "en") === "vi" ? "vi" : "en";
    const to = from === "vi" ? "en" : (String(req.query.to || "vi") === "en" ? "en" : "vi");
    if (!text) return res.status(400).json({ error: "thiếu text" });
    const cacheKey = `${from}|${to}|${text}`; // cache theo cả hướng dịch
    const cached = db.prepare("SELECT translation FROM translation_cache WHERE text = ?").get(cacheKey) as any;
    if (cached) return res.json({ translation: cached.translation });
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const r = await fetch(url);
      const data: any = await r.json();
      const translation = data?.responseData?.translatedText || "";
      db.prepare("INSERT OR REPLACE INTO translation_cache (text, translation) VALUES (?, ?)").run(cacheKey, translation);
      res.json({ translation });
    } catch {
      res.status(502).json({ error: "translate proxy lỗi" });
    }
  });

  // Chế độ chat: AI bật khi server có key VÀ user trả phí (premium). Còn lại -> kịch bản.
  app.get("/api/chat/status", requireAuth, (req, res) => {
    const keyOk = !!(process.env.DEEPSEEK_API_KEY || "");
    const u = (req as any).user;
    res.json({ enabled: keyOk && !!u.isPremium, premium: !!u.isPremium, configured: keyOk });
  });

  // ── Hội thoại AI (proxy DeepSeek, key ở server/.env, không lộ ra client) — chỉ user premium ──
  app.post("/api/chat", requireAuth, async (req, res) => {
    const key = process.env.DEEPSEEK_API_KEY || "";
    if (!key) return res.status(503).json({ error: "Chatbot chưa cấu hình (thiếu DEEPSEEK_API_KEY)." });
    const u = (req as any).user;
    if (!u.isPremium) return res.status(403).json({ error: "Chat AI dành cho tài khoản nâng cấp (premium)." });
    const { messages, level, scenario } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "thiếu messages" });

    const levelHint: Record<string, string> = {
      kids: "rất đơn giản, câu 3-6 từ", a1: "đơn giản, thì hiện tại", a2: "câu ngắn, từ vựng cơ bản",
      b1: "trung cấp", b2: "khá nâng cao", c1: "nâng cao, học thuật",
    };
    const sys = [
      "You are a friendly English tutor for a Vietnamese child learning English.",
      scenario ? `Role-play this situation: ${scenario}.` : "Have a simple, friendly conversation.",
      `Keep YOUR English replies short and at CEFR level ${level || "a1"} (${levelHint[level] || "simple"}).`,
      "Always answer in English first (1-2 sentences, stay in character).",
      "If the child's message has an English mistake, after your reply add a new line starting with '💡' giving a SHORT correction explained in Vietnamese (tiếng Việt). If no mistake, add '💡 Tốt lắm!'.",
      "Be encouraging and never use difficult words above the level.",
    ].join(" ");

    try {
      const r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages: [{ role: "system", content: sys }, ...messages.slice(-12)],
          temperature: 0.7, max_tokens: 220,
        }),
      });
      if (!r.ok) return res.status(502).json({ error: `DeepSeek lỗi ${r.status}` });
      const data: any = await r.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || "...";
      res.json({ reply });
    } catch {
      res.status(502).json({ error: "Không gọi được DeepSeek." });
    }
  });

  return app;
}

async function fromPexels(query: string, count = 5, page = 1) {
  const key = process.env.PEXELS_KEY || "";
  if (!key) return [];
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&page=${page}`, {
    headers: { Authorization: key },
  });
  if (!r.ok) return [];
  const data: any = await r.json();
  return (data.photos || []).map((p: any) => ({
    id: String(p.id), url: p.src.large, thumbUrl: p.src.tiny,
    photographer: p.photographer, sourceUrl: p.url,
  }));
}

async function fromUnsplash(query: string, count = 5, page = 1) {
  const key = process.env.UNSPLASH_KEY || "";
  if (!key) return [];
  const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&page=${page}`, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!r.ok) return [];
  const data: any = await r.json();
  return (data.results || []).map((p: any) => ({
    id: p.id, url: p.urls.regular, thumbUrl: p.urls.thumb,
    photographer: p.user.name, sourceUrl: p.links.html,
  }));
}
