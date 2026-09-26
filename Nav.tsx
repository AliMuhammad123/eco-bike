"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Magnetic from "./Magnetic";

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why electric", href: "#benefits" },
  { label: "vs Petrol", href: "#compare" },
  { label: "Easy to use", href: "#easy-use" },
  { label: "The bike", href: "#explorer" },
  { label: "Charging", href: "#charging" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Tuck away while scrolling down fast through content, return on scroll-up.
      setHidden(y > 900 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-5"
        animate={{ y: hidden && !open ? -110 : 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-[1320px] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6 ${
            scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]" : "border border-transparent"
          }`}
        >
          <a href="#top" className="flex items-center" aria-label="Eco Bike — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative px-3.5 py-2 text-[13px] tracking-wide transition-colors ${
                    active === l.href ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-volt"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.25}>
              <a href="#build" className="btn btn-primary !h-10 !px-5 !text-[11px]">
                Build Yours
              </a>
            </Magnetic>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-px w-4 bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-4 bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink-950/95 px-6 pb-12 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline gap-4 py-2 text-[11vw] leading-none"
                  >
                    <span className="font-mono text-xs font-normal tracking-widest text-volt">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
