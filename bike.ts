/**
 * Bike configuration model — shared by the Bike visual, the configurator,
 * Ride AI and anything else that needs to know "the rider's bike".
 */

export type WheelStyle = "aero" | "blade" | "turbine";
export type SeatStyle = "sport" | "touring" | "carbon";
export type LightStyle = "volt" | "ion" | "pure";
export type AccessoryId = "screen" | "rack" | "panniers" | "mount";

export interface BikeConfig {
  color: string;
  wheels: WheelStyle;
  seat: SeatStyle;
  light: LightStyle;
  accessories: AccessoryId[];
}

export interface Option<T extends string> {
  id: T;
  name: string;
  note: string;
  price: number;
  /** Range impact in km (weight / aero). */
  range?: number;
}

export const PAINTS = [
  { id: "#1C2026", name: "Graphite Night", note: "Satin metallic", price: 0 },
  { id: "#E8EBEE", name: "Arctic Ceramic", note: "Pearl white", price: 450 },
  { id: "#2B4A3F", name: "Moss Alloy", note: "Deep green metallic", price: 450 },
  { id: "#7C1F24", name: "Ember Red", note: "Tinted clear-coat", price: 650 },
  { id: "#274472", name: "Deep Current", note: "Candy blue", price: 650 },
  { id: "#B8A17A", name: "Desert Titan", note: "Brushed champagne", price: 900 },
] as const;

export const WHEELS: Option<WheelStyle>[] = [
  { id: "aero", name: "Aero Disc", note: "Covered, lowest drag", price: 0, range: 4 },
  { id: "blade", name: "Blade 5", note: "Forged, five-blade", price: 800, range: 0 },
  { id: "turbine", name: "Turbine", note: "Ventilated, 18 vanes", price: 1100, range: -2 },
];

export const SEATS: Option<SeatStyle>[] = [
  { id: "sport", name: "Sport Solo", note: "Slim, tail-integrated", price: 0 },
  { id: "touring", name: "Touring Duo", note: "Two-up, dense foam", price: 350, range: -1 },
  { id: "carbon", name: "Carbon Shell", note: "Perforated, 1.2 kg", price: 700, range: 1 },
];

export const LIGHTS: Option<LightStyle>[] = [
  { id: "volt", name: "Volt Signature", note: "Lime DRL", price: 0 },
  { id: "ion", name: "Ion Blue", note: "Cyan DRL", price: 200 },
  { id: "pure", name: "Pure White", note: "Matrix beam", price: 350 },
];

export const ACCESSORIES: Option<AccessoryId>[] = [
  { id: "screen", name: "Aero Screen", note: "Tinted wind deflector", price: 290, range: 3 },
  { id: "rack", name: "Tail Rack", note: "Aluminium, 18 kg load", price: 240, range: -2 },
  { id: "panniers", name: "Hard Panniers", note: "2 × 21 L, lockable", price: 690, range: -6 },
  { id: "mount", name: "Phone Mount", note: "MagSafe + wireless charge", price: 120 },
];

export const LIGHT_COLORS: Record<LightStyle, string> = {
  volt: "#C8FF2E",
  ion: "#4DE8FF",
  pure: "#F4F7FF",
};

export const DEFAULT_CONFIG: BikeConfig = {
  color: "#1C2026",
  wheels: "aero",
  seat: "sport",
  light: "volt",
  accessories: [],
};

export const BASE_PRICE = 11900;
export const BASE_RANGE = 120; // km, WMTC-style mixed estimate
export const MOTOR = "Axial flux · 11 kW peak";

export function paintName(hex: string) {
  return PAINTS.find((p) => p.id === hex)?.name ?? "Custom";
}

export function summarize(cfg: BikeConfig) {
  const wheel = WHEELS.find((w) => w.id === cfg.wheels)!;
  const seat = SEATS.find((s) => s.id === cfg.seat)!;
  const light = LIGHTS.find((l) => l.id === cfg.light)!;
  const paint = PAINTS.find((p) => p.id === cfg.color);
  const acc = ACCESSORIES.filter((a) => cfg.accessories.includes(a.id));

  const range =
    BASE_RANGE +
    (wheel.range ?? 0) +
    (seat.range ?? 0) +
    acc.reduce((s, a) => s + (a.range ?? 0), 0);

  const price =
    BASE_PRICE +
    (paint?.price ?? 0) +
    wheel.price +
    seat.price +
    light.price +
    acc.reduce((s, a) => s + a.price, 0);

  return {
    range,
    price,
    motor: MOTOR,
    color: paint?.name ?? "Custom",
    wheel: wheel.name,
    seat: seat.name,
    light: light.name,
    accessories: acc.map((a) => a.name),
  };
}

/** Compact, URL-safe build code, e.g. "1C2026-a-s-v-sr" */
export function encodeConfig(cfg: BikeConfig) {
  const acc = cfg.accessories.map((a) => a[0]).join("") || "0";
  return [cfg.color.slice(1), cfg.wheels[0], cfg.seat[0], cfg.light[0], acc].join("-");
}

export function decodeConfig(code: string): BikeConfig | null {
  const [hex, w, s, l, acc] = code.split("-");
  if (!hex || !/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  const wheels = WHEELS.find((x) => x.id[0] === w)?.id;
  const seat = SEATS.find((x) => x.id[0] === s)?.id;
  const light = LIGHTS.find((x) => x.id[0] === l)?.id;
  if (!wheels || !seat || !light) return null;
  const accessories = ACCESSORIES.filter((a) => (acc ?? "").includes(a.id[0])).map(
    (a) => a.id
  );
  return { color: `#${hex.toUpperCase()}`, wheels, seat, light, accessories };
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
