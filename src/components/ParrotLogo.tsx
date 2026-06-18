export function ParrotLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      {/* Body - white/cream to pop on teal */}
      <ellipse cx="100" cy="115" rx="52" ry="58" fill="#FFF8E1" />
      {/* Belly highlight */}
      <ellipse cx="100" cy="120" rx="36" ry="40" fill="#FFFFFF" opacity="0.6" />
      {/* Left wing */}
      <ellipse cx="52" cy="110" rx="22" ry="40" fill="#FFB300" transform="rotate(12 52 110)" />
      <ellipse cx="52" cy="115" rx="16" ry="32" fill="#FF8F00" transform="rotate(12 52 115)" />
      {/* Right wing */}
      <ellipse cx="148" cy="110" rx="22" ry="40" fill="#FFB300" transform="rotate(-12 148 110)" />
      <ellipse cx="148" cy="115" rx="16" ry="32" fill="#FF8F00" transform="rotate(-12 148 115)" />
      {/* Head - facing forward, bright green */}
      <ellipse cx="100" cy="55" rx="44" ry="42" fill="#4CAF50" />
      {/* Head highlight */}
      <ellipse cx="100" cy="48" rx="34" ry="28" fill="#66BB6A" opacity="0.7" />
      {/* Crest/tuft on top */}
      <ellipse cx="100" cy="16" rx="10" ry="14" fill="#FF5722" />
      <ellipse cx="88" cy="20" rx="8" ry="12" fill="#FF7043" transform="rotate(15 88 20)" />
      <ellipse cx="112" cy="20" rx="8" ry="12" fill="#FF7043" transform="rotate(-15 112 20)" />
      {/* Left eye white */}
      <ellipse cx="78" cy="52" rx="14" ry="15" fill="#fff" />
      {/* Left pupil */}
      <circle cx="80" cy="52" r="8" fill="#1A1A2E" />
      {/* Left eye shine */}
      <circle cx="83" cy="49" r="3" fill="#fff" />
      {/* Right eye white */}
      <ellipse cx="122" cy="52" rx="14" ry="15" fill="#fff" />
      {/* Right pupil */}
      <circle cx="120" cy="52" r="8" fill="#1A1A2E" />
      {/* Right eye shine */}
      <circle cx="123" cy="49" r="3" fill="#fff" />
      {/* Beak - front facing, orange */}
      <path d="M90,68 L100,82 L110,68 Z" fill="#FF6D00" />
      <path d="M90,68 L100,74 L110,68 Z" fill="#FFB300" />
      {/* Cheek blush */}
      <circle cx="68" cy="64" r="8" fill="#FF8A80" opacity="0.5" />
      <circle cx="132" cy="64" r="8" fill="#FF8A80" opacity="0.5" />
      {/* Tail feathers */}
      <rect x="80" y="162" width="12" height="28" rx="6" fill="#4CAF50" transform="rotate(-8 86 176)" />
      <rect x="94" y="164" width="12" height="25" rx="6" fill="#66BB6A" />
      <rect x="108" y="162" width="12" height="28" rx="6" fill="#4CAF50" transform="rotate(8 114 176)" />
      {/* Feet */}
      <rect x="78" y="172" width="16" height="8" rx="4" fill="#FF6D00" />
      <rect x="106" y="172" width="16" height="8" rx="4" fill="#FF6D00" />
    </svg>
  );
}
