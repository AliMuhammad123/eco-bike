"use client";

import { useEffect, useState } from "react";
import { useSmoothScroll } from "./SmoothScroll";

/** Fixed bottom-corner arrows that step to the previous / next section of the page. */
export default function ScrollButtons() {
  const { scrollTo } = useSmoothScroll();
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 80);
      setAtBottom(y + window.innerHeight >= document.documentElement.scrollHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const stops = Array.from(document.querySelectorAll<HTMLElement>("#main > section, footer"));
    const y = window.scrollY;
    const tops = stops.map((el) => el.getBoundingClientRect().top + y);
    if (dir === 1) {
      const i = tops.findIndex((t) => t > y + 10);
      if (i === -1) scrollTo(document.documentElement.scrollHeight);
      else scrollTo(stops[i]);
    } else {
      let i = -1;
      tops.forEach((t, k) => t < y - 10 && (i = k));
      if (i <= 0) scrollTo(0);
      else scrollTo(stops[i]);
    }
  };

  const btn =
    "glass flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:border-volt hover:text-volt disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col gap-2 md:bottom-8 md:right-8">
      <button type="button" className={btn} onClick={() => step(-1)} disabled={atTop} aria-label="Scroll up one section">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={btn} onClick={() => step(1)} disabled={atBottom} aria-label="Scroll down one section">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
