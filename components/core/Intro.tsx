"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "./SmoothScroll";

/**
 * 1.6s power-on intro: a charge bar fills, the wordmark resolves, then the
 * curtain lifts into the hero. Skipped for reduced motion and on repeat
 * visits within the session.
 */
export default function Intro() {
  const [show, setShow] = useState(true);
  const [pct, setPct] = useState(0);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("ecobike.intro") === "1";
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          try {
            sessionStorage.setItem("ecobike.intro", "1");
          } catch {}
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (show) lenis()?.stop();
    else lenis()?.start();
  }, [show, lenis]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}
          aria-hidden
        >
          <div className="w-[min(420px,70vw)]">
            <div className="mb-4 flex items-end justify-between font-mono text-[11px] tracking-[0.3em] text-white/50">
              <span>SYSTEM ONLINE</span>
              <span className="tabular-nums text-volt">{String(pct).padStart(3, "0")}%</span>
            </div>
            <div className="relative h-[3px] overflow-hidden rounded bg-white/10">
              <div
                className="absolute inset-y-0 left-0 bg-volt shadow-[0_0_24px_rgba(200,255,46,0.9)]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-10 overflow-hidden">
              <motion.p
                className="display text-center text-[clamp(2rem,6vw,3.5rem)]"
                initial={{ y: "100%" }}
                animate={{ y: pct > 35 ? "0%" : "100%" }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                ECO<span className="font-light text-white/50">BIKE</span>
              </motion.p>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] tracking-[0.4em] text-white/40">
              RIDE THE FUTURE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
