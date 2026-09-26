import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Eco Bike — Ride the Future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 70% 80%, #1b2a10 0%, #050607 60%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 800 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 40, height: 8, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 28, height: 8, background: "#C8FF2E", borderRadius: 2 }} />
            <div style={{ width: 40, height: 8, background: "#fff", borderRadius: 2 }} />
          </div>
          ECO BIKE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>THE FUTURE IS</div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>ALREADY MOVING.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#C8FF2E" }}>Silent power. Intelligent control. Unforgettable rides.</div>
        </div>
      </div>
    ),
    size
  );
}
