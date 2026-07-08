import { X } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/components/ui/cn";

interface SessionHeaderProps {
  title: string;
  icon?: React.ReactNode; // icon hoặc emoji trước title
  iconBg?: string; // class nền cho icon (e.g. "bg-blue-500")
  onClose: () => void;
  right?: React.ReactNode;
  progress?: number; // 0..100
}

export function SessionHeader({ title, icon, iconBg, onClose, right, progress }: SessionHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border/60 bg-background/85 px-4 pb-2.5 pt-3 backdrop-blur">
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.5rem] text-white shadow-md text-sm", iconBg || "bg-primary")}>
            {icon}
          </span>
        )}
        <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold tracking-tight">{title}</h1>
        {right}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          title="Đóng"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-500 active:scale-95"
        >
          <X className="h-5 w-5" strokeWidth={2.8} />
        </button>
      </div>
      {typeof progress === "number" ? <ProgressBar value={progress} className="mt-3 h-2.5" /> : null}
    </div>
  );
}
