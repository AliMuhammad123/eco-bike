/**
 * All editable copy + product figures live here so the brand team can change
 * numbers without touching components. Figures are illustrative placeholders
 * for a concept brand — replace with homologated values before launch.
 */

import type { BikePoint } from "@/components/bike/Bike";

export const PARTS: Record<
  BikePoint,
  { title: string; kicker: string; body: string; stats: [string, string][] }
> = {
  battery: {
    kicker: "01 / Energy",
    title: "Structural Battery",
    body: "The 9.6 kWh pack is part of the frame, lowering the centre of gravity and freeing space for storage.",
    stats: [["Capacity", "9.6 kWh"], ["Voltage", "96 V"], ["Cycles to 80%", "2,000"]],
  },
  motor: {
    kicker: "02 / Drive",
    title: "Axial Flux Motor",
    body: "A pancake-thin motor mounted at the swingarm pivot — instant torque with almost no drivetrain loss.",
    stats: [["Peak power", "11 kW"], ["Torque", "180 Nm (wheel)"], ["Efficiency", "96%"]],
  },
  display: {
    kicker: "03 / Interface",
    title: "Smart Display",
    body: "A 5-inch bonded glass display with turn-by-turn navigation, ride modes and live energy flow.",
    stats: [["Size", "5.0 in"], ["Brightness", "1,500 nits"], ["OS", "Eco OS 3"]],
  },
  suspension: {
    kicker: "04 / Chassis",
    title: "Adaptive Suspension",
    body: "Inverted 41 mm forks and a progressive rear shock tuned by ride mode, from supple to sharp.",
    stats: [["Front travel", "120 mm"], ["Rear travel", "110 mm"], ["Modes", "4 presets"]],
  },
  lighting: {
    kicker: "05 / Vision",
    title: "Matrix LED Lighting",
    body: "Segmented LEDs shape the beam around oncoming traffic and bend into corners as you lean.",
    stats: [["Output", "1,800 lm"], ["Segments", "24"], ["Cornering", "±35°"]],
  },
  brakes: {
    kicker: "06 / Control",
    title: "Braking System",
    body: "Radial four-piston calipers with cornering ABS, blended with regenerative braking on every stop.",
    stats: [["Front disc", "300 mm"], ["ABS", "Cornering"], ["Regen", "Up to 28%"]],
  },
  connectivity: {
    kicker: "07 / Network",
    title: "Always Connected",
    body: "Built-in LTE and GPS for remote lock, theft tracking, over-the-air updates and ride sharing.",
    stats: [["Network", "LTE-M + GPS"], ["Updates", "Over the air"], ["Tracking", "Live"]],
  },
  storage: {
    kicker: "08 / Utility",
    title: "Frunk Storage",
    body: "Where a fuel tank would sit, there's a lockable 22 L compartment — room for a helmet and a charger.",
    stats: [["Volume", "22 L"], ["Lock", "Keyless"], ["Charging", "USB-C 100 W"]],
  },
};

export const SPECS = [
  { value: 120, unit: "KM", label: "Estimated range", note: "Mixed riding, Eco mode", decimals: 0 },
  { value: 4.2, unit: "SEC", label: "0–60 km/h acceleration", note: "Boost mode, solo rider", decimals: 1 },
  { value: 85, unit: "KM/H", label: "Top speed", note: "Electronically limited", decimals: 0 },
  { value: 3.5, unit: "H", label: "Fast charging", note: "0–100% on the onboard 3.3 kW charger", decimals: 1 },
];

export const ENERGY_NODES = [
  {
    id: "battery",
    name: "Battery",
    code: "BAT-96",
    metrics: { consumption: "4.8 kW draw", efficiency: "98.2%", power: "Up to 14 kW", temp: "31 °C", perf: "Cells balanced ±4 mV" },
  },
  {
    id: "controller",
    name: "Controller",
    code: "VCU-3",
    metrics: { consumption: "0.12 kW overhead", efficiency: "98.9%", power: "400 A phase", temp: "44 °C", perf: "20 kHz switching (SiC)" },
  },
  {
    id: "motor",
    name: "Motor",
    code: "AXF-11",
    metrics: { consumption: "4.6 kW input", efficiency: "96.1%", power: "11 kW peak", temp: "58 °C", perf: "Torque response 8 ms" },
  },
  {
    id: "wheels",
    name: "Wheels",
    code: "DRV-R",
    metrics: { consumption: "4.4 kW at road", efficiency: "97.4% belt", power: "180 Nm", temp: "Tyre 24 °C", perf: "Traction control active" },
  },
] as const;

export const TECH = [
  { n: "01", title: "Battery", line: "Energy dense. Built into the frame.", detail: "Cylindrical 21700 cells in a sealed, liquid-cooled structural pack." },
  { n: "02", title: "Intelligence", line: "A bike that learns how you ride.", detail: "The vehicle control unit adapts throttle, regen and suspension in real time." },
  { n: "03", title: "Motor", line: "Instant torque. Zero noise.", detail: "Axial flux topology delivers more torque per kilogram than radial motors." },
  { n: "04", title: "Connectivity", line: "Always online, always yours.", detail: "LTE, GPS and Bluetooth for navigation, updates and anti-theft." },
  { n: "05", title: "Safety", line: "Sees what you can't.", detail: "Cornering ABS, traction control and blind-spot radar as standard." },
  { n: "06", title: "Performance", line: "Everything, working as one.", detail: "Four ride modes shape every system around the road ahead." },
];

export const MODES = {
  eco: { name: "Eco", color: "#C8FF2E", max: 55, range: 132, power: 4, torque: 110, efficiency: 98, regen: 32 },
  city: { name: "City", color: "#4DE8FF", max: 70, range: 118, power: 7, torque: 140, efficiency: 92, regen: 24 },
  sport: { name: "Sport", color: "#FF8A3D", max: 85, range: 96, power: 9.5, torque: 165, efficiency: 84, regen: 16 },
  boost: { name: "Boost", color: "#FF3DA5", max: 85, range: 78, power: 11, torque: 180, efficiency: 76, regen: 10 },
} as const;
export type ModeId = keyof typeof MODES;

export const STATIONS = [
  { id: "s1", name: "Harbour Point", x: 180, y: 420, kw: 22, free: 4, total: 6 },
  { id: "s2", name: "Old Town Square", x: 360, y: 250, kw: 7, free: 1, total: 4 },
  { id: "s3", name: "Central Station", x: 520, y: 330, kw: 50, free: 6, total: 10 },
  { id: "s4", name: "Riverside Park", x: 610, y: 150, kw: 11, free: 0, total: 3 },
  { id: "s5", name: "Tech Campus", x: 760, y: 260, kw: 50, free: 3, total: 8 },
  { id: "s6", name: "Eastgate Mall", x: 880, y: 430, kw: 22, free: 5, total: 12 },
  { id: "s7", name: "Coast Road Hub", x: 300, y: 520, kw: 22, free: 2, total: 4 },
  { id: "s8", name: "Hillside View", x: 940, y: 120, kw: 7, free: 2, total: 2 },
] as const;

export const LIFESTYLE = [
  { id: "city", title: "Futuristic City", caption: "Neon streets, no noise.", km: "18 km", time: "22:40" },
  { id: "coast", title: "Coastal Road", caption: "Salt air and sweeping bends.", km: "64 km", time: "18:12" },
  { id: "mountain", title: "Mountain Pass", caption: "Torque from zero, all the way up.", km: "41 km", time: "07:30" },
  { id: "night", title: "Night Ride", caption: "Just you and the beam.", km: "27 km", time: "01:05" },
  { id: "commute", title: "Urban Commute", caption: "Past the traffic, on time.", km: "12 km", time: "08:15" },
] as const;

/* ── Plain-language sections ─────────────────────────────────────────── */

/** Real product photos. Drop files at these paths in `public/`; until then the drawn bike is shown. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // "/<repo>" on GitHub Pages

export const PHOTOS = {
  hero: { src: `${BASE}/images/bike-silver.webp`, alt: "Eco Bike electric scooter in silver with green accents" },
  riding: { src: `${BASE}/images/bike-black.webp`, alt: "Eco Bike electric scooter in graphite black" },
};

/** "Easy to understand": electric parts explained through the petrol parts people already know. */
export const HOW_IT_WORKS = [
  { ev: "Battery", petrol: "Fuel tank", body: "Stores electricity instead of petrol. A full battery takes you about 120 km." },
  { ev: "Charger", petrol: "Petrol pump", body: "Plug into a normal wall socket at home. Empty to full in about 3.5 hours." },
  { ev: "Motor", petrol: "Engine", body: "Turns the rear wheel directly. No oil, no gears, no exhaust — nothing to tune." },
  { ev: "Regen braking", petrol: "Engine braking", body: "When you slow down, the motor puts a little energy back into the battery." },
];

/** Headline specs rewritten for people who don't read spec sheets. */
export const PLAIN_SPECS = [
  { value: "120 km", label: "per full charge", note: "About a week of normal city commuting" },
  { value: "3.5 hours", label: "to charge at home", note: "Plug in at night, leave full in the morning" },
  { value: "85 km/h", label: "top speed", note: "Plenty for city roads and ring roads" },
  { value: "4.2 sec", label: "from 0 to 60 km/h", note: "Quicker than most petrol commuter bikes" },
];

export const BENEFITS = [
  { icon: "money", title: "Much cheaper to run", body: "Electricity costs far less than petrol for the same distance. See the numbers below." },
  { icon: "wrench", title: "Almost no servicing", body: "No engine oil, filters, spark plugs, clutch or chain to replace. Tyres and brakes — that's it." },
  { icon: "quiet", title: "Quiet ride", body: "No engine noise or vibration. Hear the road, talk to your pillion, don't wake the street." },
  { icon: "leaf", title: "No exhaust fumes", body: "Zero tailpipe emissions — cleaner air where you and your family breathe." },
  { icon: "bolt", title: "Instant pick-up", body: "Full pulling power the moment you twist. Great for overtaking and traffic lights." },
  { icon: "plug", title: "Fill up at home", body: "Start every day with a full battery. No detours or queues at the petrol station." },
] as const;

export const EASY_STEPS = [
  { title: "Unlock", body: "Walk up with your phone or key fob and press start. No key to turn, no kick start." },
  { title: "Twist and go", body: "No clutch and no gears. Twist the throttle to go, squeeze the brake to stop." },
  { title: "Pick a mode", body: "One button: Eco for the longest range, City for everyday, Sport when you want more." },
  { title: "Plug in at night", body: "Take the cable from the storage box, plug into any home socket, wake up full." },
];

export const NO_MORE = ["No gears", "No clutch", "No kick start", "No oil changes", "No fuel stops"];

/**
 * Electric vs petrol comparison, in Pakistani rupees. The petrol side is a typical
 * Pakistani commuter bike averaging 30 km per litre.
 * Petrol: OGRA price on 26 Sep 2026. Electricity: typical all-in domestic unit rate
 * (NEPRA slab + taxes + adjustments). Update both when prices change.
 */
export const COMPARE_ASSUMPTIONS = {
  electricityPerKwh: 55, // Rs per unit (kWh), home bill incl. taxes
  evKwhPer100Km: 8, // 9.6 kWh battery ÷ 120 km
  evServicePerYear: 4000, // Rs — tyres/brakes check
  petrolPerLitre: 391.3, // Rs per litre
  petrolKmPerLitre: 30, // average petrol bike mileage
  petrolTankLitres: 8.5, // typical commuter-bike tank
  petrolServicePerYear: 15000, // Rs — oil changes, filters, plugs, chain, clutch
  petrolCo2PerLitre: 2.31, // kg CO₂ per litre burned
  evCo2PerKm: 0.009, // kg CO₂ per km, grid-average charging (see LIFECYCLE)
};

export const formatRs = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

/** Row-by-row comparison. `win` marks the better side — petrol honestly wins some. */
export const COMPARE_ROWS: { label: string; ev: string; petrol: string; win: "ev" | "petrol" | "tie" }[] = [
  { label: "Gears & clutch", ev: "None — twist and go", petrol: "5 gears + clutch", win: "ev" },
  { label: "Servicing", ev: "Tyres & brakes, once a year", petrol: "Oil, filters, plugs, chain every few months", win: "ev" },
  { label: "Noise", ev: "Near silent", petrol: "Engine & exhaust noise", win: "ev" },
  { label: "Exhaust fumes", ev: "Zero", petrol: "Yes, every ride", win: "ev" },
  { label: "Pick-up", ev: "Full power instantly", petrol: "Builds with revs", win: "ev" },
  { label: "Where you fill up", ev: "At home, any socket", petrol: "Petrol station only", win: "ev" },
  { label: "Range on a full tank / charge", ev: "About 120 km", petrol: `About ${COMPARE_ASSUMPTIONS.petrolTankLitres * COMPARE_ASSUMPTIONS.petrolKmPerLitre} km`, win: "petrol" },
  { label: "Time to fill up", ev: "3.5 h (overnight)", petrol: "5 minutes", win: "petrol" },
];

export const LIFECYCLE = [
  { stage: "Materials", value: 62, suffix: "%", label: "recycled aluminium in the frame" },
  { stage: "Manufacturing", value: 100, suffix: "%", label: "renewable electricity at assembly" },
  { stage: "Battery", value: 2000, suffix: "", label: "charge cycles before 80% capacity" },
  { stage: "Ride", value: 9, suffix: " g", label: "CO₂ per km, grid-average charging" },
  { stage: "Recycling", value: 95, suffix: "%", label: "battery materials recovered" },
];
