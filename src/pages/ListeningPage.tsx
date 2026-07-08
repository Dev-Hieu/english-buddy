import { Ear, Image, MessageSquare, Headphones } from "lucide-react";
import { useState } from "react";
import type { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; onBackHome: () => void; }

type Mode = "word-image" | "sentence" | "stories";
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const MODES: { key: Mode; icon: typeof Ear; label: string; desc: string; color: string }[] = [
  { key: "word-image", icon: Image, label: "Nghe từ chọn ảnh", desc: "Nghe phát âm → chọn hình đúng", color: "bg-blue-100 text-blue-600" },
  { key: "sentence", icon: MessageSquare, label: "Nghe câu chọn đáp án", desc: "Nghe câu → chọn câu trả lời đúng", color: "bg-green-100 text-green-600" },
  { key: "stories", icon: Headphones, label: "Nghe hiểu câu chuyện", desc: "Nghe audio stories → trả lời câu hỏi", color: "bg-purple-100 text-purple-600" },
];

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function ListeningPage({ student, onBackHome }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<CEFRLevel>("A1");

  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-xl px-4">
        <SessionHeader title="Nghe" onClose={onBackHome} />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MODES.map((m) => (
            <button key={m.key} type="button" onClick={() => setMode(m.key)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md text-left">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", m.color)}>
                <m.icon className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          Trình độ: {level} · {student.name}
        </p>
      </main>
    );
  }

  const modeInfo = MODES.find((m) => m.key === mode)!;

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title={modeInfo.label} onClose={() => setMode(null)} />

      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <span className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-2xl", modeInfo.color)}>
            <modeInfo.icon className="h-8 w-8" />
          </span>
          <h2 className="text-lg font-black">{modeInfo.label}</h2>
          <p className="text-sm text-muted-foreground">Trình độ {level}</p>
          <p className="text-sm font-bold text-primary">Đang phát triển...</p>
          <p className="text-xs text-muted-foreground">Tính năng này sẽ sớm được hoàn thiện</p>
        </CardContent>
      </Card>
    </main>
  );
}
