"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowTwoMob() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="162"
      height="227"
      viewBox="0 0 162 227"
      fill="none"
      className="absolute z-20 bottom-[98px] right-[-50px] w-[162px] h-[227px]"
    >
      {/* Основна крива */}
      <motion.path
        d="M75.555 225.708C65.9987 220.577 42.5735 200.712 38.654 187.026C32.1139 164.191 29.9581 140.033 36.2745 117.143C48.1029 74.2781 75.3898 28.7051 121.48 19.1246"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Верхній вигин */}
      <motion.path
        d="M85.6363 2.03711C97.4775 7.37981 109.319 12.7225 121.16 18.0652C127.56 20.9529 118.882 22.8826 115.43 25.315C96.8318 38.419 104.523 35.9145 86.6025 49.9507"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 2.5 }}
      />
    </svg>
  );
}
