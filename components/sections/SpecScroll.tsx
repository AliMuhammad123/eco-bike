"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import Bike from "@/components/bike/Bike";
import Counter from "@/components/core/Counter";
import { useBuild } from "@/lib/build-context";
import { SPECS } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect, useReducedMotion } from "@/lib/hooks";

/** Per-spec visual that wraps the anchored bike. */
function SpecVisual({ i }: { i: number }) {
  const common = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 } };
  if (i === 0)
    return (
      <motion.svg {...common} viewBox="0 0 400 400" className="absolute inset-[-8%] h-[116%] w-[116%]" aria-hidden>
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.08)" />
        <motion.circle
          cx="200" cy="200" r="180" fill="none" stroke="#C8FF2E" strokeWidth="2" strokeLinecap="round"
          transform="rotate(-90 200 200)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 0.86 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {Array.from({ length: 60 }).map((_, k) => (
          <line key={k} x1="200" y1="14" x2="200" y2={k % 5 ? "22" : "30"} stroke="rgba(255,255,255,0.2)" transform={`rotate(${k * 6} 200 200)`} />
        ))}
      </motion.svg>
    );
  if (i === 1)
    return (
      <motion.svg {...common} viewBox="0 0 400 200" className="absolute inset-x-[-20%] top-[20%] w-[140%]" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 14 }).map((_, k) => (
          <motion.line
            key={k} x1="0" x2="160" y1={20 + k * 12} y2={20 + k * 12}
            stroke={k % 4 ? "rgba(255,255,255,0.25)" : "#C8FF2E"} strokeWidth={k % 4 ? 1 : 2}
            initial={{ x: 400, opacity: 0 }} animate={{ x: -200, opacity: [0, 1, 0] }}
            transition={{ duration: 0.9 + (k % 3) * 0.3, repeat: Infinity, delay: k * 0.07, ease: "easeIn" }}
          />
        ))}
      </motion.svg>
    );
  if (i === 2)
    return (
      <motion.svg {...common} viewBox="0 0 400 220" className="absolute inset-x-[5%] -top-[20%] w-[90%]" aria-hidden>
        <path d="M40 200 A160 160 0 0 1 360 200" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <motion.path
          d="M40 200 A160 160 0 0 1 360 200" fill="none" stroke="url(#spd)" strokeWidth="14"
          initial={{ pathLength: 0 }} animate={{ pathLength: 0.94 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="spd" x1="0" x2="1">
            <stop offset="0" stopColor="#4DE8FF" />
            <stop offset="1" stopColor="#C8FF2E" />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  return (
    <motion.div {...common} className="absolute -top-[14%] left-1/2 flex -translate-x-1/2 items-center gap-1" aria-hidden>
      {Array.from({ length: 12 }).map((_, k) => (
        <motion.span
          key={k} className="h-7 w-3 rounded-sm bg-volt md:h-10 md:w-4"
          initial={{ opacity: 0.1 }} animate={{ opacity: k < 10 ? 1 : 0.15 }}
          transition={{ delay: 0.2 + k * 0.12, duration: 0.2 }}
        />
      ))}
      <span className="ml-1 h-4 w-1.5 rounded-sm bg-white/30" />
    </motion.div>
  );
}

export default function SpecScroll() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const { config } = useBuild();

  useIsoLayoutEffect(() => {
    if (reduced || !root.current) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${SPECS.length * 90}%`,
        pin: true,
        scrub: true,
        onUpdate: (st) => {
          const n = Math.min(SPECS.length - 1, Math.floor(st.progress * SPECS.length));
          setIdx((p) => (p === n ? p : n));
          if (bar.current) bar.current.style.transform = `scaleY(${st.progress})`;
          el.style.setProperty("--spec-p", String(st.progress));
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section id="specs" aria-labelledby="specs-title" className="bg-ink-950 px-5 py-28 md:px-10">
        <h2 id="specs-title" className="sr-only">Specifications</h2>
        <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-2">
          {SPECS.map((s) => (
            <div key={s.label} className="border-t border-white/10 pt-6">
              <p className="display text-7xl">
                {s.value}
                <span className="ml-2 text-3xl text-volt">{s.unit}</span>
              </p>
              <p className="mt-2 text-lg">{s.label}</p>
              <p className="text-sm text-mist">{s.note}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const s = SPECS[idx];

  return (
    <section ref={root} id="specs" aria-labelledby="specs-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink-950">
      <h2 id="specs-title" className="sr-only">
        Specifications: {SPECS.map((x) => `${x.value} ${x.unit} ${x.label}`).join(", ")}
      </h2>

      {/* Giant background unit */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`bg-${idx}`}
          aria-hidden
          className="display pointer-events-none absolute -bottom-[4vw] right-[-2vw] select-none text-[34vw] leading-none text-white/[0.025]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {s.unit}
        </motion.p>
      </AnimatePresence>

      <div className="relative mx-auto grid h-full max-w-[1320px] grid-rows-[auto_1fr] items-center gap-4 px-5 pt-24 md:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] md:grid-rows-1 md:px-10 md:pt-0">
        {/* Progress rail */}
        <div className="absolute left-5 top-1/2 hidden h-48 -translate-y-1/2 md:left-10 md:block">
          <div className="relative h-full w-px bg-white/10">
            <div ref={bar} className="absolute inset-0 origin-top bg-volt" style={{ transform: "scaleY(0)" }} />
          </div>
        </div>

        {/* Numbers */}
        <div className="md:pl-12">
          <p className="eyebrow mb-6">02 · Specification</p>
          <div className="relative h-[clamp(5.5rem,13vw,12rem)] overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={idx}
                className="display absolute inset-0 flex items-end text-[clamp(5rem,13vw,12rem)] leading-[0.85]"
                initial={{ y: "100%", filter: "blur(16px)" }}
                animate={{ y: "0%", filter: "blur(0px)" }}
                exit={{ y: "-100%", filter: "blur(16px)" }}
                transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}
              >
                <Counter to={s.value} decimals={s.decimals} start duration={1.6} />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`l-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <p className="display mt-2 text-3xl text-volt md:text-5xl">{s.unit}</p>
              <p className="mt-5 text-lg md:text-xl">{s.label}</p>
              <p className="mt-1 font-mono text-xs tracking-wider text-mist">{s.note}</p>
            </motion.div>
          </AnimatePresence>

          <ol className="mt-10 flex gap-6 font-mono text-[11px] tracking-widest" aria-hidden>
            {SPECS.map((x, i) => (
              <li key={x.label} className={`transition-colors ${i === idx ? "text-white" : "text-white/25"}`}>
                0{i + 1}
                <span className={`mt-2 block h-px transition-all duration-500 ${i === idx ? "w-8 bg-volt" : "w-3 bg-white/25"}`} />
              </li>
            ))}
          </ol>
        </div>

        {/* Anchored bike */}
        <div className="relative self-center" style={{ perspective: 1400 }}>
          <motion.div
            className="relative"
            animate={{ rotateY: [-10, 6, -4, 10][idx], scale: [1, 1.05, 1.02, 0.98][idx], x: ["0%", "-3%", "2%", "0%"][idx] }}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <AnimatePresence mode="wait">
              <SpecVisual key={idx} i={idx} />
            </AnimatePresence>
            <Bike config={config} spin={idx === 1 || idx === 2} headlight={idx === 3 ? 0.2 : 1} battery={idx === 3 ? 0.83 : 1} energy={1} className="relative w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
