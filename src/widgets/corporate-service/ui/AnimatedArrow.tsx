"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="103"
      height="114"
      viewBox="0 0 103 114"
      fill="none"
      className="absolute z-20 top-[218px] xl:top-[102px] right-[calc(50%-144px)] xl:right-[48px] w-[103px] xl:w-[176px] h-auto"
    >
      {/* Основна крива */}
      <motion.path
        d="M68.6498 3.36006C76.0756 3.71994 87.2983 2.2464 93.0793 7.73364C103.761 17.8727 100.9 44.5429 98.1748 57.4512C93.153 81.2367 58.5694 71.9863 59.6492 49.7052C60.2046 38.2447 74.1389 34.2552 78.3329 46.1702C82.014 56.6282 78.2341 68.978 72.42 77.8425C58.0051 99.8202 28.43 101.912 5.07685 107.226"
        stroke="#E43A3A"
        strokeWidth="2.19108"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1.6 }}
        viewport={{ once: true, amount: 0.8 }}
      />

      {/* Маленька стрілка (наконечник), віддзеркалена */}
      <motion.path
        d="M20.6299 109.637C14.5886 109.344 8.54741 109.051 2.50618 108.758C1.839 108.726 1.89208 108.599 2.36131 108.126C5.25546 105.208 6.53901 100.62 8.21047 96.9898"
        stroke="#E43A3A"
        strokeWidth="2.19108"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 3.4 }}
        viewport={{ once: true, amount: 0.8 }}
      />
    </motion.svg>
  );
}
