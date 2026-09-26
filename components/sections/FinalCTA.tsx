"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Bike from "@/components/bike/Bike";
import Magnetic from "@/components/core/Magnetic";
import SplitText from "@/components/core/SplitText";
import { useBuild } from "@/lib/build-context";
import { useReducedMotion } from "@/lib/hooks";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { config, setTestRideOpen } = useBuild();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  const brightness = useTransform(scrollYProgress, [0.15, 0.85], [0.05, 1]);
  const filter = useTransform(brightness, (b) => `brightness(${b}) contrast(${1 + (1 - b) * 0.4})`);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "0%"]);
  const rim = useTransform(scrollYProgress, [0.4, 1], ["-30%", "130%"]);
  const glow = useTransform(scrollYProgress, [0.5, 1], [0, 0.16]);

  return (
    <section ref={ref} id="final" aria-labelledby="final-title" className="relative overflow-hidden bg-black pb-24 pt-32 md:pb-32 md:pt-48">
      <div className="relative mx-auto max-w-[1320px] px-5 text-center md:px-10">
        <p className="eyebrow mb-8">The next chapter</p>
        <SplitText id="final-title" text={"READY TO MOVE\nDIFFERENTLY?"} className="display mx-auto text-[clamp(2.8rem,9vw,9rem)]" />
        <motion.p
          className="mt-6 text-lg text-white/70"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Your next ride starts here.
        </motion.p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#build" className="btn btn-primary" data-cursor="Build">
              Build Your Bike
            </a>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-ghost" onClick={() => setTestRideOpen(true)} data-cursor="Book">
              Book a Test Ride
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Bike emerging from darkness */}
      <div className="relative mx-auto mt-16 w-[110vw] max-w-[1200px] -translate-x-[5vw] md:mt-24 md:w-[80vw] md:translate-x-0">
        <motion.div className="pointer-events-none absolute left-1/2 top-1/2 h-[40%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt blur-[140px]" style={{ opacity: reduced ? 0.12 : glow }} />
        <motion.div style={reduced ? undefined : { filter, scale, y }} className="relative">
          <Bike config={config} headlight={1} battery={1} energy={1} className="w-full" title="Eco Bike emerging from darkness" />
          {/* Rim light sweep */}
          {!reduced && (
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-[30%] mix-blend-overlay"
              style={{ left: rim, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
