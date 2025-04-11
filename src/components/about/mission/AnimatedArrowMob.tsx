"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowMob() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="188"
      height="83"
      viewBox="0 0 188 83"
      fill="none"
      className="xl:hidden absolute bottom-[-80px] right-[calc(50%-168px)] md:right-[calc(50%-308px)]"
    >
      {/* Перша крива */}
      <motion.path
        d="M1.28625 31.0546C2.72656 51.1734 54.2255 99.1443 68.3517 68.7422C72.6149 59.567 70.4968 46.0801 66.8181 36.9854C64.053 30.1495 54.8422 31.8997 53.8579 39.023C50.9172 60.3055 81.3103 63.9613 80.1927 43.6907C79.9772 39.7808 77.2931 37.1921 81.6976 36.66C92.22 35.389 102.584 32.85 112.841 30.2555C135.788 24.4515 158.57 18.9735 181.776 14.3284"
        stroke="#E43A3A"
        strokeWidth="1.55093"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Наконечник стрілки */}
      <motion.path
        d="M171.354 34.79C175.206 28.4442 179.059 22.0984 182.912 15.7526C184.994 12.3228 180.281 14.2188 177.868 14.1886C164.868 14.026 169.302 12.7197 156.319 11.8988"
        stroke="#E43A3A"
        strokeWidth="1.37022"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
