import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#79abaf",
        secondary: "#7C9952",
        tertiary: "#021808",
      },
      height: {
        "without-nav": "calc(100vh - 3rem)",
      },
    },
  },
  plugins: [],
} satisfies Config;
