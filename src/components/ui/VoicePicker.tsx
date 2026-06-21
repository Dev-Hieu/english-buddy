import { AudioLines, Volume2 } from "lucide-react";
import { useState } from "react";
import { getVoicePrefs, setVoicePrefs, type Accent, type Gender, type Rate } from "@/services/voicePrefs";
import { speakText } from "@/services/speechService";
import { Button } from "./button";
import { cn } from "./cn";

function Seg<T extends string>({ value, options, onChange }: {
  value: T; options: { v: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={cn("flex-1 rounded-lg px-2 py-1.5 text-sm font-bold transition active:scale-95",
            value === o.v ? "bg-card text-foreground shadow-card" : "text-muted-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function VoicePicker() {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState(getVoicePrefs());
  const upd = (patch: Partial<{ accent: Accent; gender: Gender; rate: Rate }>) => setP(setVoicePrefs(patch));

  return (
    <div className="relative">
      <Button type="button" size="icon" variant="outline" aria-label="Giọng đọc" onClick={() => setOpen((o) => !o)}>
        <AudioLines className="h-5 w-5" />
      </Button>
      {open ? (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-2 w-64 space-y-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">Giọng vùng</p>
              <Seg value={p.accent} onChange={(v) => upd({ accent: v })}
                options={[{ v: "us", label: "Anh-Mỹ" }, { v: "gb", label: "Anh-Anh" }]} />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">Giọng đọc</p>
              <Seg value={p.gender} onChange={(v) => upd({ gender: v })}
                options={[{ v: "female", label: "Nữ" }, { v: "male", label: "Nam" }]} />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">Tốc độ</p>
              <Seg value={p.rate} onChange={(v) => upd({ rate: v })}
                options={[{ v: "slow", label: "Chậm" }, { v: "normal", label: "Vừa" }, { v: "fast", label: "Nhanh" }]} />
            </div>
            <Button type="button" variant="secondary" className="w-full" onClick={() => speakText("Hello! Let's learn English together.")}>
              <Volume2 className="h-4 w-4" /> Nghe thử
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
