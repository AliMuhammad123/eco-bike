"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useSmoothScroll } from "./SmoothScroll";

/**
 * Accessible dialog: focus moves in on open and back on close, Tab is
 * trapped, Escape closes, page scroll is paused.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  className = "",
  bare = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  /** No panel chrome — content fills the viewport (used by the film). */
  bare?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    lenis()?.stop();
    document.documentElement.style.overflow = "hidden";

    const t = setTimeout(() => {
      const f = panel.current?.querySelector<HTMLElement>(
        "[autofocus], input, button, [href], select, textarea"
      );
      (f ?? panel.current)?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const els = panel.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!els.length) return;
      const first = els[0],
        last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis()?.start();
      prev?.focus?.();
    };
  }, [open, onClose, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={
              bare
                ? `relative h-full w-full outline-none ${className}`
                : `glass relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 outline-none md:p-8 ${className}`
            }
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/60 hover:text-white"
              aria-label="Close dialog"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
