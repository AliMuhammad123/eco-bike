import type { Metadata } from "next";
import NextPage from "@/components/core/NextPage";
import BikeExplorer from "@/components/sections/BikeExplorer";
import EasyToUse from "@/components/sections/EasyToUse";
import HowItWorks from "@/components/sections/HowItWorks";

export const metadata: Metadata = {
  title: "The Bike",
  description: "Look inside the Eco Bike, see how an electric scooter works and why anyone can ride it.",
  alternates: { canonical: "/bike" },
};

export default function BikePage() {
  return (
    <main id="main" className="pt-16 md:pt-20">
      <BikeExplorer />
      <HowItWorks />
      <EasyToUse />
      <NextPage href="/build" label="Build yours" hint="Pick your colour, battery and extras and see the price." />
    </main>
  );
}
