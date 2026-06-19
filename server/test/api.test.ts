// Test tích hợp các luồng chính của API (nghiệm thu T-053): auth, hồ sơ bé,
// cô lập dữ liệu, hạn mức, tiến độ/XP, quiz + lọc theo cấp, My Words, xếp hạng.
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { tmpdir } from "node:os";
import path from "node:path";
import { rmSync } from "node:fs";
import { db } from "../src/db.js";

const DBP = path.join(tmpdir(), `eb_api_${Date.now()}.db`);
let server: any;
let base = "";

const headers = (token?: string) => ({
  "content-type": "application/json",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
});
const post = (p: string, body: unknown, token?: string) =>
  fetch(base + p, { method: "POST", headers: headers(token), body: JSON.stringify(body) });
const put = (p: string, body: unknown, token?: string) =>
  fetch(base + p, { method: "PUT", headers: headers(token), body: JSON.stringify(body) });
const get = (p: string, token?: string) =>
  fetch(base + p, { headers: token ? { authorization: `Bearer ${token}` } : {} });

// Tài khoản test duy nhất theo lần chạy.
const U1 = { email: `u1_${Date.now()}@t.vn`, password: "123456", name: "Phụ huynh 1" };
const U2 = { email: `u2_${Date.now()}@t.vn`, password: "123456", name: "Phụ huynh 2" };
let t1 = "", t2 = "", studentId = "";

beforeAll(async () => {
  process.env.DB_PATH = DBP;
  process.env.AUTH_SECRET = "test_secret";
  const { createApp } = await import("../src/app.ts");
  const app = createApp(); // initSchema() tạo bảng
  await import("../src/seed.ts"); // seedAll() nạp topics/vocabulary/demo users
  await new Promise<void>((res) => { server = app.listen(0, () => res()); });
  base = `http://127.0.0.1:${server.address().port}`;
});
afterAll(() => { server?.close(); try { rmSync(DBP); } catch { /* ignore */ } });

describe("Auth", () => {
  test("register + login + me", async () => {
    const r = await post("/api/register", U1);
    expect(r.status).toBe(200);
    const reg = await r.json();
    expect(reg.token).toBeTruthy();

    const lg = await post("/api/login", { email: U1.email, password: U1.password });
    expect(lg.status).toBe(200);
    t1 = (await lg.json()).token;
    expect(t1).toBeTruthy();

    const me = await (await get("/api/me", t1)).json();
    expect(me.email).toBe(U1.email);
    expect(me.role).toBe("parent");
  });

  test("login sai mật khẩu -> 401", async () => {
    expect((await post("/api/login", { email: U1.email, password: "sai" })).status).toBe(401);
  });

  test("API cần auth -> 401 khi thiếu token", async () => {
    expect((await get("/api/students")).status).toBe(401);
  });
});

describe("Hồ sơ bé + hạn mức + cô lập", () => {
  test("tạo bé đầu tiên OK, lưu đúng level", async () => {
    const r = await post("/api/students", { name: "Bé Test", grade: 3, level: "kids" }, t1);
    expect(r.status).toBe(200);
    const s = await r.json();
    studentId = s.id;
    expect(s.level).toBe("kids");
  });

  test("vượt hạn mức (mặc định 1 bé) -> 403", async () => {
    expect((await post("/api/students", { name: "Bé 2", level: "a1" }, t1)).status).toBe(403);
  });

  test("sửa hồ sơ đổi level được lưu", async () => {
    const r = await put(`/api/students/${studentId}`, { level: "a2" }, t1);
    expect((await r.json()).level).toBe("a2");
  });

  test("tài khoản khác KHÔNG truy cập bé của người khác -> 403", async () => {
    await post("/api/register", U2);
    t2 = (await (await post("/api/login", { email: U2.email, password: U2.password })).json()).token;
    expect((await get(`/api/students/${studentId}`, t2)).status).toBe(403);
    expect((await get(`/api/students/${studentId}`, t1)).status).toBe(200);
  });
});

describe("Tiến độ + điểm (flashcard không cộng điểm mỗi thẻ)", () => {
  test("trả lời -> mastery>0 nhưng KHÔNG cộng XP mỗi thẻ (chống gian lận)", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const word = vocab.find((w: any) => w.topicIds.includes("topic_food"));
    expect(word).toBeTruthy();

    const before = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    const ans = await post(`/api/students/${studentId}/answer`, { wordId: word.id, correct: true }, t1);
    expect((await ans.json()).mastery).toBeGreaterThan(0); // tiến độ vẫn ghi nhận

    const after = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    expect(after).toBe(before); // KHÔNG cộng điểm mỗi thẻ
  });

  test("báo 'Thuộc' -> đưa vào kho Chờ thi (status=pending_test), KHÔNG điểm", async () => {
    const before = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    const vocab = await (await get("/api/vocabulary")).json();
    const w = vocab.find((x: any) => x.topicIds.includes("topic_animals")) || vocab[300];
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1);
    const pending = await (await get(`/api/students/${studentId}/pending`, t1)).json();
    expect(pending.words).toContain(w.id);
    const after = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    expect(after).toBe(before); // học tự do không cộng điểm
  });

  test("báo 'Cần ôn' -> đưa vào kho Cần ôn (status=relearn)", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const w = vocab.find((x: any) => x.topicIds.includes("topic_animals")) || vocab[301];
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: false }, t1);
    const relearn = await (await get(`/api/students/${studentId}/relearn`, t1)).json();
    expect(relearn.words).toContain(w.id);
  });
});

describe("Quiz", () => {
  test("sinh quiz: đáp án đúng nằm trong options", async () => {
    const qs = await (await get(`/api/quiz?topicId=topic_food&count=5`, t1)).json();
    expect(Array.isArray(qs)).toBe(true);
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) expect(q.options).toContain(q.answer);
  });

  test("lọc theo cấp: quiz level=kids chỉ gồm từ cấp kids", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const levelById = new Map(vocab.map((w: any) => [w.id, w.level]));
    const qs = await (await get(`/api/quiz?topicId=topic_animals&count=8&level=kids`, t1)).json();
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) expect(levelById.get(q.wordId)).toBe("kids");
  });
});

describe("My Words + Xếp hạng", () => {
  test("lưu từ kèm nghĩa -> đọc lại có nghĩa", async () => {
    await post("/api/lookup", { studentId, query: "apple", type: "word", saved: true, meaning: "quả táo", phonetic: "/ˈæp.əl/" }, t1);
    const list = await (await get(`/api/students/${studentId}/lookups`, t1)).json();
    const found = list.find((x: any) => x.query === "apple");
    expect(found?.meaning).toBe("quả táo");
  });

  test("leaderboard trả về mảng", async () => {
    const lb = await (await get("/api/leaderboard", t1)).json();
    expect(Array.isArray(lb)).toBe(true);
  });
});

describe("Admin + hạn mức", () => {
  let tAdmin = "";
  test("non-admin không vào được /api/admin/users -> 403", async () => {
    expect((await get("/api/admin/users", t1)).status).toBe(403);
  });

  test("admin xem users + nâng hạn mức -> phụ huynh tạo thêm bé được", async () => {
    tAdmin = (await (await post("/api/login", { email: "admin@buddy.vn", password: "123456" })).json()).token;
    expect(tAdmin).toBeTruthy();
    const users = await (await get("/api/admin/users", tAdmin)).json();
    expect(Array.isArray(users)).toBe(true);

    const me = await (await get("/api/me", t1)).json();
    const up = await put(`/api/admin/users/${me.id}`, { studentLimit: 3 }, tAdmin);
    expect((await up.json()).studentLimit).toBe(3);

    // Trước đó u1 đã đạt giới hạn 1; giờ nâng lên 3 -> tạo thêm OK.
    expect((await post("/api/students", { name: "Bé 2", level: "a1" }, t1)).status).toBe(200);
  });
});

describe("Quiz results + Review", () => {
  test("lưu kết quả test -> đọc lại có, nhưng KHÔNG cộng điểm (điểm chỉ từ Thi kỹ năng)", async () => {
    const before = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    const body = {
      studentId, topicId: "topic_food", score: 80, totalQuestions: 5,
      correctAnswers: 4, wrongAnswers: 1, wrongWordIds: [], durationSeconds: 30,
    };
    await post("/api/quiz-results", body, t1);
    const list = await (await get(`/api/students/${studentId}/quiz-results`, t1)).json();
    expect(list.length).toBeGreaterThan(0);
    const after = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    expect(after).toBe(before); // luyện tập không cộng điểm
  });

  test("hàng đợi ôn trả về mảng", async () => {
    const due = await (await get(`/api/students/${studentId}/reviews`, t1)).json();
    expect(Array.isArray(due)).toBe(true);
  });
});

describe("Chat AI premium", () => {
  test("free: status enabled=false, POST chat -> 503 (chưa key)", async () => {
    const st = await (await get("/api/chat/status", t1)).json();
    expect(st.enabled).toBe(false);
    expect(st.premium).toBe(false);
    expect((await post("/api/chat", { messages: [{ role: "user", content: "hi" }] }, t1)).status).toBe(503);
  });

  test("admin cấp premium -> status.premium=true (enabled vẫn false vì chưa key)", async () => {
    const tAdmin = (await (await post("/api/login", { email: "admin@buddy.vn", password: "123456" })).json()).token;
    const me = await (await get("/api/me", t1)).json();
    await put(`/api/admin/users/${me.id}`, { isPremium: true }, tAdmin);
    const st = await (await get("/api/chat/status", t1)).json();
    expect(st.premium).toBe(true);
    expect(st.enabled).toBe(false); // chưa có DEEPSEEK_API_KEY trong test
  });
});

describe("Chống cày điểm + xếp hạng tuần", () => {
  test("trả lời thẻ KHÔNG cộng điểm dù bấm nhiều lần (chống cày)", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const w = vocab.find((x: any) => x.topicIds.includes("topic_technology")) || vocab[800];
    const x0 = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1);
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1);
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1);
    const x1 = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    expect(x1).toBe(x0); // bấm 3 lần vẫn 0 điểm
  });

  test("ôn lại SỚM không tăng mastery (phải đúng lịch giãn cách)", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const w = vocab.find((x: any) => x.topicIds.includes("topic_society")) || vocab[1200];
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1); // học mới -> mastery 1
    let prog = await (await get(`/api/students/${studentId}/progress`, t1)).json();
    const m1 = prog.find((p: any) => p.wordId === w.id).mastery;
    await post(`/api/students/${studentId}/answer`, { wordId: w.id, correct: true }, t1); // ôn lại NGAY (chưa tới hạn)
    prog = await (await get(`/api/students/${studentId}/progress`, t1)).json();
    const m2 = prog.find((p: any) => p.wordId === w.id).mastery;
    expect(m1).toBe(1);
    expect(m2).toBe(1); // không tăng vì chưa tới hạn ôn
  });

  test("leaderboard tuần trả về điểm (points) theo cấp", async () => {
    const lb = await (await get("/api/leaderboard?period=week", t1)).json();
    expect(Array.isArray(lb)).toBe(true);
    if (lb.length) { expect(lb[0]).toHaveProperty("points"); expect(lb[0]).toHaveProperty("level"); }
  });
});

describe("Thi kỹ năng (điểm = số kỹ năng đang qua)", () => {
  let w: any;
  const xpOf = async () => (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
  const progOf = async (id: string) =>
    (await (await get(`/api/students/${studentId}/progress`, t1)).json()).find((p: any) => p.wordId === id);

  test("chấm đúng đủ 3 kỹ năng -> scored + cộng đúng điểm (server chấm)", async () => {
    db.prepare("DELETE FROM progress WHERE studentId=?").run(studentId); // cô lập
    const vocab = await (await get("/api/vocabulary")).json();
    w = vocab[0];
    db.prepare("INSERT OR REPLACE INTO progress (studentId,wordId,status,mastery,correctCount,wrongCount,lastReviewedAt,nextReviewAt,skillsPassed) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(studentId, w.id, "pending_test", 1, 0, 0, Date.now(), Date.now(), null);
    const start = await (await post(`/api/students/${studentId}/skill-test/start`, { mode: "new" }, t1)).json();
    expect(start.skills.length).toBe(3); // a2 = nghe/nói/viết
    expect(start.items.length).toBe(1);
    expect(start.items[0].options.length).toBe(4); // nghe chọn chữ -> 4 lựa chọn

    const before = await xpOf();
    const answers = [
      { wordId: w.id, skill: "listen_word", value: w.word },
      { wordId: w.id, skill: "write", value: w.word },
      { wordId: w.id, skill: "speak", value: 85 },
    ];
    const sub = await (await post(`/api/students/${studentId}/skill-test/submit`, { sessionId: start.sessionId, answers }, t1)).json();
    expect(sub.totalDelta).toBe(3);
    expect(sub.results[0].points).toBe(3);
    expect(await xpOf()).toBe(before + 3);
    expect((await progOf(w.id)).status).toBe("scored");
  });

  test("thi LẠI quên 1 kỹ năng -> trừ điểm kỹ năng đó + về Cần ôn", async () => {
    // đưa từ đã scored về diện thi lại (đến hạn), đủ 3 kỹ năng
    db.prepare("UPDATE progress SET status='scored', nextReviewAt=?, skillsPassed=? WHERE studentId=? AND wordId=?")
      .run(Date.now() - 1000, JSON.stringify(["listen_word", "speak", "write"]), studentId, w.id);
    const start = await (await post(`/api/students/${studentId}/skill-test/start`, { mode: "review" }, t1)).json();
    expect(start.items.some((i: any) => i.wordId === w.id)).toBe(true);

    const before = await xpOf();
    const answers = [
      { wordId: w.id, skill: "listen_word", value: w.word },
      { wordId: w.id, skill: "write", value: w.word },
      { wordId: w.id, skill: "speak", value: 30 }, // phát âm kém -> rớt
    ];
    const sub = await (await post(`/api/students/${studentId}/skill-test/submit`, { sessionId: start.sessionId, answers }, t1)).json();
    const r = sub.results.find((x: any) => x.wordId === w.id);
    expect(r.lost).toContain("speak");
    expect(await xpOf()).toBe(before - 1); // mất 1 điểm kỹ năng nói
    expect((await progOf(w.id)).status).toBe("relearn");
  });

  test("chấm SAI -> không qua kỹ năng, 0 điểm", async () => {
    db.prepare("DELETE FROM progress WHERE studentId=?").run(studentId);
    const vocab = await (await get("/api/vocabulary")).json();
    const w2 = vocab[1];
    db.prepare("INSERT OR REPLACE INTO progress (studentId,wordId,status,mastery,correctCount,wrongCount,lastReviewedAt,nextReviewAt,skillsPassed) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(studentId, w2.id, "pending_test", 1, 0, 0, Date.now(), Date.now(), null);
    const start = await (await post(`/api/students/${studentId}/skill-test/start`, { mode: "new" }, t1)).json();
    const before = await xpOf();
    const answers = [
      { wordId: w2.id, skill: "listen_word", value: "___sai___" },
      { wordId: w2.id, skill: "write", value: "___sai___" },
      { wordId: w2.id, skill: "speak", value: 10 },
    ];
    const sub = await (await post(`/api/students/${studentId}/skill-test/submit`, { sessionId: start.sessionId, answers }, t1)).json();
    expect(sub.totalDelta).toBe(0);
    expect(await xpOf()).toBe(before);
    expect((await progOf(w2.id)).status).toBe("relearn");
  });
});

describe("Xóa hồ sơ bé", () => {
  test("tạo rồi xóa -> không còn trong danh sách", async () => {
    const s = await (await post("/api/students", { name: "Bé Xóa", level: "a1" }, t2)).json();
    expect((await fetch(base + `/api/students/${s.id}`, { method: "DELETE", headers: { authorization: `Bearer ${t2}` } })).status).toBe(200);
    const list = await (await get("/api/students", t2)).json();
    expect(list.some((x: any) => x.id === s.id)).toBe(false);
  });
});
