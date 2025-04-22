"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowOneMob() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="158"
      height="222"
      viewBox="0 0 158 222"
      fill="none"
      className="absolute z-10 bottom-[93px] left-[18px] w-[158px] h-[222px]"
    >
      {/* Основний шлях */}
      <motion.path
        d="M139.149 197.866C118.304 207.358 42.4911 182.06 65.1355 151.458C71.9694 142.223 86.5695 137.009 97.6374 135.737C105.956 134.781 109.214 144.917 102.645 149.768C83.0194 164.261 62.8639 135.938 83.6855 126.042C87.7016 124.133 91.7412 125.403 89.8792 120.722C85.4309 109.538 82.3331 97.8237 79.3484 86.1853C72.6714 60.1491 65.7594 34.4554 57.7858 8.78994"
        stroke="white"
        strokeWidth="1.7612"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Другий шлях */}
      <motion.path
        d="M43.0419 30.2998C47.2772 23.0106 51.5125 15.7213 55.7479 8.43207C58.037 4.49236 58.7065 10.2223 60.0475 12.6124C67.2716 25.4887 66.1656 20.3571 74.0365 32.858"
        stroke="white"
        strokeWidth="1.55599"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 2.4 }}
      />
    </svg>
  );
}
