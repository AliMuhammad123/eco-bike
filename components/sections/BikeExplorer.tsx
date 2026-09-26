"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Bike, { BIKE_POINTS, BIKE_VIEWBOX, type BikePoint } from "@/components/bike/Bike";
import SectionHead from "@/components/core/SectionHead";
import { useBuild } from "@/lib/build-context";
import { PARTS } from "@/lib/content";
import { useFinePointer, useMediaQuery, useReducedMotion } from "@/lib/hooks";

const ORDER: BikePoint[] = ["battery", "motor", "display", "suspension", "lighting", "brakes", "connectivity", "storage"];
const LABEL: Record<BikePoint, string> = {
  battery: "Battery",
  motor: "Motor",
  display: "Smart Display",
  suspension: "Suspension",
  lighting: "LED Lighting",
  brakes: "Braking System",
  connectivity: "Connectivity",
  storage: "Storage",
};

export default function BikeExplorer() {
  const [active, setActive] = useState<BikePoint | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const { config } = useBuild();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");

  const close = useCallback(() => setActive(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Zoom maths: bring the hotspot to the stage centre (slightly left on desktop to leave room for the card).
  const zoom = desktop ? 2 : 1.8;
  let camera = { scale: 1, x: "0%", y: "0%" };
  if (active) {
    const p = BIKE_POINTS[active];
    const px = p.x / BIKE_VIEWBOX.w;
    const py = p.y / BIKE_VIEWBOX.h;
    const targetX = desktop ? 0.34 : 0.5;
    const targetY = desktop ? 0.5 : 0.32;
    // Translate % is relative to the bike wrapper, so convert stage fractions
    // into wrapper units. Wrapper = 76% (desktop) / 92% (mobile) of stage width;
    // stage aspect 16:8 / 4:3; bike aspect 1000:560.
    const wrapW = desktop ? 0.76 : 0.92;
    const stageAspect = desktop ? 0.5 : 0.75;
    const kx = 1 / wrapW;
    const ky = stageAspect / (wrapW * (BIKE_VIEWBOX.h / BIKE_VIEWBOX.w));
    camera = {
      scale: zoom,
      x: `${((targetX - 0.5) * kx - (px - 0.5) * zoom) * 100}%`,
      y: `${((targetY - 0.5) * ky - (py - 0.5) * zoom) * 100}%`,
    };
  }

  const part = active ? PARTS[active] : null;

  return (
    <section id="explorer" aria-labelledby="explorer-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="01"
          eyebrow="Bike Explorer"
          id="explorer-title"
          title={"Every part,\nre-imagined."}
          lede="Select a system to look closer. Eight components, engineered together from a blank sheet."
        />

        {/* Stage */}
        <div
          ref={stage}
          className="corner-frame relative mt-10 aspect-[4/3] w-full overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent md:mt-14 md:aspect-[16/8]"
          onPointerMove={(e) => {
            if (!fine || reduced || active || !stage.current) return;
            const r = stage.current.getBoundingClientRect();
            setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 14 });
          }}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ perspective: 1400 }}
        >
          {/* HUD chrome */}
          <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40 md:left-6 md:top-6">
            VIEW · {active ? LABEL[active].toUpperCase() : "FULL ASSEMBLY"}
            <br />
            ZOOM · {active ? `${zoom.toFixed(1)}×` : "1.0×"}
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/30 md:bottom-6 md:left-6">
            {active ? "ESC TO RESET" : "DRAG POINTER TO ROTATE · SELECT A HOTSPOT"}
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotateX: active ? 0 : tilt.x, rotateY: active ? 0 : tilt.y }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="relative w-[92%] md:w-[76%]"
              animate={camera}
              transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
            >
              <Bike config={config} headlight={1} battery={1} energy={1} className="w-full" beam={false} />

              {/* Hotspots */}
              {ORDER.map((k) => {
                const p = BIKE_POINTS[k];
                const on = active === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActive(on ? null : k)}
                    aria-pressed={on}
                    aria-label={`${LABEL[k]}${on ? " — selected" : ""}`}
                    className="group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    style={{
                      left: `${(p.x / BIKE_VIEWBOX.w) * 100}%`,
                      top: `${(p.y / BIKE_VIEWBOX.h) * 100}%`,
                      transform: `translate(-50%,-50%) scale(${active ? 1 / zoom : 1})`,
                      transition: "transform 1.1s cubic-bezier(.77,0,.18,1), opacity .4s",
                      opacity: active && !on ? 0.25 : 1,
                    }}
                  >
                    <span className={`absolute inset-0 rounded-full border ${on ? "border-volt" : "border-white/50"} ${reduced ? "" : "animate-ping"} opacity-40`} />
                    <span className={`relative h-3 w-3 rounded-full ${on ? "bg-volt shadow-[0_0_20px_#C8FF2E]" : "bg-white group-hover:bg-volt"} transition`} />
                    <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-widest text-white/70 opacity-0 transition group-hover:opacity-100 md:block">
                      {LABEL[k].toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Connecting line from the centred hotspot to the card */}
          <AnimatePresence>
            {active && desktop && (
              <motion.svg
                key={`l-${active}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden
              >
                <motion.line
                  x1="34%"
                  y1="50%"
                  x2="60%"
                  y2="34%"
                  stroke="#C8FF2E"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
                <circle cx="34%" cy="50%" r="22" fill="none" stroke="#C8FF2E" strokeOpacity="0.5" />
                <circle cx="34%" cy="50%" r="36" fill="none" stroke="#C8FF2E" strokeOpacity="0.15" strokeDasharray="3 5" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Info card */}
          <AnimatePresence mode="wait">
            {part && (
              <motion.div
                key={active}
                role="region"
                aria-live="polite"
                aria-label={`${part.title} details`}
                className="glass absolute inset-x-3 bottom-3 rounded-xl p-5 md:inset-x-auto md:bottom-auto md:right-6 md:top-[18%] md:w-[340px] md:p-6"
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="font-mono text-[10px] tracking-[0.25em] text-volt">{part.kicker}</p>
                <h3 className="display mt-2 text-2xl md:text-3xl">{part.title}</h3>
                <p className="mt-3 hidden text-sm leading-relaxed text-white/65 md:block">{part.body}</p>
                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 md:grid-cols-1 md:gap-2">
                  {part.stats.map(([k, v]) => (
                    <div key={k} className="md:flex md:items-baseline md:justify-between">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-white/45">{k}</dt>
                      <dd className="mt-1 text-sm font-semibold md:mt-0">{v}</dd>
                    </div>
                  ))}
                </dl>
                <button onClick={close} className="mt-5 hidden font-mono text-[10px] tracking-[0.25em] text-white/50 hover:text-white md:block">
                  ← BACK TO FULL VIEW
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Part rail — keyboard & mobile friendly */}
        <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Bike systems">
          {ORDER.map((k, i) => (
            <button key={k} className="chip shrink-0" aria-pressed={active === k} onClick={() => setActive(active === k ? null : k)}>
              <span className="mr-2 opacity-50">0{i + 1}</span>
              {LABEL[k]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
