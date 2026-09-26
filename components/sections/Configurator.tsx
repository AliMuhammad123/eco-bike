"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Bike from "@/components/bike/Bike";
import Magnetic from "@/components/core/Magnetic";
import SectionHead from "@/components/core/SectionHead";
import { STORAGE_KEY, useBuild } from "@/lib/build-context";
import {
  ACCESSORIES,
  LIGHTS,
  LIGHT_COLORS,
  PAINTS,
  SEATS,
  WHEELS,
  encodeConfig,
  formatPrice,
  summarize,
  type AccessoryId,
} from "@/lib/bike";

type Tab = "color" | "seat" | "wheels" | "lighting" | "accessories";
const TABS: { id: Tab; label: string }[] = [
  { id: "color", label: "Colour" },
  { id: "seat", label: "Seat" },
  { id: "wheels", label: "Wheels" },
  { id: "lighting", label: "Lighting" },
  { id: "accessories", label: "Accessories" },
];

export default function Configurator() {
  const { config, setConfig } = useBuild();
  const [tab, setTab] = useState<Tab>("color");
  const [toast, setToast] = useState<string | null>(null);
  const [sweep, setSweep] = useState(0);
  const sum = summarize(config);

  const update = (patch: Partial<typeof config>) => {
    setConfig((c) => ({ ...c, ...patch }));
    setSweep((s) => s + 1);
  };
  const toggleAcc = (id: AccessoryId) =>
    update({
      accessories: config.accessories.includes(id) ? config.accessories.filter((a) => a !== id) : [...config.accessories, id],
    });

  const save = async () => {
    const code = encodeConfig(config);
    let msg = `Build saved · ${code}`;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      msg = `Build code · ${code}`;
    }
    const url = `${location.origin}${location.pathname}#build=${code}`;
    history.replaceState(null, "", `#build=${code}`);
    try {
      await navigator.clipboard.writeText(url);
      msg += " · share link copied";
    } catch {
      /* clipboard blocked — the URL is still updated */
    }
    setToast(msg);
    setTimeout(() => setToast(null), 3600);
  };

  return (
    <section id="build" aria-labelledby="build-title" className="relative overflow-hidden bg-ink-950 py-28 md:py-40">
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="06"
          eyebrow="Build Your Bike"
          id="build-title"
          title={"Make it\nunmistakably yours."}
          lede="Every choice updates the bike — and the range — instantly."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          {/* Studio stage */}
          <div className="corner-frame relative flex min-h-[380px] items-center justify-center overflow-hidden border border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_20%,#1a1e23_0%,#050607_70%)] md:min-h-[560px]">
            {/* spotlight + floor */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[60%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgba(255,255,255,0.06)_180deg,transparent_200deg)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
            <div
              className="pointer-events-none absolute bottom-[14%] left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] blur-3xl transition-colors duration-700"
              style={{ background: LIGHT_COLORS[config.light], opacity: 0.08 }}
            />

            <div className="relative w-[88%] pb-24 md:pb-10">
              <Bike config={config} beam={false} headlight={1} battery={1} energy={1} className="w-full" title={`Your build: ${sum.color} Eco Bike`} />
              {/* light sweep on every change */}
              <AnimatePresence>
                <motion.div
                  key={sweep}
                  className="pointer-events-none absolute inset-0 mix-blend-overlay"
                  initial={{ backgroundPosition: "-120% 0" }}
                  animate={{ backgroundPosition: "220% 0" }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  style={{
                    backgroundImage: "linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                    backgroundSize: "60% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Floating summary */}
            <div className="glass absolute bottom-3 left-3 right-3 rounded-xl p-4 md:bottom-6 md:left-6 md:right-auto md:w-[300px] md:p-5">
              <p className="font-mono text-[10px] tracking-[0.25em] text-volt">YOUR CONFIGURATION</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
                <Row k="Range" v={`${sum.range} km`} />
                <Row k="Motor" v={sum.motor} />
                <Row k="Colour" v={sum.color} />
                <Row k="Accessories" v={sum.accessories.length ? sum.accessories.join(", ") : "None"} />
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-[10px] tracking-widest text-white/50">FROM</span>
                <AnimatePresence mode="popLayout">
                  <motion.span key={sum.price} className="display text-xl" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                    {formatPrice(sum.price)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="corner-frame flex flex-col border border-white/[0.07] p-5 md:p-7">
            <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Customisation options">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`relative shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${tab === t.id ? "text-white" : "text-white/40 hover:text-white/80"}`}
                >
                  {t.label}
                  {tab === t.id && <motion.span layoutId="tab-line" className="absolute inset-x-3 -bottom-px h-px bg-volt" />}
                </button>
              ))}
            </div>
            <div className="mt-6 flex-1" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {tab === "color" && (
                    <div>
                      <div className="grid grid-cols-6 gap-3" role="radiogroup" aria-label="Paint">
                        {PAINTS.map((p) => (
                          <button
                            key={p.id}
                            role="radio"
                            aria-checked={config.color === p.id}
                            aria-label={p.name}
                            onClick={() => update({ color: p.id })}
                            className={`relative aspect-square rounded-full transition-transform hover:scale-110 ${config.color === p.id ? "ring-2 ring-volt ring-offset-4 ring-offset-ink-950" : "ring-1 ring-white/15"}`}
                            style={{ background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), ${p.id} 45%, #000 120%)` }}
                          />
                        ))}
                      </div>
                      <p className="mt-6 text-lg font-semibold">{PAINTS.find((p) => p.id === config.color)?.name}</p>
                      <p className="text-sm text-mist">
                        {PAINTS.find((p) => p.id === config.color)?.note} · {(() => { const pr = PAINTS.find((p) => p.id === config.color)?.price ?? 0; return pr ? `+${formatPrice(pr)}` : "Included"; })()}
                      </p>
                    </div>
                  )}
                  {tab === "seat" && <OptionList items={SEATS} value={config.seat} onPick={(id) => update({ seat: id })} label="Seat" />}
                  {tab === "wheels" && <OptionList items={WHEELS} value={config.wheels} onPick={(id) => update({ wheels: id })} label="Wheels" />}
                  {tab === "lighting" && <OptionList items={LIGHTS} value={config.light} onPick={(id) => update({ light: id })} label="Lighting" swatch={(id) => LIGHT_COLORS[id]} />}
                  {tab === "accessories" && (
                    <ul className="space-y-2">
                      {ACCESSORIES.map((a) => {
                        const on = config.accessories.includes(a.id);
                        return (
                          <li key={a.id}>
                            <button
                              onClick={() => toggleAcc(a.id)}
                              aria-pressed={on}
                              className={`flex w-full items-center justify-between gap-3 border-b py-3 text-left transition-colors ${on ? "border-volt/60" : "border-white/10 hover:border-white/30"}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className={`flex h-5 w-5 items-center justify-center rounded border ${on ? "border-volt bg-volt text-ink-950" : "border-white/30"}`}>
                                  {on && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden>
                                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" fill="none" />
                                    </svg>
                                  )}
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold">{a.name}</span>
                                  <span className="block text-xs text-mist">{a.note}</span>
                                </span>
                              </span>
                              <span className="text-right font-mono text-[11px] text-white/60">
                                +{formatPrice(a.price)}
                                {a.range ? <span className="block text-[10px] text-white/40">{a.range > 0 ? "+" : ""}{a.range} km</span> : null}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button className="btn btn-primary" onClick={save} data-cursor="Save">
                  Save My Build
                </button>
              </Magnetic>
              <p className="font-mono text-[10px] tracking-wider text-white/40">Saved on this device · shareable link</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[75] -translate-x-1/2 rounded-full px-5 py-3 font-mono text-xs tracking-wider"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-volt" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-white/45">{k}</dt>
      <dd className="truncate font-semibold md:text-right">{v}</dd>
    </div>
  );
}

function OptionList<T extends string>({
  items,
  value,
  onPick,
  label,
  swatch,
}: {
  items: { id: T; name: string; note: string; price: number; range?: number }[];
  value: T;
  onPick: (id: T) => void;
  label: string;
  swatch?: (id: T) => string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="space-y-2">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            role="radio"
            aria-checked={on}
            onClick={() => onPick(it.id)}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left transition-all ${on ? "border-volt bg-volt/[0.06]" : "border-white/10 hover:border-white/30"}`}
          >
            <span className="flex items-center gap-3">
              {swatch && <span className="h-3 w-8 rounded-full" style={{ background: swatch(it.id), boxShadow: `0 0 12px ${swatch(it.id)}` }} />}
              <span>
                <span className="block text-sm font-semibold">{it.name}</span>
                <span className="block text-xs text-mist">{it.note}</span>
              </span>
            </span>
            <span className="text-right font-mono text-[11px] text-white/60">
              {it.price ? `+${formatPrice(it.price)}` : "Included"}
              {it.range ? <span className="block text-[10px] text-white/40">{it.range > 0 ? "+" : ""}{it.range} km</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
