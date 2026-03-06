import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9280FC",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D5ABFF",
          foreground: "#0F0F14",
        },
        accent: {
          DEFAULT: "#D6E2F7",
          foreground: "#0F0F14",
        },
        background: "#0F0F14",
        foreground: "#FFFFFF",

        card: {
          DEFAULT: "#1A1A23",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1A1A23",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#272732",
          foreground: "#A0A0A0",
        },
        destructive: {
          DEFAULT: "#FF4D4D",
          foreground: "#FFFFFF",
        },
        border: "#272732",
        input: "#272732",
        ring: "#9280FC",
      },
      fontFamily: {
        heading: ["var(--font-poppins)"],
        body: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;