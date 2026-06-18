// Huy hiệu suy ra từ chỉ số học tập. Level theo XP (100 XP / cấp).
export interface Badge {
  id: string;
  label: string;
  emoji: string;
  earned: boolean;
}

export interface Stats {
  learned: number;
  streak: number;
  xp: number;
}

export const levelOf = (xp: number) => Math.floor((xp || 0) / 100) + 1;
export const xpInLevel = (xp: number) => (xp || 0) % 100;

export function computeBadges(s: Stats): Badge[] {
  return [
    { id: "first10", emoji: "🌱", label: "10 từ đầu", earned: s.learned >= 10 },
    { id: "word50", emoji: "📚", label: "50 từ", earned: s.learned >= 50 },
    { id: "word100", emoji: "🎓", label: "100 từ", earned: s.learned >= 100 },
    { id: "streak3", emoji: "🔥", label: "3 ngày", earned: s.streak >= 3 },
    { id: "streak7", emoji: "⚡", label: "7 ngày", earned: s.streak >= 7 },
    { id: "xp100", emoji: "⭐", label: "100 XP", earned: s.xp >= 100 },
    { id: "xp500", emoji: "🏅", label: "500 XP", earned: s.xp >= 500 },
  ];
}
