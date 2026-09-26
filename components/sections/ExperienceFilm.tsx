"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SceneStage, { type SceneId } from "@/components/bike/SceneStage";
import Modal from "@/components/core/Modal";
import { useBuild } from "@/lib/build-context";
import { LIFESTYLE } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

const CHAPTER = 4200;

/** "Watch the Experience" — a full-screen, auto-playing cinematic reel. */
export default function ExperienceFilm() {
  const { filmOpen, setFilmOpen, config } = useBuild();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!filmOpen) {
      setI(0);
      return;
    }
    const t = setTimeout(() => {
      if (i < LIFESTYLE.length - 1) setI(i + 1);
    }, CHAPTER);
    return () => clearTimeout(t);
  }, [filmOpen, i]);

  const s = LIFESTYLE[i];

  return (
    <Modal open={filmOpen} onClose={() => setFilmOpen(false)} label="The Eco Bike experience film" bare className="bg-ink-950">
      <div className="absolute inset-0">
        <SceneStage scene={s.id as SceneId} config={config} reduced={reduced} />
        {/* Letterbox */}
        <div className="absolute inset-x-0 top-0 h-[9vh] bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-[9vh] bg-black" />

        <div className="absolute inset-x-0 bottom-[13vh] px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.8 }}>
              <p className="font-mono text-[11px] tracking-[0.35em] text-volt">
                CHAPTER 0{i + 1} · {s.title.toUpperCase()}
              </p>
              <p className="display mt-3 text-[clamp(2rem,5vw,4.5rem)]">{s.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-6 bottom-[4vh] flex gap-2 md:inset-x-16">
          {LIFESTYLE.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} className="h-4 flex-1" aria-label={`Chapter ${k + 1}: ${x.title}`}>
              <span className="block h-[2px] overflow-hidden bg-white/20">
                <motion.span
                  key={`${k}-${i}`}
                  className="block h-full bg-white"
                  initial={{ width: k < i ? "100%" : "0%" }}
                  animate={{ width: k <= i ? "100%" : "0%" }}
                  transition={{ duration: k === i && !reduced ? CHAPTER / 1000 : 0, ease: "linear" }}
                />
              </span>
            </button>
          ))}
        </div>
        <p className="absolute left-6 top-[3vh] font-mono text-[10px] tracking-[0.3em] text-white/50 md:left-16">ECO BIKE · THE EXPERIENCE</p>
      </div>
    </Modal>
  );
}
