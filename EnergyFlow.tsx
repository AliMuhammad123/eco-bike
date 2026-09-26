"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { ENERGY_NODES } from "@/lib/content";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

type NodeId = (typeof ENERGY_NODES)[number]["id"];

function NodeIcon({ id }: { id: NodeId }) {
  const s = { stroke: "currentColor", strokeWidth: 1.5, fill: "none" } as const;
  if (id === "battery")
    return (
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <rect x="6" y="11" width="26" height="18" rx="2" {...s} />
        <rect x="32" y="16" width="3" height="8" rx="1" fill="currentColor" />
        <path d="M11 20h4M20 20h4M13 17v6" {...s} />
      </svg>
    );
  if (id === "controller")
    return (
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <rect x="11" y="11" width="18" height="18" rx="2" {...s} />
        <path d="M15 6v5M20 6v5M25 6v5M15 29v5M20 29v5M25 29v5M6 15h5M6 20h5M6 25h5M29 15h5M29 20h5M29 25h5" {...s} />
        <rect x="16" y="16" width="8" height="8" fill="currentColor" opacity="0.4" />
      </svg>
    );
  if (id === "motor")
    return (
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <circle cx="20" cy="20" r="13" {...s} />
        <circle cx="20" cy="20" r="7" {...s} />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
        <path d="M20 7v6M20 27v6M7 20h6M27 20h6" {...s} />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
      <circle cx="20" cy="20" r="14" {...s} />
      <circle cx="20" cy="20" r="4" {...s} />
      <path d="M20 6v10M20 24v10M6 20h10M24 20h10" {...s} />
    </svg>
  );
}

export default function EnergyFlow() {
  const [active, setActive] = useState<NodeId>("battery");
  const [kw, setKw] = useState(4.8);
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();

  // Live telemetry jitter
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setKw((k) => Math.max(3.9, Math.min(6.4, k + (Math.random() - 0.5) * 0.35))), 420);
    return () => clearInterval(t);
  }, [reduced]);

  const W = wide ? 1200 : 400;
  const H = wide ? 420 : 900;
  const pts = ENERGY_NODES.map((_, i) =>
    wide ? { x: 150 + i * 300, y: 210 } : { x: 200, y: 110 + i * 226 }
  );
  const paths = pts.slice(0, -1).map((p, i) => {
    const q = pts[i + 1];
    if (wide) {
      const mx = (p.x + q.x) / 2;
      return [
        `M${p.x + 70} ${p.y - 14} C${mx} ${p.y - 70}, ${mx} ${q.y - 70}, ${q.x - 70} ${q.y - 14}`,
        `M${p.x + 70} ${p.y + 14} C${mx} ${p.y + 70}, ${mx} ${q.y + 70}, ${q.x - 70} ${q.y + 14}`,
      ];
    }
    const my = (p.y + q.y) / 2;
    return [
      `M${p.x - 16} ${p.y + 62} C${p.x - 70} ${my}, ${q.x - 70} ${my}, ${q.x - 16} ${q.y - 62}`,
      `M${p.x + 16} ${p.y + 62} C${p.x + 70} ${my}, ${q.x + 70} ${my}, ${q.x + 16} ${q.y - 62}`,
    ];
  });

  const node = ENERGY_NODES.find((n) => n.id === active)!;
  const METRICS: [keyof typeof node.metrics, string, number][] = [
    ["consumption", "Energy consumption", 0.62],
    ["efficiency", "Efficiency", 0.96],
    ["power", "Power delivery", 0.78],
    ["temp", "Temperature", 0.44],
    ["perf", "Performance", 0.88],
  ];

  return (
    <section id="energy" aria-labelledby="energy-title" className="relative overflow-hidden bg-ink-900 py-28 md:py-40">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHead
            index="03"
            eyebrow="Energy Flow"
            id="energy-title"
            title={"Follow the\nelectrons."}
            lede="From cell to contact patch in under 10 milliseconds. Hover or tap a system to read its live telemetry."
          />
          {/* Telemetry strip */}
          <div className="corner-frame flex gap-6 border border-white/10 px-5 py-4 font-mono text-[11px] tracking-wider" aria-live="off">
            <div>
              <p className="text-white/40">SYSTEM LOAD</p>
              <p className="mt-1 text-lg text-volt tabular-nums">{kw.toFixed(2)} kW</p>
            </div>
            <div>
              <p className="text-white/40">BUS</p>
              <p className="mt-1 text-lg tabular-nums">96.4 V</p>
            </div>
            <div>
              <p className="text-white/40">STATE</p>
              <p className="mt-1 flex items-center gap-2 text-lg">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt" /> NOMINAL
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Schematic */}
          <div className="corner-frame relative border border-white/[0.07] bg-ink-950/60">
            <div className="relative mx-auto" style={{ aspectRatio: `${W} / ${H}`, maxHeight: wide ? undefined : 760 }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <filter id="ef-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {paths.flat().map((d, i) => (
                  <g key={i}>
                    <path id={`ef-p-${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <path d={d} fill="none" stroke={i % 2 ? "#4DE8FF" : "#C8FF2E"} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 10">
                      {!reduced && <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="2s" repeatCount="indefinite" />}
                    </path>
                    {!reduced &&
                      Array.from({ length: 5 }).map((_, k) => (
                        <circle key={k} r={k === 0 ? 4 : 2.5} fill={i % 2 ? "#4DE8FF" : "#C8FF2E"} filter="url(#ef-glow)">
                          <animateMotion dur={`${1.6 + (i % 3) * 0.2}s`} begin={`${k * 0.32}s`} repeatCount="indefinite">
                            <mpath href={`#ef-p-${i}`} />
                          </animateMotion>
                        </circle>
                      ))}
                  </g>
                ))}
                {/* Measurement ticks */}
                {wide &&
                  Array.from({ length: 49 }).map((_, i) => (
                    <line key={i} x1={24 + i * 23.5} x2={24 + i * 23.5} y1={H - 30} y2={H - (i % 4 ? 24 : 16)} stroke="rgba(255,255,255,0.15)" />
                  ))}
              </svg>

              {ENERGY_NODES.map((n, i) => {
                const p = pts[i];
                const on = n.id === active;
                return (
                  <button
                    key={n.id}
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    onClick={() => setActive(n.id)}
                    aria-pressed={on}
                    aria-label={`${n.name} telemetry`}
                    className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-2xl border transition-all duration-500 ${
                      on
                        ? "border-volt bg-volt/[0.08] text-volt shadow-[0_0_60px_-10px_rgba(200,255,46,0.6)]"
                        : "border-white/15 bg-ink-900/90 text-white/70 hover:border-white/40"
                    }`}
                    style={{
                      left: `${(p.x / W) * 100}%`,
                      top: `${(p.y / H) * 100}%`,
                      width: wide ? "11.5%" : "36%",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    {on && !reduced && <span className="absolute inset-0 animate-ping rounded-2xl border border-volt/40" />}
                    <NodeIcon id={n.id} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white md:text-xs">{n.name}</span>
                    <span className="font-mono text-[9px] tracking-widest text-white/40">{n.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Readout */}
          <div className="corner-frame border border-white/[0.07] bg-ink-950/60 p-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35 }}>
                <p className="font-mono text-[10px] tracking-[0.25em] text-volt">{node.code} · LIVE</p>
                <h3 className="display mt-2 text-3xl">{node.name}</h3>
                <dl className="mt-6 space-y-5">
                  {METRICS.map(([k, label, v], i) => (
                    <div key={k}>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-white/45">{label}</dt>
                        <dd className="text-right text-sm font-semibold">{node.metrics[k]}</dd>
                      </div>
                      <div className="mt-2 h-[3px] overflow-hidden rounded bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded bg-gradient-to-r from-ion to-volt"
                          initial={{ width: 0 }}
                          animate={{ width: `${(v - (ENERGY_NODES.findIndex((x) => x.id === active) * 0.04)) * 100}%` }}
                          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
