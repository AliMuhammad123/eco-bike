"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { TECH } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect, useReducedMotion } from "@/lib/hooks";

const ease = [0.19, 1, 0.22, 1] as const;

function Visual({ i, on }: { i: number; on: boolean }) {
  const S = "rgba(255,255,255,0.18)";
  switch (i) {
    case 0: // Battery cells
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          {Array.from({ length: 48 }).map((_, k) => {
            const c = k % 12,
              r = Math.floor(k / 12);
            return (
              <motion.circle
                key={k}
                cx={40 + c * 29}
                cy={70 + r * 52}
                r="11"
                fill="none"
                stroke="#C8FF2E"
                strokeWidth="2"
                initial={{ fill: "rgba(200,255,46,0)", opacity: 0.25 }} animate={on ? { fill: "rgba(200,255,46,0.9)", opacity: 1 } : { fill: "rgba(200,255,46,0)", opacity: 0.25 }}
                transition={{ delay: 0.2 + (c + r * 3) * 0.035, duration: 0.3 }}
              />
            );
          })}
          <rect x="16" y="44" width="368" height="210" rx="10" fill="none" stroke={S} />
        </svg>
      );
    case 1: {
      // Neural net
      const layers = [3, 5, 5, 2];
      const nodes = layers.flatMap((n, li) => Array.from({ length: n }).map((_, k) => ({ x: 50 + li * 100, y: 150 + (k - (n - 1) / 2) * 50, li })));
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          {nodes.map((a, ai) =>
            nodes
              .filter((b) => b.li === a.li + 1)
              .map((b, bi) => (
                <motion.line
                  key={`${ai}-${bi}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="#4DE8FF" strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0.1 }} animate={on ? { pathLength: 1, opacity: 0.45 } : { pathLength: 0, opacity: 0.1 }}
                  transition={{ delay: 0.2 + a.li * 0.3 + bi * 0.03, duration: 0.6 }}
                />
              ))
          )}
          {nodes.map((n, k) => (
            <motion.circle
              key={k} cx={n.x} cy={n.y} r="8" fill="#050607" stroke="#C8FF2E" strokeWidth="2"
              initial={{ scale: 0 }} animate={on ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.1 + n.li * 0.3, type: "spring", stiffness: 300 }}
            />
          ))}
        </svg>
      );
    }
    case 2: // Motor rotor
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          <circle cx="200" cy="150" r="120" fill="none" stroke={S} />
          <circle cx="200" cy="150" r="96" fill="none" stroke={S} strokeDasharray="4 6" />
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="6s" repeatCount="indefinite" />
            {Array.from({ length: 16 }).map((_, k) => (
              <rect key={k} x="194" y="44" width="12" height="30" rx="2" fill={k % 2 ? "#C8FF2E" : "#4DE8FF"} transform={`rotate(${k * 22.5} 200 150)`} />
            ))}
          </g>
          <circle cx="200" cy="150" r="46" fill="#0A0C0E" stroke="#C8FF2E" strokeWidth="2" />
          <circle cx="200" cy="150" r="12" fill="#C8FF2E" />
        </svg>
      );
    case 3: // Connectivity
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          {[40, 80, 120, 160].map((r, k) => (
            <motion.path
              key={r}
              d={`M${200 - r} ${250 - r * 0.2} A${r} ${r} 0 0 1 ${200 + r} ${250 - r * 0.2}`}
              fill="none" stroke="#4DE8FF" strokeWidth="2"
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: k * 0.25 }}
            />
          ))}
          <circle cx="200" cy="250" r="10" fill="#C8FF2E" />
          {[[70, 70], [330, 60], [340, 190], [60, 180]].map(([x, y], k) => (
            <g key={k}>
              <motion.line x1="200" y1="250" x2={x} y2={y} stroke="#C8FF2E" strokeDasharray="3 6" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: 0.3 + k * 0.15, duration: 0.8 }} />
              <rect x={x - 22} y={y - 14} width="44" height="28" rx="6" fill="#0A0C0E" stroke={S} />
              <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="JetBrains Mono Variable, monospace">
                {["GPS", "LTE", "OTA", "BT"][k]}
              </text>
            </g>
          ))}
        </svg>
      );
    case 4: // Radar
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="sweep" x1="0" x2="1">
              <stop offset="0" stopColor="#C8FF2E" stopOpacity="0" />
              <stop offset="1" stopColor="#C8FF2E" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {[40, 80, 120].map((r) => (
            <circle key={r} cx="200" cy="160" r={r} fill="none" stroke={S} />
          ))}
          <path d="M80 160 H320 M200 40 V280" stroke={S} />
          <path d="M200 160 L320 160 A120 120 0 0 0 284 75 Z" fill="url(#sweep)">
            <animateTransform attributeName="transform" type="rotate" from="0 200 160" to="360 200 160" dur="3.2s" repeatCount="indefinite" />
          </path>
          {[[260, 110], [140, 210], [290, 200]].map(([x, y], k) => (
            <motion.circle key={k} cx={x} cy={y} r="5" fill={k === 1 ? "#FF6B3D" : "#C8FF2E"} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: k * 0.9 }} />
          ))}
        </svg>
      );
    default: // Performance curve
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
          {Array.from({ length: 6 }).map((_, k) => (
            <line key={k} x1="30" x2="380" y1={40 + k * 44} y2={40 + k * 44} stroke="rgba(255,255,255,0.06)" />
          ))}
          <motion.path
            d="M30 260 C80 80 120 60 180 70 S300 110 380 150"
            fill="none" stroke="#C8FF2E" strokeWidth="3"
            initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 1.6, ease }}
          />
          <motion.path
            d="M30 260 C100 220 160 150 220 110 S330 60 380 56"
            fill="none" stroke="#4DE8FF" strokeWidth="2" strokeDasharray="6 6"
            initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 1.6, delay: 0.2, ease }}
          />
        </svg>
      );
  }
}

export default function TechStory() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Which panels have been revealed. Driven by ScrollTrigger's containerAnimation
  // (IntersectionObserver is unreliable inside a transformed horizontal track).
  const [live, setLive] = useState<boolean[]>(() => TECH.map(() => false));

  useIsoLayoutEffect(() => {
    if (reduced) setLive(TECH.map(() => true));
  }, [reduced]);

  useIsoLayoutEffect(() => {
    const el = root.current,
      tr = track.current;
    if (!el || !tr || reduced) return;
    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => bar.current && (bar.current.style.transform = `scaleX(${st.progress})`),
        },
      });
      gsap.utils.toArray<HTMLElement>(tr.querySelectorAll("article")).forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: "left 75%",
          end: "right 10%",
          onToggle: (st) => setLive((cur) => (cur[i] === st.isActive ? cur : cur.map((v, k) => (k === i ? st.isActive : v)))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="technology" aria-labelledby="tech-title" className={`relative overflow-hidden bg-ink-950 ${reduced ? "py-28" : "h-[100svh] min-h-[620px]"}`}>
      <div
        ref={track}
        className={reduced ? "mx-auto max-w-[1320px] space-y-16 px-5 md:px-10" : "flex h-full w-max items-stretch will-change-transform"}
      >
        {/* Intro panel */}
        <div className={`${reduced ? "" : "flex w-[88vw] shrink-0 flex-col justify-center px-5 md:w-[46vw] md:px-10"}`}>
          <p className="eyebrow mb-6">09 · Technology Story</p>
          <h2 id="tech-title" className="display text-[clamp(2.6rem,6.4vw,6rem)]">
            How it
            <br />
            actually <span className="text-volt">works.</span>
          </h2>
          <p className="mt-6 max-w-sm text-mist">Six systems. One nervous system. Keep scrolling to go inside.</p>
          {!reduced && (
            <p className="mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-white/50" aria-hidden>
              SCROLL
              <span className="h-px w-16 bg-white/30" />→
            </p>
          )}
        </div>

        {TECH.map((t, i) => (
          <article
            key={t.n}
            aria-label={`${t.n} ${t.title}`}
            className={
              reduced
                ? "grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2"
                : "relative flex w-[92vw] shrink-0 flex-col justify-center gap-6 border-l border-white/[0.07] px-6 md:w-[72vw] md:flex-row md:items-center md:gap-12 md:px-14"
            }
          >
            {/* giant index */}
            <span aria-hidden className="display pointer-events-none absolute right-6 top-[12%] select-none text-[28vw] leading-none text-white/[0.03] md:text-[18vw]">
              {t.n}
            </span>
            <div className="relative md:w-[42%]">
              <p className="font-mono text-sm text-volt">{t.n} —</p>
              <div className="overflow-hidden">
                <motion.h3
                  className="display mt-3 break-words text-[clamp(2.2rem,3.9vw,4rem)]"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: live[i] ? "0%" : "105%" }}
                  transition={{ duration: 1, ease }}
                >
                  {t.title}
                </motion.h3>
              </div>
              <motion.p
                className="mt-4 text-xl text-white/90 md:text-2xl"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={live[i] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.9, delay: 0.15, ease }}
              >
                {t.line}
              </motion.p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">{t.detail}</p>
            </div>
            <motion.div
              className="corner-frame relative aspect-[4/3] w-full border border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:w-[52%]"
              initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: live[i] ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.18, 1] }}
            >
              <Visual i={i} on={live[i]} />
            </motion.div>
          </article>
        ))}
        {!reduced && <div className="w-[8vw] shrink-0" aria-hidden />}
      </div>

      {!reduced && (
        <div className="absolute bottom-8 left-5 right-5 h-px bg-white/10 md:left-10 md:right-10" aria-hidden>
          <div ref={bar} className="h-full origin-left bg-volt" style={{ transform: "scaleX(0)" }} />
        </div>
      )}
    </section>
  );
}
