"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type ScrollTo = (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;

const ScrollCtx = createContext<{ scrollTo: ScrollTo; lenis: () => Lenis | null }>({
  scrollTo: () => {},
  lenis: () => null,
});

export const useSmoothScroll = () => useContext(ScrollCtx);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scrubs
 * stay perfectly in sync. Disabled entirely for reduced-motion users and
 * touch devices keep native momentum (Lenis default).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: start at the top and re-measure scroll-driven animations.
  useEffect(() => {
    if (location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const scrollTo = useCallback<ScrollTo>((target, opts = {}) => {
    const el =
      typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
    if (el === null) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el as HTMLElement | number, {
        offset: opts.offset ?? 0,
        immediate: opts.immediate,
        duration: 1.6,
      });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
      window.scrollTo({ top });
    }
    // Move keyboard focus to the destination for screen-reader / keyboard users.
    if (el instanceof HTMLElement) {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
  }, []);

  // Intercept in-page anchor clicks so they glide instead of jump.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      scrollTo(el as HTMLElement);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  return (
    <ScrollCtx.Provider value={{ scrollTo, lenis: () => lenisRef.current }}>
      {children}
    </ScrollCtx.Provider>
  );
}
