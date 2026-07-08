import { apiRequest } from "./api";

export interface GameScore {
  id: number;
  studentId: string;
  studentName: string;
  score: number;
  detail?: string;
  createdAt: number;
}

export interface MyGameRank {
  bestScore: number;
  rank: number;
  totalPlayers: number;
}

export function submitGameScore(studentId: string, gameId: string, score: number, detail?: string) {
  return apiRequest("/api/game-scores", { method: "POST", body: { studentId, gameId, score, detail } });
}

export function getGameLeaderboard(gameId: string, limit = 10): Promise<GameScore[]> {
  return apiRequest(`/api/game-scores/${gameId}?limit=${limit}`, { auth: false });
}

export function getMyGameRank(gameId: string, studentId: string): Promise<MyGameRank> {
  return apiRequest(`/api/game-scores/${gameId}/my?studentId=${studentId}`);
}
