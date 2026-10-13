"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowDesk() {
  return (
    <motion.svg
      width="321"
      height="205"
      viewBox="0 0 321 205"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute -z-10 top-[-152px] left-[calc(50%-296px)] w-[321px] h-[205px]"
    >
      <motion.path
        d="M27.0472 176.154C16.3907 144.896 63.4637 39.7179 104.152 76.5571C116.431 87.675 121.837 109.364 122.088 125.425C122.277 137.496 107.271 140.73 101.245 130.616C83.2397 100.397 126.742 75.5039 137.982 106.785C140.15 112.818 137.753 118.434 144.734 116.428C161.412 111.635 178.66 108.855 195.783 106.227C234.088 100.348 271.935 94.0827 309.893 86.2904"
        stroke="#E43A3A"
        strokeWidth="2.5393"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.4 }}
      />
      <motion.path
        d="M281.128 62.0791C290.985 69.1919 300.841 76.3047 310.698 83.4176C316.025 87.2619 307.709 87.4081 304.089 88.9923C284.587 97.5271 292.107 96.6697 273.053 106.186"
        stroke="#E43A3A"
        strokeWidth="2.24343"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.2 }}
        viewport={{ once: true, amount: 0.8 }}
      />
    </motion.svg>
  );
}
