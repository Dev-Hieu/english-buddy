import { Palette } from "lucide-react";
import { useState } from "react";
import { applyTheme, getThemeId, THEMES } from "./theme";
import { cn } from "./cn";

export function ThemePicker() {
  const [id, setId] = useState(getThemeId());

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-bold">Đổi màu</span>
      </div>
      <div className="flex gap-2 justify-center">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.name}
            aria-label={t.name}
            onClick={() => { applyTheme(t.id); setId(t.id); }}
            style={{ background: t.swatch }}
            className={cn("h-7 w-7 rounded-full transition-all active:scale-90 hover:scale-110", id === t.id ? "ring-2 ring-foreground ring-offset-2" : "")}
          />
        ))}
      </div>
    </div>
  );
}
