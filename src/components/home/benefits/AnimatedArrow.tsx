"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      width="248"
      height="163"
      viewBox="0 0 248 163"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute -z-10 left-[calc(50%-185px)] top-[-82px] w-[230px] h-auto"
    >
      {/* Основна дуга */}
      <motion.path
        d="M29.3621 160.819C26.4057 149.199 25.0987 115.272 33.3241 101.856C47.0486 79.4716 65.1263 59.671 88.4977 47.7225C132.264 25.3471 189.783 13.5465 232.014 43.9511"
        stroke="#E43A3A"
        strokeWidth="2.65045"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Наконечник стрілки — розвернутий шлях */}
      <motion.path
        d="M180.844 38.5527C205.668 42.6735 197.882 38.276 222.452 43.6453C227.012 44.6419 235.066 50.2722 232.639 42.9C228.149 29.2598 223.659 15.6196 219.169 1.97949"
        stroke="#E43A3A"
        strokeWidth="2.65045"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2 }}
      />
    </motion.svg>
  );
}
