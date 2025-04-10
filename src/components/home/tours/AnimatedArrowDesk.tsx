"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowDesk() {
  return (
    <svg
      width="246"
      height="132"
      viewBox="0 0 246 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute top-[-78px] lg:top-[-104px] left-[calc(50%-222px)] lg:left-[calc(50%-322px)] md:w-[182px] lg:w-[246px] h-auto"
    >
      {/* Перша лінія */}
      <motion.path
        d="M244.5 90.9999C241.581 79.3708 226.612 48.8967 213 40.9999C190.288 27.8236 164.974 18.9895 138.732 19.5797C89.59 20.6849 33.3709 37.6293 10.6564 84.4475"
        stroke="#E43A3A"
        strokeWidth="2.65045"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Друга лінія */}
      <motion.path
        d="M2.01758 41.4131C4.54731 55.5487 7.07704 69.6842 9.60677 83.8198C10.974 91.4599 15.3857 82.6792 18.9252 79.6353C37.9936 63.2375 33.2321 70.8061 53.1169 55.3861"
        stroke="#E43A3A"
        strokeWidth="2.65045"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.4 }}
      />
    </svg>
  );
}
