"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowDesk() {
  return (
    <motion.svg
      width="321"
      height="201"
      viewBox="0 0 321 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden xl:block absolute bottom-[-116px] right-[calc(50%-613px)]"
    >
      {/* Основна крива */}
      <motion.path
        d="M9.07585 120.388C19.2377 151.81 119.882 207.926 130.445 154.064C133.633 137.809 124.988 117.196 115.581 104.176C108.511 94.3902 94.5516 100.777 95.774 112.487C99.4259 147.473 149.176 141.393 139.468 109.603C137.596 103.472 132.316 100.406 139.11 97.837C155.341 91.6991 170.825 83.6073 186.117 75.4691C220.328 57.263 254.403 39.6403 289.48 23.175"
        stroke="#E43A3A"
        strokeWidth="2.5393"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Наконечник стрілки */}
      <motion.path
        d="M280.917 59.7842C284.559 48.1879 288.201 36.5916 291.844 24.9953C293.812 18.7277 287.061 23.586 283.213 24.4823C262.48 29.3107 269.019 25.4988 248.057 29.2735"
        stroke="#E43A3A"
        strokeWidth="2.24343"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
