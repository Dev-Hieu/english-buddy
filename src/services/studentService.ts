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
  level: string;
}
export function createStudent(data: NewStudent): Promise<Student> {
  return apiRequest(`/api/students`, { method: "POST", body: data });
}

export function updateStudent(id: string, data: Partial<NewStudent>): Promise<Student> {
  return apiRequest(`/api/students/${id}`, { method: "PUT", body: data });
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
  studentLimit: number;
  isPremium?: number;
  canEditImages?: number;
}
export function listUsers(): Promise<AdminUser[]> {
  return apiRequest(`/api/admin/users`);
}
export function setStudentLimit(userId: string, studentLimit: number): Promise<{ ok: boolean; studentLimit: number }> {
  return apiRequest(`/api/admin/users/${userId}`, { method: "PUT", body: { studentLimit } });
}
export function setPremium(userId: string, isPremium: boolean): Promise<{ ok: boolean; isPremium: boolean }> {
  return apiRequest(`/api/admin/users/${userId}`, { method: "PUT", body: { isPremium } });
}
export function setImageEditor(userId: string, canEditImages: boolean): Promise<{ ok: boolean; canEditImages: boolean }> {
  return apiRequest(`/api/admin/users/${userId}`, { method: "PUT", body: { canEditImages } });
}
export function resetScores(): Promise<{ ok: boolean; students: number }> {
  return apiRequest(`/api/admin/reset-scores`, { method: "POST" });
}

export interface LeaderEntry {
  id: string;
  name: string;
  avatar: string;
  level: string;
  points: number;
  streak: number;
}
export function getLeaderboard(period: "week" | "all" = "week", level = ""): Promise<LeaderEntry[]> {
  const lv = level ? `&level=${encodeURIComponent(level)}` : "";
  return apiRequest(`/api/leaderboard?period=${period}${lv}`);
}
