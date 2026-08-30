import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Official Berkeley Haas palette
        "berkeley-blue": "#003262",
        "california-gold": "#FDB515",
        "founders-rock": "#3B7EA1",
        "medalist": "#C4820E",
        "sather-gate": "#B9D3B6",
        "ink": "#0A1F33",
        "cream": "#FBF7F0",
        "soft-gray": "#F4F4F1"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Source Serif 4'", "'Source Serif Pro'", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(0, 50, 98, 0.18)",
        card: "0 4px 18px -8px rgba(10, 31, 51, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
