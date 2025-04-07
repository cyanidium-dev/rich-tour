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
        "9reg": ["9px", { fontWeight: "400", lineHeight: "1.23" }],
        "10reg": ["10px", { fontWeight: "400", lineHeight: "1.23" }],
        "10med": ["10px", { fontWeight: "500", lineHeight: "1.23" }],
        "10bold": ["10px", { fontWeight: "700", lineHeight: "1.23" }],
        "12light": ["12px", { fontWeight: "300", lineHeight: "1.23" }],
        "12reg": ["12px", { fontWeight: "400", lineHeight: "1.23" }],
        "12med": ["12px", { fontWeight: "500", lineHeight: "1.23" }],
        "12semi": ["12px", { fontWeight: "600", lineHeight: "1.23" }],
        "12bold": ["12px", { fontWeight: "700", lineHeight: "1.23" }],
        "14light": ["14px", { fontWeight: "300", lineHeight: "1.23" }],
        "14reg": ["14px", { fontWeight: "400", lineHeight: "1.23" }],
        "14med": ["14px", { fontWeight: "500", lineHeight: "1.23" }],
        "14semi": ["14px", { fontWeight: "600", lineHeight: "1.23" }],
        "16light": ["16px", { fontWeight: "300", lineHeight: "1.23" }],
        "16reg": ["16px", { fontWeight: "400", lineHeight: "1.23" }],
        "16med": ["16px", { fontWeight: "500", lineHeight: "1.23" }],
        "18reg": ["18px", { fontWeight: "400", lineHeight: "1.23" }],
        "18med": ["18px", { fontWeight: "500", lineHeight: "1.23" }],
        "16semi": ["16px", { fontWeight: "600", lineHeight: "1.23" }],
        "20reg": ["20px", { fontWeight: "400", lineHeight: "1.23" }],
        "20med": ["20px", { fontWeight: "500", lineHeight: "1.23" }],
        "20semi": ["20px", { fontWeight: "600", lineHeight: "1.23" }],
        "24reg": ["24px", { fontWeight: "400", lineHeight: "1.23" }],
        "24med": ["24px", { fontWeight: "500", lineHeight: "1.23" }],
        "24semi": ["24px", { fontWeight: "600", lineHeight: "1.23" }],
        "24bold": ["24px", { fontWeight: "700", lineHeight: "1.23" }],
        "28med": ["28px", { fontWeight: "500", lineHeight: "1.23" }],
        "32med": ["32px", { fontWeight: "500", lineHeight: "1.23" }],
        "32semi": ["32px", { fontWeight: "600", lineHeight: "1.23" }],
        "32bold": ["32px", { fontWeight: "700", lineHeight: "1.23" }],
        "36med": ["36px", { fontWeight: "500", lineHeight: "1.23" }],
        "40med": ["40px", { fontWeight: "500", lineHeight: "1.23" }],
        "40semi": ["40px", { fontWeight: "600", lineHeight: "1.23" }],
        "40bold": ["40px", { fontWeight: "700", lineHeight: "1.23" }],
        "48med": ["48px", { fontWeight: "500", lineHeight: "1.23" }],
        "52semi": ["52px", { fontWeight: "600", lineHeight: "1.23" }],
        "64semi": ["64px", { fontWeight: "600", lineHeight: "1.23" }],
      },
      colors: {
        white: "#ffffff",
        black: "#18181b",
        main: "#e43a3a",
        red: "#FD0000",
      },
      backgroundImage: {},
      boxShadow: { benefits: "0px 0px 28px 1px rgba(27, 27, 27, 0.12)" },
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
