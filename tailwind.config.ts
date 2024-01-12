import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#79abaf",
        secondary: "#246835",
        tertiary: "#5BB65C",
      },
      height: {
        "without-nav-fixed": "calc(100vh - 3rem)",
        "without-nav-auto": "calc(100% - 3rem);",
      },
    },
  },
  plugins: [],
} satisfies Config;
