"use client";

import Cursor from "@/components/core/Cursor";
import Nav from "@/components/core/Nav";
import ScrollButtons from "@/components/core/ScrollButtons";
import SmoothScroll from "@/components/core/SmoothScroll";
import ExperienceFilm from "@/components/sections/ExperienceFilm";
import Footer from "@/components/sections/Footer";
import TestRideModal from "@/components/sections/TestRideModal";
import { BuildProvider } from "@/lib/build-context";

/** Chrome shared by every page: nav, footer, scroll arrows and the global dialogs. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <BuildProvider>
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Cursor />
        <Nav />
        {children}
        <Footer />
        <ScrollButtons />
        <ExperienceFilm />
        <TestRideModal />
      </SmoothScroll>
    </BuildProvider>
  );
}
