"use client";

import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { MODES, type ModeId } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Chart colours are the mode colours stepped into the dark-mode lightness
 * band (validated for CVD separation + contrast on #050607). UI accents keep
 * the brighter MODES colours; data marks use these.
 */
const CHART: Record<ModeId, string> = {
  eco: "#7EA515",
  city: "#1596B0",
  sport: "#D65F1A",
  boost: "#D8358A",
};
const IDS = Object.keys(MODES) as ModeId[];

// Wheel torque (Nm) vs speed: flat until the power limit, then constant-power falloff.
function torqueAt(mode: ModeId, v: number) {
  const m = MODES[mode];
  const k = 38; // tuned so the knee lands at a plausible speed
  if (v > m.max) return null;
  return Math.min(m.torque, (m.power * k * 36) / Math.max(v, 1) / 3.6);
}

const W = 640,
  H = 340,
  PAD = { l: 44, r: 70, t: 16, b: 36 };
const X_MAX = 90,
  Y_MAX = 200;
const sx = (v: number) => PAD.l + (v / X_MAX) * (W - PAD.l - PAD.r);
const sy = (t: number) => H - PAD.b - (t / Y_MAX) * (H - PAD.t - PAD.b);

const METRICS: { key: "torque" | "power" | "range" | "efficiency"; label: string; unit: string; max: number }[] = [
  { key: "torque", label: "Peak torque", unit: "Nm", max: 200 },
  { key: "power", label: "Peak power", unit: "kW", max: 12 },
  { key: "range", label: "Range", unit: "km", max: 140 },
  { key: "efficiency", label: "Efficiency", unit: "%", max: 100 },
];

export default function Performance() {
  const [on, setOn] = useState<ModeId[]>(["eco", "sport"]);
  const [hoverV, setHoverV] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  const toggle = (id: ModeId) =>
    setOn((cur) => (cur.includes(id) ? (cur.length > 1 ? cur.filter((x) => x !== id) : cur) : IDS.filter((x) => cur.includes(x) || x === id)));

  const paths = useMemo(() => {
    const out: Record<ModeId, string> = {} as Record<ModeId, string>;
    IDS.forEach((id) => {
      let d = "";
      for (let v = 0; v <= MODES[id].max; v += 1) {
        const t = torqueAt(id, v);
        if (t == null) break;
        d += `${v ? "L" : "M"}${sx(v).toFixed(1)} ${sy(t).toFixed(1)}`;
      }
      out[id] = d;
    });
    return out;
  }, []);

  const onMove = (clientX: number) => {
    const r = svg.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((clientX - r.left) / r.width) * W;
    const v = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * X_MAX);
    setHoverV(v >= 0 && v <= 85 ? v : null);
  };

  return (
    <section id="performance" aria-labelledby="perf-title" className="relative overflow-hidden bg-ink-900 py-28 md:py-40">
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="10"
          eyebrow="Performance"
          id="perf-title"
          title={"Four characters.\nOne machine."}
          lede="Compare how each riding mode trades range for response. Select modes to overlay them."
        />

        {/* Filters: one row, above everything they scope */}
        <div className="mt-12 flex flex-wrap items-center gap-2" role="group" aria-label="Modes to compare">
          {IDS.map((id) => {
            const active = on.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                aria-pressed={active}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${active ? "border-white/40 bg-white/[0.06] text-white" : "border-white/10 text-white/40 hover:text-white/70"}`}
              >
                <span className="h-[2px] w-4 rounded" style={{ background: active ? CHART[id] : "rgba(255,255,255,0.25)" }} />
                {MODES[id].name}
              </button>
            );
          })}
          <button onClick={() => setTable((t) => !t)} className="ml-auto font-mono text-[11px] tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white hover:underline" aria-pressed={table}>
            {table ? "VIEW CHARTS" : "VIEW AS TABLE"}
          </button>
        </div>

        {table ? (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">Performance by riding mode</caption>
              <thead className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                <tr className="border-b border-white/10">
                  <th className="py-3 font-normal">Mode</th>
                  <th className="py-3 font-normal">Top speed</th>
                  {METRICS.map((m) => (
                    <th key={m.key} className="py-3 font-normal">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IDS.map((id) => (
                  <tr key={id} className="border-b border-white/[0.06]">
                    <td className="py-3 font-semibold">{MODES[id].name}</td>
                    <td className="py-3 tabular-nums">{MODES[id].max} km/h</td>
                    {METRICS.map((m) => (
                      <td key={m.key} className="py-3 tabular-nums">
                        {MODES[id][m.key]} {m.unit}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {/* Torque curve */}
            <figure className="corner-frame border border-white/[0.07] bg-ink-950/70 p-4 md:p-6">
              <figcaption className="mb-4 flex items-baseline justify-between">
                <span className="text-sm font-semibold">Wheel torque vs speed</span>
                <span className="font-mono text-[10px] tracking-widest text-white/40">Nm · km/h</span>
              </figcaption>
              <div className="relative">
                <svg
                  ref={svg}
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full touch-none"
                  role="img"
                  aria-label={`Torque curves for ${on.map((id) => MODES[id].name).join(", ")}. Flat torque at low speed, falling as power limits are reached.`}
                  onPointerMove={(e) => onMove(e.clientX)}
                  onPointerLeave={() => setHoverV(null)}
                >
                  {/* Recessive grid */}
                  {[0, 50, 100, 150, 200].map((t) => (
                    <g key={t}>
                      <line x1={PAD.l} x2={W - PAD.r} y1={sy(t)} y2={sy(t)} stroke="rgba(255,255,255,0.06)" />
                      <text x={PAD.l - 10} y={sy(t) + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono Variable, monospace">
                        {t}
                      </text>
                    </g>
                  ))}
                  {[0, 20, 40, 60, 80].map((v) => (
                    <text key={v} x={sx(v)} y={H - 12} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono Variable, monospace">
                      {v}
                    </text>
                  ))}
                  {/* Series */}
                  {IDS.filter((id) => on.includes(id)).map((id) => {
                    const end = torqueAt(id, MODES[id].max)!;
                    return (
                      <g key={id}>
                        <motion.path
                          d={paths[id]}
                          fill="none"
                          stroke={CHART[id]}
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={reduced ? false : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                        />
                        {/* direct label at line end */}
                        <text x={sx(MODES[id].max) + 8} y={sy(end) + 4} fill="rgba(255,255,255,0.85)" fontSize="12" fontWeight="600">
                          {MODES[id].name}
                        </text>
                      </g>
                    );
                  })}
                  {/* Crosshair */}
                  {hoverV != null && (
                    <g pointerEvents="none">
                      <line x1={sx(hoverV)} x2={sx(hoverV)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(255,255,255,0.35)" />
                      {on.map((id) => {
                        const t = torqueAt(id, hoverV);
                        return t == null ? null : <circle key={id} cx={sx(hoverV)} cy={sy(t)} r="5" fill={CHART[id]} stroke="#050607" strokeWidth="2" />;
                      })}
                    </g>
                  )}
                </svg>
                {hoverV != null && (
                  <div
                    className="pointer-events-none absolute top-2 rounded-lg border border-white/10 bg-ink-950/95 px-3 py-2 text-xs shadow-xl"
                    style={{ left: `${(sx(hoverV) / W) * 100}%`, transform: `translateX(${hoverV > 50 ? "calc(-100% - 12px)" : "12px"})` }}
                  >
                    <p className="mb-1 font-mono text-[10px] text-white/50">{hoverV} km/h</p>
                    {on.map((id) => {
                      const t = torqueAt(id, hoverV);
                      return (
                        <p key={id} className="flex items-center gap-2 whitespace-nowrap">
                          <span className="h-[2px] w-3 rounded" style={{ background: CHART[id] }} />
                          <span className="font-semibold tabular-nums">{t == null ? "—" : `${Math.round(t)} Nm`}</span>
                          <span className="text-white/50">{MODES[id].name}</span>
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </figure>

            {/* Small multiples — each metric on its own scale */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {METRICS.map((m) => (
                <figure key={m.key} className="corner-frame border border-white/[0.07] bg-ink-950/70 p-4">
                  <figcaption className="mb-4 flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{m.label}</span>
                    <span className="font-mono text-[10px] tracking-widest text-white/40">{m.unit}</span>
                  </figcaption>
                  <ul className="space-y-3">
                    {IDS.filter((id) => on.includes(id)).map((id) => {
                      const v = MODES[id][m.key];
                      return (
                        <li key={id} className="group" title={`${MODES[id].name}: ${v} ${m.unit}`}>
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="text-white/55">{MODES[id].name}</span>
                            <span className="font-semibold tabular-nums">{v}</span>
                          </div>
                          <div className="mt-1.5 h-1 rounded-full bg-white/[0.06]">
                            <motion.div
                              className="h-full rounded-full group-hover:brightness-125"
                              style={{ background: CHART[id] }}
                              initial={reduced ? false : { width: 0 }}
                              whileInView={{ width: `${(v / m.max) * 100}%` }}
                              animate={{ width: `${(v / m.max) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
