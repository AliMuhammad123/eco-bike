import type { Metadata } from "next";
import NextPage from "@/components/core/NextPage";
import ChargingMap from "@/components/sections/ChargingMap";

export const metadata: Metadata = {
  title: "Charging",
  description: "Charge your Eco Bike from a normal wall socket at home, or at a station on your route.",
  alternates: { canonical: "/charging" },
};

export default function ChargingPage() {
  return (
    <main id="main" className="pt-16 md:pt-20">
      <ChargingMap />
      <NextPage href="/contact" label="Contact us" hint="Questions, or ready for a test ride?" />
    </main>
  );
}
