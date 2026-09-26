import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ecobike.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eco Bike — Ride the Future",
    template: "%s · Eco Bike",
  },
  description:
    "Eco Bike is a next-generation electric motorcycle. Silent power, intelligent control and 120 km of range — explore the bike, build yours and book a test ride.",
  keywords: [
    "electric motorcycle",
    "electric bike",
    "e-bike",
    "EV",
    "Eco Bike",
    "electric scooter",
    "urban mobility",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Eco Bike",
    title: "Eco Bike — Ride the Future",
    description: "Silent power. Intelligent control. Unforgettable rides.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco Bike — Ride the Future",
    description: "Silent power. Intelligent control. Unforgettable rides.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050607",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}
