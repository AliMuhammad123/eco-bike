"use client";

import { motion } from "framer-motion";
import Bike from "@/components/bike/Bike";
import BikePhoto from "@/components/bike/BikePhoto";
import SectionHead from "@/components/core/SectionHead";
import { EASY_STEPS, NO_MORE, PHOTOS } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";

export default function EasyToUse() {
  const reduced = useReducedMotion();

  return (
    <section id="easy-use" aria-labelledby="easy-title" className="relative overflow-hidden bg-ink-900 py-28 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="04"
          eyebrow="Easy to use"
          id="easy-title"
          title={"Four steps.\nThat's it."}
          lede="If you can ride a scooter, you can ride this. There's nothing new to learn."
        />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-2 lg:items-center">
          <ol className="space-y-4">
            {EASY_STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                className="flex gap-5 rounded-2xl border border-white/10 bg-ink-950 p-6"
                initial={reduced ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              >
                <span className="display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-volt text-xl text-ink-950">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-950 bg-[radial-gradient(ellipse_at_50%_45%,#3A424C_0%,#1A1E23_45%,#050607_100%)]">
              <BikePhoto
                src={PHOTOS.riding.src}
                alt={PHOTOS.riding.alt}
                className="h-full w-full object-contain p-6 drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]"
                fallback={
                  <div className="flex h-full items-center justify-center p-6">
                    <Bike headlight={1} battery={1} energy={1} className="w-full" title="Eco Bike Model One" />
                  </div>
                }
              />
            </div>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Things you won't need to deal with">
              {NO_MORE.map((n) => (
                <li key={n} className="chip flex items-center gap-2">
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-volt" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M2.5 6.5l2.2 2L9.5 3.5" />
                  </svg>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
