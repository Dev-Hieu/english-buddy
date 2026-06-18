// Các bộ màu chủ đạo — đổi bằng cách ghi đè biến CSS trên :root (áp dụng toàn app ngay).
export interface Theme {
  id: string;
  name: string;
  swatch: string; // màu chấm hiển thị ở nút chọn
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "teal", name: "Xanh ngọc", swatch: "hsl(176 76% 37%)",
    vars: { "--primary": "176 76% 37%", "--primary-shadow": "176 76% 27%", "--accent": "22 100% 62%", "--accent-shadow": "18 90% 46%", "--secondary": "176 58% 91%", "--secondary-foreground": "178 72% 22%" },
  },
  {
    id: "purple", name: "Tím", swatch: "hsl(262 68% 56%)",
    vars: { "--primary": "262 68% 56%", "--primary-shadow": "262 60% 42%", "--accent": "28 100% 60%", "--accent-shadow": "24 90% 46%", "--secondary": "262 60% 94%", "--secondary-foreground": "262 55% 34%" },
  },
  {
    id: "pink", name: "Hồng", swatch: "hsl(330 75% 56%)",
    vars: { "--primary": "330 75% 56%", "--primary-shadow": "330 65% 42%", "--accent": "199 90% 52%", "--accent-shadow": "199 80% 40%", "--secondary": "330 70% 95%", "--secondary-foreground": "330 58% 38%" },
  },
  {
    id: "blue", name: "Xanh dương", swatch: "hsl(214 84% 56%)",
    vars: { "--primary": "214 84% 56%", "--primary-shadow": "214 80% 42%", "--accent": "22 100% 60%", "--accent-shadow": "18 90% 46%", "--secondary": "214 70% 93%", "--secondary-foreground": "214 70% 32%" },
  },
  {
    id: "green", name: "Xanh lá", swatch: "hsl(150 60% 42%)",
    vars: { "--primary": "150 60% 42%", "--primary-shadow": "150 55% 30%", "--accent": "35 100% 58%", "--accent-shadow": "30 90% 45%", "--secondary": "150 55% 92%", "--secondary-foreground": "150 60% 24%" },
  },
  {
    id: "orange", name: "Cam", swatch: "hsl(22 90% 52%)",
    vars: { "--primary": "22 90% 52%", "--primary-shadow": "18 85% 40%", "--accent": "196 85% 48%", "--accent-shadow": "196 80% 38%", "--secondary": "28 90% 93%", "--secondary-foreground": "22 80% 34%" },
  },
];

const KEY = "english-buddy:theme";

export function getThemeId(): string {
  if (typeof window === "undefined") return THEMES[0].id;
  return localStorage.getItem(KEY) ?? THEMES[0].id;
}

export function applyTheme(id: string): void {
  const t = THEMES.find((x) => x.id === id) ?? THEMES[0];
  for (const [k, v] of Object.entries(t.vars)) document.documentElement.style.setProperty(k, v);
  localStorage.setItem(KEY, t.id);
}
