import { apiRequest } from "./api";

export interface Certificate {
  id: string;
  type: string;
  level: string;
  score: number;
  totalQuestions: number;
  certId: string;
  createdAt: number;
}

export function saveCertificate(studentId: string, data: Omit<Certificate, "id" | "createdAt">) {
  return apiRequest("/api/certificates", { method: "POST", body: { studentId, ...data } });
}

export function getCertificates(studentId: string): Promise<Certificate[]> {
  return apiRequest(`/api/students/${studentId}/certificates`);
}
