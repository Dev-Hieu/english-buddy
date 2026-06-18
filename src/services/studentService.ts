import { apiRequest } from "./api";
import type { Student } from "../types";

export function listStudents(): Promise<Student[]> {
  return apiRequest(`/api/students`);
}

export function getStudent(id: string): Promise<Student> {
  return apiRequest(`/api/students/${id}`);
}

export interface NewStudent {
  name: string;
  grade: number;
  avatar: string;
  dailyGoal: number;
}
export function createStudent(data: NewStudent): Promise<Student> {
  return apiRequest(`/api/students`, { method: "POST", body: data });
}

export function deleteStudent(id: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/students/${id}`, { method: "DELETE" });
}

// Admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: number;
  studentCount: number;
}
export function listUsers(): Promise<AdminUser[]> {
  return apiRequest(`/api/admin/users`);
}
