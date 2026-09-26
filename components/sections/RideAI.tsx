"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHead from "@/components/core/SectionHead";
import { useBuild } from "@/lib/build-context";
import { useReducedMotion } from "@/lib/hooks";
import { rideAi, type AiCard } from "@/lib/ride-ai";

type Msg = { id: number; role: "rider" | "ai"; text: string; card?: AiCard };
type Status = "idle" | "thinking" | "speaking";

const SUGGESTIONS = [
  "Which riding mode should I use?",
  "How much range will I have?",
  "Plan a 50 km weekend ride.",
  "Find charging stops.",
];

/** Typewriter that reveals text character by character. */
function Typed({ text, onDone, instant }: { text: string; onDone?: () => void; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) {
      setN(text.length);
      onDone?.();
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setN(i);
      if (i >= text.length) {
        clearInterval(t);
        onDone?.();
      }
    }, 16);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, instant]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-volt" />}
    </>
  );
}

function Card({ card }: { card: AiCard }) {
  if (card.kind === "modes")
    return (
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {card.rows.map((r) => (
          <div key={r.mode} className="rounded-lg border border-white/10 p-3">
            <p className="font-mono text-[10px] tracking-widest" style={{ color: r.color }}>
              {r.mode.toUpperCase()}
            </p>
            <p className="display mt-1 text-2xl">
              {r.range}
              <span className="text-sm text-white/50"> km</span>
            </p>
            <p className="text-[11px] text-white/50">{r.best}</p>
          </div>
        ))}
      </div>
    );
  if (card.kind === "route")
    return (
      <ol className="mt-4 space-y-0 border-l border-volt/40 pl-5">
        {card.legs.map((l, i) => (
          <li key={i} className="relative pb-4 last:pb-0">
            <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-volt bg-ink-950" />
            <p className="text-sm font-semibold">
              {l.label} <span className="font-mono text-xs text-volt">· {l.km} km</span>
            </p>
            <p className="text-xs text-white/55">{l.note}</p>
          </li>
        ))}
      </ol>
    );
  return (
    <ul className="mt-4 space-y-2">
      {card.items.map((s) => (
        <li key={s.name} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5">
          <span>
            <span className="block text-sm font-semibold">{s.name}</span>
            <span className="font-mono text-[10px] text-white/50">
              {s.kw} kW · {s.eta}
            </span>
          </span>
          <span className="font-mono text-xs text-volt">
            {s.free}/{s.total} free
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RideAI() {
  const { config } = useBuild();
  const reduced = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "ai", text: "RIDE AI online. I know your bike, your battery and the roads ahead. How can I help?" },
  ]);
  const [status, setStatus] = useState<Status>("idle");
  const [input, setInput] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, status, reduced]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t || status !== "idle") return;
    setInput("");
    setMsgs((m) => [...m, { id: nextId.current++, role: "rider", text: t }]);
    setStatus("thinking");
    // Swap this for a fetch() to your own model endpoint when ready.
    setTimeout(() => {
      const r = rideAi(t, config);
      setMsgs((m) => [...m, { id: nextId.current++, role: "ai", ...r }]);
      setStatus("speaking");
    }, reduced ? 50 : 900);
  };

  const lastAi = [...msgs].reverse().find((m) => m.role === "ai");

  return (
    <section id="ride-ai" aria-labelledby="ai-title" className="relative overflow-hidden bg-ink-900 py-16 md:py-24">
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-10">
        <SectionHead
          index="07"
          eyebrow="Ride AI"
          id="ai-title"
          title={"A co-pilot\nthat knows your bike."}
          lede="Ride AI reads your battery, your build and the road to answer in plain language — hands-free on the move."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Core / orb */}
          <div className="corner-frame relative flex flex-col items-center justify-center overflow-hidden border border-white/[0.07] bg-ink-950 p-8">
            <div className="relative h-56 w-56 md:h-64 md:w-64" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: i % 2 ? "rgba(77,232,255,0.35)" : "rgba(200,255,46,0.4)", inset: `${i * 12}%` }}
                  animate={
                    reduced
                      ? undefined
                      : {
                          rotate: i % 2 ? -360 : 360,
                          scale: status === "speaking" ? [1, 1.06 + i * 0.02, 1] : status === "thinking" ? [1, 0.96, 1] : 1,
                        }
                  }
                  transition={{
                    rotate: { duration: 14 + i * 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: status === "speaking" ? 0.6 : 1.2, repeat: Infinity },
                  }}
                >
                  <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt" />
                </motion.div>
              ))}
              <motion.div
                className="absolute inset-[38%] rounded-full bg-volt"
                animate={reduced ? undefined : { boxShadow: status === "idle" ? "0 0 40px 6px rgba(200,255,46,0.35)" : "0 0 90px 20px rgba(200,255,46,0.6)" }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="mt-8 font-mono text-[11px] tracking-[0.3em] text-white/60" aria-live="polite">
              {status === "idle" ? "● LISTENING" : status === "thinking" ? "◌ PROCESSING…" : "▶ RESPONDING"}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-widest text-white/30">ECO OS 3 · ON-DEVICE</p>
          </div>

          {/* Console */}
          <div className="corner-frame flex min-h-[520px] flex-col border border-white/[0.07] bg-ink-950">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-white/40">
              <span>SESSION · RIDER-01</span>
              <span className="text-volt">SECURE</span>
            </div>
            <div ref={log} className="flex-1 space-y-6 overflow-y-auto px-5 py-6 md:px-8" style={{ maxHeight: 460 }} aria-live="polite" aria-relevant="additions">
              <AnimatePresence initial={false}>
                {msgs.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <p className={`font-mono text-[10px] tracking-[0.25em] ${m.role === "ai" ? "text-volt" : "text-white/40"}`}>
                      {m.role === "ai" ? "◆ RIDE AI" : "› RIDER"}
                    </p>
                    <div className={`mt-2 max-w-2xl leading-relaxed ${m.role === "ai" ? "text-[15px] text-white md:text-base" : "font-mono text-sm text-white/70"}`}>
                      {m.role === "ai" ? (
                        <Typed text={m.text} instant={reduced || m.id === 0 || m !== lastAi} onDone={m === lastAi ? () => setStatus((s) => (s === "speaking" ? "idle" : s)) : undefined} />
                      ) : (
                        m.text
                      )}
                    </div>
                    {m.card && (status === "idle" || m !== lastAi) && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <Card card={m.card} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {status === "thinking" && (
                <div className="flex gap-1.5" aria-label="Ride AI is thinking">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-volt" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.07] p-4 md:p-5">
              <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip shrink-0" onClick={() => ask(s)} disabled={status !== "idle"}>
                    {s}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2 rounded-full border border-white/15 pl-5 pr-1.5 focus-within:border-volt/70"
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
              >
                <label htmlFor="ai-input" className="sr-only">
                  Ask Ride AI
                </label>
                <input
                  id="ai-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ride AI…"
                  className="h-12 flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || status !== "idle"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-volt text-ink-950 transition disabled:opacity-30"
                  aria-label="Send"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
