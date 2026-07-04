import { Mic } from "lucide-react";
import type { PronResult } from "@/services/pronunciationService";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { ProgressRing } from "@/components/ui/progress";

// Nguồn duy nhất cho mốc "đạt" khi chấm phát âm (dùng chung cho bài thi lẫn luyện nói).
export const SPEAK_PASS = 60;

interface SpeakResultProps {
  result: PronResult;
  /** Bấm "Đọc lại" — thu âm lại từ đầu. */
  onRetry: () => void;
  /** Đạt: bấm nút tiếp tục (label tuỳ nơi gọi). */
  onContinue: () => void;
  /** Chưa đạt: bấm "Bỏ qua" — không tính đạt, để ôn lại sau. */
  onSkip: () => void;
  /** Nhãn nút tiếp tục khi đạt (mặc định "Tiếp tục"). */
  continueLabel?: React.ReactNode;
  /** Kích thước vòng tròn điểm. */
  ringSize?: number;
  /** Có hiện dòng "Âm nghe được" không. */
  showHeard?: boolean;
}

/**
 * Khối kết quả chấm phát âm dùng chung: vòng %, chip âm vị, verdict đạt/chưa đạt,
 * và nút hành động theo trạng thái:
 *  - Đạt (>= SPEAK_PASS): [Đọc lại] + [tiếp tục]
 *  - Chưa đạt (< SPEAK_PASS): [Đọc lại] + [Bỏ qua]
 * Nơi gọi tự bọc container (Card / hộp muted) và hiển thị từ đang đọc.
 */
export function SpeakResult({
  result, onRetry, onContinue, onSkip,
  continueLabel = "Tiếp tục", ringSize = 92, showHeard = false,
}: SpeakResultProps) {
  const pass = result.score >= SPEAK_PASS;
  return (
    <>
      <ProgressRing value={result.score} max={100} size={ringSize} stroke={10}>
        <span className={cn("text-2xl font-black", pass ? "text-success" : "text-red-600")}>{result.score}%</span>
      </ProgressRing>

      {result.phones.length ? (
        <div className="flex flex-wrap justify-center gap-1.5">
          {result.phones.map((p, i) => (
            <span key={i} className={cn("rounded-lg px-2 py-1 text-sm font-extrabold", p.ok ? "bg-success/15 text-success" : "bg-red-100 text-red-600")}>
              {p.ipa}
            </span>
          ))}
        </div>
      ) : null}

      {showHeard && result.heard ? (
        <p className="text-xs font-semibold text-muted-foreground">Âm nghe được: {result.heard}</p>
      ) : null}

      <p className={cn("font-extrabold", pass ? "text-success" : "text-red-600")}>
        {pass ? "Đạt! Phát âm tốt 👏" : "Chưa đạt — đọc lại cho rõ hơn nhé"}
      </p>

      <div className="flex w-full gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onRetry}>
          <Mic className="h-5 w-5" /> Đọc lại
        </Button>
        {pass ? (
          <Button type="button" className="flex-1" onClick={onContinue}>{continueLabel}</Button>
        ) : (
          <Button type="button" variant="secondary" className="flex-1" onClick={onSkip}>Bỏ qua</Button>
        )}
      </div>
    </>
  );
}
