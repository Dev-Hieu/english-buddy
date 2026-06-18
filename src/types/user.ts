// Đồng bộ với docs/CONTRACTS.md §1 (Contracts version 1)

export type Role = "parent";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: number; // epoch ms
}
