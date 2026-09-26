"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { MODES, type ModeId } from "@/lib/content";
import { useInView, useReducedMotion } from "@/lib/hooks";

const SWEEP = 240; // degrees
const START = 150; // degrees (SVG, clockwise from +x)

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: Math.round((cx + r * Math.cos(a)) * 100) / 100, y: Math.round((cy + r * Math.sin(a)) * 100) / 100 };
}
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${a.x} ${a.y} A${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

const TARGET: Record<ModeId, [number, number]> = {
  eco: [36, 7],
  city: [52, 9],
  sport: [70, 10],
  boost: [81, 3],
};

export default function SmartDashboard() {
  const [mode, setMode] = useState<ModeId>("city");
  const [speed, setSpeed] = useState(0);
  const [clock, setClock] = useState("--:--");
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, margin: "0px" });
  const reduced = useReducedMotion();
  const m = MODES[mode];

  useEffect(() => {
    const f = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    f();
    const t = setInterval(f, 30_000);
    return () => clearInterval(t);
  }, []);

  // Speed simulation — only runs while the dashboard is on screen.
  useEffect(() => {
    const [base, amp] = TARGET[mode];
    if (reduced) {
      setSpeed(base);
      return;
    }
    if (!visible) return;
    const t0 = performance.now();
    const t = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      const target = base + Math.sin(s * 0.9) * amp + Math.sin(s * 2.3) * amp * 0.25;
      setSpeed((v) => v + (target - v) * 0.12);
    }, 50);
    return () => clearInterval(t);
  }, [mode, visible, reduced]);

  const cx = 250,
    cy = 230,
    r = 180;
  const frac = Math.min(1, speed / 100);
  const maxFrac = m.max / 100;
  const battery = Math.round(78 - (mode === "boost" ? 4 : mode === "sport" ? 2 : 0));
  const rangeLeft = Math.round((m.range * battery) / 100);
  const power = Math.max(0.08, (speed / m.max) * (m.power / 11));

  return (
    <section id="dashboard" aria-labelledby="dash-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[120px] transition-colors duration-700"
        style={{ background: m.color }}
      />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="04"
          eyebrow="Smart Dashboard"
          id="dash-title"
          title={"Your ride,\nat a glance."}
          lede="A bonded-glass cockpit that reshapes itself around every mode. Switch modes and watch the whole interface respond."
        />

        {/* Mode selector */}
        <div className="mt-12 flex flex-wrap gap-2" role="radiogroup" aria-label="Riding mode">
          {(Object.keys(MODES) as ModeId[]).map((k) => (
            <button
              key={k}
              role="radio"
              aria-checked={mode === k}
              onClick={() => setMode(k)}
              className="relative isolate overflow-hidden rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] transition-colors duration-300"
              style={{
                borderColor: mode === k ? MODES[k].color : "rgba(255,255,255,0.15)",
                color: mode === k ? "#050607" : "rgba(255,255,255,0.75)",
              }}
            >
              {mode === k && (
                <motion.span layoutId="mode-pill" className="absolute inset-0 -z-0" style={{ background: MODES[k].color }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              <span className="relative">{MODES[k].name}</span>
            </button>
          ))}
        </div>

        {/* Display */}
        <div
          ref={ref}
          className="mt-8 rounded-[28px] bg-gradient-to-b from-[#2a2f35] to-[#0b0d10] p-[3px] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
          style={{ ["--mode" as string]: m.color }}
        >
          <div className="relative overflow-hidden rounded-[25px] bg-[#040506] p-4 md:p-8">
            {/* glass reflection */}
            <div className="pointer-events-none absolute -left-1/4 -top-1/2 h-full w-[80%] rotate-12 bg-gradient-to-b from-white/[0.05] to-transparent" />

            {/* Status bar */}
            <div className="relative flex items-center justify-between font-mono text-[11px] tracking-wider text-white/60">
              <span className="tabular-nums">{clock}</span>
              <span className="flex items-center gap-2 uppercase" style={{ color: m.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
                {m.name} mode
              </span>
              <span className="flex items-center gap-3">
                <span aria-label="LTE signal">
                  <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                    {[0, 1, 2, 3].map((i) => (
                      <rect key={i} x={i * 4} y={8 - i * 2.5} width="3" height={2 + i * 2.5} fill="currentColor" opacity={i < 3 ? 1 : 0.3} />
                    ))}
                  </svg>
                </span>
                <span>21°C</span>
              </span>
            </div>

            <div className="relative mt-4 grid gap-6 md:grid-cols-[1fr_1.6fr_1fr] md:items-center">
              {/* Left column: battery / range / temp */}
              <div className="order-2 grid grid-cols-3 gap-4 md:order-1 md:grid-cols-1 md:gap-6">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-white/40">BATTERY</p>
                  <p className="display mt-1 text-3xl tabular-nums md:text-5xl">
                    {battery}
                    <span className="text-lg text-white/50">%</span>
                  </p>
                  <div className="mt-2 flex gap-[3px]" aria-hidden>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className="h-3 flex-1 rounded-[2px] transition-colors duration-500" style={{ background: i < battery / 10 ? m.color : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-white/40">RANGE</p>
                  <p className="display mt-1 text-3xl tabular-nums md:text-4xl">
                    <AnimatePresence mode="popLayout">
                      <motion.span key={rangeLeft} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-block">
                        {rangeLeft}
                      </motion.span>
                    </AnimatePresence>
                    <span className="ml-1 text-lg text-white/50">km</span>
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-white/40">MOTOR / PACK</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums md:text-xl">
                    {mode === "boost" ? 61 : mode === "sport" ? 54 : 46}° / {mode === "boost" ? 36 : 31}°
                  </p>
                </div>
              </div>

              {/* Speedometer */}
              <div className="order-1 md:order-2">
                <svg viewBox="0 0 500 360" className="mx-auto w-full max-w-[520px]" role="img" aria-label={`Speed ${Math.round(speed)} kilometres per hour`}>
                  <path d={arc(cx, cy, r, START, START + SWEEP)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="18" strokeLinecap="round" />
                  <path d={arc(cx, cy, r, START + maxFrac * SWEEP, START + SWEEP)} fill="none" stroke="rgba(255,60,60,0.25)" strokeWidth="18" />
                  <path
                    d={arc(cx, cy, r, START, START + Math.max(0.5, frac * SWEEP))}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="18"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 12px ${m.color})`, transition: "stroke .5s" }}
                  />
                  {Array.from({ length: 41 }).map((_, i) => {
                    const deg = START + (i / 40) * SWEEP;
                    const a = polar(cx, cy, r - 26, deg);
                    const b = polar(cx, cy, r - (i % 5 ? 34 : 44), deg);
                    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i / 40 <= frac ? "#fff" : "rgba(255,255,255,0.25)"} strokeWidth={i % 5 ? 1 : 2} />;
                  })}
                  {[0, 20, 40, 60, 80, 100].map((v) => {
                    const p = polar(cx, cy, r - 66, START + (v / 100) * SWEEP);
                    return (
                      <text key={v} x={p.x} y={p.y + 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="13" fontFamily="JetBrains Mono Variable, monospace">
                        {v}
                      </text>
                    );
                  })}
                  <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize="112" fontWeight="800" style={{ fontStretch: "125%", letterSpacing: "-4px" }} className="tabular-nums">
                    {Math.round(speed)}
                  </text>
                  <text x={cx} y={cy + 44} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="14" letterSpacing="4" fontFamily="JetBrains Mono Variable, monospace">
                    KM/H
                  </text>
                  {/* power / regen bar */}
                  <rect x={cx - 120} y={cy + 80} width="240" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
                  <rect x={cx} y={cy + 80} width={120 * Math.min(1, power)} height="6" rx="3" fill={m.color} style={{ transition: "width .15s" }} />
                  <rect x={cx - 34 * (m.regen / 32)} y={cy + 80} width={34 * (m.regen / 32)} height="6" rx="3" fill="#4DE8FF" opacity="0.8" />
                  <text x={cx - 120} y={cy + 108} fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" letterSpacing="2">REGEN</text>
                  <text x={cx + 120} y={cy + 108} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" letterSpacing="2">
                    {(power * 11).toFixed(1)} kW
                  </text>
                </svg>
              </div>

              {/* Right column: nav / phone / security */}
              <div className="order-3 grid grid-cols-2 gap-4 md:grid-cols-1">
                <div className="col-span-2 overflow-hidden rounded-xl border border-white/10 md:col-span-1">
                  <svg viewBox="0 0 200 110" className="block w-full bg-[#07090b]" aria-hidden>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <path key={i} d={`M${i * 30 - 20} 0 L${i * 30 + 20} 110`} stroke="rgba(255,255,255,0.06)" />
                    ))}
                    <path d="M0 70 H200 M0 30 H200" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                    <path d="M40 110 L60 70 L140 70 L150 30 L200 30" stroke={m.color} strokeWidth="3" fill="none" strokeLinejoin="round" strokeDasharray="200" style={{ transition: "stroke .5s" }}>
                      {!reduced && <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite" />}
                    </path>
                    <circle cx="60" cy="70" r="5" fill="#fff" />
                  </svg>
                  <div className="flex items-center gap-3 p-3">
                    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
                      <path d="M6 18V9h9M11 4l5 5-5 5" stroke={m.color} strokeWidth="2" fill="none" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold">350 m</p>
                      <p className="font-mono text-[10px] text-white/50">RIGHT · HARBOUR RD</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06]">
                    <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden>
                      <rect x="1" y="1" width="10" height="16" rx="2" stroke="#fff" fill="none" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Phone</p>
                    <p className="font-mono text-[10px] text-volt">CONNECTED</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06]">
                    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden>
                      <rect x="1" y="7" width="12" height="8" rx="1.5" stroke="#fff" fill="none" />
                      <path d="M4 7V4a3 3 0 016 0v3" stroke="#fff" fill="none" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Security</p>
                    <p className="font-mono text-[10px] text-volt">ARMED · GPS LIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
