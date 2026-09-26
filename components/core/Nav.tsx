"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Magnetic from "./Magnetic";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "The bike", href: "/bike" },
  { label: "Savings", href: "/savings" },
  { label: "Charging", href: "/charging" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = pathname.replace(/\/$/, "") || "/";

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

  // Close the mobile menu after navigating to another page.
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

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
          <Link href="/" className="flex items-center" aria-label="Eco Bike — home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active === l.href ? "page" : undefined}
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
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.25}>
              <Link href="/build" className="btn btn-primary !h-10 !px-4 !text-[11px] md:!px-5">
                Build Yours
              </Link>
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
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 px-6 pb-10 pt-24 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
          >
            <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.href ? "page" : undefined}
                    className={`flex items-center gap-4 py-4 text-xl font-semibold tracking-tight sm:text-2xl ${
                      active === l.href ? "text-volt" : "text-white"
                    }`}
                  >
                    <span className="w-6 font-mono text-[11px] font-normal tracking-widest text-white/40">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
