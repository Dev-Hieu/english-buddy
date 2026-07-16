interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="text-[10px] text-muted-foreground text-center py-3 space-y-1">
      <p>English Buddy v1.0 · © 2026 · en.vev.vn</p>
      <button
        type="button"
        onClick={() => onNavigate("premium")}
        className="font-bold text-amber-600 hover:underline"
      >
        ⭐ Nâng cấp Premium
      </button>
    </footer>
  );
}
