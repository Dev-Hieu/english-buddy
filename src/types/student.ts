// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)

export type Level = "beginner" | "elementary" | "intermediate";

export interface Student {
  id: string; // "student_001" | "student_002"
  parentId: string;
  name: string; // "Bảo Ngọc" | "Bảo Nam"
  grade: number;
  level: Level;
  avatar: string; // asset key, vd "girl_avatar_01"
  dailyGoal: number; // số từ/ngày
  xp: number;
  streak: number;
  createdAt: number;
}
