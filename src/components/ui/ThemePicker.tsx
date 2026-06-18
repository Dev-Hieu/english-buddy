import { Palette } from "lucide-react";
import { useState } from "react";
import { applyTheme, getThemeId, THEMES } from "./theme";
import { cn } from "./cn";
import { Button } from "./button";

export function ThemePicker() {
  const [id, setId] = useState(getThemeId());
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button type="button" size="icon" variant="outline" aria-label="Đổi màu" onClick={() => setOpen((o) => !o)}>
        <Palette className="h-5 w-5" />
      </Button>
      {open ? (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-2 flex gap-2 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.name}
                aria-label={t.name}
                onClick={() => { applyTheme(t.id); setId(t.id); setOpen(false); }}
                style={{ background: t.swatch }}
                className={cn("h-8 w-8 rounded-full transition-transform active:scale-90", id === t.id ? "ring-2 ring-foreground ring-offset-2" : "")}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
