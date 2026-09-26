"use client";

import { motion } from "framer-motion";
import { createElement, type ElementType } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Masked word-by-word (or char-by-char) reveal.
 * Screen readers get the plain string via aria-label; the animated
 * fragments are aria-hidden.
 *
 * Use "\n" in `text` for a hard line break.
 */
export default function SplitText({
  text,
  as = "h2",
  className,
  by = "word",
  delay = 0,
  stagger = 0.06,
  once = true,
  animateOnMount = false,
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Animate immediately instead of on scroll-in (e.g. hero). */
  animateOnMount?: boolean;
  id?: string;
}) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");
  let idx = 0;

  const inner = lines.map((line, li) => (
    <span key={li} className="block">
      {line.split(" ").map((word, wi) => {
        const parts = by === "char" ? Array.from(word) : [word];
        return (
          <span key={wi} className="inline-block whitespace-nowrap">
            {parts.map((p, pi) => {
              const i = idx++;
              return (
                <span key={pi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={reduced ? false : { y: "110%", rotate: 4 }}
                    {...(animateOnMount
                      ? { animate: { y: "0%", rotate: 0 } }
                      : { whileInView: { y: "0%", rotate: 0 }, viewport: { once, margin: "0px 0px -10% 0px" } })}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: delay + i * stagger }}
                  >
                    {p}
                  </motion.span>
                </span>
              );
            })}
            {wi < line.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </span>
  ));

  return createElement(
    as,
    { className, "aria-label": text.replace(/\n/g, " "), id },
    <span aria-hidden>{inner}</span>
  );
}
