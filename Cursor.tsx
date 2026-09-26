"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * A trailing ring + dot that reacts to interactive elements.
 * The native cursor stays visible — this only adds, never replaces.
 * Elements can set data-cursor="label" to show a text label in the ring.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [role='button'], input, select, [data-cursor]"
      );
      setActive(!!t);
      setLabel(t?.dataset.cursor ?? null);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 transition-[width,height,background-color] duration-300 ease-out"
          style={{
            width: label ? 84 : active ? 54 : 30,
            height: label ? 84 : active ? 54 : 30,
            backgroundColor: label ? "rgba(255,255,255,1)" : "transparent",
          }}
        >
          {label && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black">{label}</span>
          )}
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </div>
  );
}
