import type { Student } from "../types";

// 2 profile cứng (DECISIONS D-007). UI đọc trực tiếp để hiển thị màn chọn bé;
// Firestore chỉ lưu tiến độ/kết quả theo studentId.
const SEED_CREATED_AT = Date.UTC(2026, 5, 18);

export const SEED_STUDENTS: Student[] = [
  {
    id: "student_001",
    parentId: "parent_uid",
    name: "Bảo Ngọc",
    grade: 7,
    level: "beginner",
    avatar: "girl_avatar_01",
    dailyGoal: 10,
    xp: 0,
    streak: 0,
    createdAt: SEED_CREATED_AT,
  },
  {
    id: "student_002",
    parentId: "parent_uid",
    name: "Bảo Nam",
    grade: 5,
    level: "beginner",
    avatar: "boy_avatar_01",
    dailyGoal: 10,
    xp: 0,
    streak: 0,
    createdAt: SEED_CREATED_AT,
  },
];
