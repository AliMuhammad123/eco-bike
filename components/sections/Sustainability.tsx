"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Counter from "@/components/core/Counter";
import SectionHead from "@/components/core/SectionHead";
import { LIFECYCLE } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

const ICONS = [
  // Materials — ingot
  <path key="m" d="M6 22 L12 12 H28 L34 22 Z M12 12 L16 6 H24 L28 12" />,
  // Manufacturing — gear
  <g key="f">
    <circle cx="20" cy="18" r="6" />
    <path d="M20 6v4M20 26v4M8 18h4M28 18h4M11.5 9.5l2.8 2.8M25.7 23.7l2.8 2.8M11.5 26.5l2.8-2.8M25.7 12.3l2.8-2.8" />
  </g>,
  // Battery
  <g key="b">
    <rect x="8" y="10" width="22" height="14" rx="2" />
    <path d="M30 14v6M13 17h4M22 17h4M24 15v4" />
  </g>,
  // Ride — wheel
  <g key="r">
    <circle cx="20" cy="18" r="11" />
    <circle cx="20" cy="18" r="3" />
    <path d="M20 7v8M20 21v8M9 18h8M23 18h8" />
  </g>,
  // Recycling — loop arrows
  <g key="c">
    <path d="M10 18a10 10 0 0 1 17-7l2 2M30 18a10 10 0 0 1-17 7l-2-2" />
    <path d="M29 7v6h-6M11 29v-6h6" />
  </g>,
];

export default function Sustainability() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const back = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <section id="sustainability" aria-labelledby="sus-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="02"
          eyebrow="Lifecycle"
          id="sus-title"
          title={"Measured,\nnot promised."}
          lede="Every stage of the bike's life, from raw aluminium to recovered battery cells — with the numbers to show for it."
        />

        <div ref={ref} className="relative mt-10 md:mt-14">
          {/* Desktop loop line */}
          <svg viewBox="0 0 1200 300" className="absolute inset-x-0 top-0 hidden h-auto w-full md:block" aria-hidden>
            <path d="M120 60 H1080" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <path d="M1080 60 C1180 60 1180 280 1000 280 H200 C20 280 20 60 120 60" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" strokeDasharray="4 8" />
            <motion.path d="M120 60 H1080" stroke="#C8FF2E" strokeWidth="2" style={{ pathLength: reduced ? 1 : draw }} />
            <motion.path
              d="M1080 60 C1180 60 1180 280 1000 280 H200 C20 280 20 60 120 60"
              stroke="#4DE8FF"
              strokeWidth="1.5"
              fill="none"
              style={{ pathLength: reduced ? 1 : back }}
            />
            {!reduced && (
              <circle r="5" fill="#C8FF2E">
                <animateMotion dur="7s" repeatCount="indefinite" path="M120 60 H1080 C1180 60 1180 280 1000 280 H200 C20 280 20 60 120 60" />
              </circle>
            )}
            <text x="600" y="272" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" letterSpacing="4" fontFamily="JetBrains Mono Variable, monospace">
              ↺ MATERIALS RETURN TO THE START
            </text>
          </svg>

          <ol className="relative grid gap-10 border-l border-white/10 pl-8 md:grid-cols-5 md:gap-6 md:border-l-0 md:pl-0">
            {LIFECYCLE.map((s, i) => (
              <motion.li
                key={s.stage}
                className="relative md:pt-0 md:text-center"
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              >
                <span className="absolute -left-[53px] top-0 flex h-11 w-11 items-center justify-center rounded-full border border-volt/60 bg-ink-950 text-volt md:static md:mx-auto md:mb-6 md:mt-[2.5%] md:h-[4.8vw] md:max-h-[64px] md:w-[4.8vw] md:max-w-[64px]">
                  <svg viewBox="0 0 40 36" className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {ICONS[i]}
                  </svg>
                </span>
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/45">
                  0{i + 1} · {s.stage.toUpperCase()}
                </p>
                <p className="display mt-3 text-5xl md:text-[clamp(2.4rem,3.6vw,3.6rem)]">
                  <Counter to={s.value} format={(n) => Math.round(n).toLocaleString("en-GB")} />
                  <span className="text-volt">{s.suffix}</span>
                </p>
                <p className="mx-auto mt-2 max-w-[200px] text-sm text-mist md:max-w-none">{s.label}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
