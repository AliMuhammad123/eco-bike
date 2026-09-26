"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONFIG, decodeConfig, type BikeConfig } from "@/lib/bike";

type Ctx = {
  config: BikeConfig;
  setConfig: React.Dispatch<React.SetStateAction<BikeConfig>>;
  testRideOpen: boolean;
  setTestRideOpen: (v: boolean) => void;
  filmOpen: boolean;
  setFilmOpen: (v: boolean) => void;
};

const BuildCtx = createContext<Ctx | null>(null);

export const STORAGE_KEY = "ecobike.build";

/** App-wide state: the rider's current build + global dialogs. */
export function BuildProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BikeConfig>(DEFAULT_CONFIG);
  const [testRideOpen, setTestRideOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);

  // Restore from a shared link (#build=CODE) first, then from a saved build.
  useEffect(() => {
    const m = location.hash.match(/build=([^&]+)/);
    const fromUrl = m ? decodeConfig(decodeURIComponent(m[1])) : null;
    if (fromUrl) {
      setConfig(fromUrl);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? decodeConfig(raw) : null;
      if (saved) setConfig(saved);
    } catch {
      /* storage unavailable — keep defaults */
    }
  }, []);

  return (
    <BuildCtx.Provider value={{ config, setConfig, testRideOpen, setTestRideOpen, filmOpen, setFilmOpen }}>
      {children}
    </BuildCtx.Provider>
  );
}

export function useBuild() {
  const c = useContext(BuildCtx);
  if (!c) throw new Error("useBuild must be used inside <BuildProvider>");
  return c;
}
