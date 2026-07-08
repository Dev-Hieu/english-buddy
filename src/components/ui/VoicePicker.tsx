import { AudioLines, ChevronDown, Volume2 } from "lucide-react";
import { useState } from "react";
import { getVoicePrefs, setVoicePrefs, type Accent, type Gender, type Rate } from "@/services/voicePrefs";
import { speakText } from "@/services/speechService";
import { cn } from "./cn";

function Seg<T extends string>({ value, options, onChange }: {
  value: T; options: { v: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={cn("flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition active:scale-95",
            value === o.v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
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
    <div className="px-3 py-2">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-sm font-bold">
        <AudioLines className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left">Giọng đọc</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <div>
            <p className="mb-1 text-[10px] font-bold text-muted-foreground">Giọng vùng</p>
            <Seg value={p.accent} onChange={(v) => upd({ accent: v })}
              options={[{ v: "us", label: "Mỹ" }, { v: "gb", label: "Anh" }]} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold text-muted-foreground">Giới tính</p>
            <Seg value={p.gender} onChange={(v) => upd({ gender: v })}
              options={[{ v: "female", label: "Nữ" }, { v: "male", label: "Nam" }]} />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold text-muted-foreground">Tốc độ</p>
            <Seg value={p.rate} onChange={(v) => upd({ rate: v })}
              options={[{ v: "slow", label: "Chậm" }, { v: "normal", label: "Vừa" }, { v: "fast", label: "Nhanh" }]} />
          </div>
          <button type="button" onClick={() => speakText("Hello! Let's learn English together.")}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted py-1.5 text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
            <Volume2 className="h-3.5 w-3.5" /> Nghe thử
          </button>
        </div>
      )}
    </div>
  );
}
