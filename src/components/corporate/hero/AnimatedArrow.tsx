"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="177"
      height="172"
      viewBox="0 0 177 172"
      fill="none"
      className="absolute top-[216px] xl:top-4 left-[calc(50%-64px)] xl:left-[calc(50%-489px)] w-[177px] xl:w-[220px] h-auto"
    >
      {/* Основна крива */}
      <motion.path
        d="M50.8664 20.0899C48.4108 23.6085 50.9193 36.2091 56.0451 41.5389C62.8796 48.6452 63.4354 48.9444 71.337 54.2973C79.2387 59.6502 91.1745 56.8558 99.6641 54.1459C102.756 53.159 108.565 51.5315 110.63 48.7401C111.655 47.355 107.65 46.254 106.869 46.2807C99.333 46.5384 92.0997 52.5144 91.8219 60.6254C91.5698 67.9846 97.8025 73.4041 103.377 77.2114C114.5 84.8084 129.547 80.345 140.414 74.1741C142.299 73.1034 156.146 64.3955 152.92 61.4872C150.035 58.8863 144.809 60.0692 141.578 61.4846C137.843 63.1209 133.989 68.9676 132.791 72.7275C130.725 79.2113 135.102 85.8506 140.227 89.4272C146.624 93.892 155.776 93.8306 163.198 92.5101C170.388 91.2307 170.009 88.2022 163.701 85.4461C156.517 82.3074 148.198 91.9967 143.11 95.9213C121.71 112.426 102.483 129.703 86.262 151.37"
        stroke="#E43A3A"
        strokeWidth="2.41788"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Наконечник / закінчення */}
      <motion.path
        d="M86.3754 129.048C85.1912 132.153 85.4219 131.822 84.9064 139.126C84.4795 142.596 85.0039 146.114 84.7637 149.595C84.7382 149.965 84.7139 152.289 84.9474 152.247C85.369 152.172 86.0236 151.62 86.3827 151.446C88.6391 150.352 90.9625 149.382 93.2803 148.428C99.3262 145.94 105.61 144.029 111.775 141.86"
        stroke="#E43A3A"
        strokeWidth="2.41788"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
