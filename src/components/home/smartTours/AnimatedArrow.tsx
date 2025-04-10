"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      width="313"
      height="152"
      viewBox="0 0 313 152"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute -z-30 bottom-[-38px] left-[calc(50%-266px)] lg:left-[calc(50%-316px)] xl:left-[calc(50%-352px)]"
    >
      {/* Основна дуга */}
      <motion.path
        d="M10.8521 29.2468C6.57643 61.993 73.4876 155.808 106.102 111.661C115.944 98.3374 116.962 76.0081 114.038 60.2139C111.84 48.3425 96.4907 48.1349 92.5797 59.24C80.8949 92.4189 128.455 108.233 133.298 75.3491C134.232 69.0063 130.774 63.9746 138.014 64.5631C155.31 65.9687 172.768 65.2884 190.072 64.4844C228.784 62.6855 267.123 61.3555 305.872 61.5007"
        stroke="#E43A3A"
        strokeWidth="2.5393"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Наконечник стрілки — розвернутий шлях */}
      <motion.path
        d="M265.829 49.2698C286.387 54.8368 278.846 55.4809 299.649 59.9976C303.51 60.836 311.692 59.3375 307.228 64.1579C298.97 73.0766 290.712 81.9953 282.454 90.9141"
        stroke="#E43A3A"
        strokeWidth="2.24343"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.2 }}
      />
    </motion.svg>
  );
}
