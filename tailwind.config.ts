import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {},
      fontFamily: {},
      container: {
        center: true,
        padding: {
          DEFAULT: "25px",
          xl: "80px",
        },
      },
      fontSize: {},
      colors: {},
      backgroundImage: {},
      boxShadow: {},
      keyframes: {},
      animation: {},
    },
  },
  plugins: [],
} satisfies Config;
