import cors from "cors";
import express from "express";
import { db, initSchema } from "./db.js";
import { login, requireAuth } from "./auth.js";
import { nextReview } from "../../src/utils/spacedRepetition";
import { buildQuiz } from "../../src/utils/quizGenerator";
import type { VocabularyWord } from "../../src/types";

function rowToWord(r: any): VocabularyWord {
  return { ...r, topicIds: JSON.parse(r.topicIds) };
}

export function createApp() {
  initSchema();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // ── Auth ──
  app.post("/api/login", (req, res) => {
    const token = login(String(req.body?.password || ""));
    if (!token) return res.status(401).json({ error: "sai mật khẩu" });
    res.json({ token });
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

  // ── Học sinh + tiến độ (cần đăng nhập) ──
  app.get("/api/students", requireAuth, (_req, res) => {
    res.json(db.prepare("SELECT * FROM students").all());
  });

  app.get("/api/students/:id/progress", requireAuth, (req, res) => {
    res.json(db.prepare("SELECT * FROM progress WHERE studentId = ?").all(req.params.id));
  });

  app.post("/api/students/:id/answer", requireAuth, (req, res) => {
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
    res.json(row);
  });

  app.get("/api/students/:id/reviews", requireAuth, (req, res) => {
    const now = req.query.now ? Number(req.query.now) : Date.now();
    res.json(
      db.prepare("SELECT * FROM progress WHERE studentId = ? AND nextReviewAt <= ?").all(req.params.id, now)
    );
  });

  app.post("/api/lookup", requireAuth, (req, res) => {
    const { studentId, query, type, saved, createdAt } = req.body || {};
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

  app.post("/api/quiz-results", requireAuth, (req, res) => {
    const r = req.body || {};
    db.prepare(
      `INSERT INTO quiz_results
        (studentId, topicId, score, totalQuestions, correctAnswers, wrongAnswers, wrongWordIds, durationSeconds, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      r.studentId, r.topicId, r.score, r.totalQuestions, r.correctAnswers, r.wrongAnswers,
      JSON.stringify(r.wrongWordIds ?? []), r.durationSeconds, r.createdAt ?? Date.now()
    );
    res.json({ ok: true });
  });

  // ── Proxy ảnh (Pexels + fallback Unsplash) ──
  app.get("/api/image", async (req, res) => {
    const query = String(req.query.query || "").trim();
    if (!query) return res.status(400).json({ error: "thiếu query" });
    try {
      let images = await fromPexels(query);
      if (images.length === 0) images = await fromUnsplash(query);
      res.json(images);
    } catch {
      res.status(502).json({ error: "image proxy lỗi" });
    }
  });

  // ── Proxy dịch (MyMemory en->vi) + cache trong DB ──
  app.get("/api/translate", async (req, res) => {
    const text = String(req.query.text || "").trim();
    if (!text) return res.status(400).json({ error: "thiếu text" });
    const cached = db.prepare("SELECT translation FROM translation_cache WHERE text = ?").get(text) as any;
    if (cached) return res.json({ translation: cached.translation });
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;
      const r = await fetch(url);
      const data: any = await r.json();
      const translation = data?.responseData?.translatedText || "";
      db.prepare("INSERT OR REPLACE INTO translation_cache (text, translation) VALUES (?, ?)").run(text, translation);
      res.json({ translation });
    } catch {
      res.status(502).json({ error: "translate proxy lỗi" });
    }
  });

  return app;
}

async function fromPexels(query: string) {
  const key = process.env.PEXELS_KEY || "";
  if (!key) return [];
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`, {
    headers: { Authorization: key },
  });
  if (!r.ok) return [];
  const data: any = await r.json();
  return (data.photos || []).map((p: any) => ({
    id: String(p.id), url: p.src.large, thumbUrl: p.src.tiny,
    photographer: p.photographer, sourceUrl: p.url,
  }));
}

async function fromUnsplash(query: string) {
  const key = process.env.UNSPLASH_KEY || "";
  if (!key) return [];
  const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!r.ok) return [];
  const data: any = await r.json();
  return (data.results || []).map((p: any) => ({
    id: p.id, url: p.urls.regular, thumbUrl: p.urls.thumb,
    photographer: p.user.name, sourceUrl: p.links.html,
  }));
}
