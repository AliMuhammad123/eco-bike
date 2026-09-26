import Intro from "@/components/core/Intro";
import Benefits from "@/components/sections/Benefits";
import ExploreCards from "@/components/sections/ExploreCards";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import Lifestyle from "@/components/sections/Lifestyle";
import { BASE_PRICE } from "@/lib/bike";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Eco Bike Model One",
  brand: { "@type": "Brand", name: "Eco Bike" },
  category: "Electric motorcycle",
  description:
    "Next-generation electric motorcycle with 120 km range, 0–60 km/h in 4.2 s, 85 km/h top speed and a structural 9.6 kWh battery.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: BASE_PRICE,
    availability: "https://schema.org/PreOrder",
  },
};

export default function Home() {
  return (
    <>
      <Intro />
      <main id="main">
        <Hero />
        <Benefits />
        <ExploreCards />
        <Lifestyle />
        <FinalCTA />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
