/**
 * RIDE AI — a deterministic, on-device assistant for the marketing site.
 *
 * It answers the four showcase questions (and variations) using the rider's
 * current build from the configurator. To connect a real model later, keep
 * this module as the offline fallback and call your API from `ask()` in
 * components/sections/RideAI.tsx.
 */

import { summarize, type BikeConfig } from "@/lib/bike";
import { MODES, STATIONS, type ModeId } from "@/lib/content";

export type AiCard =
  | { kind: "modes"; rows: { mode: string; range: number; color: string; best: string }[] }
  | { kind: "route"; total: number; legs: { label: string; km: number; note: string }[] }
  | { kind: "stations"; items: { name: string; kw: number; free: number; total: number; eta: string }[] };

export interface AiReply {
  text: string;
  card?: AiCard;
}

const has = (s: string, ...words: string[]) => words.some((w) => s.includes(w));

export function rideAi(input: string, cfg: BikeConfig): AiReply {
  const q = input.toLowerCase().trim();
  const sum = summarize(cfg);
  const accNote = sum.accessories.length ? ` with ${sum.accessories.join(" and ").toLowerCase()}` : "";

  if (!q) return { text: "I'm listening. Ask me about ride modes, range, a route or charging." };

  // ── Plan a ride ───────────────────────────────────────────────
  if (has(q, "plan", "route", "trip", "weekend", "ride to")) {
    const km = Number(q.match(/(\d{2,3})\s*(km|k\b|kilomet)/)?.[1] ?? 50);
    const outbound = Math.round(km * 0.5);
    const needsCharge = km > sum.range * 0.85;
    const legs = [
      { label: "Old Town → Coast Road", km: Math.round(outbound * 0.45), note: "City mode · 30 km/h zones" },
      { label: "Coast Road → Hillside View", km: outbound - Math.round(outbound * 0.45), note: "Eco mode · sea views, gentle climbs" },
      { label: "Hillside View → Home", km: km - outbound, note: needsCharge ? "Top up at Tech Campus (50 kW)" : "Sport mode for the descent — regen does the rest" },
    ];
    const arrive = Math.max(8, Math.round(100 - (km / sum.range) * 100 * 1.05));
    return {
      text: `Here's a ${km} km loop built for a weekend. Based on your build (${sum.range} km estimated range${accNote}), you'll finish with around ${arrive}% battery${needsCharge ? " — I've added one 20-minute charging stop" : ", no charging needed"}.`,
      card: { kind: "route", total: km, legs },
    };
  }

  // ── Charging ──────────────────────────────────────────────────
  if (has(q, "charg", "station", "plug", "top up")) {
    const items = [...STATIONS]
      .filter((s) => s.free > 0)
      .sort((a, b) => b.kw - a.kw)
      .slice(0, 3)
      .map((s, i) => ({ name: s.name, kw: s.kw, free: s.free, total: s.total, eta: `${4 + i * 5} min away` }));
    return {
      text: `I found ${items.length} stations with free bays nearby, fastest first. A 10–80% top-up takes about 2 hours on the onboard 3.3 kW charger, or around 40 minutes at a DC fast-charge bay.`,
      card: { kind: "stations", items },
    };
  }

  // ── Range ─────────────────────────────────────────────────────
  if (has(q, "range", "how far", "battery", "km will", "distance")) {
    const rows = (Object.keys(MODES) as ModeId[]).map((k) => {
      const factor = MODES[k].range / MODES.city.range;
      return {
        mode: MODES[k].name,
        range: Math.round(sum.range * factor),
        color: MODES[k].color,
        best: { eco: "Longest rides", city: "Everyday", sport: "Twisty roads", boost: "Short bursts" }[k],
      };
    });
    return {
      text: `Your ${sum.color} build is rated at ${sum.range} km in mixed riding${accNote}. Here's what that looks like per mode from a full charge — temperature and wind can shift it by around 10%.`,
      card: { kind: "modes", rows },
    };
  }

  // ── Riding mode ───────────────────────────────────────────────
  if (has(q, "mode", "eco", "sport", "boost", "which setting", "should i use")) {
    const hour = new Date().getHours();
    const pick: ModeId = has(q, "fast", "fun", "track", "overtake") ? "sport" : has(q, "far", "long", "save") ? "eco" : hour >= 7 && hour <= 19 ? "city" : "eco";
    const m = MODES[pick];
    return {
      text: `I'd use ${m.name} right now. ${
        {
          eco: "It softens throttle response and maximises regen — perfect for long, relaxed distances.",
          city: "It balances smooth throttle with strong regen, so you can ride one-pedal through traffic.",
          sport: "It sharpens throttle and firms up the suspension. Expect about 20% less range.",
          boost: "Full 11 kW for short bursts. Great for merging — I'll switch you back after 30 seconds.",
        }[pick]
      } Top speed in this mode is ${m.max} km/h.`,
    };
  }

  if (has(q, "test ride", "book", "demo")) {
    return { text: "I can help with that — tap “Book a Test Ride” at the end of the page and pick a date. Rides last about 45 minutes." };
  }
  if (has(q, "hello", "hi", "hey")) {
    return { text: "Hello, rider. Systems are nominal and the pack is warm. Where are we going today?" };
  }
  if (has(q, "speed", "fast", "top")) {
    return { text: `Top speed is 85 km/h (electronically limited), and 0–60 km/h takes 4.2 seconds in Boost mode.` };
  }

  return {
    text: "I didn't quite catch that. Try asking which riding mode to use, how much range you have, to plan a ride, or to find charging stops.",
  };
}
