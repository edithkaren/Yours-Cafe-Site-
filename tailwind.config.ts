import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F0",
        beige: "#EDE1D0",
        espresso: "#29211D",
        terracotta: "#C65D3B",
        "terracotta-deep": "#A94A2C",
        olive: "#66734B",
        ink: "#29211D",
        muted: "#6E625A",
      },
      fontFamily: {
        display: ["\"Fraunces Variable\"", "Georgia", "serif"],
        sans: ["\"Instrument Sans Variable\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(41,33,29,0.08), 0 12px 32px -18px rgba(41,33,29,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
