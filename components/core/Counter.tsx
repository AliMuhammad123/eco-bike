"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { useInView, useReducedMotion } from "@/lib/hooks";

/** Counts up from 0 when scrolled into view (or when `start` flips true). */
export default function Counter({
  to,
  decimals = 0,
  duration = 1.8,
  start,
  className,
  format,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  /** Optional external trigger; falls back to in-view detection. */
  start?: boolean;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  const go = start ?? seen;
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!go) return;
    if (reduced) {
      setVal(to);
      return;
    }
    const c = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setVal,
    });
    return () => c.stop();
  }, [go, to, duration, reduced]);

  const txt = format ? format(val) : val.toFixed(decimals);
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {txt}
    </span>
  );
}
