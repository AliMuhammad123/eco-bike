import Cursor from "@/components/core/Cursor";
import Intro from "@/components/core/Intro";
import Nav from "@/components/core/Nav";
import SmoothScroll from "@/components/core/SmoothScroll";
import Benefits from "@/components/sections/Benefits";
import BikeExplorer from "@/components/sections/BikeExplorer";
import ChargingMap from "@/components/sections/ChargingMap";
import ComparePetrol from "@/components/sections/ComparePetrol";
import Configurator from "@/components/sections/Configurator";
import EasyToUse from "@/components/sections/EasyToUse";
import ExperienceFilm from "@/components/sections/ExperienceFilm";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Lifestyle from "@/components/sections/Lifestyle";
import Sustainability from "@/components/sections/Sustainability";
import TestRideModal from "@/components/sections/TestRideModal";
import { BuildProvider } from "@/lib/build-context";
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
    <BuildProvider>
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Intro />
        <Cursor />
        <Nav />
        <main id="main">
          {/* Plain-language story first; the deeper sections follow for those who want them. */}
          <Hero />
          <HowItWorks />
          <Benefits />
          <ComparePetrol />
          <EasyToUse />
          <BikeExplorer />
          <Configurator />
          <ChargingMap />
          <Lifestyle />
          <Sustainability />
          <FinalCTA />
        </main>
        <Footer />
        <ExperienceFilm />
        <TestRideModal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </SmoothScroll>
    </BuildProvider>
  );
}
