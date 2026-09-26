"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * A product photo that splits into labelled parts on hover (tap on touch).
 *
 * The photo is cut into polygons that tile it exactly (so it looks whole at
 * rest); each piece slides out along `dx/dy` and shows its one-word label.
 * Polygons are in % of the image and are tuned for `bike-silver.webp` —
 * adjust them if you swap the photo.
 */
const PARTS = [
  { word: "Display", clip: "0% 0%, 100% 0%, 100% 42%, 50% 42%, 42% 26%, 0% 26%", dx: 0, dy: -26, at: [50, 13] },
  { word: "Light", clip: "0% 26%, 42% 26%, 50% 42%, 48% 64%, 0% 64%", dx: -26, dy: -6, at: [20, 45] },
  { word: "Seat", clip: "50% 42%, 100% 42%, 100% 62%, 70% 63%, 48% 64%", dx: 24, dy: -12, at: [78, 52] },
  { word: "Brakes", clip: "0% 64%, 40% 64%, 40% 100%, 0% 100%", dx: -22, dy: 22, at: [18, 84] },
  { word: "Battery", clip: "40% 64%, 48% 64%, 70% 63%, 70% 100%, 40% 100%", dx: 0, dy: 28, at: [55, 84] },
  { word: "Motor", clip: "70% 63%, 100% 62%, 100% 100%, 70% 100%", dx: 24, dy: 22, at: [86, 84] },
] as const;

export default function ExplodedBike({
  src,
  alt,
  fallback,
  className = "",
}: {
  src: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
}) {
  const probe = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const pointer = useRef("");
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = probe.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;

  const ease = reduced ? "none" : "transform 0.7s cubic-bezier(0.19,1,0.22,1), opacity 0.4s";

  return (
    <div className={className}>
      <button
        type="button"
        className="group relative block w-full cursor-pointer rounded-[2rem] p-8"
        // Mouse: hover opens. Touch/pen: tap toggles. Keyboard: focus opens.
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={(e) => (e.detail === 0 || pointer.current !== "mouse") && setOpen((o) => !o)}
        onKeyUp={(e) => e.key === "Tab" && setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-pressed={open}
        aria-label={`${alt}. Show the main parts: ${PARTS.map((p) => p.word).join(", ")}.`}
      >
        {/* Soft glow + ground shadow so the cut-out doesn't float on the dark page */}
        <span aria-hidden className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(200,255,46,0.22),transparent)]" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[7%] h-8 rounded-[50%] bg-black/70 blur-xl" />
        <span className="relative block">
          {/* Whole photo: sizes the box and hides the hairline seams between pieces at rest. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={probe}
            src={src}
            alt=""
            className="block w-full"
            style={{ opacity: open ? 0 : 1, transition: reduced ? "none" : "opacity 0.2s" }}
            onError={() => setFailed(true)}
            fetchPriority="high"
          />

          {PARTS.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.word}
              src={src}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full select-none"
              style={{
                clipPath: `polygon(${p.clip})`,
                transform: open ? `translate(${p.dx}px, ${p.dy}px)` : "none",
                transition: ease,
              }}
            />
          ))}

          {PARTS.map((p, i) => (
            <span
              key={p.word}
              aria-hidden
              className="pointer-events-none absolute whitespace-nowrap rounded-full bg-ink-950 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-volt shadow-lg"
              style={{
                left: `${p.at[0]}%`,
                top: `${p.at[1]}%`,
                opacity: open ? 1 : 0,
                transform: `translate(-50%, -50%) translate(${open ? p.dx * 2.2 : p.dx}px, ${open ? p.dy * 2.2 : p.dy}px)`,
                transition: reduced ? "none" : `transform 0.7s cubic-bezier(0.19,1,0.22,1) ${i * 40}ms, opacity 0.4s ${i * 40}ms`,
              }}
            >
              {p.word}
            </span>
          ))}
        </span>
      </button>
      <p className="mt-3 text-center font-mono text-[11px] tracking-[0.2em] text-white/50" aria-hidden>
        <span className="hidden md:inline">HOVER</span>
        <span className="md:hidden">TAP</span> TO SEE WHAT&apos;S INSIDE
      </p>
    </div>
  );
}
