/**
 * HeroArt — Berkeley Haas themed editorial visual.
 * Pure SVG, no external assets required. Keeps palette restrained:
 * Berkeley Blue (#003262) + California Gold (#FDB515) on cream.
 */
export default function HeroArt() {
  return (
    <svg
      viewBox="0 0 560 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003262" />
          <stop offset="100%" stopColor="#0A1F33" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDB515" />
          <stop offset="100%" stopColor="#C4820E" />
        </linearGradient>
        <linearGradient id="soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF7F0" />
          <stop offset="100%" stopColor="#F4F4F1" />
        </linearGradient>
      </defs>

      {/* Backdrop panel */}
      <rect x="20" y="20" width="520" height="480" rx="28" fill="url(#soft)" />

      {/* Subtle grid */}
      <g opacity="0.06" stroke="#003262" strokeWidth="1">
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="20"
            y1={60 + i * 44}
            x2="540"
            y2={60 + i * 44}
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={60 + i * 44}
            y1="20"
            x2={60 + i * 44}
            y2="500"
          />
        ))}
      </g>

      {/* Large blue arch — signature architectural nod */}
      <path
        d="M80 420 L80 200 A160 160 0 0 1 400 200 L400 420 Z"
        fill="url(#navy)"
      />

      {/* Gold half-disc overlapping */}
      <path
        d="M280 60 A160 160 0 0 1 440 220 L280 220 Z"
        fill="url(#gold)"
      />

      {/* Thin gold rule */}
      <rect x="80" y="420" width="320" height="4" fill="#FDB515" />

      {/* Portrait silhouette card (representative, abstracted) */}
      <g transform="translate(330,170)">
        <rect
          width="180"
          height="250"
          rx="14"
          fill="#FBF7F0"
          stroke="#003262"
          strokeOpacity="0.15"
        />
        {/* abstract figure */}
        <circle cx="90" cy="92" r="36" fill="#003262" />
        <path
          d="M30 220 C30 170 60 148 90 148 C120 148 150 170 150 220 Z"
          fill="#003262"
        />
        {/* gold accent ring */}
        <circle
          cx="90"
          cy="92"
          r="48"
          stroke="#FDB515"
          strokeWidth="3"
          fill="none"
        />
        {/* name plate */}
        <rect x="18" y="232" width="144" height="6" rx="3" fill="#FDB515" />
      </g>

      {/* Floating pill tags echoing pillars */}
      <g fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="11">
        <g transform="translate(60,90)">
          <rect width="150" height="30" rx="15" fill="#FBF7F0" stroke="#003262" strokeOpacity="0.15"/>
          <circle cx="16" cy="15" r="4" fill="#FDB515" />
          <text x="30" y="19" fill="#003262">Question the Status Quo</text>
        </g>
        <g transform="translate(100,440)">
          <rect width="160" height="30" rx="15" fill="#003262" />
          <circle cx="16" cy="15" r="4" fill="#FDB515" />
          <text x="30" y="19" fill="#FBF7F0">Confidence Without Attitude</text>
        </g>
        <g transform="translate(330,440)">
          <rect width="130" height="30" rx="15" fill="#FDB515" />
          <circle cx="16" cy="15" r="4" fill="#003262" />
          <text x="30" y="19" fill="#003262">Student Always</text>
        </g>
      </g>

      {/* Small corner mark */}
      <g transform="translate(48,48)">
        <rect width="36" height="36" rx="8" fill="#003262" />
        <text
          x="18"
          y="24"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="18"
          fill="#FDB515"
        >
          W
        </text>
      </g>
    </svg>
  );
}
