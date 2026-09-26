import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050607",
          900: "#0A0C0E",
          800: "#111418",
          700: "#1A1E23",
          600: "#262B31",
        },
        volt: {
          DEFAULT: "#C8FF2E",
          soft: "#E4FF94",
          dim: "#7A9A1C",
        },
        ion: "#4DE8FF",
        heat: "#FF6B3D",
        mist: "#9BA3AD",
      },
      fontFamily: {
        display: ["'Archivo Variable'", "system-ui", "sans-serif"],
        sans: ["'Archivo Variable'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
      },
    },
  },
  plugins: [],
};

export default config;
