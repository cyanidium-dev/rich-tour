"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowTwoDesk() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="224"
      height="167"
      viewBox="0 0 224 167"
      fill="none"
      className="absolute z-20 bottom-[113px] right-[-57px] w-[224px] h-[167px]"
    >
      {/* Основна крива */}
      <motion.path
        d="M34.9382 164.849C31.054 154.721 26.2943 124.378 32.2665 111.456C42.2315 89.8938 56.3806 70.1937 76.1156 56.9887C113.072 32.2604 163.503 15.5794 204.658 38.433"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
      />
      {/* Верхній відрізок */}
      <motion.path
        d="M188.681 2.08203C194.157 13.8624 199.632 25.6427 205.108 37.4231C208.067 43.7902 200.237 39.5828 196.034 39.1694C173.392 36.942 180.852 40.0701 158.114 38.9912"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.6 }}
      />
    </svg>
  );
}
