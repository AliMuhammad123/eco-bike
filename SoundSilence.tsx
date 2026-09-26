"use client";

import { useRef } from "react";
import Bike from "@/components/bike/Bike";
import { CityNight, Coast } from "@/components/bike/Scenes";
import { useBuild } from "@/lib/build-context";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect, useReducedMotion } from "@/lib/hooks";

const NOISE_TAGS = [
  { t: "HORN · 110 dB", x: "12%", y: "22%" },
  { t: "ENGINE 6,200 RPM", x: "68%", y: "18%" },
  { t: "EXHAUST · 96 dB", x: "20%", y: "70%" },
  { t: "TRAFFIC · 85 dB", x: "74%", y: "72%" },
  { t: "SIREN", x: "46%", y: "12%" },
];

const HEADLINE = ["POWER", "DOESN’T", "HAVE", "TO", "BE", "LOUD."];

export default function SoundSilence() {
  const root = useRef<HTMLElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const db = useRef<HTMLSpanElement>(null);
  const { config } = useBuild();
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const q = gsap.utils.selector(el);
    let progress = 0;
    let raf = 0;
    let running = false;

    const draw = (t: number) => {
      const amp = Math.pow(Math.max(0, 1 - progress / 0.48), 1.6);
      const time = t / 1000;
      paths.current.forEach((p, layer) => {
        if (!p) return;
        let d = "";
        const N = 140;
        for (let i = 0; i <= N; i++) {
          const x = (i / N) * 1600;
          const env = Math.sin((i / N) * Math.PI); // taper at edges
          const n =
            Math.sin(i * 0.9 + time * (9 + layer * 3)) * 0.5 +
            Math.sin(i * 2.7 - time * 13) * 0.3 +
            Math.sin(i * 0.23 + time * 4 + layer) * 0.6 +
            (Math.sin(i * 12.9898 + Math.floor(time * 24) * 78.233) * 43758.5453 % 1) * 0.5;
          const y = 450 + n * 170 * amp * env * (1 - layer * 0.25);
          d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
        }
        p.setAttribute("d", d);
      });
      if (db.current) db.current.textContent = String(Math.round(28 + 82 * amp));
      if (running) raf = requestAnimationFrame(draw);
    };

    const ctx = gsap.context(() => {
      gsap.set(q(".ss-word"), { yPercent: 110 });
      gsap.set(q(".ss-calm, .ss-bike, .ss-caption"), { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.8,
          onUpdate: (st) => (progress = st.progress),
          onToggle: (st) => {
            running = st.isActive;
            cancelAnimationFrame(raf);
            if (running) raf = requestAnimationFrame(draw);
          },
        },
      });
      tl.to(q(".ss-tag"), { opacity: 0, y: -20, stagger: 0.03, duration: 0.2 }, 0.18)
        .to(q(".ss-city"), { opacity: 0.05, filter: "blur(6px)", duration: 0.35 }, 0.1)
        .to(q(".ss-wave-noise"), { opacity: 0, duration: 0.12 }, 0.44)
        .fromTo(q(".ss-wave-clean"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.44)
        .to(q(".ss-meter"), { opacity: 0, duration: 0.1 }, 0.5)
        .to(q(".ss-word"), { yPercent: 0, stagger: 0.025, duration: 0.14 }, 0.5)
        .to(q(".ss-headline"), { yPercent: -120, opacity: 0, duration: 0.14 }, 0.8)
        .to(q(".ss-calm"), { opacity: 1, duration: 0.2 }, 0.74)
        .fromTo(q(".ss-bike"), { opacity: 0, xPercent: -70 }, { opacity: 1, xPercent: 40, duration: 0.3 }, 0.7)
        .to(q(".ss-wave-clean"), { opacity: 0.25, duration: 0.1 }, 0.8)
        .to(q(".ss-caption"), { opacity: 1, duration: 0.1 }, 0.86);
    }, el);

    // First paint
    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section id="stories" aria-labelledby="ss-title" className="relative overflow-hidden bg-ink-950 py-32">
        <div className="mx-auto max-w-[1320px] px-5 md:px-10">
          <p className="eyebrow mb-6">05 · Sound → Silence</p>
          <h2 id="ss-title" className="display text-[clamp(2.6rem,8vw,7rem)]">
            POWER DOESN’T HAVE TO BE <span className="text-volt">LOUD.</span>
          </h2>
          <p className="mt-6 max-w-lg text-mist">A city at 85 dB. An Eco Bike at cruising speed: around 28 dB — about as loud as a whisper.</p>
          <Bike config={config} className="mt-12 w-full max-w-3xl" />
        </div>
      </section>
    );
  }

  return (
    <section ref={root} id="stories" aria-labelledby="ss-title" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink-950">
      <h2 id="ss-title" className="sr-only">
        Power doesn’t have to be loud. An Eco Bike at cruising speed produces around 28 decibels.
      </h2>

      {/* Noisy city */}
      <div className="ss-city absolute inset-0" aria-hidden>
        <CityNight className="h-full w-full opacity-60" />
      </div>
      {/* Calm coast */}
      <div className="ss-calm absolute inset-0" aria-hidden>
        <Coast className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950/80" />
      </div>

      {/* Waveforms */}
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="ss-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="4" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="ss-wave-noise">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              ref={(n) => {
                paths.current[i] = n;
              }}
              fill="none"
              stroke={["#FF6B3D", "#FFFFFF", "#FF3DA5"][i]}
              strokeOpacity={[0.9, 0.45, 0.35][i]}
              strokeWidth={[2.5, 1.5, 1][i]}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <path className="ss-wave-clean" d="M0 450 H1600" stroke="#C8FF2E" strokeWidth="2" filter="url(#ss-glow)" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Noise tags */}
      {NOISE_TAGS.map((n, i) => (
        <span
          key={n.t}
          className="ss-tag absolute font-mono text-[10px] tracking-[0.2em] text-heat md:text-xs"
          style={{ left: n.x, top: n.y, animation: `blink ${0.6 + i * 0.17}s steps(2) infinite` }}
          aria-hidden
        >
          ▲ {n.t}
        </span>
      ))}

      {/* dB meter */}
      <div className="ss-meter absolute bottom-10 left-5 md:bottom-14 md:left-10" aria-hidden>
        <p className="eyebrow">Ambient noise</p>
        <p className="display mt-2 text-6xl tabular-nums md:text-8xl">
          <span ref={db}>110</span>
          <span className="ml-2 text-2xl text-white/50">dB</span>
        </p>
      </div>
      <p className="eyebrow absolute left-5 top-28 md:left-10" aria-hidden>
        05 · Sound → Silence
      </p>

      {/* Headline */}
      <div className="ss-headline absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 text-center md:px-10" aria-hidden>
        <p className="display mx-auto max-w-6xl text-[clamp(2.6rem,8.6vw,8.5rem)]">
          {HEADLINE.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <span className={`ss-word inline-block ${w === "LOUD." ? "text-volt" : ""}`}>{w}&nbsp;</span>
            </span>
          ))}
        </p>
      </div>

      {/* Gliding bike on the silent line */}
      <div className="ss-bike absolute left-[8%] top-1/2 w-[70vw] max-w-[640px] -translate-y-[92%]" aria-hidden>
        <Bike config={config} spin headlight={0.6} ground={false} className="w-full" />
      </div>
      <div className="ss-caption absolute bottom-12 left-1/2 w-full max-w-lg -translate-x-1/2 px-5 text-center" aria-hidden>
        <p className="display text-4xl md:text-5xl">
          28 <span className="text-white/50">dB</span>
        </p>
        <p className="mt-2 text-sm text-white/70">At cruising speed — about as loud as a whisper.</p>
      </div>
    </section>
  );
}
