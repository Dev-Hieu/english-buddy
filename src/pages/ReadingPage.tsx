import { BookOpen } from "lucide-react";
import { useState } from "react";
import type { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; onBackHome: () => void; }

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function ReadingPage({ student, onBackHome }: Props) {
  const [level, setLevel] = useState<CEFRLevel>("A1");

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      <SessionHeader title="Đọc hiểu" onClose={onBackHome} />

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

      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <BookOpen className="h-8 w-8" />
          </span>
          <h2 className="text-lg font-black">Đọc hiểu câu chuyện</h2>
          <p className="text-sm text-muted-foreground">Trình độ {level} · Đọc stories tiếng Anh → trả lời câu hỏi</p>
          <p className="text-sm font-bold text-primary">Đang phát triển...</p>
          <p className="text-xs text-muted-foreground">Tính năng này sẽ sớm được hoàn thiện</p>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
        {student.name}
      </p>
    </main>
  );
}
