import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Core palette as theme tokens (values in globals.css). Ivory theme is
        // the brand default; the dark theme swaps each role, not each hue:
        // "ivory" is always the page background, "pine" always the main text.
        ivory: "rgb(var(--c-ivory) / <alpha-value>)", // page background
        cloud: "rgb(var(--c-cloud) / <alpha-value>)", // raised panels/cards
        mist: "rgb(var(--c-mist) / <alpha-value>)", // borders & dividers
        olive: "rgb(var(--c-olive) / <alpha-value>)", // primary accent
        pine: "rgb(var(--c-pine) / <alpha-value>)", // primary text
        rust: "rgb(var(--c-rust) / <alpha-value>)", // errors & attention
        marigold: "rgb(var(--c-marigold) / <alpha-value>)", // bright secondary accent
        sage: "rgb(var(--c-sage) / <alpha-value>)", // tags & confirmations
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(59,66,41,0.05) 1px, transparent 0)",
      },
      keyframes: {
        "draw-line": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
