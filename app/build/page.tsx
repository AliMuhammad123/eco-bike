import type { Metadata } from "next";
import NextPage from "@/components/core/NextPage";
import Configurator from "@/components/sections/Configurator";

export const metadata: Metadata = {
  title: "Build Yours",
  description: "Configure your Eco Bike — colour, battery and accessories — with live pricing.",
  alternates: { canonical: "/build" },
};

export default function BuildPage() {
  return (
    <main id="main" className="pt-16 md:pt-20">
      <Configurator />
      <NextPage href="/charging" label="Charging" hint="Where and how you will charge your bike." />
    </main>
  );
}
