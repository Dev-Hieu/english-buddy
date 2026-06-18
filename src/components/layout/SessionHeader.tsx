import { X } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";

interface SessionHeaderProps {
  title: string;
  onClose: () => void;
  right?: React.ReactNode;
  progress?: number; // 0..100; có thì hiện thanh tiến độ dưới header
}

export function SessionHeader({ title, onClose, right, progress }: SessionHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 bg-background/80 px-4 pb-2 pt-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-colors hover:bg-secondary active:translate-y-[1px]"
        >
          <X className="h-5 w-5" strokeWidth={2.8} />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold">{title}</h1>
        {right}
      </div>
      {typeof progress === "number" ? <ProgressBar value={progress} className="mt-3 h-2.5" /> : null}
    </div>
  );
}
