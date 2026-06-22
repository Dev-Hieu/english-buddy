import cors from "cors";
import express from "express";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import { db, initSchema } from "./db.js";
import { generateStudentUsername, generateUsername, hashPassword, loginUser, registerUser, requireAdmin, requireAuth, verifyToken } from "./auth.js";
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
  const s = db.prepare("SELECT parentId, userId FROM students WHERE id = ?").get(studentId) as any;
  if (!s) { res.status(403).json({ error: "forbidden" }); return false; }
  // Parent hoặc student chính mình
  if (s.parentId === user?.id || s.userId === user?.id) return true;
  // Teacher có bé trong lớp mình
  if (user?.role === "teacher") {
    const inClass = db.prepare("SELECT 1 FROM class_students cs JOIN classes c ON c.id = cs.classId WHERE cs.studentId = ? AND c.teacherId = ?").get(studentId, user.id);
    if (inClass) return true;
  }
  res.status(403).json({ error: "forbidden" });
  return false;
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
  app.use(cors({ origin: process.env.CORS_ORIGIN || "https://en.vev.vn", credentials: true }));
  app.use(express.json());
  // Không cache phản hồi API -> client luôn nhận dữ liệu mới sau khi sửa hồ sơ/tiến độ.
  app.use("/api", (_req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.use(express.static(PUBLIC_DIR));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // Trang chọn ảnh cho phụ huynh.
  app.get("/picker", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "picker.html")));

  // ── Rate limit login (5 lần / phút / IP) ──
  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  function checkLoginRate(ip: string): boolean {
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (!entry || now > entry.resetAt) { loginAttempts.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
    entry.count++;
    return entry.count <= 5;
  }

  // ── Auth (đa người dùng: email + mật khẩu) ──
  app.post("/api/register", (req, res) => {
    const { email, password, name, inviteCode, role } = req.body || {};
    const result = registerUser(email, password, name, inviteCode, role);
    if ("error" in result) return res.status(400).json(result);
    res.json(result);
  });

  app.post("/api/login", (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkLoginRate(ip)) return res.status(429).json({ error: "Quá nhiều lần thử. Vui lòng đợi 1 phút." });
    const { email, password } = req.body || {};
    const result = loginUser(String(email || ""), String(password || ""));
    if (!result) return res.status(401).json({ error: "sai email hoặc mật khẩu" });
    res.json(result);
  });

  app.get("/api/me", requireAuth, (req, res) => res.json((req as any).user));

  // Cập nhật thông tin cá nhân
  app.put("/api/me", requireAuth, (req, res) => {
    const u = (req as any).user;
    const { name, phone, birthday, password } = req.body || {};
    if (name !== undefined) db.prepare("UPDATE users SET name = ? WHERE id = ?").run(String(name).trim(), u.id);
    if (phone !== undefined) db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(String(phone).trim() || null, u.id);
    if (birthday !== undefined) db.prepare("UPDATE users SET birthday = ? WHERE id = ?").run(String(birthday).trim() || null, u.id);
    if (password && String(password).length >= 4) db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?").run(hashPassword(String(password)), u.id);
    const updated = db.prepare("SELECT id, email, username, name, role, status, phone, birthday, isPremium, canEditImages, studentLimit FROM users WHERE id = ?").get(u.id);
    res.json(updated);
  });

  // Đổi tên đăng nhập (chỉ premium hoặc admin)
  app.put("/api/me/username", requireAuth, (req, res) => {
    const u = (req as any).user;
    if (!u.isPremium && u.role !== "admin") return res.status(403).json({ error: "Chỉ tài khoản Premium được đổi tên đăng nhập" });
    const { username } = req.body || {};
    const un = String(username || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    if (un.length < 3) return res.status(400).json({ error: "Tên đăng nhập tối thiểu 3 ký tự (a-z, 0-9, dấu chấm)" });
    const exists = db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").get(un, u.id);
    if (exists) return res.status(400).json({ error: "Tên đăng nhập đã được dùng" });
    db.prepare("UPDATE users SET username = ? WHERE id = ?").run(un, u.id);
    res.json({ ok: true, username: un });
  });

  // ── Admin: quản lý người dùng ──
  app.get("/api/admin/users", requireAdmin, (_req, res) => {
    const rows = db.prepare(`
      SELECT u.id, u.email, u.username, u.name, u.role, u.status, u.phone, u.birthday, u.createdAt, u.studentLimit, u.isPremium, u.canEditImages,
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
    const uid = req.params.id;
    if (body.name !== undefined) db.prepare("UPDATE users SET name = ? WHERE id = ?").run(String(body.name).trim(), uid);
    if (body.email !== undefined) {
      const em = String(body.email).trim().toLowerCase();
      const dup = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(em, uid);
      if (dup) return res.status(409).json({ error: "Email đã được dùng" });
      db.prepare("UPDATE users SET email = ? WHERE id = ?").run(em, uid);
    }
    if (body.username !== undefined) {
      const un = String(body.username).trim();
      if (un.length >= 2) {
        const dup = db.prepare("SELECT id FROM users WHERE LOWER(username) = ? AND id != ?").get(un.toLowerCase(), uid);
        if (dup) return res.status(409).json({ error: "Tên đăng nhập đã được dùng" });
        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(un, uid);
      }
    }
    if (body.role !== undefined && ["parent", "teacher", "admin", "student"].includes(body.role)) {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(body.role, uid);
    }
    if (body.password !== undefined && String(body.password).length >= 4) {
      db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?").run(hashPassword(String(body.password)), uid);
    }
    if (body.studentLimit !== undefined) {
      db.prepare("UPDATE users SET studentLimit = ? WHERE id = ?").run(Math.max(0, Math.min(200, Number(body.studentLimit) || 0)), uid);
    }
    if (body.isPremium !== undefined) db.prepare("UPDATE users SET isPremium = ? WHERE id = ?").run(body.isPremium ? 1 : 0, uid);
    if (body.canEditImages !== undefined) db.prepare("UPDATE users SET canEditImages = ? WHERE id = ?").run(body.canEditImages ? 1 : 0, uid);
    if (body.phone !== undefined) db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(String(body.phone).trim() || null, uid);
    if (body.birthday !== undefined) db.prepare("UPDATE users SET birthday = ? WHERE id = ?").run(String(body.birthday).trim() || null, uid);
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(uid) as any;
    if (!row) return res.status(404).json({ error: "không có user" });
    res.json({ ok: true });
  });

  // Admin tạo user mới
  app.post("/api/admin/users", requireAdmin, (req, res) => {
    const { email, password, name, role, studentLimit, isPremium, phone, birthday } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "thiếu email hoặc password" });
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(String(email));
    if (existing) return res.status(409).json({ error: "email đã tồn tại" });
    const id = randomUUID();
    const r = ["admin", "parent", "teacher", "student"].includes(role) ? role : "parent";
    const uname = generateUsername(r);
    const user = {
      id, email: String(email).trim(), username: uname, passwordHash: hashPassword(String(password)),
      name: String(name || "").trim() || null, role: r,
      createdAt: Date.now(), studentLimit: Number(studentLimit) || 1, isPremium: isPremium ? 1 : 0, status: "active",
      phone: String(phone || "").trim() || null, birthday: String(birthday || "").trim() || null,
    };
    db.prepare(`INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, isPremium, status, phone, birthday)
      VALUES (@id, @email, @username, @passwordHash, @name, @role, @createdAt, @studentLimit, @isPremium, @status, @phone, @birthday)`).run(user);
    res.json({ ...user, passwordHash: undefined });
  });

  // Admin xoá user + dữ liệu liên quan
  app.delete("/api/admin/users/:id", requireAdmin, (req, res) => {
    const uid = req.params.id;
    if (uid === (req as any).user.id) return res.status(400).json({ error: "không thể xoá chính mình" });
    const studentIds = (db.prepare("SELECT id FROM students WHERE parentId = ?").all(uid) as any[]).map(r => r.id);
    for (const sid of studentIds) {
      db.prepare("DELETE FROM progress WHERE studentId = ?").run(sid);
      db.prepare("DELETE FROM xp_events WHERE studentId = ?").run(sid);
      db.prepare("DELETE FROM quiz_results WHERE studentId = ?").run(sid);
      db.prepare("DELETE FROM lookup_history WHERE studentId = ?").run(sid);
      db.prepare("DELETE FROM skill_test_sessions WHERE studentId = ?").run(sid);
    }
    db.prepare("DELETE FROM students WHERE parentId = ?").run(uid);
    db.prepare("DELETE FROM users WHERE id = ?").run(uid);
    res.json({ ok: true });
  });

  // Admin tạo student trực tiếp (không cần parent)
  app.post("/api/admin/create-student", requireAdmin, (req, res) => {
    const { name, grade, level, avatar, dailyGoal, email, password, birthday } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "thiếu tên bé" });
    const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const lv = LEVELS.includes(level) ? level : "a1";
    let parentId = "classroom";
    let loginInfo: any = null;
    if (email && password) {
      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(String(email));
      if (existing) return res.status(409).json({ error: "email đã tồn tại" });
      const uid = randomUUID();
      const uname = generateStudentUsername();
      db.prepare(`INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, isPremium, status)
        VALUES (?, ?, ?, ?, ?, 'student', ?, 1, 0, 'active')`).run(uid, String(email).trim(), uname, hashPassword(String(password)), String(name).trim(), Date.now());
      parentId = uid;
      loginInfo = { email: String(email).trim(), username: uname, userId: uid };
    }
    const student = {
      id: "student_" + randomUUID().slice(0, 8), parentId, name: String(name).trim(),
      grade: Number(grade) || 1, level: lv, avatar: avatar || "girl_avatar_01",
      dailyGoal: Number(dailyGoal) || 10, xp: 0, streak: 0, createdAt: Date.now(), lastActiveDate: null,
      birthday: String(birthday || "").trim() || null,
    };
    db.prepare(`INSERT INTO students (id,parentId,name,grade,level,avatar,dailyGoal,xp,streak,createdAt,lastActiveDate,birthday)
      VALUES (@id,@parentId,@name,@grade,@level,@avatar,@dailyGoal,@xp,@streak,@createdAt,@lastActiveDate,@birthday)`).run(student);
    res.json({ student, loginInfo });
  });

  // Admin: list ALL students with parent info
  app.get("/api/admin/students", requireAdmin, (_req, res) => {
    const rows = db.prepare(`
      SELECT s.*, u.name AS parentName, u.email AS parentEmail, u.username AS parentUsername, u.role AS parentRole,
             su.username AS studentUsername, su.email AS studentEmail, su.phone AS studentPhone
      FROM students s
      LEFT JOIN users u ON u.id = s.parentId
      LEFT JOIN users su ON su.id = s.userId
      ORDER BY s.createdAt DESC
    `).all();
    res.json(rows);
  });

  // Admin xoá student + dữ liệu liên quan
  app.delete("/api/admin/students/:id", requireAdmin, (req, res) => {
    const sid = req.params.id;
    db.prepare("DELETE FROM progress WHERE studentId = ?").run(sid);
    db.prepare("DELETE FROM xp_events WHERE studentId = ?").run(sid);
    db.prepare("DELETE FROM quiz_results WHERE studentId = ?").run(sid);
    db.prepare("DELETE FROM lookup_history WHERE studentId = ?").run(sid);
    db.prepare("DELETE FROM skill_test_sessions WHERE studentId = ?").run(sid);
    db.prepare("DELETE FROM students WHERE id = ?").run(sid);
    res.json({ ok: true });
  });

  // Admin cập nhật student
  app.put("/api/admin/students/:id", requireAdmin, (req, res) => {
    const { name, grade, level, avatar, dailyGoal } = req.body || {};
    const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const sets: string[] = [];
    const params: any = { id: req.params.id };
    if (name !== undefined) { sets.push("name = @name"); params.name = String(name).trim(); }
    if (grade !== undefined) { sets.push("grade = @grade"); params.grade = Number(grade) || 1; }
    if (level !== undefined && LEVELS.includes(level)) { sets.push("level = @level"); params.level = level; }
    if (avatar !== undefined) { sets.push("avatar = @avatar"); params.avatar = avatar; }
    if (dailyGoal !== undefined) { sets.push("dailyGoal = @dailyGoal"); params.dailyGoal = Number(dailyGoal) || 10; }
    if (req.body.birthday !== undefined) { sets.push("birthday = @birthday"); params.birthday = String(req.body.birthday).trim() || null; }
    if (sets.length === 0) return res.status(400).json({ error: "không có gì để cập nhật" });
    db.prepare(`UPDATE students SET ${sets.join(", ")} WHERE id = @id`).run(params);
    const row = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "không có student" });
    res.json(row);
  });

  // Admin: tạo/cập nhật tài khoản đăng nhập cho học sinh đã có
  app.post("/api/admin/students/:id/account", requireAdmin, (req, res) => {
    const { username, password, email, phone } = req.body || {};
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id) as any;
    if (!student) return res.status(404).json({ error: "không tìm thấy học sinh" });

    if (student.parentId === "classroom" || !student.parentId) {
      // Chưa có TK → tạo mới
      if (!password || String(password).length < 4) return res.status(400).json({ error: "Mật khẩu tối thiểu 4 ký tự" });
      const uid = randomUUID();
      const uname = username?.trim() || generateStudentUsername();
      const dupUn = db.prepare("SELECT id FROM users WHERE LOWER(username) = ?").get(uname.toLowerCase());
      if (dupUn) return res.status(409).json({ error: "Tên đăng nhập đã được dùng" });
      const em = email?.trim() || `${uname.toLowerCase()}@student.local`;
      db.prepare("INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, status) VALUES (?, ?, ?, ?, ?, 'student', ?, 1, 'active')")
        .run(uid, em, uname, hashPassword(String(password)), student.name, Date.now());
      db.prepare("UPDATE students SET parentId = ? WHERE id = ?").run(uid, student.id);
      res.json({ ok: true, username: uname, email: em, created: true });
    } else {
      // Đã có TK → cập nhật username/password/email
      const userId = student.userId || student.parentId;
      if (username?.trim()) {
        const un = String(username).trim();
        const dup = db.prepare("SELECT id FROM users WHERE LOWER(username) = ? AND id != ?").get(un.toLowerCase(), userId);
        if (dup) return res.status(409).json({ error: "Tên đăng nhập đã được dùng" });
        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(un, userId);
      }
      if (email !== undefined) {
        const em = String(email).trim().toLowerCase();
        if (em) {
          const dup = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(em, userId);
          if (dup) return res.status(409).json({ error: "Email đã được dùng" });
          db.prepare("UPDATE users SET email = ? WHERE id = ?").run(em, userId);
        }
      }
      if (phone !== undefined) {
        db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(String(phone).trim() || null, userId);
      }
      if (password && String(password).length >= 4) {
        db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?").run(hashPassword(String(password)), userId);
      }
      res.json({ ok: true, updated: true });
    }
  });

  // ── Invite codes ──
  app.get("/api/admin/invite-codes", requireAdmin, (_req, res) => {
    res.json(db.prepare("SELECT * FROM invite_codes ORDER BY createdAt DESC").all());
  });
  app.post("/api/admin/invite-codes", requireAdmin, (req, res) => {
    const { type, classId, maxUses, expiresAt } = req.body || {};
    if (!type || !["invite", "class"].includes(type)) return res.status(400).json({ error: "type phải là invite hoặc class" });
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    db.prepare("INSERT INTO invite_codes (code, type, classId, maxUses, createdBy, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(code, type, classId || null, maxUses || (type === "class" ? 50 : 1), (req as any).user.id, Date.now(), expiresAt || null);
    res.json({ ok: true, code });
  });
  app.delete("/api/admin/invite-codes/:code", requireAdmin, (req, res) => {
    db.prepare("DELETE FROM invite_codes WHERE code = ?").run(req.params.code);
    res.json({ ok: true });
  });

  // Admin: approve/reject user
  app.put("/api/admin/users/:id/status", requireAdmin, (req, res) => {
    const { status } = req.body || {};
    if (!["active", "pending", "rejected"].includes(status)) return res.status(400).json({ error: "status không hợp lệ" });
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ ok: true, status });
  });

  // ── Classes (admin CRUD) ──
  app.get("/api/admin/classes", requireAdmin, (_req, res) => {
    const rows = db.prepare(`
      SELECT c.*, u.name AS teacherName, u.email AS teacherEmail,
             (SELECT COUNT(*) FROM class_students cs WHERE cs.classId = c.id) AS studentCount
      FROM classes c LEFT JOIN users u ON u.id = c.teacherId
      ORDER BY c.createdAt DESC
    `).all();
    res.json(rows);
  });
  app.post("/api/admin/classes", requireAdmin, (req, res) => {
    const { name, teacherId, grade, level } = req.body || {};
    if (!name) return res.status(400).json({ error: "thiếu tên lớp" });
    const id = randomUUID();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    db.prepare("INSERT INTO classes (id, name, teacherId, code, grade, level, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, name, teacherId || null, code, grade || null, level || null, Date.now());
    res.json({ ok: true, id, code });
  });
  app.put("/api/admin/classes/:id", requireAdmin, (req, res) => {
    const { name, teacherId, grade, level } = req.body || {};
    const sets: string[] = []; const params: any = { id: req.params.id };
    if (name !== undefined) { sets.push("name = @name"); params.name = name; }
    if (teacherId !== undefined) { sets.push("teacherId = @teacherId"); params.teacherId = teacherId || null; }
    if (grade !== undefined) { sets.push("grade = @grade"); params.grade = grade; }
    if (level !== undefined) { sets.push("level = @level"); params.level = level; }
    if (!sets.length) return res.status(400).json({ error: "không có gì cập nhật" });
    db.prepare(`UPDATE classes SET ${sets.join(", ")} WHERE id = @id`).run(params);
    res.json({ ok: true });
  });
  app.delete("/api/admin/classes/:id", requireAdmin, (req, res) => {
    db.prepare("DELETE FROM class_students WHERE classId = ?").run(req.params.id);
    db.prepare("DELETE FROM classes WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  // Add/remove students from class
  app.post("/api/admin/classes/:id/students", requireAdmin, (req, res) => {
    const { studentId } = req.body || {};
    if (!studentId) return res.status(400).json({ error: "thiếu studentId" });
    db.prepare("INSERT OR IGNORE INTO class_students (classId, studentId, joinedAt) VALUES (?, ?, ?)").run(req.params.id, studentId, Date.now());
    res.json({ ok: true });
  });
  app.delete("/api/admin/classes/:id/students/:studentId", requireAdmin, (req, res) => {
    db.prepare("DELETE FROM class_students WHERE classId = ? AND studentId = ?").run(req.params.id, req.params.studentId);
    res.json({ ok: true });
  });
  // Students in a class
  app.get("/api/admin/classes/:id/students", requireAdmin, (req, res) => {
    const rows = db.prepare(`
      SELECT s.*, u.name AS parentName, u.email AS parentEmail
      FROM class_students cs
      JOIN students s ON s.id = cs.studentId
      LEFT JOIN users u ON u.id = s.parentId
      WHERE cs.classId = ?
      ORDER BY s.name
    `).all(req.params.id);
    res.json(rows);
  });

  // Notifications
  app.get("/api/admin/notifications", requireAdmin, (_req, res) => {
    res.json(db.prepare("SELECT * FROM notifications ORDER BY createdAt DESC").all());
  });
  app.post("/api/admin/notifications", requireAdmin, (req, res) => {
    const { title, message, expiresAt } = req.body || {};
    if (!title || !message) return res.status(400).json({ error: "thiếu title hoặc message" });
    db.prepare("INSERT INTO notifications (title, message, createdBy, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?)")
      .run(title, message, (req as any).user.id, Date.now(), expiresAt || null);
    res.json({ ok: true });
  });
  app.delete("/api/admin/notifications/:id", requireAdmin, (req, res) => {
    db.prepare("DELETE FROM notifications WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });
  // Public: active notifications for students
  app.get("/api/notifications", (_req, res) => {
    res.json(db.prepare("SELECT id, title, message, createdAt FROM notifications WHERE expiresAt IS NULL OR expiresAt > ? ORDER BY createdAt DESC LIMIT 5").all(Date.now()));
  });

  // ── Teacher endpoints (xem lớp mình, quản lý bé trong lớp) ──
  const requireTeacher = (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      const role = (req as any).user?.role;
      if (role !== "teacher" && role !== "admin") { res.status(403).json({ error: "forbidden" }); return; }
      next();
    });
  };

  // Teacher: danh sách lớp của mình
  app.get("/api/teacher/classes", requireTeacher, (req, res) => {
    const uid = (req as any).user.id;
    const role = (req as any).user.role;
    const rows = role === "admin"
      ? db.prepare("SELECT c.*, (SELECT COUNT(*) FROM class_students cs WHERE cs.classId = c.id) AS studentCount FROM classes c ORDER BY c.name").all()
      : db.prepare("SELECT c.*, (SELECT COUNT(*) FROM class_students cs WHERE cs.classId = c.id) AS studentCount FROM classes c WHERE c.teacherId = ? ORDER BY c.name").all(uid);
    res.json(rows);
  });

  // Teacher: HS trong lớp
  app.get("/api/teacher/classes/:id/students", requireTeacher, (req, res) => {
    const uid = (req as any).user.id;
    const role = (req as any).user.role;
    // Check teacher owns this class (or is admin)
    if (role !== "admin") {
      const cls = db.prepare("SELECT id FROM classes WHERE id = ? AND teacherId = ?").get(req.params.id, uid);
      if (!cls) return res.status(403).json({ error: "không phải lớp của bạn" });
    }
    const rows = db.prepare(`
      SELECT s.id, s.name, s.grade, s.level, s.avatar, s.xp, s.streak, s.dailyGoal,
             (SELECT COUNT(*) FROM progress p WHERE p.studentId = s.id AND p.status = 'scored') AS vocabCount
      FROM class_students cs JOIN students s ON s.id = cs.studentId
      WHERE cs.classId = ? ORDER BY s.name
    `).all(req.params.id);
    res.json(rows);
  });

  // Teacher: thêm bé vào lớp
  app.post("/api/teacher/classes/:id/students", requireTeacher, (req, res) => {
    const uid = (req as any).user.id;
    const role = (req as any).user.role;
    if (role !== "admin") {
      const cls = db.prepare("SELECT id FROM classes WHERE id = ? AND teacherId = ?").get(req.params.id, uid);
      if (!cls) return res.status(403).json({ error: "không phải lớp của bạn" });
    }
    const { studentId } = req.body || {};
    if (!studentId) return res.status(400).json({ error: "thiếu studentId" });
    db.prepare("INSERT OR IGNORE INTO class_students (classId, studentId, joinedAt) VALUES (?, ?, ?)").run(req.params.id, studentId, Date.now());
    res.json({ ok: true });
  });

  // Teacher: xoá bé khỏi lớp
  app.delete("/api/teacher/classes/:id/students/:studentId", requireTeacher, (req, res) => {
    const uid = (req as any).user.id;
    const role = (req as any).user.role;
    if (role !== "admin") {
      const cls = db.prepare("SELECT id FROM classes WHERE id = ? AND teacherId = ?").get(req.params.id, uid);
      if (!cls) return res.status(403).json({ error: "không phải lớp của bạn" });
    }
    db.prepare("DELETE FROM class_students WHERE classId = ? AND studentId = ?").run(req.params.id, req.params.studentId);
    res.json({ ok: true });
  });

  // Teacher: đặt mục tiêu cho bé (chỉ bé trong lớp mình)
  app.put("/api/teacher/students/:id/goal", requireTeacher, (req, res) => {
    const { dailyGoal } = req.body || {};
    const teacher = (req as any).user;
    if (!dailyGoal) return res.status(400).json({ error: "thiếu dailyGoal" });
    // Admin bypass, teacher phải check class ownership
    if (teacher.role !== "admin") {
      const inClass = db.prepare("SELECT 1 FROM class_students cs JOIN classes c ON c.id = cs.classId WHERE cs.studentId = ? AND c.teacherId = ?").get(req.params.id, teacher.id);
      if (!inClass) return res.status(403).json({ error: "Không có quyền" });
    }
    db.prepare("UPDATE students SET dailyGoal = ? WHERE id = ?").run(Number(dailyGoal), req.params.id);
    res.json({ ok: true });
  });

  // Online: students active today (lastActiveDate = today's date string)
  app.get("/api/admin/online", requireAdmin, (_req, res) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const rows = db.prepare(`
      SELECT s.id, s.name, s.avatar, s.level, s.grade,
             (SELECT MAX(p.lastReviewedAt) FROM progress p WHERE p.studentId = s.id) AS lastSeen
      FROM students s
      WHERE s.lastActiveDate = ?
      ORDER BY lastSeen DESC
    `).all(todayStr);
    res.json({ count: rows.length, students: rows });
  });

  // Admin: reports
  app.get("/api/admin/reports", requireAdmin, (_req, res) => {
    const totalStudents = (db.prepare("SELECT COUNT(*) AS c FROM students").get() as any).c;
    const activeToday = (db.prepare("SELECT COUNT(DISTINCT studentId) AS c FROM progress WHERE lastReviewedAt > ?").get(Date.now() - 86400000) as any).c;
    const totalWords = (db.prepare("SELECT COUNT(*) AS c FROM vocabulary").get() as any).c;
    const avgXp = (db.prepare("SELECT AVG(COALESCE(xp,0)) AS a FROM students").get() as any).a || 0;
    const topStudents = db.prepare("SELECT s.name, s.xp, s.streak, s.level, s.avatar, (SELECT COUNT(*) FROM progress p WHERE p.studentId = s.id AND p.status = 'scored') AS vocabCount FROM students s ORDER BY s.xp DESC LIMIT 10").all();
    const levelDist = db.prepare("SELECT level, COUNT(*) AS count FROM students GROUP BY level ORDER BY level").all();
    const recentQuizzes = db.prepare("SELECT q.score, q.createdAt, s.name AS studentName FROM quiz_results q JOIN students s ON s.id = q.studentId ORDER BY q.createdAt DESC LIMIT 10").all();
    res.json({ totalStudents, activeToday, totalWords, avgXp: Math.round(avgXp), topStudents, levelDist, recentQuizzes });
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
    const q = `SELECT s.*, su.username AS studentUsername, su.email AS studentEmail, su.phone AS studentPhone
      FROM students s LEFT JOIN users su ON su.id = s.userId`;
    const rows = user.role === "admin"
      ? db.prepare(`${q} ORDER BY s.createdAt`).all()
      : db.prepare(`${q} WHERE s.parentId = ? OR s.userId = ? ORDER BY s.createdAt`).all(user.id, user.id);
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
    // Tự tạo TK đăng nhập riêng cho bé (role=student, HS username)
    const studentUid = randomUUID();
    const studentUsername = generateStudentUsername();
    const studentPassword = "123456";
    const studentEmail = `${studentUsername.toLowerCase()}@student.local`;
    db.prepare("INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, status) VALUES (?, ?, ?, ?, ?, 'student', ?, 1, 'active')")
      .run(studentUid, studentEmail, studentUsername, hashPassword(studentPassword), String(name).trim(), Date.now());

    const row = {
      id: "student_" + randomUUID().slice(0, 8), parentId: user.id, name: String(name).trim(),
      grade: Number(grade) || 1, level: lv, avatar: avatar || "girl_avatar_01",
      dailyGoal: Number(dailyGoal) || 10, xp: 0, streak: 0, createdAt: Date.now(), lastActiveDate: null,
      userId: studentUid,
    };
    db.prepare(`INSERT INTO students (id,parentId,name,grade,level,avatar,dailyGoal,xp,streak,createdAt,lastActiveDate,userId)
      VALUES (@id,@parentId,@name,@grade,@level,@avatar,@dailyGoal,@xp,@streak,@createdAt,@lastActiveDate,@userId)`).run(row);
    res.json({ ...row, studentUsername, studentPassword });
  });

  app.put("/api/students/:id", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const { name, grade, avatar, dailyGoal, level, birthday } = req.body || {};
    const LEVELS = ["kids", "a1", "a2", "b1", "b2", "c1"];
    const lv = LEVELS.includes(level) ? level : null;
    db.prepare("UPDATE students SET name=COALESCE(?,name), grade=COALESCE(?,grade), avatar=COALESCE(?,avatar), dailyGoal=COALESCE(?,dailyGoal), level=COALESCE(?,level), birthday=COALESCE(?,birthday) WHERE id=?")
      .run(name ?? null, grade ?? null, avatar ?? null, dailyGoal ?? null, lv, birthday !== undefined ? (String(birthday).trim() || null) : null, req.params.id);
    res.json(db.prepare("SELECT * FROM students WHERE id=?").get(req.params.id));
  });

  // Parent/teacher: quản lý TK đăng nhập của bé (tương tự admin endpoint)
  app.post("/api/students/:id/account", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const { username, password, email, phone } = req.body || {};
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id) as any;
    if (!student) return res.status(404).json({ error: "Không tìm thấy học sinh" });

    const userId = student.userId || (student.parentId !== "classroom" ? student.parentId : null);
    if (!userId || userId === "classroom") {
      // Chưa có TK → tạo mới
      if (!password || String(password).length < 4) return res.status(400).json({ error: "Mật khẩu tối thiểu 4 ký tự" });
      const uid = randomUUID();
      const uname = username?.trim() || generateStudentUsername();
      const dup = db.prepare("SELECT id FROM users WHERE LOWER(username) = ?").get(uname.toLowerCase());
      if (dup) return res.status(409).json({ error: "Tên đăng nhập đã được dùng" });
      const em = email?.trim() || `${uname.toLowerCase()}@student.local`;
      db.prepare("INSERT INTO users (id, email, username, passwordHash, name, role, createdAt, studentLimit, status, phone) VALUES (?, ?, ?, ?, ?, 'student', ?, 1, 'active', ?)")
        .run(uid, em, uname, hashPassword(String(password)), student.name, Date.now(), phone?.trim() || null);
      db.prepare("UPDATE students SET userId = ? WHERE id = ?").run(uid, student.id);
      res.json({ ok: true, username: uname, email: em, created: true });
    } else {
      // Đã có TK → cập nhật
      if (username?.trim()) {
        const un = String(username).trim();
        const dup = db.prepare("SELECT id FROM users WHERE LOWER(username) = ? AND id != ?").get(un.toLowerCase(), userId);
        if (dup) return res.status(409).json({ error: "Tên đăng nhập đã được dùng" });
        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(un, userId);
      }
      if (email !== undefined) {
        const em = String(email).trim().toLowerCase();
        if (em) {
          const dup = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(em, userId);
          if (dup) return res.status(409).json({ error: "Email đã được dùng" });
          db.prepare("UPDATE users SET email = ? WHERE id = ?").run(em, userId);
        }
      }
      if (phone !== undefined) db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(String(phone).trim() || null, userId);
      if (password && String(password).length >= 4) db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?").run(hashPassword(String(password)), userId);
      // Trả thông tin TK hiện tại
      const u = db.prepare("SELECT username, email, phone FROM users WHERE id = ?").get(userId) as any;
      res.json({ ok: true, updated: true, username: u?.username, email: u?.email, phone: u?.phone });
    }
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

  // Xoá từ khỏi My Words (unsave)
  app.delete("/api/students/:id/lookups/:query", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    db.prepare("UPDATE lookup_history SET saved = 0 WHERE studentId = ? AND query = ?").run(req.params.id, req.params.query);
    res.json({ ok: true });
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

  // ── Tra từ chi tiết (DeepSeek AI) — nghĩa VN phong phú, ví dụ, từ đồng/trái nghĩa ──
  app.get("/api/word-detail", async (req, res) => {
    const word = String(req.query.word || "").trim().toLowerCase();
    if (!word) return res.status(400).json({ error: "thiếu word" });
    const cacheKey = `wd|${word}`;
    const cached = db.prepare("SELECT translation FROM translation_cache WHERE text = ?").get(cacheKey) as any;
    if (cached) { try { return res.json(JSON.parse(cached.translation)); } catch { /* regenerate */ } }

    const dsKey = process.env.DEEPSEEK_API_KEY || "";
    if (!dsKey) return res.status(503).json({ error: "chưa cấu hình AI" });

    try {
      const r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${dsKey}` },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages: [
            { role: "system", content: `You are an English-Vietnamese dictionary for Vietnamese learners. Given an English word, return a JSON object with:
- "vi": array of Vietnamese meanings covering ALL common senses (e.g. for "nice": ["tốt bụng, tử tế", "dễ chịu", "ngon", "đẹp, hay"]). Each meaning should note which context it applies to.
- "pos": array of parts of speech commonly used in modern English. Skip very rare usages (e.g. "nice" as a noun is extremely rare — omit it).
- "examples": array of example sentences. IMPORTANT: include at least one example for EACH part of speech listed in "pos". Format: {"en":"...","vi":"...","pos":"adjective"}. For words with 2+ POS, provide 3-4 examples total to cover all POS.
- "synonyms": array of 3-5 common synonyms
- "antonyms": array of 1-3 common antonyms (empty array if none)
- "note": a short tip in Vietnamese for Vietnamese learners about common mistakes, usage differences, or collocations (1-2 sentences)
Return ONLY valid JSON, no markdown, no code fences.` },
            { role: "user", content: word },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });
      const data: any = await r.json();
      const raw = (data?.choices?.[0]?.message?.content || "").trim();
      const detail = JSON.parse(raw);
      db.prepare("INSERT OR REPLACE INTO translation_cache (text, translation) VALUES (?, ?)").run(cacheKey, JSON.stringify(detail));
      res.json(detail);
    } catch {
      res.status(502).json({ error: "AI lỗi" });
    }
  });

  // ── Dịch câu 2 chiều: premium → DeepSeek AI (chính xác), free → Google Translate ──
  // Hỗ trợ cả có auth (biết premium) lẫn không auth (mặc định free).
  app.get("/api/translate", async (req, res) => {
    const text = String(req.query.text || "").trim();
    const from = String(req.query.from || "en") === "vi" ? "vi" : "en";
    const to = from === "vi" ? "en" : (String(req.query.to || "vi") === "en" ? "en" : "vi");
    if (!text) return res.status(400).json({ error: "thiếu text" });

    // Xác định premium: verify token HMAC trước khi tin userId
    let isPremium = false;
    const auth = req.headers.authorization?.replace("Bearer ", "") || "";
    if (auth) {
      const uid = verifyToken(auth);
      if (uid) {
        const u = db.prepare("SELECT isPremium FROM users WHERE id = ?").get(uid) as any;
        if (u?.isPremium) isPremium = true;
      }
    }

    const engine = isPremium ? "ds" : "gt";
    const cacheKey = `${engine}|${from}|${to}|${text}`;
    const cached = db.prepare("SELECT translation FROM translation_cache WHERE text = ?").get(cacheKey) as any;
    if (cached) return res.json({ translation: cached.translation, engine });

    let translation = "";

    if (isPremium) {
      // DeepSeek AI — dịch chính xác (premium)
      const dsKey = process.env.DEEPSEEK_API_KEY || "";
      if (dsKey) {
        try {
          const langName: Record<string, string> = { en: "English", vi: "Vietnamese" };
          const r = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${dsKey}` },
            body: JSON.stringify({
              model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
              messages: [
                { role: "system", content: `You are a translator. Translate from ${langName[from]} to ${langName[to]}. Return ONLY the translation, nothing else. Be accurate and natural.` },
                { role: "user", content: text },
              ],
              temperature: 0.3,
              max_tokens: 500,
            }),
          });
          const data: any = await r.json();
          translation = (data?.choices?.[0]?.message?.content || "").trim();
        } catch { /* fallback below */ }
      }
    }

    // Google Translate (miễn phí, chất lượng cao) — dùng cho free hoặc fallback khi DeepSeek lỗi
    if (!translation) {
      try {
        const { default: translate } = await import("google-translate-api-x") as any;
        const r = await translate(text, { from, to });
        translation = r?.text || "";
      } catch { /* bỏ qua */ }
    }

    if (!translation) return res.status(502).json({ error: "translate proxy lỗi" });
    db.prepare("INSERT OR REPLACE INTO translation_cache (text, translation) VALUES (?, ?)").run(cacheKey, translation);
    res.json({ translation, engine });
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
