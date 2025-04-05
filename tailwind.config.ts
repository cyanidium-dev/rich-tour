import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: { xs: "375px" },
      fontFamily: { montserrat: ["var(--font-montserrat)"] },
      container: {
        center: true,
        padding: {
          DEFAULT: "16px",
          xs: "25px",
          xl: "80px",
        },
      },
      fontSize: {
        "9reg": ["9px", { fontWeight: "400", lineHeight: "1.2" }],
        "10reg": ["10px", { fontWeight: "400", lineHeight: "1.2" }],
        "10med": ["10px", { fontWeight: "500", lineHeight: "1.2" }],
        "10bold": ["10px", { fontWeight: "700", lineHeight: "1.2" }],
        "12light": ["12px", { fontWeight: "300", lineHeight: "1.2" }],
        "12reg": ["12px", { fontWeight: "400", lineHeight: "1.2" }],
        "12med": ["12px", { fontWeight: "500", lineHeight: "1.2" }],
        "12semi": ["12px", { fontWeight: "600", lineHeight: "1.2" }],
        "12bold": ["12px", { fontWeight: "700", lineHeight: "1.2" }],
        "14light": ["14px", { fontWeight: "300", lineHeight: "1.2" }],
        "14reg": ["14px", { fontWeight: "400", lineHeight: "1.2" }],
        "14med": ["14px", { fontWeight: "500", lineHeight: "1.2" }],
        "14semi": ["14px", { fontWeight: "600", lineHeight: "1.2" }],
        "16light": ["16px", { fontWeight: "300", lineHeight: "1.2" }],
        "16reg": ["16px", { fontWeight: "400", lineHeight: "1.2" }],
        "16med": ["16px", { fontWeight: "500", lineHeight: "1.2" }],
        "18reg": ["18px", { fontWeight: "400", lineHeight: "1.2" }],
        "18med": ["18px", { fontWeight: "500", lineHeight: "1.2" }],
        "16semi": ["16px", { fontWeight: "600", lineHeight: "1.2" }],
        "20reg": ["20px", { fontWeight: "400", lineHeight: "1.2" }],
        "20med": ["20px", { fontWeight: "500", lineHeight: "1.2" }],
        "20semi": ["20px", { fontWeight: "600", lineHeight: "1.2" }],
        "24reg": ["24px", { fontWeight: "400", lineHeight: "1.2" }],
        "24med": ["24px", { fontWeight: "500", lineHeight: "1.2" }],
        "24semi": ["24px", { fontWeight: "600", lineHeight: "1.2" }],
        "24bold": ["24px", { fontWeight: "700", lineHeight: "1.2" }],
        "28med": ["28px", { fontWeight: "500", lineHeight: "1.2" }],
        "32med": ["32px", { fontWeight: "500", lineHeight: "1.2" }],
        "32bold": ["32px", { fontWeight: "700", lineHeight: "1.2" }],
        "36med": ["36px", { fontWeight: "500", lineHeight: "1.2" }],
        "40med": ["40px", { fontWeight: "500", lineHeight: "1.2" }],
        "40semi": ["40px", { fontWeight: "600", lineHeight: "1.2" }],
        "40bold": ["40px", { fontWeight: "700", lineHeight: "1.2" }],
        "48med": ["48px", { fontWeight: "500", lineHeight: "1.2" }],
        "64semi": ["64px", { fontWeight: "600", lineHeight: "1.2" }],
      },
      colors: {
        white: "#ffffff",
        black: "#18181b",
        main: "#e43a3a",
        red: "#FD0000"
      },
      backgroundImage: {},
      boxShadow: {},
      keyframes: {
        rotate: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        rotation: "rotate 1600ms linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
