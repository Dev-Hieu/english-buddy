import { ArrowRight, Mic, SkipForward } from "lucide-react";
import type { PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

export const SPEAK_PASS = 60;

interface SpeakResultProps {
  result: PronResult;
  onRetry: () => void;
  onContinue: () => void;
  onSkip: () => void;
  continueLabel?: React.ReactNode;
  ringSize?: number;
  showHeard?: boolean;
}

export function SpeakResult({
  result, onRetry, onContinue, onSkip,
  continueLabel = "Tiếp tục", ringSize = 80, showHeard = false,
}: SpeakResultProps) {
  const pass = result.score >= SPEAK_PASS;
  const score = result.score;
  const color = pass ? "text-success" : "text-red-600";
  const bgColor = pass ? "bg-success/10" : "bg-red-50";

  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-2xl p-4 w-full", bgColor)}>
      {/* Score + verdict */}
      <div className="flex items-center gap-4">
        {/* Score ring */}
        <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/20" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className={color}
              strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <span className={cn("absolute text-xl font-black", color)}>{score}%</span>
        </div>
        <div>
          <p className={cn("text-lg font-black", color)}>
            {pass ? "Đạt! 👏" : "Chưa đạt"}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">
            {score >= 90 ? "Xuất sắc!" : score >= 80 ? "Rất tốt!" : pass ? "Khá tốt" : "Đọc lại nhé"}
          </p>
        </div>
      </div>

      {/* Phoneme chips — compact */}
      {result.phones.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {result.phones.map((p, i) => (
            <span key={i} className={cn("rounded-md px-1.5 py-0.5 text-xs font-extrabold", p.ok ? "bg-success/20 text-success" : "bg-red-200 text-red-700")}>
              {p.ipa}
            </span>
          ))}
        </div>
      )}

      {/* Heard */}
      {showHeard && result.heard && (
        <p className="text-[10px] font-semibold text-muted-foreground">Nghe được: /{result.heard}/</p>
      )}

      {/* Buttons — compact */}
      <div className="flex w-full gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onRetry}>
          <Mic className="h-4 w-4" /> Đọc lại
        </Button>
        {pass ? (
          <Button type="button" size="sm" className="flex-1" onClick={onContinue}>{continueLabel}</Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onSkip}>
            <SkipForward className="h-4 w-4" /> Bỏ qua
          </Button>
        )}
      </div>
    </div>
  );
}
