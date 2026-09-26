"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { STATIONS } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

type Station = (typeof STATIONS)[number];
type Filter = "all" | "free" | "fast";

const PACK_KWH = 9.6;
const BIKE_MAX_KW = 12; // max charge rate the bike accepts (DC)
const KM_PER_UNIT = 0.032; // map units → km

function routeFor(a: Station, b: Station) {
  // Follow the street grid: horizontal then vertical, with a rounded corner.
  const midX = b.x;
  const r = Math.min(24, Math.abs(b.y - a.y) / 2, Math.abs(b.x - a.x) / 2);
  const sx = Math.sign(b.x - a.x) || 1;
  const sy = Math.sign(b.y - a.y) || 1;
  const d = `M${a.x} ${a.y} H${midX - sx * r} Q${midX} ${a.y} ${midX} ${a.y + sy * r} V${b.y}`;
  const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  return { d, km: len * KM_PER_UNIT * 1.25 };
}

export default function ChargingMap() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Station["id"]>("s3");
  const [from, setFrom] = useState<Station["id"]>("s1");
  const [to, setTo] = useState<Station["id"]>("s5");
  const [soc, setSoc] = useState(20);
  const [target, setTarget] = useState(80);

  const visible = STATIONS.filter((s) => (filter === "free" ? s.free > 0 : filter === "fast" ? s.kw >= 22 : true));
  const sel = STATIONS.find((s) => s.id === selected)!;
  const A = STATIONS.find((s) => s.id === from)!;
  const B = STATIONS.find((s) => s.id === to)!;
  const route = useMemo(() => routeFor(A, B), [A, B]);
  const rate = Math.min(sel.kw, BIKE_MAX_KW);
  const hours = Math.max(0, (PACK_KWH * (target - soc)) / 100 / (rate * 0.9));
  const timeStr = hours < 1 ? `${Math.round(hours * 60)} min` : `${Math.floor(hours)} h ${Math.round((hours % 1) * 60)} min`;
  const totalFree = STATIONS.reduce((s, x) => s + x.free, 0);

  return (
    <section id="charging" aria-labelledby="charge-title" className="relative overflow-hidden bg-ink-950 py-28 md:py-40">
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="07"
          eyebrow="Charging Network"
          id="charge-title"
          title={"Power is never\nfar away."}
          lede="Find a bay, see what's free right now, estimate your charge time and plan the route — all before you leave."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Map */}
          <div className="corner-frame relative overflow-hidden border border-white/[0.07] bg-[#06080a]">
            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2" role="group" aria-label="Filter stations">
              {(
                [
                  ["all", "All"],
                  ["free", "Available"],
                  ["fast", "Fast ≥22 kW"],
                ] as [Filter, string][]
              ).map(([k, l]) => (
                <button key={k} className="chip !bg-ink-950/80 backdrop-blur aria-pressed:!bg-volt" aria-pressed={filter === k} onClick={() => setFilter(k)}>
                  {l}
                </button>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] tracking-[0.2em] text-white/40">
              {totalFree} BAYS FREE · UPDATED LIVE
            </div>

            <svg viewBox="0 0 1000 600" className="block h-auto w-full" role="img" aria-label="Map of charging stations">
              <defs>
                <pattern id="grid-min" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.035)" />
                </pattern>
                <radialGradient id="st-glow">
                  <stop offset="0" stopColor="#C8FF2E" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#C8FF2E" stopOpacity="0" />
                </radialGradient>
                <filter id="route-glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="3" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="1000" height="600" fill="url(#grid-min)" />
              {/* Water */}
              <path d="M0 470 C120 450 200 520 260 600 H0 Z" fill="#0A1A22" />
              <path d="M0 470 C120 450 200 520 260 600" fill="none" stroke="#4DE8FF" strokeOpacity="0.25" />
              {/* River */}
              <path d="M430 0 C470 120 420 200 480 290 C540 380 520 460 600 600" fill="none" stroke="#0E2430" strokeWidth="26" />
              <path d="M430 0 C470 120 420 200 480 290 C540 380 520 460 600 600" fill="none" stroke="#4DE8FF" strokeOpacity="0.18" />
              {/* Parks */}
              <path d="M560 90 q60 -30 110 10 q20 60 -40 80 q-70 0 -70 -90z" fill="#12200F" opacity="0.8" />
              <path d="M800 470 q70 -20 120 20 q10 60 -60 70 q-70 -10 -60 -90z" fill="#12200F" opacity="0.6" />
              {/* Major roads */}
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none">
                <path d="M0 250 H1000" />
                <path d="M0 420 H1000" />
                <path d="M180 0 V600" />
                <path d="M520 0 V600" />
                <path d="M760 0 V600" />
                <path d="M0 150 C300 140 700 170 1000 120" />
              </g>
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <path key={i} d={`M${i * 90 + 40} 0 V600`} />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <path key={`h${i}`} d={`M0 ${i * 80 + 20} H1000`} />
                ))}
              </g>
              {/* District labels */}
              <g fill="rgba(255,255,255,0.22)" fontFamily="JetBrains Mono Variable, monospace" fontSize="11" letterSpacing="3">
                <text x="60" y="80">OLD TOWN</text>
                <text x="620" y="60">RIVERSIDE</text>
                <text x="800" y="360">EASTGATE</text>
                <text x="40" y="560">HARBOUR</text>
              </g>

              {/* Route */}
              <path d={route.d} fill="none" stroke="#C8FF2E" strokeOpacity="0.15" strokeWidth="10" strokeLinecap="round" />
              <motion.path
                key={route.d}
                d={route.d}
                fill="none"
                stroke="#C8FF2E"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#route-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 1.6, ease: [0.65, 0, 0.35, 1] }}
              />
              {!reduced && (
                <circle key={`dot-${route.d}`} r="6" fill="#fff">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path={route.d} />
                </circle>
              )}

              {/* Stations */}
              {visible.map((s) => {
                const free = s.free > 0;
                const on = s.id === selected;
                const col = free ? "#C8FF2E" : "#6B737C";
                return (
                  <g
                    key={s.id}
                    transform={`translate(${s.x} ${s.y})`}
                    onClick={() => setSelected(s.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(s.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${s.name}, ${s.kw} kilowatts, ${s.free} of ${s.total} bays free`}
                    className="cursor-pointer outline-none"
                  >
                    {free && <circle r="34" fill="url(#st-glow)" />}
                    {free && !reduced && <circle r="10" fill="none" stroke={col} className="pulse-ring" />}
                    <circle r={on ? 11 : 8} fill="#06080a" stroke={col} strokeWidth="2.5" />
                    <path d="M-2 -5 L3 -1 H0 L2 5 L-3 1 H0 Z" fill={col} />
                    {on && (
                      <text y="-22" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">
                        {s.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6">
            {/* Selected station + calculator */}
            <div className="corner-frame border border-white/[0.07] p-5 md:p-6">
              <label htmlFor="station" className="font-mono text-[10px] tracking-[0.25em] text-white/45">
                CHARGER
              </label>
              <select
                id="station"
                value={selected}
                onChange={(e) => setSelected(e.target.value as Station["id"])}
                className="mt-2 w-full appearance-none rounded-lg border border-white/15 bg-ink-900 px-3 py-2.5 text-sm"
              >
                {STATIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.kw} kW · {s.free}/{s.total} free
                  </option>
                ))}
              </select>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <Slider id="soc" label="Now" value={soc} set={(v) => setSoc(Math.min(v, target - 5))} />
                <Slider id="target" label="Target" value={target} set={(v) => setTarget(Math.max(v, soc + 5))} />
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-white/45">ESTIMATED TIME</p>
                  <AnimatePresence mode="popLayout">
                    <motion.p key={timeStr} className="display text-3xl" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                      {timeStr}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="text-right font-mono text-[10px] leading-relaxed text-white/45">
                  AT {rate} kW
                  <br />+{Math.round((PACK_KWH * (target - soc)) / 100 * 12.5)} km
                </p>
              </div>
            </div>

            {/* Route planner */}
            <div className="corner-frame border border-white/[0.07] p-5 md:p-6">
              <p className="font-mono text-[10px] tracking-[0.25em] text-white/45">PLAN A ROUTE</p>
              <div className="mt-3 space-y-2">
                <StationSelect id="from" label="From" value={from} set={setFrom} />
                <StationSelect id="to" label="To" value={to} set={setTo} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                <Stat k="Distance" v={`${route.km.toFixed(1)} km`} />
                <Stat k="Ride time" v={`${Math.max(4, Math.round((route.km / 32) * 60))} min`} />
                <Stat k="Energy" v={`${Math.max(1, Math.round((route.km / 120) * 100))}%`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ id, label, value, set }: { id: string; label: string; value: number; set: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/45">
        <label htmlFor={id}>{label.toUpperCase()}</label>
        <span className="text-white">{value}%</span>
      </div>
      <input id={id} type="range" min={0} max={100} step={5} value={value} onChange={(e) => set(+e.target.value)} className="mt-2 w-full accent-[#C8FF2E]" />
    </div>
  );
}

function StationSelect({ id, label, value, set }: { id: string; label: string; value: Station["id"]; set: (v: Station["id"]) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="w-10 font-mono text-[10px] tracking-widest text-white/45">
        {label.toUpperCase()}
      </label>
      <select id={id} value={value} onChange={(e) => set(e.target.value as Station["id"])} className="flex-1 rounded-lg border border-white/15 bg-ink-900 px-3 py-2 text-sm">
        {STATIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] tracking-widest text-white/45">{k.toUpperCase()}</p>
      <p className="mt-1 text-lg font-semibold">{v}</p>
    </div>
  );
}
