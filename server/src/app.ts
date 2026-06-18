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

// Cập nhật chuỗi ngày học liên tiếp khi bé hoạt động: mới hôm nay liên tiếp +1, bỏ ngày -> về 1.
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

function addXp(studentId: string, delta: number): void {
  if (delta <= 0) return;
  db.prepare("UPDATE students SET xp = COALESCE(xp, 0) + ? WHERE id = ?").run(delta, studentId);
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
      SELECT u.id, u.email, u.name, u.role, u.createdAt, u.studentLimit,
             (SELECT COUNT(*) FROM students s WHERE s.parentId = u.id) AS studentCount
      FROM users u ORDER BY u.createdAt DESC
    `).all();
    res.json(rows);
  });

  // Admin đặt hạn mức số bé cho 1 phụ huynh.
  app.put("/api/admin/users/:id", requireAdmin, (req, res) => {
    const limit = Math.max(0, Math.min(50, Number(req.body?.studentLimit)));
    if (Number.isNaN(limit)) return res.status(400).json({ error: "studentLimit không hợp lệ" });
    const r = db.prepare("UPDATE users SET studentLimit = ? WHERE id = ?").run(limit, req.params.id);
    if (r.changes === 0) return res.status(404).json({ error: "không có user" });
    res.json({ ok: true, studentLimit: limit });
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
    const { name, grade, avatar, dailyGoal } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "thiếu tên bé" });
    if (user.role !== "admin") {
      const count = (db.prepare("SELECT COUNT(*) AS c FROM students WHERE parentId = ?").get(user.id) as any).c;
      if (count >= (user.studentLimit ?? 1)) {
        return res.status(403).json({ error: `Đã đạt giới hạn ${user.studentLimit ?? 1} bé. Liên hệ admin để tăng hạn mức.` });
      }
    }
    const row = {
      id: "student_" + randomUUID().slice(0, 8), parentId: user.id, name: String(name).trim(),
      grade: Number(grade) || 1, level: "beginner", avatar: avatar || "girl_avatar_01",
      dailyGoal: Number(dailyGoal) || 10, xp: 0, streak: 0, createdAt: Date.now(), lastActiveDate: null,
    };
    db.prepare(`INSERT INTO students (id,parentId,name,grade,level,avatar,dailyGoal,xp,streak,createdAt,lastActiveDate)
      VALUES (@id,@parentId,@name,@grade,@level,@avatar,@dailyGoal,@xp,@streak,@createdAt,@lastActiveDate)`).run(row);
    res.json(row);
  });

  app.put("/api/students/:id", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const { name, grade, avatar, dailyGoal } = req.body || {};
    db.prepare("UPDATE students SET name=COALESCE(?,name), grade=COALESCE(?,grade), avatar=COALESCE(?,avatar), dailyGoal=COALESCE(?,dailyGoal) WHERE id=?")
      .run(name ?? null, grade ?? null, avatar ?? null, dailyGoal ?? null, req.params.id);
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

  app.post("/api/students/:id/answer", requireAuth, (req, res) => {
    if (!canAccessStudent(req, res, req.params.id)) return;
    const studentId = req.params.id;
    const { wordId, correct } = req.body || {};
    if (!wordId) return res.status(400).json({ error: "thiếu wordId" });

    const prev = db.prepare("SELECT * FROM progress WHERE studentId = ? AND wordId = ?").get(studentId, wordId) as any;
    const now = Date.now();
    const base = prev || { mastery: 0, correctCount: 0, wrongCount: 0 };
    const { mastery, nextReviewAt, status } = nextReview(base.mastery, !!correct, now);
    const row = {
      studentId, wordId, status, mastery,
      correctCount: base.correctCount + (correct ? 1 : 0),
      wrongCount: base.wrongCount + (correct ? 0 : 1),
      lastReviewedAt: now, nextReviewAt,
    };
    db.prepare(
      `INSERT OR REPLACE INTO progress
        (studentId, wordId, status, mastery, correctCount, wrongCount, lastReviewedAt, nextReviewAt)
       VALUES (@studentId, @wordId, @status, @mastery, @correctCount, @wrongCount, @lastReviewedAt, @nextReviewAt)`
    ).run(row);
    bumpStreak(studentId);
    if (correct) addXp(studentId, 10); // +10 XP cho mỗi từ trả lời đúng
    res.json(row);
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
      "SELECT query, type, MAX(createdAt) AS createdAt FROM lookup_history WHERE studentId = ? AND saved = 1 GROUP BY query ORDER BY createdAt DESC LIMIT 100"
    ).all(req.params.id);
    res.json(rows);
  });

  app.post("/api/lookup", requireAuth, (req, res) => {
    const { studentId, query, type, saved, createdAt } = req.body || {};
    if (!canAccessStudent(req, res, studentId)) return;
    db.prepare(
      `INSERT INTO lookup_history (studentId, query, type, saved, createdAt) VALUES (?, ?, ?, ?, ?)`
    ).run(studentId, query, type, saved ? 1 : 0, createdAt ?? Date.now());
    res.json({ ok: true });
  });

  // ── Quiz ──
  app.get("/api/quiz", requireAuth, (req, res) => {
    const topicId = String(req.query.topicId || "");
    const count = Number(req.query.count || 10);
    const rows = db.prepare("SELECT * FROM vocabulary").all() as any[];
    const words = rows.map(rowToWord).filter((w) => w.topicIds.includes(topicId));
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
    if (r.studentId) {
      bumpStreak(r.studentId);
      addXp(r.studentId, (Number(r.correctAnswers) || 0) * 5); // +5 XP mỗi câu test đúng
    }
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

  // ── Chọn/đổi ảnh cho 1 từ (dùng bởi trang /picker) ──
  app.post("/api/image-pick", (req, res) => {
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
