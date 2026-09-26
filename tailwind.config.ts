import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#56d8e4",
          purple: "#9f01ea",
          deep: "#6a06ec",
        },
        surface: {
          light: "#ffffff",
          "light-alt": "#f5f5f7",
          dark: "#0b0b14",
          "dark-alt": "#13131f",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(115deg, #56d8e4 10%, #9f01ea 90%)",
        "gradient-brand-text": "linear-gradient(to right, #56d8e4 20%, #9f01ea 80%)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      keyframes: {
        moving: {
          "0%": { left: "-20px" },
          "100%": { left: "100%" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-30px, 25px) scale(0.95)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        moving: "moving 2s linear infinite",
        blob: "blob 18s ease-in-out infinite",
        "blob-slow": "blob 26s ease-in-out infinite reverse",
        marquee: "marquee 75s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
