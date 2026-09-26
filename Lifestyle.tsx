"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SceneStage, { type SceneId } from "@/components/bike/SceneStage";
import SplitText from "@/components/core/SplitText";
import { useBuild } from "@/lib/build-context";
import { LIFESTYLE } from "@/lib/content";
import { useInView, useReducedMotion } from "@/lib/hooks";

const DURATION = 6000;

export default function Lifestyle() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, margin: "0px" });
  const reduced = useReducedMotion();
  const { config } = useBuild();
  const s = LIFESTYLE[i];

  useEffect(() => {
    if (!visible || paused || reduced) return;
    const t = setTimeout(() => setI((n) => (n + 1) % LIFESTYLE.length), DURATION);
    return () => clearTimeout(t);
  }, [i, visible, paused, reduced]);

  return (
    <section id="experience" aria-labelledby="life-title" className="relative bg-ink-950 py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <p className="eyebrow mb-6 flex items-center gap-4">
          <span className="font-mono text-volt">11</span>
          <span className="h-px w-12 bg-white/30" />
          The Experience
        </p>
      </div>

      <div
        ref={ref}
        className="relative mx-auto aspect-[4/5] w-full max-w-[1600px] overflow-hidden md:aspect-[21/9]"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        data-cursor={hover ? "Ride" : undefined}
      >
        <SceneStage scene={s.id as SceneId} config={config} distort={hover} reduced={reduced} />

        {/* Overlay copy */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-12">
          <div className="flex items-start justify-between font-mono text-[10px] tracking-[0.25em] text-white/70 md:text-[11px]">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <p className="text-volt">{s.title.toUpperCase()}</p>
                <p className="mt-1">
                  {s.time} · {s.km}
                </p>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => setPaused((p) => !p)}
              className="rounded-full border border-white/30 px-3 py-1.5 hover:border-white"
              aria-label={paused ? "Play scenes" : "Pause scenes"}
            >
              {paused ? "▶ PLAY" : "❚❚ PAUSE"}
            </button>
          </div>

          <div>
            <SplitText
              id="life-title"
              text={"ONE BIKE.\nINFINITE WAYS TO MOVE."}
              className="display max-w-5xl text-[clamp(2.4rem,7vw,7rem)]"
            />
            <AnimatePresence mode="wait">
              <motion.p key={s.id} className="mt-4 text-white/75 md:text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {s.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chapter selector */}
      <div className="mx-auto mt-4 max-w-[1600px] px-5 md:px-12">
        <div className="grid grid-cols-5 gap-2 md:gap-4" role="tablist" aria-label="Riding environments">
          {LIFESTYLE.map((x, k) => (
            <button key={x.id} role="tab" aria-selected={k === i} onClick={() => setI(k)} className="group text-left">
              <span className="block h-[2px] overflow-hidden bg-white/15">
                {k === i && (
                  <motion.span
                    key={`${i}-${paused}`}
                    className="block h-full bg-volt"
                    initial={{ width: reduced || paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: reduced || paused ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
              </span>
              <span className={`mt-3 block font-mono text-[10px] tracking-widest transition-colors ${k === i ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>
                0{k + 1}
                <span className="hidden md:inline"> · {x.title.toUpperCase()}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
