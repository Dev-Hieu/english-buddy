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

// Ghi 1 sự kiện điểm vào sổ cái + cập nhật tổng XP (cộng dồn tính lại được từ sổ cái).
function awardXp(studentId: string, type: string, points: number, refId: string | null = null): void {
  if (points <= 0) return;
  db.prepare("INSERT INTO xp_events (studentId, type, points, refId, createdAt) VALUES (?, ?, ?, ?, ?)")
    .run(studentId, type, points, refId, Date.now());
  db.prepare("UPDATE students SET xp = COALESCE(xp, 0) + ? WHERE id = ?").run(points, studentId);
}

// Chỉ thưởng 1 lần cho mỗi (loại, tham chiếu) — vd: học/thuộc 1 từ chỉ tính 1 lần (chống cày).
function awardXpOnce(studentId: string, type: string, refId: string, points: number): void {
  const existed = db.prepare("SELECT 1 FROM xp_events WHERE studentId=? AND type=? AND refId=? LIMIT 1").get(studentId, type, refId);
  if (existed) return;
  awardXp(studentId, type, points, refId);
}

// Cập nhật chuỗi ngày học liên tiếp; thưởng điểm mốc 3/7/30 ngày.
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
  const bonus: Record<number, number> = { 3: 10, 7: 30, 14: 60, 30: 150 };
  if (bonus[streak]) awardXp(studentId, "streak_milestone", bonus[streak], `streak_${streak}_${today}`);
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
      SELECT u.id, u.email, u.name, u.role, u.createdAt, u.studentLimit, u.isPremium,
             (SELECT COUNT(*) FROM students s WHERE s.parentId = u.id) AS studentCount
      FROM users u ORDER BY u.createdAt DESC
    `).all();
    res.json(rows);
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
    const row = db.prepare("SELECT id, studentLimit, isPremium FROM users WHERE id = ?").get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: "không có user" });
    res.json({ ok: true, studentLimit: row.studentLimit, isPremium: !!row.isPremium });
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
    // Điểm thưởng "học thật" (chống cày): thưởng theo tiến bộ, không theo số lần bấm.
    if (correct) {
      const wasDue = prev && prev.nextReviewAt <= now;
      if ((base.mastery ?? 0) === 0) awardXpOnce(studentId, "first_learn", wordId, 10); // học từ mới lần đầu
      else if (mastery >= 5 && (base.mastery ?? 0) < 5) awardXpOnce(studentId, "mastered", wordId, 20); // thuộc hẳn
      else if (wasDue) awardXp(studentId, "review", 5, wordId); // ôn đúng từ đến hạn
      else awardXp(studentId, "practice", 1, wordId); // luyện lại từ đã biết
    }
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
    const rows = db.prepare("SELECT * FROM vocabulary").all() as any[];
    const words = rows
      .map(rowToWord)
      .filter((w) => w.topicIds.includes(topicId) && (!level || w.level === level));
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
      // Thưởng theo số câu đúng nhưng chỉ tính LẦN ĐẦU mỗi (chủ đề, ngày) -> chống làm đi làm lại để cày.
      const today = dayStr(new Date());
      const pts = Math.min(50, (Number(r.correctAnswers) || 0) * 3);
      awardXpOnce(r.studentId, "quiz", `${r.topicId || "exam"}_${today}`, pts);
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
