"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowDesk() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="240"
      height="224"
      viewBox="0 0 240 224"
      fill="none"
      className="hidden lg:block absolute top-[120px] xl:top-[156px] left-[calc(50%-328px)] xl:left-[calc(50%-368px)]"
    >
      {/* Перша крива */}
      <motion.path
        d="M62.7345 222.235C55.1805 211.5 40.0539 177.821 42.3422 161.716C46.1603 134.843 55.1543 109.18 72.3707 89.7203C104.611 53.2786 154.19 23.0792 206.587 40.1694"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Друга крива */}
      <motion.path
        d="M177.252 2.08447C187.084 14.3608 196.916 26.6371 206.748 38.9135C212.062 45.5486 202.138 42.4583 197.416 42.9108C171.976 45.349 181.141 47.2859 155.972 51.0595"
        stroke="white"
        strokeWidth="2.39769"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
