"use client";

import { useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { COMPARE_ASSUMPTIONS as A, COMPARE_ROWS, formatRs } from "@/lib/content";

const evPer100 = A.evKwhPer100Km * A.electricityPerKwh;
const petrolPer100 = (100 / A.petrolKmPerLitre) * A.petrolPerLitre;

function yearly(kmPerDay: number) {
  const km = kmPerDay * 365;
  const ev = (km / 100) * evPer100 + A.evServicePerYear;
  const petrol = (km / 100) * petrolPer100 + A.petrolServicePerYear;
  const co2Saved = (km / A.petrolKmPerLitre) * A.petrolCo2PerLitre - km * A.evCo2PerKm;
  return { km, ev, petrol, saved: petrol - ev, co2Saved };
}

function Tick({ on }: { on: boolean }) {
  return on ? (
    <svg viewBox="0 0 16 16" className="mr-2 inline h-4 w-4 shrink-0 text-volt" fill="none" stroke="currentColor" strokeWidth="2" aria-label="Better">
      <path d="M3 8.5l3.2 3L13 5" />
    </svg>
  ) : null;
}

export default function ComparePetrol() {
  const [kmPerDay, setKmPerDay] = useState(30);
  const y = yearly(kmPerDay);
  const maxCost = Math.max(y.ev, y.petrol);

  return (
    <section id="compare" aria-labelledby="compare-title" className="relative overflow-hidden bg-ink-950 py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="01"
          eyebrow="Electric vs petrol"
          id="compare-title"
          title={"Eco Bike vs a\npetrol bike."}
          lede={`An honest side-by-side with a typical petrol bike doing ${A.petrolKmPerLitre} km per litre, at today's Pakistan petrol price. Electric wins on cost and comfort; petrol still fills up faster.`}
        />

        {/* ── Savings calculator ─────────────────────── */}
        <div className="glass mt-10 rounded-3xl p-6 md:mt-14 md:p-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <label htmlFor="km-per-day" className="text-lg font-semibold">
              How far do you ride each day?
            </label>
            <output htmlFor="km-per-day" className="display text-4xl text-volt">
              {kmPerDay} km
            </output>
          </div>
          <input
            id="km-per-day"
            type="range"
            min={5}
            max={100}
            step={5}
            value={kmPerDay}
            onChange={(e) => setKmPerDay(Number(e.target.value))}
            className="mt-5 w-full accent-[#C8FF2E]"
          />

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-5" role="group" aria-label="Yearly running cost">
              {[
                { name: "Eco Bike (electric)", cost: y.ev, color: "bg-volt" },
                { name: "Petrol bike", cost: y.petrol, color: "bg-heat" },
              ].map((r) => (
                <div key={r.name}>
                  <div className="flex justify-between text-sm">
                    <span>{r.name}</span>
                    <span className="font-mono">{formatRs(r.cost)} / year</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${r.color} transition-[width] duration-500`} style={{ width: `${(r.cost / maxCost) * 100}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-white/45">
                Fuel/electricity + servicing for {y.km.toLocaleString("en-PK")} km a year. Petrol Rs {A.petrolPerLitre}/litre at{" "}
                {A.petrolKmPerLitre} km/litre; electricity about Rs {A.electricityPerKwh}/unit. Estimates — your bill will vary.
              </p>
            </div>

            <div className="rounded-2xl border border-volt/40 bg-volt/[0.06] p-6 text-center md:min-w-[260px]">
              <p className="text-sm text-white/70">You save about</p>
              <p className="display mt-2 text-[clamp(2.2rem,4vw,3rem)] text-volt">{formatRs(y.saved)}</p>
              <p className="mt-1 text-sm text-white/70">every year</p>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm text-mist">
                and avoid <span className="font-semibold text-white">{Math.round(y.co2Saved).toLocaleString("en-US")} kg</span> of CO₂
              </p>
            </div>
          </div>
        </div>

        {/* ── Side-by-side table ─────────────────────── */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">Eco Bike compared with a typical petrol commuter motorcycle</caption>
            <thead>
              <tr className="bg-ink-900">
                <th scope="col" className="p-4 font-mono text-[11px] font-normal tracking-[0.2em] text-white/50 md:p-5">
                  WHAT MATTERS
                </th>
                <th scope="col" className="p-4 text-base font-semibold text-volt md:p-5">Eco Bike</th>
                <th scope="col" className="p-4 text-base font-semibold text-white/80 md:p-5">Petrol bike</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <th scope="row" className="p-4 font-normal text-white/70 md:p-5">Cost per 100 km</th>
                <td className="p-4 md:p-5"><Tick on />{formatRs(evPer100)}</td>
                <td className="p-4 md:p-5">{formatRs(petrolPer100)}</td>
              </tr>
              {COMPARE_ROWS.map((r) => (
                <tr key={r.label} className="border-t border-white/10">
                  <th scope="row" className="p-4 font-normal text-white/70 md:p-5">{r.label}</th>
                  <td className="p-4 md:p-5"><Tick on={r.win === "ev"} />{r.ev}</td>
                  <td className="p-4 md:p-5"><Tick on={r.win === "petrol"} />{r.petrol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
