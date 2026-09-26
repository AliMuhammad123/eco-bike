"use client";

import { motion } from "framer-motion";
import SectionHead from "@/components/core/SectionHead";
import { HOW_IT_WORKS, PLAIN_SPECS } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

/** Socket → battery → motor → wheel, drawn as a simple chain. */
const FLOW = ["Wall socket", "Battery", "Motor", "Rear wheel"];

export default function HowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="02"
          eyebrow="Easy to understand"
          id="how-title"
          title={"How an electric\nbike works."}
          lede="If you've ridden a petrol bike, you already understand this one. Every part has a petrol twin — it just does the job more simply."
        />

        {/* Energy path */}
        <ol className="mt-10 flex flex-col gap-3 md:mt-14 md:flex-row md:items-center" aria-label="How energy gets to the wheel">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-3 md:flex-1">
              <span className="glass flex-1 rounded-2xl px-5 py-4 text-center">
                <span className="block font-mono text-[10px] tracking-[0.25em] text-volt">STEP {i + 1}</span>
                <span className="mt-1 block text-lg font-semibold">{step}</span>
              </span>
              {i < FLOW.length - 1 && (
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 rotate-90 text-volt md:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              )}
            </li>
          ))}
        </ol>

        {/* Part-by-part, in petrol terms */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((p, i) => (
            <motion.li
              key={p.ev}
              className="rounded-2xl border border-white/10 bg-ink-900 p-6"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
            >
              <p className="text-xl font-semibold">{p.ev}</p>
              <p className="mt-1 text-sm text-volt">= the {p.petrol.toLowerCase()} on a petrol bike</p>
              <p className="mt-4 text-sm leading-relaxed text-mist">{p.body}</p>
            </motion.li>
          ))}
        </ul>

        {/* Key numbers, in plain words */}
        <h3 className="eyebrow mt-12">The numbers, in plain words</h3>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PLAIN_SPECS.map((s) => (
            <div key={s.label} className="bg-ink-950 p-6">
              <dt className="text-sm text-white/70">{s.label}</dt>
              <dd className="display mt-2 text-4xl">{s.value}</dd>
              <dd className="mt-2 text-sm text-mist">{s.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
