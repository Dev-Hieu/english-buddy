import { apiRequest } from "./api";
import type { Student } from "../types";

// Lấy hồ sơ học sinh (gồm streak hiện tại) từ DB trung tâm.
export function getStudent(id: string): Promise<Student> {
  return apiRequest(`/api/students/${id}`);
}
