"use client";

import { useId, type CSSProperties } from "react";
import {
  DEFAULT_CONFIG,
  LIGHT_COLORS,
  type BikeConfig,
  type WheelStyle,
} from "@/lib/bike";
import { shade, luminance } from "@/lib/color";

/**
 * The Eco Bike — a code-drawn, fully configurable side profile.
 *
 * Geometry lives in a 1000 × 560 viewBox. Hotspot coordinates exported
 * below (BIKE_POINTS) use the same space, so overlays can be positioned
 * with simple percentages.
 *
 * Animatable without re-rendering: set these CSS custom properties on any
 * ancestor (e.g. with GSAP) —
 *   --headlight  0..1   beam + LED intensity
 *   --battery    0..1   how many cells in the pack glow
 *   --energy     0..1   glow on motor + signature line
 */

export const BIKE_VIEWBOX = { w: 1000, h: 560 };
export const REAR_HUB = { x: 255, y: 410 };
export const FRONT_HUB = { x: 775, y: 410 };
const R_TIRE = 128;

export const BIKE_POINTS = {
  battery: { x: 555, y: 322 },
  motor: { x: 458, y: 352 },
  display: { x: 640, y: 132 },
  suspension: { x: 735, y: 300 },
  lighting: { x: 716, y: 190 },
  brakes: { x: 775, y: 410 },
  connectivity: { x: 226, y: 184 },
  storage: { x: 590, y: 170 },
} as const;
export type BikePoint = keyof typeof BIKE_POINTS;

interface BikeProps {
  config?: BikeConfig;
  /** Override --headlight (0..1). Leave undefined to inherit from CSS. */
  headlight?: number;
  battery?: number;
  energy?: number;
  spin?: boolean;
  beam?: boolean;
  /** Draw a soft reflection / shadow under the tyres */
  ground?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const CELLS = 10;

export default function Bike({
  config = DEFAULT_CONFIG,
  headlight,
  battery,
  energy,
  spin = false,
  beam = true,
  ground = true,
  className,
  style,
  title = "Eco Bike electric motorcycle, side view",
}: BikeProps) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const paint = config.color;
  const light = LIGHT_COLORS[config.light];
  const isLight = luminance(paint) > 0.6;
  const acc = new Set(config.accessories);

  const vars: Record<string, string | number> = {};
  if (headlight !== undefined) vars["--headlight"] = headlight;
  if (battery !== undefined) vars["--battery"] = battery;
  if (energy !== undefined) vars["--energy"] = energy;

  return (
    <svg
      viewBox={`0 0 ${BIKE_VIEWBOX.w} ${BIKE_VIEWBOX.h}`}
      className={className}
      style={{ ...(vars as CSSProperties), overflow: "visible", ...style }}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={id("paint")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(paint, isLight ? 0.35 : 0.28)} />
          <stop offset="0.38" stopColor={paint} />
          <stop offset="0.62" stopColor={shade(paint, -0.25)} />
          <stop offset="1" stopColor={shade(paint, -0.6)} />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity={isLight ? 0.55 : 0.32} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B939C" />
          <stop offset="0.5" stopColor="#3A4047" />
          <stop offset="1" stopColor="#15181C" />
        </linearGradient>
        <linearGradient id={id("dark")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A2F35" />
          <stop offset="1" stopColor="#0B0D10" />
        </linearGradient>
        <radialGradient id={id("tire")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.8" stopColor="#0E1013" />
          <stop offset="0.93" stopColor="#1D2126" />
          <stop offset="1" stopColor="#08090B" />
        </radialGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={light} stopOpacity="0.55" />
          <stop offset="0.35" stopColor={light} stopOpacity="0.16" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FE9FF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0B1418" stopOpacity="0.15" />
        </linearGradient>
        <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* ── Ground shadow ─────────────────────────────────────────── */}
      {ground && (
        <ellipse cx="515" cy="542" rx="400" ry="18" fill={`url(#${id("shadow")})`} />
      )}

      {/* ── Headlight beam ────────────────────────────────────────── */}
      {beam && (
        <g style={{ opacity: "var(--headlight, 1)", transition: "opacity .4s" }}>
          <path
            d="M722 186 L1180 70 L1180 330 Z"
            fill={`url(#${id("beam")})`}
            filter={`url(#${id("soft")})`}
          />
          <path d="M722 190 L1000 150 L1000 236 Z" fill={`url(#${id("beam")})`} opacity="0.6" />
        </g>
      )}

      {/* ── Rear wheel ────────────────────────────────────────────── */}
      <Wheel cx={REAR_HUB.x} cy={REAR_HUB.y} style={config.wheels} spin={spin} tire={id("tire")} metal={id("metal")} accent={light} />

      {/* Belt drive */}
      <path
        d="M458 334 L262 384 M458 370 L262 436"
        stroke="#23282E"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Swingarm */}
      <path
        d="M470 330 C430 336 330 372 262 392 L250 404 L258 424 C330 410 440 382 478 372 Z"
        fill={`url(#${id("metal")})`}
      />
      <path d="M462 342 C410 356 330 382 270 400" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" fill="none" />

      {/* Rear shock (coil-over) */}
      <g>
        <path d="M398 262 L352 372" stroke="#2E343B" strokeWidth="12" strokeLinecap="round" />
        {Array.from({ length: 7 }).map((_, i) => {
          const t = 0.18 + i * 0.1;
          const x = Math.round(398 + (352 - 398) * t);
          const y = Math.round(262 + (372 - 262) * t);
          return (
            <line
              key={i}
              x1={x - 11}
              y1={y - 4}
              x2={x + 11}
              y2={y + 4}
              stroke={light}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })}
      </g>

      {/* ── Front wheel + fork ────────────────────────────────────── */}
      <Wheel cx={FRONT_HUB.x} cy={FRONT_HUB.y} style={config.wheels} spin={spin} tire={id("tire")} metal={id("metal")} accent={light} front />

      {/* Upside-down fork: thick outer tube on top, slim stanchion below */}
      <g>
        <path d="M676 150 L735 292" stroke={`url(#${id("dark")})`} strokeWidth="26" strokeLinecap="round" />
        <path d="M676 150 L735 292" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" transform="translate(-7 2)" />
        <path d="M728 276 L776 404" stroke="#C9CED4" strokeWidth="13" strokeLinecap="round" />
        <path d="M728 276 L776 404" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" transform="translate(-3 1)" />
        <rect x="722" y="284" width="30" height="10" rx="3" fill={light} opacity="0.85" transform="rotate(-22 737 289)" />
      </g>

      {/* Front hugger / fender */}
      <path
        d="M700 322 A140 140 0 0 1 900 330 L884 338 A124 124 0 0 0 712 334 Z"
        fill={`url(#${id("paint")})`}
      />

      {/* Rear hugger */}
      <path d="M150 336 A140 140 0 0 1 300 282 L304 296 A126 126 0 0 0 166 344 Z" fill="#16191D" />

      {/* ── Accessory: panniers (behind body, over rear wheel) ────── */}
      {acc.has("panniers") && (
        <g>
          <rect x="138" y="228" width="170" height="98" rx="14" fill={`url(#${id("dark")})`} stroke="#3A4148" />
          <rect x="138" y="228" width="170" height="98" rx="14" fill="none" stroke="#fff" strokeOpacity="0.06" />
          <path d="M152 250 H294" stroke={light} strokeWidth="2" opacity="0.8" />
          <rect x="204" y="286" width="38" height="8" rx="4" fill="#565E66" />
        </g>
      )}

      {/* ── Main body (monocoque) ─────────────────────────────────── */}
      <path
        d="M522 196
           C548 160 578 148 614 147
           L690 152
           C712 155 724 170 727 192
           L712 206
           C700 214 690 226 682 244
           L652 336
           C648 350 640 356 626 358
           L482 372
           C466 373 456 366 450 354
           L420 314
           C408 298 396 282 378 270
           L300 240
           L196 226
           C170 224 146 216 128 206
           L132 198
           C160 200 190 198 222 196
           L330 204 Z"
        fill={`url(#${id("paint")})`}
      />
      {/* Specular sheen along the tank */}
      <path
        d="M536 182 C560 162 584 156 614 156 L688 160 C700 162 708 168 712 176 L612 170 C584 170 560 176 536 188 Z"
        fill={`url(#${id("sheen")})`}
      />
      {/* Tail sheen */}
      <path d="M140 204 C180 206 230 204 320 208 L318 214 C240 212 190 214 150 210 Z" fill="#fff" opacity={isLight ? 0.35 : 0.14} />

      {/* Lower belly — dark composite skid with the battery pack */}
      <path
        d="M470 296 L664 286 L652 336 C648 350 640 356 626 358 L482 372 C466 373 456 366 450 354 L438 336 Z"
        fill={`url(#${id("dark")})`}
      />

      {/* Battery pack — cells glow based on --battery */}
      <g>
        {Array.from({ length: CELLS }).map((_, i) => {
          const x = 478 + i * 16.5;
          return (
            <rect
              key={i}
              x={x}
              y={310 - i * 0.9}
              width="11"
              height={40 - i * 0.6}
              rx="2"
              fill={light}
              style={{
                opacity: `clamp(0.08, calc(var(--battery, 1) * ${CELLS} - ${i}), 1)`,
                transition: "opacity .3s",
              }}
            />
          );
        })}
        <path d="M472 302 L660 292" stroke="#fff" strokeOpacity="0.16" />
      </g>

      {/* Motor — axial flux disc */}
      <g>
        <circle cx="458" cy="352" r="40" fill="#101316" stroke="#3A4148" strokeWidth="3" />
        <circle cx="458" cy="352" r="30" fill="none" stroke={light} strokeWidth="2" style={{ opacity: "calc(0.25 + var(--energy, 0.6) * 0.75)" }} filter={`url(#${id("glow")})`} />
        <circle cx="458" cy="352" r="18" fill={`url(#${id("metal")})`} />
        <circle cx="458" cy="352" r="6" fill="#0B0D10" />
      </g>

      {/* Signature line — runs nose to tail */}
      <path
        d="M712 204 C690 214 676 232 668 252 L646 324 M640 282 L470 292 M420 300 C400 278 372 262 330 250 L200 234"
        stroke={light}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        filter={`url(#${id("glow")})`}
        style={{ opacity: "calc(0.35 + var(--energy, 0.6) * 0.65)" }}
      />

      {/* Side panel cut-line + cooling vents */}
      <path
        d="M540 206 C580 196 630 196 676 206 L658 262 C620 270 560 276 500 282 C510 250 522 222 540 206 Z"
        fill="#000"
        opacity="0.22"
      />
      <path d="M540 206 C580 196 630 196 676 206" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.2" fill="none" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${600 + i * 14} ${226 + i * 1} L${590 + i * 14} ${258 - i * 1}`}
          stroke="#000"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <text x="512" y="252" fill={isLight ? "#000" : "#fff"} fillOpacity={isLight ? 0.4 : 0.3} fontSize="11" fontFamily="JetBrains Mono Variable, monospace" letterSpacing="3">
        ECO · 96V
      </text>

      {/* Tank storage lid seam */}
      <path d="M560 178 C572 166 590 162 612 161 L660 164" stroke="#000" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
      <circle cx="652" cy="170" r="3" fill="#000" opacity="0.4" />

      {/* ── Seat ──────────────────────────────────────────────────── */}
      <Seat kind={config.seat} dark={id("dark")} accent={light} />

      {/* Connectivity fin */}
      <path d="M212 198 C218 184 226 176 236 172 L242 196 Z" fill={`url(#${id("dark")})`} />
      <circle cx="232" cy="178" r="2.5" fill={light} filter={`url(#${id("glow")})`} style={{ animation: "blink 2.4s infinite" }} />

      {/* Tail light */}
      <path d="M128 202 L150 204" stroke="#FF3B3B" strokeWidth="5" strokeLinecap="round" filter={`url(#${id("glow")})`} />

      {/* Accessory: tail rack */}
      {acc.has("rack") && (
        <g stroke="#9AA2AB" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M150 186 H286 M170 186 L184 208 M266 186 L262 204" />
          <path d="M150 186 H286" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" transform="translate(0 -2)" />
        </g>
      )}

      {/* ── Cockpit: handlebar, display, mirror ───────────────────── */}
      <path d="M668 156 L628 124" stroke="#1B1F24" strokeWidth="10" strokeLinecap="round" />
      <path d="M634 128 L612 112" stroke="#0B0D10" strokeWidth="14" strokeLinecap="round" />
      <path d="M654 140 L664 104 L678 100" stroke="#2A2F35" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="684" cy="98" rx="11" ry="6" fill="#15181C" stroke="#3A4148" />
      <g transform="rotate(-18 648 140)">
        <rect x="628" y="128" width="42" height="22" rx="4" fill="#07090B" stroke="#3A4148" />
        <rect x="632" y="132" width="34" height="14" rx="2" fill={light} opacity="0.22" />
        <rect x="635" y="135" width="16" height="3" rx="1" fill={light} filter={`url(#${id("glow")})`} />
        <rect x="635" y="140" width="24" height="2" rx="1" fill={light} opacity="0.6" />
      </g>

      {/* Accessory: phone mount */}
      {acc.has("mount") && (
        <g transform="rotate(-24 606 100)">
          <rect x="592" y="80" width="30" height="46" rx="6" fill="#0B0D10" stroke="#565E66" strokeWidth="2" />
          <rect x="596" y="85" width="22" height="34" rx="3" fill="#4DE8FF" opacity="0.28" />
        </g>
      )}

      {/* Accessory: aero screen */}
      {acc.has("screen") && (
        <path
          d="M664 152 C668 116 690 84 730 70 L738 76 C722 104 716 140 724 178 Z"
          fill={`url(#${id("glass")})`}
          stroke="#9FE9FF"
          strokeOpacity="0.45"
        />
      )}

      {/* ── Headlight module ──────────────────────────────────────── */}
      <g>
        <path d="M704 184 C712 182 722 184 727 190 L720 198 C712 196 706 194 700 196 Z" fill="#07090B" />
        <path
          d="M706 188 L724 191"
          stroke={light}
          strokeWidth="4"
          strokeLinecap="round"
          filter={`url(#${id("glow")})`}
          style={{ opacity: "calc(0.25 + var(--headlight, 1) * 0.75)" }}
        />
        <path d="M690 214 L712 204" stroke={light} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function Wheel({
  cx,
  cy,
  style,
  spin,
  tire,
  metal,
  accent,
  front = false,
}: {
  cx: number;
  cy: number;
  style: WheelStyle;
  spin: boolean;
  tire: string;
  metal: string;
  accent: string;
  front?: boolean;
}) {
  const rimR = 104;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {/* Tyre */}
      <circle r={R_TIRE} fill={`url(#${tire})`} />
      <circle r={R_TIRE - 4} fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="1.5" />
      <circle r={rimR + 2} fill="#0A0C0E" />
      {/* Rim — spins as a group */}
      <g className={spin ? "wheel-spin" : undefined}>
        <circle r={rimR} fill="none" stroke={`url(#${metal})`} strokeWidth="6" />
        <circle r={rimR - 6} fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1.2" />
        {style === "aero" && (
          <>
            <circle r={rimR - 9} fill="#15181C" />
            <circle r={rimR - 9} fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="14" />
            {[0, 120, 240].map((a) => (
              <path
                key={a}
                d="M0 -88 A88 88 0 0 1 40 -78"
                stroke="#262B31"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                transform={`rotate(${a})`}
              />
            ))}
          </>
        )}
        {style === "blade" &&
          Array.from({ length: 5 }).map((_, i) => (
            <path
              key={i}
              d="M-7 -22 C-10 -58 -8 -80 -2 -97 L8 -97 C10 -78 12 -56 8 -22 Z"
              fill={`url(#${metal})`}
              transform={`rotate(${i * 72})`}
            />
          ))}
        {style === "turbine" &&
          Array.from({ length: 18 }).map((_, i) => (
            <path
              key={i}
              d="M0 -24 C10 -50 14 -76 8 -98"
              stroke="#9AA2AB"
              strokeWidth="3"
              fill="none"
              transform={`rotate(${i * 20})`}
            />
          ))}
        {/* Brake disc (front only gets the big one) */}
        <circle r={front ? 60 : 46} fill="none" stroke="#6B737C" strokeWidth={front ? 10 : 8} strokeDasharray="3 5" />
        <circle r="22" fill={`url(#${metal})`} />
        <circle r="9" fill="#0B0D10" />
      </g>
      {/* Caliper */}
      <path
        d={front ? "M36 -56 C48 -50 58 -40 62 -28 L50 -22 C46 -34 38 -42 28 -46 Z" : "M-30 -40 C-38 -34 -44 -26 -46 -18 L-36 -14 C-34 -22 -30 -28 -24 -32 Z"}
        fill={accent}
      />
    </g>
  );
}

function Seat({ kind, dark, accent }: { kind: BikeConfig["seat"]; dark: string; accent: string }) {
  if (kind === "touring") {
    return (
      <g>
        <path
          d="M300 206 C300 190 316 180 336 178 L420 174 C436 162 452 158 470 160 L512 166 C528 168 536 180 532 196 L330 212 Z"
          fill={`url(#${dark})`}
        />
        <path d="M332 190 L420 186 M446 172 L516 176" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      </g>
    );
  }
  if (kind === "carbon") {
    return (
      <g>
        <path
          d="M324 204 C328 192 340 186 356 185 L500 178 C518 177 530 184 530 196 L330 208 Z"
          fill="#15181C"
        />
        <path d="M330 200 L520 190" stroke={accent} strokeWidth="1.5" opacity="0.7" />
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={352 + i * 10.5} cy={193 - i * 0.4} r="1.3" fill="#fff" opacity="0.28" />
        ))}
      </g>
    );
  }
  return (
    <g>
      <path
        d="M318 204 C322 188 338 180 358 179 L498 172 C518 171 530 180 530 196 L330 210 Z"
        fill={`url(#${dark})`}
      />
      <path d="M340 186 L508 178" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.5" />
    </g>
  );
}
