"use client";

import { motion } from "framer-motion";
import SectionHead from "@/components/core/SectionHead";
import { BENEFITS } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

const ICONS: Record<(typeof BENEFITS)[number]["icon"], React.ReactNode> = {
  money: (
    <g>
      <path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z" />
      <path d="M4 7l11-3v3M20 11h-4a2 2 0 0 0 0 4h4" />
    </g>
  ),
  wrench: <path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z" />,
  quiet: (
    <g>
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      <path d="M17 9l4 6M21 9l-4 6" />
    </g>
  ),
  leaf: (
    <g>
      <path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" />
      <path d="M5 19l8-8" />
    </g>
  ),
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  plug: (
    <g>
      <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
    </g>
  ),
};

export default function Benefits() {
  const reduced = useReducedMotion();

  return (
    <section id="benefits" aria-labelledby="benefits-title" className="relative overflow-hidden bg-ink-900 py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="02"
          eyebrow="Benefits of EV bikes"
          id="benefits-title"
          title={"Why go\nelectric?"}
          lede="Six everyday reasons riders switch — and don't go back."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {BENEFITS.map((b, i) => (
            <motion.li
              key={b.title}
              className="group rounded-2xl border border-white/10 bg-ink-950 p-7 transition-colors hover:border-volt/50"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-volt/50 text-volt">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[b.icon]}
                </svg>
              </span>
              <h3 className="mt-6 text-xl font-semibold">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{b.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
