"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="196"
      height="204"
      viewBox="0 0 196 204"
      fill="none"
      className="hidden lg:block absolute bottom-[-124px] left-[-58px] w-[196px] h-[204px]"
    >
      {/* Основна лінія */}
      <motion.path
        d="M194.657 137.569C168.975 152.64 140.588 174.033 112.34 177.65C91.2487 180.35 82.1017 171.08 88.3556 152.895C93.6825 137.406 102.976 122.434 123.067 115.337C139.932 109.379 125.81 127.344 119.72 132.199C106.43 142.791 87.5993 153.239 77.1462 143.295C72.722 139.086 64.3492 129.985 70.9097 122.147C74.0683 118.374 82.1325 113.827 72.9041 117.741C52.8515 126.248 41.9103 114.727 34.0232 105.099C27.2878 96.8769 21.542 87.8548 16.6982 78.4595C12.7769 70.8536 18.5337 64.7052 25.0886 56.2788"
        stroke="#E43A3A"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
      />
      {/* Додатковий хвостик */}
      <motion.path
        d="M30.0594 64.9575C27.9888 64.5985 27.0199 60.8162 26.6998 59.2325C26.4605 58.0481 26.3256 56.7733 26.2791 55.5437C26.2634 55.1278 26.5913 53.8512 26.28 53.6191C25.9515 53.3741 24.5969 54.3965 24.2868 54.5701C17.0057 58.6462 9.48386 62.114 2.00008 65.6803"
        stroke="#E43A3A"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2 }}
      />
    </svg>
  );
}
