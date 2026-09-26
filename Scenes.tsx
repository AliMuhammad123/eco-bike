/**
 * Code-drawn cinematic environments. Each scene is an SVG (1600 × 900,
 * slice-fit) so it scales to any viewport with no image downloads.
 *
 * To swap in real footage later, pass `videoSrc` to <SceneFrame/> in the
 * Lifestyle section — the SVG becomes the poster/fallback.
 */

import type { SVGProps } from "react";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 1600 900",
  preserveAspectRatio: "xMidYMax slice",
  "aria-hidden": true,
};

/* ── Night city skyline ─────────────────────────────────────────── */
export function CityNight({ className }: { className?: string }) {
  const r = rng(7);
  const far: { x: number; w: number; h: number }[] = [];
  const near: { x: number; w: number; h: number; lit: number[] }[] = [];
  for (let x = -20; x < 1640; ) {
    const w = 40 + r() * 70;
    far.push({ x, w, h: 180 + r() * 260 });
    x += w + 6;
  }
  for (let x = -40; x < 1640; ) {
    const w = 70 + r() * 110;
    const h = 160 + r() * 360;
    const lit: number[] = [];
    const cols = Math.floor(w / 16),
      rows = Math.floor(h / 22);
    for (let i = 0; i < cols * rows; i++) if (r() > 0.78) lit.push(i);
    near.push({ x, w, h, lit });
    x += w + 14 + r() * 20;
  }
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="cn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030405" />
          <stop offset="0.7" stopColor="#0B1016" />
          <stop offset="1" stopColor="#132028" />
        </linearGradient>
        <linearGradient id="cn-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4DE8FF" stopOpacity="0" />
          <stop offset="1" stopColor="#4DE8FF" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#cn-sky)" />
      <g fill="#0C1117">
        {far.map((b, i) => (
          <rect key={i} x={b.x} y={720 - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      <rect y="420" width="1600" height="300" fill="url(#cn-haze)" />
      {near.map((b, i) => {
        const cols = Math.floor(b.w / 16);
        return (
          <g key={i}>
            <rect x={b.x} y={740 - b.h} width={b.w} height={b.h} fill="#070A0D" />
            <rect x={b.x} y={740 - b.h} width={b.w} height="2" fill="#4DE8FF" opacity="0.25" />
            {b.lit.map((c) => (
              <rect
                key={c}
                x={b.x + 6 + (c % cols) * 16}
                y={740 - b.h + 10 + Math.floor(c / cols) * 22}
                width="7"
                height="10"
                fill={c % 5 === 0 ? "#C8FF2E" : "#FFD9A0"}
                opacity={0.25 + ((c * 37) % 60) / 100}
              />
            ))}
          </g>
        );
      })}
      <rect y="740" width="1600" height="160" fill="#050607" />
      <path d="M0 742 H1600" stroke="#4DE8FF" strokeOpacity="0.35" />
    </svg>
  );
}

/* ── Sunrise ────────────────────────────────────────────────────── */
export function Sunrise({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="sr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1320" />
          <stop offset="0.45" stopColor="#3A2D4A" />
          <stop offset="0.72" stopColor="#C4664A" />
          <stop offset="0.86" stopColor="#F2B36B" />
          <stop offset="1" stopColor="#F7D69A" />
        </linearGradient>
        <radialGradient id="sr-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4D6" />
          <stop offset="0.35" stopColor="#FFD58A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF9A5A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sr-sky)" />
      <circle cx="1000" cy="720" r="320" fill="url(#sr-sun)" />
      <path d="M0 690 L180 640 L360 675 L560 610 L760 668 L980 620 L1200 660 L1400 626 L1600 660 V760 H0 Z" fill="#1E1A2A" opacity="0.8" />
      <path d="M0 720 L260 690 L520 716 L800 684 L1060 712 L1340 688 L1600 710 V760 H0 Z" fill="#141220" />
      <rect y="740" width="1600" height="160" fill="#0B0A10" />
    </svg>
  );
}

/* ── Open road (daylight, perspective lines) ────────────────────── */
export function OpenRoad({ className, moving = true }: { className?: string; moving?: boolean }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="or-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6FA3C8" />
          <stop offset="0.6" stopColor="#B9D3E0" />
          <stop offset="1" stopColor="#E9E3D2" />
        </linearGradient>
        <linearGradient id="or-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6D7560" />
          <stop offset="1" stopColor="#2A2E24" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#or-sky)" />
      <path d="M0 660 L300 600 L620 640 L900 590 L1250 632 L1600 600 V720 H0 Z" fill="#8FA1A8" opacity="0.7" />
      <rect y="700" width="1600" height="200" fill="url(#or-ground)" />
      <path d="M720 700 L880 700 L1600 900 L0 900 Z" fill="#2B2F33" />
      <path
        d="M800 704 L800 900"
        stroke="#F4F2E8"
        strokeWidth="10"
        strokeDasharray="24 36"
        style={moving ? { animation: "road .6s linear infinite" } : undefined}
        transform="scale(1 1)"
      />
    </svg>
  );
}

/* ── Coast ──────────────────────────────────────────────────────── */
export function Coast({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="co-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12202E" />
          <stop offset="0.6" stopColor="#5E7F93" />
          <stop offset="1" stopColor="#E7B98A" />
        </linearGradient>
        <linearGradient id="co-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E6275" />
          <stop offset="1" stopColor="#0C1A22" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#co-sky)" />
      <rect y="610" width="1600" height="290" fill="url(#co-sea)" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${(i * 131) % 1600} ${630 + i * 12} h${60 + (i % 4) * 30}`} stroke="#F5D7A8" strokeOpacity={0.35 - i * 0.02} strokeWidth="2" />
      ))}
      <path d="M0 520 C200 500 300 560 420 600 L520 640 L0 700 Z" fill="#1A1D1F" />
      <path d="M0 760 C400 730 900 720 1600 740 V900 H0 Z" fill="#101214" />
      <path d="M0 770 C400 742 900 732 1600 752" stroke="#E7B98A" strokeOpacity="0.4" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ── Mountain pass ──────────────────────────────────────────────── */
export function Mountain({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2330" />
          <stop offset="1" stopColor="#9EAAB4" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#mo-sky)" />
      <path d="M0 620 L220 360 L380 500 L560 280 L760 520 L940 340 L1120 540 L1320 300 L1600 560 V900 H0 Z" fill="#4A5563" />
      <path d="M560 280 L610 340 L590 350 L540 318 Z M1320 300 L1370 360 L1340 366 L1296 330 Z M220 360 L260 408 L236 414 L200 384 Z" fill="#E8EEF2" opacity="0.85" />
      <path d="M0 700 L300 560 L520 650 L760 560 L1000 660 L1260 580 L1600 680 V900 H0 Z" fill="#262D35" />
      <path d="M0 800 C300 760 700 820 1000 770 C1250 730 1450 760 1600 750 V900 H0 Z" fill="#12161B" />
      <path d="M0 812 C300 772 700 832 1000 782 C1250 742 1450 772 1600 762" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="18 22" fill="none" />
    </svg>
  );
}

/* ── Night ride (neon tunnel lines) ─────────────────────────────── */
export function NightRide({ className }: { className?: string }) {
  return (
    <svg {...svgProps} className={className}>
      <rect width="1600" height="900" fill="#030405" />
      {Array.from({ length: 22 }).map((_, i) => {
        const y = 60 + i * 34;
        return (
          <path
            key={i}
            d={`M800 470 L${i % 2 ? 1700 : -100} ${y}`}
            stroke={i % 3 === 0 ? "#C8FF2E" : "#4DE8FF"}
            strokeOpacity={0.08 + (i % 5) * 0.04}
            strokeWidth={1 + (i % 3)}
          />
        );
      })}
      <path d="M680 760 L920 760 L1600 900 L0 900 Z" fill="#0A0D10" />
      <path d="M800 760 L800 900" stroke="#C8FF2E" strokeOpacity="0.6" strokeWidth="4" strokeDasharray="14 24" />
    </svg>
  );
}

/* ── Urban commute (dawn, overpass, rails) ──────────────────────── */
export function Commute({ className }: { className?: string }) {
  const r = rng(21);
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="cm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2230" />
          <stop offset="1" stopColor="#6C7A88" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#cm-sky)" />
      {Array.from({ length: 16 }).map((_, i) => {
        const w = 60 + r() * 90,
          h = 200 + r() * 300;
        return <rect key={i} x={i * 104 - 20} y={700 - h} width={w} height={h} fill="#2A3340" opacity={0.6 + r() * 0.4} />;
      })}
      <rect y="520" width="1600" height="34" fill="#1B2128" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={40 + i * 190} y="554" width="26" height="190" fill="#161B21" />
      ))}
      <rect y="744" width="1600" height="156" fill="#101317" />
      <path d="M0 790 H1600" stroke="#FFD9A0" strokeOpacity="0.35" strokeDasharray="40 30" strokeWidth="3" />
    </svg>
  );
}

export const SCENES = { CityNight, Sunrise, OpenRoad, Coast, Mountain, NightRide, Commute };
