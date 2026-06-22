# Admin Dashboard Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Professional admin dashboard with sidebar layout, user approval system (4 methods), and full CRUD for users/students.

**Architecture:** Sidebar + content layout. AdminPage.tsx becomes thin orchestrator using AdminLayout component. Each tab is a separate file. Backend gets invite_codes table + user status field + approval APIs.

**Tech Stack:** React + TypeScript + Tailwind CSS (frontend), Express + SQLite (backend), existing UI components (Button, Card, etc.)

## Global Constraints

- Follow existing Tailwind CSS patterns (rounded-2xl, font-extrabold, shadow-card, etc.)
- All Vietnamese UI text
- Mobile-first responsive (sidebar collapses to hamburger <768px)
- Use existing `apiRequest` from `src/services/api.ts` for all API calls
- Use `cn()` from existing `src/components/ui/cn.ts` for conditional classes
- Commit after each task

---

### Task 1: Database — invite_codes table + user status column

**Files:**
- Modify: `server/src/db.ts`

**Produces:** `invite_codes` table, `status` column on `users`

- [ ] **Step 1: Add schema + migration to db.ts**

Add to `initSchema()` after existing CREATE TABLE statements:

```typescript
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
```

Add migration after existing ALTER TABLE blocks:

```typescript
try { db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'"); } catch { /* đã có */ }
```

- [ ] **Step 2: Verify locally**

Run: `cd server && npx tsx src/seed.ts`
Expected: Seed runs without errors, DB has new table/column.

- [ ] **Step 3: Commit**

```bash
git add server/src/db.ts && git commit -m "feat(db): add invite_codes table + user status column"
```

---

### Task 2: Backend — Invite code APIs + register flow update

**Files:**
- Modify: `server/src/app.ts`
- Modify: `server/src/auth.ts`

**Consumes:** invite_codes table from Task 1
**Produces:** `POST/GET/DELETE /api/admin/invite-codes`, updated register/login flow

- [ ] **Step 1: Add invite code CRUD endpoints to app.ts**

After existing admin endpoints (~line 300), add:

```typescript
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
```

- [ ] **Step 2: Update register in auth.ts**

Modify `registerUser` to accept optional `inviteCode`, check it, set status accordingly:

```typescript
export function registerUser(email: string, password: string, name: string, inviteCode?: string): { token: string; user: User } | { error: string } {
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "email không hợp lệ" };
  if (!password || password.length < 4) return { error: "mật khẩu tối thiểu 4 ký tự" };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return { error: "email đã được dùng" };

  let status = "pending";
  let classId: string | null = null;

  if (inviteCode) {
    const ic = db.prepare("SELECT * FROM invite_codes WHERE code = ? AND usedCount < maxUses AND (expiresAt IS NULL OR expiresAt > ?)").get(inviteCode, Date.now()) as any;
    if (!ic) return { error: "Mã không hợp lệ hoặc hết lượt" };
    status = "active";
    if (ic.type === "class") classId = ic.classId;
    db.prepare("UPDATE invite_codes SET usedCount = usedCount + 1 WHERE code = ?").run(inviteCode);
  }

  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, passwordHash, name, role, createdAt, studentLimit, status) VALUES (?, ?, ?, ?, 'parent', ?, 1, ?)")
    .run(id, email, hashPassword(password), (name || "").trim() || email.split("@")[0], Date.now(), status);

  // If class code: auto-create student under classroom user
  if (classId) {
    db.prepare("INSERT INTO students (id, parentId, name, grade, level, avatar, dailyGoal, xp, streak, createdAt) VALUES (?, ?, ?, 1, 'a1', 'boy', 10, 0, 0, ?)")
      .run(randomUUID(), "classroom", (name || "").trim(), Date.now());
  }

  return { token: sign(id), user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)) };
}
```

Add `status` to `publicUser` and `User` interface:

```typescript
export interface User {
  // ...existing fields...
  status: string; // "active" | "pending" | "rejected"
}

const publicUser = (r: any): User => ({
  // ...existing fields...
  status: r.status || "active",
});
```

- [ ] **Step 3: Update login in auth.ts**

In `loginUser`, after verifying password, check status:

```typescript
if (row.status === "rejected") return null;
```

- [ ] **Step 4: Update register endpoint in app.ts**

Pass `inviteCode` from request body:

```typescript
app.post("/api/register", (req, res) => {
  const { email, password, name, inviteCode } = req.body || {};
  const result = registerUser(email, password, name, inviteCode);
  if ("error" in result) return res.status(400).json(result);
  res.json(result);
});
```

- [ ] **Step 5: Type check + commit**

```bash
npx tsc -b --noEmit && git add server/ && git commit -m "feat(auth): invite codes + user approval system"
```

---

### Task 3: Frontend services — invite codes + approval APIs

**Files:**
- Modify: `src/services/studentService.ts`

**Produces:** Frontend functions for invite code CRUD + user approval

- [ ] **Step 1: Add service functions**

Append to `studentService.ts`:

```typescript
// Invite codes
export interface InviteCode { code: string; type: string; classId?: string; maxUses: number; usedCount: number; createdBy: string; createdAt: number; expiresAt?: number; }
export function listInviteCodes(): Promise<InviteCode[]> { return apiRequest("/api/admin/invite-codes"); }
export function createInviteCode(data: { type: string; classId?: string; maxUses?: number; expiresAt?: number }): Promise<{ ok: boolean; code: string }> {
  return apiRequest("/api/admin/invite-codes", { method: "POST", body: data });
}
export function deleteInviteCode(code: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/invite-codes/${code}`, { method: "DELETE" });
}

// User approval
export function setUserStatus(userId: string, status: "active" | "pending" | "rejected"): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/users/${userId}/status`, { method: "PUT", body: { status } });
}
```

- [ ] **Step 2: Update AuthPage to pass inviteCode**

In `src/pages/AuthPage.tsx`, add invite code field to register form and pass it to `register()` call.

- [ ] **Step 3: Add pending screen in App.tsx**

After login, if `user.status === "pending"`, show a "Tài khoản đang chờ duyệt" screen instead of the normal app.

- [ ] **Step 4: Type check + commit**

```bash
npx tsc -b --noEmit && git add src/ && git commit -m "feat(frontend): invite code services + pending screen"
```

---

### Task 4: AdminLayout — sidebar + responsive shell

**Files:**
- Create: `src/components/admin/AdminLayout.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`

**Produces:** Sidebar layout component with mobile hamburger

- [ ] **Step 1: Create AdminSidebar.tsx**

```typescript
// Menu items with icons, active state highlighting
// Props: activeTab, onTabChange, onLogout
// Desktop: always visible, 240px wide
// Mobile: overlay slide-in with backdrop
// Items: Tổng quan, Tài khoản, Học sinh, Nội dung(disabled), Ảnh(disabled), Báo cáo(disabled), Thông báo(disabled), Online(disabled), Cài đặt(disabled)
// GĐ2+ items show lock icon + "Sắp có"
// Bottom: admin name + Thoát button
```

- [ ] **Step 2: Create AdminLayout.tsx**

```typescript
// Props: children, activeTab, onTabChange, adminName, onLogout
// Desktop: flex row — sidebar fixed left + content scrollable right
// Mobile: header with hamburger + title, sidebar as overlay
// State: sidebarOpen (mobile only)
```

- [ ] **Step 3: Type check + commit**

```bash
npx tsc -b --noEmit && git add src/components/admin/ && git commit -m "feat(admin): sidebar layout + responsive shell"
```

---

### Task 5: Admin tab components — Overview, Users, Students

**Files:**
- Create: `src/pages/admin/OverviewTab.tsx`
- Create: `src/pages/admin/UsersTab.tsx`
- Create: `src/pages/admin/StudentsTab.tsx`

**Consumes:** Services from Task 3, Layout from Task 4

- [ ] **Step 1: Create OverviewTab.tsx**

Dashboard with:
- Welcome header (gradient)
- 4 stats cards (users, students, premium, online placeholder)
- Pending approval banner (if count > 0)
- Quick actions grid (4 buttons)
- Activity placeholder ("Sắp có")

- [ ] **Step 2: Create UsersTab.tsx**

Full user management:
- Header: title + [+ Thêm] button
- Sub-tabs: Tất cả | Chờ duyệt | Premium | Admin
- Search bar
- User cards with: avatar, name, email, badges, status badge (active/pending/rejected)
- Actions: approve/reject (pending), edit limits, toggle premium, toggle editor, delete
- Add user form (modal/inline)
- Invite codes section: create form + list with copy/delete

- [ ] **Step 3: Create StudentsTab.tsx**

Full student management (migrate from existing AdminPage logic):
- Header: title + [+ Tạo] button
- Filter: Tất cả | Theo lớp | Theo trình độ
- Search bar
- Student cards with proper avatarEmoji, stats, parent info
- Actions: Học thử, Sửa (inline form), Xoá
- Add student form (with optional account creation)

- [ ] **Step 4: Type check + commit**

```bash
npx tsc -b --noEmit && git add src/pages/admin/ && git commit -m "feat(admin): overview, users, students tab components"
```

---

### Task 6: Rewrite AdminPage.tsx — orchestrator with new layout

**Files:**
- Modify: `src/pages/AdminPage.tsx` (rewrite)
- Modify: `src/app/App.tsx` (update props)

**Consumes:** AdminLayout (Task 4), Tab components (Task 5)

- [ ] **Step 1: Rewrite AdminPage.tsx**

Thin orchestrator:
- State: activeTab
- Uses AdminLayout for sidebar shell
- Renders OverviewTab / UsersTab / StudentsTab based on activeTab
- Passes onLoginAsStudent, onOpenPicker callbacks down

- [ ] **Step 2: Update App.tsx**

Pass admin name and ensure onLoginAsStudent shows badge "Đang xem với tư cách [Tên bé]" with "Quay lại Admin" button.

- [ ] **Step 3: Type check + build + commit**

```bash
npx tsc -b --noEmit && npm run build && git add src/ && git commit -m "feat(admin): complete phase 1 dashboard with sidebar layout"
```

---

### Task 7: Deploy + verify

**Files:** None (deployment only)

- [ ] **Step 1: Push + deploy**

```bash
git push origin main
ssh oracle-vps "cd ~/english-buddy && git gc --prune=now; bash ~/deploy-eb.sh"
```

- [ ] **Step 2: Verify on production**

- Login as admin@buddy.vn / 123456
- Check sidebar renders on desktop + mobile
- Test CRUD users (add, edit status, delete)
- Test invite code creation + copy
- Test register with invite code (new incognito tab)
- Test CRUD students (add with/without account, edit, delete)
- Test "Học thử" button
- Test pending user screen

- [ ] **Step 3: Sync check**

```bash
LOCAL=$(git rev-parse HEAD) && VPS=$(ssh oracle-vps "cd ~/english-buddy && git rev-parse HEAD") && [ "$LOCAL" = "$VPS" ] && echo "✅ Synced"
```
