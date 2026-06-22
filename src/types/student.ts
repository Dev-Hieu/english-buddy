// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)

// Thang cấp độ học: trẻ em -> IELTS (CEFR).
export type Level = "kids" | "a1" | "a2" | "b1" | "b2" | "c1";

export const LEVEL_LABELS: Record<Level, string> = {
  kids: "Trẻ em", a1: "A1 (Sơ cấp)", a2: "A2 (Sơ cấp+)",
  b1: "B1 (Trung cấp)", b2: "B2 (Trung cao)", c1: "C1 (IELTS)",
};
export const LEVEL_ORDER: Level[] = ["kids", "a1", "a2", "b1", "b2", "c1"];

export interface Student {
  id: string; // "student_001" | "student_002"
  parentId: string;
  userId?: string;
  name: string; // "Bảo Ngọc" | "Bảo Nam"
  grade: number;
  level: Level;
  avatar: string; // asset key, vd "girl_avatar_01"
  dailyGoal: number; // số từ/ngày
  xp: number;
  streak: number;
  createdAt: number;
}
