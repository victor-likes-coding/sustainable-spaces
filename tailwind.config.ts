import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "slide-up": "slide-up .4s forwards",
        "slide-down": "slide-down .4s forwards",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      colors: {
        "custom-primary": "#79abaf",
        "custom-secondary": "#246835",
        "custom-tertiary": "#5BB65C",
        dark: "#1A4939",
      },
      height: {
        "without-nav-fixed": "calc(100vh - 3rem)",
        "without-nav-auto": "calc(100% - 3rem);",
      },
      screens: {
        xsmall: "320px",
        small: "375px",
        med: "425px",
        large: "768px",
        xlarge: "1024px",
        "2xlarge": "1440px",
        hd: "2560px",
      },
      fontFamily: {
        default: [
          "Lato",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        roboto: ["Roboto", "sans-serif"], // Add 'roboto' as a key with the font family.
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
