"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Bike from "@/components/bike/Bike";
import ExplodedBike from "@/components/bike/ExplodedBike";
import { Sunrise } from "@/components/bike/Scenes";
import Magnetic from "@/components/core/Magnetic";
import SplitText from "@/components/core/SplitText";
import { useSmoothScroll } from "@/components/core/SmoothScroll";
import { COMPARE_ASSUMPTIONS as A, PHOTOS, formatRs } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

const evPer100 = A.evKwhPer100Km * A.electricityPerKwh;

const FACTS = [
  { value: "120 km", label: "on one charge" },
  { value: "3.5 h", label: "to charge at home" },
  { value: formatRs(evPer100), label: "per 100 km" },
];

/** Drawn bike, used if the product photo is missing. */
function DrawnBike({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-x-[10%] bottom-[1%] h-10 rounded-[50%] bg-black/80 blur-2xl" />
      <Bike spin={!reduced} headlight={1} battery={1} energy={1} className="relative w-full" title="Eco Bike Model One" />
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  return (
    <section id="top" aria-labelledby="hero-title" className="relative min-h-[100svh] w-full overflow-hidden bg-ink-950">
      {/* Backdrop */}
      <Sunrise className="absolute inset-0 h-full w-full opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/60 to-ink-950/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/90 to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1320px] items-center gap-10 px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[1.2fr_1fr]">
      {/* ── Copy ─────────────────────────────────────── */}
      <div>
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3"
          initial={reduced ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-volt" />
          Eco Bike · Electric scooter
        </motion.p>
        <SplitText
          as="h1"
          id="hero-title"
          text={"RIDE ELECTRIC.\nSPEND LESS."}
          animateOnMount
          delay={0.4}
          stagger={0.08}
          className="display text-[clamp(2.6rem,6vw,6rem)]"
        />
        <motion.p
          className="mt-6 max-w-lg text-base text-white/80 md:text-lg"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Twist and go, charge at home, and pay about a third of what petrol costs for every kilometre.
        </motion.p>

        <motion.dl
          className="mt-8 flex flex-wrap gap-x-8 gap-y-4"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15 }}
        >
          {FACTS.map((f) => (
            <div key={f.label} className="border-l border-volt/60 pl-3">
              <dt className="sr-only">{f.label}</dt>
              <dd className="display text-2xl md:text-3xl">{f.value}</dd>
              <dd className="text-sm text-mist">{f.label}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <Magnetic>
            <button className="btn btn-primary" onClick={() => scrollTo("#benefits")}>
              Why go electric
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
            </button>
          </Magnetic>
          <Magnetic>
            <Link href="/savings" className="btn btn-ghost">
              Compare with petrol
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── Bike ─────────────────────────────────────── */}
      <motion.div
        className="mx-auto w-full max-w-[min(440px,50svh)]"
        initial={reduced ? false : { opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <ExplodedBike
          src={PHOTOS.hero.src}
          alt={PHOTOS.hero.alt}
          fallback={<DrawnBike reduced={reduced} />}
        />
      </motion.div>
      </div>
    </section>
  );
}
