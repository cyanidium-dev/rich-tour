"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowOneDesk() {
  return (
    <svg
      width="196"
      height="286"
      viewBox="0 0 196 286"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute z-20 right-[-103px] bottom-[-16px] w-[196px] h-[286px]"
    >
      {/* Основна крива */}
      <motion.path
        d="M68.7976 275.023C41.6918 263.693 -0.622952 170.325 47.9068 164.939C62.5528 163.313 80.1885 172.499 91.0361 181.8C99.1895 188.791 92.4968 200.695 82.2058 198.746C51.4592 192.925 60.5236 149.269 87.989 160.223C93.2866 162.336 95.6143 167.243 98.3938 161.41C105.034 147.473 113.351 134.344 121.695 121.388C140.362 92.4039 158.502 63.4972 175.689 33.6166"
        stroke="white"
        strokeWidth="2.25895"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 1 }}
      />
      {/* Верхній відрізок */}
      <motion.path
        d="M142.601 38.5039C153.151 36.1313 163.7 33.7586 174.25 31.3859C179.951 30.1036 175.146 35.7299 174.067 39.0754C168.255 57.0986 172.117 51.5836 167.223 69.8878"
        stroke="white"
        strokeWidth="1.99575"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 2.9 }}
      />
    </svg>
  );
}
