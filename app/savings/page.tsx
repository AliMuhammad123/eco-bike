import type { Metadata } from "next";
import NextPage from "@/components/core/NextPage";
import ComparePetrol from "@/components/sections/ComparePetrol";
import Sustainability from "@/components/sections/Sustainability";

export const metadata: Metadata = {
  title: "Savings vs Petrol",
  description: "What an Eco Bike costs to run compared with a petrol bike, in rupees — fuel, servicing and emissions.",
  alternates: { canonical: "/savings" },
};

export default function SavingsPage() {
  return (
    <main id="main" className="pt-16 md:pt-20">
      <ComparePetrol />
      <Sustainability />
      <NextPage href="/bike" label="Meet the bike" hint="See what is inside and how it works." />
    </main>
  );
}
