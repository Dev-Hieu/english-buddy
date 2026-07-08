import { BookMarked, Dumbbell, GraduationCap, Home, Mic, Search } from "lucide-react";
import { cn } from "@/components/ui/cn";

export type TabKey = "home" | "lookup" | "review" | "mywords" | "test" | "speak";

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Học", icon: Home },
  { key: "lookup", label: "Tra từ", icon: Search },
  { key: "speak", label: "Nói", icon: Mic },
  { key: "review", label: "Ôn", icon: Dumbbell },
  { key: "mywords", label: "Từ vựng", icon: BookMarked },
  { key: "test", label: "Test", icon: GraduationCap },
];

export function TabBar({ active, onSelect }: { active: TabKey | null; onSelect: (key: TabKey) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const on = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onSelect(t.key)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
                on ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn("flex h-8 w-11 items-center justify-center rounded-2xl transition-colors", on && "bg-secondary")}>
                <t.icon className="h-5 w-5" strokeWidth={2.6} />
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
