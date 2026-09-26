"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Bike from "./Bike";
import { CityNight, Coast, Commute, Mountain, NightRide } from "./Scenes";
import type { BikeConfig } from "@/lib/bike";

export const SCENE_MAP = {
  city: CityNight,
  coast: Coast,
  mountain: Mountain,
  night: NightRide,
  commute: Commute,
} as const;
export type SceneId = keyof typeof SCENE_MAP;

/**
 * Optional real footage per scene. Drop MP4s into /public/video and add
 * them here — the code-drawn scene stays as the poster and fallback.
 * Videos are only loaded when their scene becomes active.
 */
export const SCENE_VIDEO: Partial<Record<SceneId, string>> = {
  // city: "/video/city.mp4",
};

/** A cinematic, crossfading scene with the bike riding through it. */
export default function SceneStage({
  scene,
  config,
  distort = false,
  reduced,
  className = "",
}: {
  scene: SceneId;
  config: BikeConfig;
  distort?: boolean;
  reduced: boolean;
  className?: string;
}) {
  const Scene = SCENE_MAP[scene];
  const video = SCENE_VIDEO[scene];
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    vref.current?.play().catch(() => {});
  }, [scene]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Hover distortion filter */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id="scene-distort">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="3">
            {!reduced && <animate attributeName="baseFrequency" dur="6s" values="0.012 0.03;0.016 0.05;0.012 0.03" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale={distort && !reduced ? 26 : 0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <AnimatePresence initial={false}>
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08, clipPath: "inset(0 0 0 100%)" }}
          animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0 0%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 1.4, ease: [0.77, 0, 0.18, 1] }}
          style={{ filter: distort ? "url(#scene-distort)" : undefined }}
        >
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { scale: [1, 1.06] }}
            transition={{ duration: 8, ease: "linear" }}
          >
            <Scene className="h-full w-full" />
            {video && (
              <video
                ref={vref}
                className="absolute inset-0 h-full w-full object-cover"
                src={video}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
              />
            )}
          </motion.div>
          {/* Rider */}
          {!video && (
            <motion.div
              className="absolute bottom-[14%] w-[46%] max-w-[560px] md:bottom-[13%] md:w-[34%]"
              initial={{ left: "-40%" }}
              animate={{ left: reduced ? "52%" : ["-10%", "56%"] }}
              transition={{ duration: 7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Bike config={config} spin={!reduced} headlight={scene === "night" || scene === "city" ? 1 : 0.35} ground={false} className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/40" />
    </div>
  );
}
