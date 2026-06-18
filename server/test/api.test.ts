// Test tích hợp các luồng chính của API (nghiệm thu T-053): auth, hồ sơ bé,
// cô lập dữ liệu, hạn mức, tiến độ/XP, quiz + lọc theo cấp, My Words, xếp hạng.
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { tmpdir } from "node:os";
import path from "node:path";
import { rmSync } from "node:fs";

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

describe("Tiến độ + XP", () => {
  test("trả lời đúng -> mastery>0 và XP tăng", async () => {
    const vocab = await (await get("/api/vocabulary")).json();
    const word = vocab.find((w: any) => w.topicIds.includes("topic_food"));
    expect(word).toBeTruthy();

    const before = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    const ans = await post(`/api/students/${studentId}/answer`, { wordId: word.id, correct: true }, t1);
    expect((await ans.json()).mastery).toBeGreaterThan(0);

    const after = (await (await get(`/api/students/${studentId}`, t1)).json()).xp ?? 0;
    expect(after).toBe(before + 10);

    const prog = await (await get(`/api/students/${studentId}/progress`, t1)).json();
    expect(prog.some((p: any) => p.wordId === word.id && p.mastery > 0)).toBe(true);
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
