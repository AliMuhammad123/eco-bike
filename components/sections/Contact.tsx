"use client";

import SectionHead from "@/components/core/SectionHead";
import { useBuild } from "@/lib/build-context";

export default function Contact() {
  const { setTestRideOpen } = useBuild();

  return (
    <section id="contact-us" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="01"
          eyebrow="Contact"
          id="contact-title"
          title="TALK TO US"
          lede="Questions about price, charging or delivery? Write to us, or book a free test ride and try it yourself."
        />
        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
          <a href="mailto:hello@ecobike.example" className="glass group rounded-3xl p-6 transition-colors hover:border-volt/50 md:p-8">
            <span className="eyebrow">Email</span>
            <span className="mt-4 block text-xl font-semibold group-hover:text-volt md:text-2xl">hello@ecobike.example</span>
            <span className="mt-2 block text-sm text-mist">We usually reply within one working day.</span>
          </a>
          <div className="glass rounded-3xl p-6 md:p-8">
            <span className="eyebrow">Test ride</span>
            <span className="mt-4 block text-xl font-semibold md:text-2xl">Try it before you buy</span>
            <span className="mt-2 block text-sm text-mist">Pick a city and a date — it takes under a minute.</span>
            <button type="button" className="btn btn-primary mt-6" onClick={() => setTestRideOpen(true)}>
              Book a test ride
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
