"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="201"
      height="115"
      viewBox="0 0 201 115"
      fill="none"
      className="absolute top-[-124px] xl:top-[-130px] right-[calc(50%-205px)] xl:right-[calc(50%-529px)] w-[201px] xl:w-[294px] h-auto"
    >
      {/* Основна крива */}
      <motion.path
        d="M214.428 56.9768C210.301 34.5283 146.402 -13.009 134.302 22.9449C130.651 33.7956 134.713 48.7008 139.984 58.4715C143.946 65.8154 154.087 62.6993 154.307 54.5649C154.963 30.2616 120.323 29.9367 124.106 52.5963C124.835 56.9669 128.177 59.5442 123.289 60.6914C111.613 63.432 100.273 67.579 89.059 71.7751C63.9732 81.1622 39.0333 90.1618 13.5112 98.2778"
        stroke="#E43A3A"
        strokeWidth="1.75503"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Наконечник / завершення */}
      <motion.path
        d="M22.6841 73.9653C19.1414 81.5827 15.5987 89.2 12.056 96.8173C10.1412 100.934 15.2059 98.2147 17.9238 97.9479C32.5661 96.5109 27.7416 98.5327 42.4459 97.8384"
        stroke="#E43A3A"
        strokeWidth="1.55054"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 1.8 }}
      />
    </motion.svg>
  );
}
