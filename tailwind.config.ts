import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#79abaf",
        secondary: "#246835",
        tertiary: "#5BB65C",
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
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
