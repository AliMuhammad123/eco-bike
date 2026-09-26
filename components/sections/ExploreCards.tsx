"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHead from "@/components/core/SectionHead";
import { useReducedMotion } from "@/lib/hooks";

const CARDS = [
  { href: "/savings", title: "Savings vs petrol", body: "See what you save every month in fuel and servicing, in rupees.", stat: "~⅓ the running cost" },
  { href: "/bike", title: "The bike", body: "Look inside, see how it works and why anyone can ride it.", stat: "120 km per charge" },
  { href: "/build", title: "Build yours", body: "Pick colour, battery and extras, and see your price live.", stat: "Live pricing" },
  { href: "/charging", title: "Charging", body: "Charge from a normal wall socket or find a station on your route.", stat: "3.5 h at home" },
];

/** Home-page doorway to the other pages. */
export default function ExploreCards() {
  const reduced = useReducedMotion();

  return (
    <section id="explore" aria-labelledby="explore-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead index="02" eyebrow="Explore" id="explore-title" title="FIND WHAT MATTERS TO YOU" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {CARDS.map((c, i) => (
            <motion.li
              key={c.href}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link
                href={c.href}
                className="glass group flex h-full flex-col rounded-3xl p-6 transition-colors hover:border-volt/50"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-volt">{c.stat.toUpperCase()}</span>
                <span className="mt-6 text-xl font-semibold">{c.title}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-mist">{c.body}</span>
                <span className="mt-6 text-sm text-white/70 transition-colors group-hover:text-volt">Open →</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
