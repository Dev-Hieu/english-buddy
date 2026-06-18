export function ParrotLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      {/* Body */}
      <ellipse cx="95" cy="100" rx="55" ry="65" fill="#1CB0A8" />
      {/* Wing */}
      <ellipse cx="75" cy="110" rx="25" ry="35" fill="#158C86" transform="rotate(-10 75 110)" />
      {/* Head */}
      <ellipse cx="100" cy="50" rx="42" ry="42" fill="#26C7BD" />
      {/* Eye white */}
      <circle cx="115" cy="42" r="13" fill="#fff" />
      {/* Pupil */}
      <circle cx="119" cy="41" r="7" fill="#262633" />
      {/* Eye shine */}
      <circle cx="122" cy="38" r="3" fill="#fff" />
      {/* Beak */}
      <polygon points="138,42 160,50 138,58" fill="#FFA726" />
      {/* Tail feathers */}
      <rect x="65" y="155" width="16" height="35" rx="8" fill="#158C86" transform="rotate(-8 73 172)" />
      <rect x="83" y="157" width="16" height="32" rx="8" fill="#1CB0A8" transform="rotate(3 91 173)" />
      <rect x="100" y="154" width="16" height="28" rx="8" fill="#26C7BD" transform="rotate(12 108 168)" />
      {/* Feet */}
      <rect x="78" y="178" width="14" height="8" rx="4" fill="#FFA726" />
      <rect x="100" y="178" width="14" height="8" rx="4" fill="#FFA726" />
      {/* Speech bubble */}
      <rect x="140" y="8" width="50" height="38" rx="12" fill="#fff" stroke="#1CB0A8" strokeWidth="2" />
      <text x="152" y="34" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="18" fill="#1CB0A8">Hi!</text>
    </svg>
  );
}
