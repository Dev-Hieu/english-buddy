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
  status?: string;
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
export interface ResetOptions { xp?: boolean; streak?: boolean; progress?: boolean; quiz?: boolean; lookups?: boolean }
export function resetScores(opts: ResetOptions): Promise<{ ok: boolean; done: string[] }> {
  return apiRequest(`/api/admin/reset-scores`, { method: "POST", body: opts });
}

// Admin: tạo user mới
export interface CreateUserPayload { email: string; password: string; name: string; role?: string; studentLimit?: number; isPremium?: boolean; }
export function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  return apiRequest(`/api/admin/users`, { method: "POST", body: payload });
}

// Admin: xoá user
export function deleteUser(userId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" });
}

// Admin: tạo student trực tiếp (cho lớp học)
export interface CreateStudentDirectPayload { name: string; grade: number; level: string; avatar?: string; dailyGoal?: number; email?: string; password?: string; }
export interface CreateStudentDirectResult { student: any; user?: { email: string; password: string }; }
export function createStudentDirect(payload: CreateStudentDirectPayload): Promise<CreateStudentDirectResult> {
  return apiRequest(`/api/admin/create-student`, { method: "POST", body: payload });
}

// Admin: list tất cả students
export interface AdminStudent { id: string; name: string; grade: number; level: string; avatar: string; xp: number; streak: number; parentId: string; parentName: string; parentEmail: string; createdAt: number; }
export function listAllStudents(): Promise<AdminStudent[]> {
  return apiRequest(`/api/admin/students`);
}

// Admin: xoá student
export function deleteStudentAdmin(studentId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/students/${studentId}`, { method: "DELETE" });
}

// Admin: cập nhật student
export function updateStudentAdmin(studentId: string, data: Partial<{ name: string; grade: number; level: string; avatar: string; dailyGoal: number }>): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/students/${studentId}`, { method: "PUT", body: data });
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

export interface InviteCode { code: string; type: string; classId?: string; maxUses: number; usedCount: number; createdBy: string; createdAt: number; expiresAt?: number; }
export function listInviteCodes(): Promise<InviteCode[]> { return apiRequest("/api/admin/invite-codes"); }
export function createInviteCode(data: { type: string; classId?: string; maxUses?: number; expiresAt?: number }): Promise<{ ok: boolean; code: string }> {
  return apiRequest("/api/admin/invite-codes", { method: "POST", body: data });
}
export function deleteInviteCode(code: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/invite-codes/${code}`, { method: "DELETE" });
}
export function setUserStatus(userId: string, status: "active" | "pending" | "rejected"): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/users/${userId}/status`, { method: "PUT", body: { status } });
}

// Teacher
export interface ClassInfo { id: string; name: string; code: string; teacherId: string; grade?: number; level?: string; studentCount: number; createdAt: number; }
export interface ClassStudent { id: string; name: string; grade: number; level: string; avatar: string; xp: number; streak: number; dailyGoal: number; vocabCount: number; }
export function getTeacherClasses(): Promise<ClassInfo[]> { return apiRequest("/api/teacher/classes"); }
export function getClassStudents(classId: string): Promise<ClassStudent[]> { return apiRequest(`/api/teacher/classes/${classId}/students`); }
export function addStudentToClass(classId: string, studentId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/teacher/classes/${classId}/students`, { method: "POST", body: { studentId } });
}
export function removeStudentFromClass(classId: string, studentId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/teacher/classes/${classId}/students/${studentId}`, { method: "DELETE" });
}
export function setStudentGoal(studentId: string, dailyGoal: number): Promise<{ ok: boolean }> {
  return apiRequest(`/api/teacher/students/${studentId}/goal`, { method: "PUT", body: { dailyGoal } });
}

// Admin: classes
export interface AdminClass { id: string; name: string; teacherId?: string; teacherName?: string; teacherEmail?: string; code: string; grade?: number; level?: string; studentCount: number; createdAt: number; }
export function listClasses(): Promise<AdminClass[]> { return apiRequest("/api/admin/classes"); }
export function createClass(data: { name: string; teacherId?: string; grade?: number; level?: string }): Promise<{ ok: boolean; id: string; code: string }> {
  return apiRequest("/api/admin/classes", { method: "POST", body: data });
}
export function updateClass(classId: string, data: { name?: string; teacherId?: string; grade?: number; level?: string }): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/classes/${classId}`, { method: "PUT", body: data });
}
export function deleteClass(classId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/classes/${classId}`, { method: "DELETE" });
}
export function addStudentToClassAdmin(classId: string, studentId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/classes/${classId}/students`, { method: "POST", body: { studentId } });
}
export function removeStudentFromClassAdmin(classId: string, studentId: string): Promise<{ ok: boolean }> {
  return apiRequest(`/api/admin/classes/${classId}/students/${studentId}`, { method: "DELETE" });
}
export function getClassStudentsAdmin(classId: string): Promise<any[]> {
  return apiRequest(`/api/admin/classes/${classId}/students`);
}
