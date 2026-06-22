# Admin Dashboard — Phase 1 Design

## Scope
Sidebar layout + Tổng quan + Tài khoản (CRUD + 4 cách duyệt) + Học sinh (CRUD + Học thử).

## 1. Layout: Sidebar + Content

### Desktop (≥768px)
```
┌──────────┬──────────────────────────────┐
│ Sidebar  │         Content Area         │
│ 240px    │         flex-1               │
│          │                              │
│ 📊 Tổng  │   [Header: breadcrumb]       │
│ 👤 TK    │   [Page content...]          │
│ 👦 HS    │                              │
│ 📚 NDD   │                              │
│ 🖼️ Ảnh   │                              │
│ 📈 BC    │                              │
│ 🔔 TB    │                              │
│ 🟢 OL    │                              │
│ ⚙️ CĐ   │                              │
│          │                              │
│ ──────── │                              │
│ 🚪 Thoát │                              │
└──────────┴──────────────────────────────┘
```

### Mobile (<768px)
- Sidebar ẩn, hiện hamburger menu (☰) trên header
- Bấm ☰ → sidebar slide từ trái, overlay backdrop
- Bấm menu item → đóng sidebar, hiện content

### Implementation
- New file: `src/components/admin/AdminLayout.tsx` — sidebar + content slot
- New file: `src/components/admin/AdminSidebar.tsx` — menu items, active state
- AdminPage.tsx → dùng AdminLayout, render content theo `tab` state
- Sidebar items: icon + label, active item highlighted with primary bg
- Bottom: user info (admin name) + nút Thoát

## 2. Tổng quan (Dashboard)

### Header
- "Xin chào, [Admin name] 👋" trên gradient primary
- Ngày hiện tại

### Stats Grid (2x2 on mobile, 4x1 on desktop)
| Card | Số liệu | Icon | Click → |
|------|---------|------|---------|
| Tài khoản | users count | 👤 | tab "users" |
| Học sinh | students count | 👦 | tab "students" |
| Premium | premium count | 👑 | — |
| Online | online count (GĐ2, hiện "—") | 🟢 | — |

### Chờ duyệt (nếu có)
- Banner nổi bật: "⚠️ N tài khoản chờ duyệt" → bấm vào tab TK filter pending
- Không hiện nếu pending = 0

### Quick Actions (grid 2 cột)
- Thêm tài khoản → tab users + open form
- Tạo học sinh → tab students + open form
- Tạo mã mời → modal tạo invite code
- Tạo mã lớp → modal tạo class code

### Hoạt động gần đây
- 5 dòng gần nhất: "Bé An vừa hoàn thành bài Food" / "Phụ huynh Minh đăng ký"
- (GĐ2 — placeholder "Sắp có" cho GĐ1)

## 3. Tài khoản (Users)

### Header
- Tiêu đề "Tài khoản" + nút [+ Thêm]
- Tabs filter: Tất cả | Chờ duyệt | Premium | Admin

### User Table/List
- Mobile: card list (như hiện tại nhưng gọn hơn)
- Desktop: table view với cột: Avatar | Tên | Email | Role | Trạng thái | Bé | Hành động

### Trạng thái tài khoản (MỚI)
- `status` field trên users table: `"active"` | `"pending"` | `"rejected"`
- Mặc định khi đăng ký: `"pending"`
- Active ngay khi: có invite code hoặc class code hợp lệ
- Admin duyệt: chuyển pending → active hoặc rejected

### CRUD Actions
- **Thêm**: form popup — tên, email, mật khẩu, role (parent/admin), premium, trạng thái (active/pending)
- **Sửa**: inline edit — tên, email, hạn mức bé, premium toggle, quyền ảnh, trạng thái
- **Xoá**: confirm dialog → cascade xoá students + data
- **Duyệt**: nút Duyệt (✓) / Từ chối (✗) cho tài khoản pending

### Invite Code System (MỚI)
- DB table: `invite_codes (code TEXT PRIMARY KEY, type TEXT, classId TEXT, maxUses INT, usedCount INT, createdAt INT, expiresAt INT)`
- `type`: "invite" (mã mời cá nhân) | "class" (mã lớp)
- API: `POST /api/admin/invite-codes` — tạo mã
- API: `GET /api/admin/invite-codes` — list mã
- API: `DELETE /api/admin/invite-codes/:code` — xoá mã
- Register flow: nếu body có `inviteCode` → validate → auto active + gán lớp nếu type=class

### Mã mời UI
- Trong tab Tài khoản: section "Mã mời & Mã lớp"
- Tạo mã: chọn loại (mời/lớp), số lần dùng, hạn dùng
- List mã: code | loại | đã dùng/tối đa | hạn | nút copy | xoá

## 4. Học sinh (Students)

### Header
- Tiêu đề "Học sinh" + nút [+ Tạo học sinh]
- Filter: Tất cả | Theo lớp | Theo trình độ

### Student List
- Card mỗi bé: Avatar (👦/👧) | Tên | Lớp | Trình độ | ⭐XP | 🔥Streak | Vốn từ
- Parent info: "👤 Phụ huynh (email)" hoặc "📚 Lớp học"
- Actions: [Học thử] [✏️ Sửa] [🗑️ Xoá]

### Tạo học sinh
- Form: Tên, Lớp (1-12), Trình độ (kids→c1), Avatar (👦/👧), Mục tiêu/ngày
- Toggle: "Tạo tài khoản riêng" → hiện email + mật khẩu
- Không tạo TK → gán vào user "classroom"

### Sửa học sinh
- Form giống tạo, pre-fill dữ liệu hiện tại
- Thêm: đổi mật khẩu (nếu có TK riêng), chuyển phụ huynh

### "Học thử"
- Admin bấm → App chuyển sang profile bé đó, vào trang Home
- Hiện badge "Đang xem với tư cách [Tên bé]" ở trên cùng
- Nút "Quay lại Admin" để trở về

## 5. Database Changes

### users table — thêm cột
```sql
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
-- 'active' | 'pending' | 'rejected'
```

### New table: invite_codes
```sql
CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'invite' | 'class'
  classId TEXT,
  maxUses INTEGER DEFAULT 1,
  usedCount INTEGER DEFAULT 0,
  createdBy TEXT,
  createdAt INTEGER,
  expiresAt INTEGER
);
```

### New table: notifications (GĐ2, placeholder)

## 6. Auth Flow Changes

### Register (sửa)
```
POST /api/register
Body: { email, password, name, inviteCode? }

1. Validate email unique
2. If inviteCode:
   a. Lookup invite_codes where code = inviteCode AND usedCount < maxUses AND (expiresAt IS NULL OR expiresAt > now)
   b. If valid: create user with status='active', increment usedCount
   c. If type='class': auto-create student under classroom user with classId
   d. If invalid: return error "Mã không hợp lệ hoặc hết lượt"
3. If no inviteCode: create user with status='pending'
4. Return { token, user } — nhưng user.status = 'pending' thì app hiện "Chờ duyệt"
```

### Login (sửa)
- Nếu user.status = 'pending' → vẫn login được nhưng app hiện trang "Tài khoản đang chờ duyệt"
- Nếu user.status = 'rejected' → return error "Tài khoản bị từ chối"

## 7. File Structure
```
src/
├── components/admin/
│   ├── AdminLayout.tsx      — sidebar + content wrapper
│   ├── AdminSidebar.tsx     — menu items
│   └── AdminHeader.tsx      — breadcrumb + mobile hamburger
├── pages/
│   ├── AdminPage.tsx        — orchestrator, render tab content
│   ├── admin/
│   │   ├── OverviewTab.tsx  — dashboard
│   │   ├── UsersTab.tsx     — CRUD users + approval + invite codes
│   │   ├── StudentsTab.tsx  — CRUD students
│   │   └── (GĐ2+: ContentTab, ReportsTab, NotificationsTab, SettingsTab)
│   └── ...
```

## 8. Không thuộc GĐ1 (GĐ2+)
- 📚 Nội dung (CRUD topics/vocab/grammar)
- 🖼️ Ảnh từ vựng (giữ picker hiện tại)
- 📈 Báo cáo (biểu đồ + xuất file)
- 🔔 Thông báo (soạn + gửi)
- 🟢 Online realtime
- ⚙️ Cài đặt (config TTS, API keys, defaults)
- Hoạt động gần đây (activity log)
