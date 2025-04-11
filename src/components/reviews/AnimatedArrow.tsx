"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="154"
      height="119"
      viewBox="0 0 154 119"
      fill="none"
      className="absolute top-[14px] md:top-[-33px] right-[calc(50%-179px)] md:right-[calc(50%-279px)] w-[154px] h-auto"
    >
      {/* Основна крива */}
      <motion.path
        d="M4.20701 48.457C4.94384 51.8254 15.5456 56.8253 22.8937 56.4001C32.6912 55.8331 33.2926 55.6416 42.6126 53.4939C51.9326 51.3461 58.3827 42.431 62.464 35.7135C63.9502 33.2672 66.9019 28.7889 66.4002 26.0431C66.1512 24.6807 62.557 26.6101 62.0255 27.112C56.897 31.9554 55.9907 39.5901 61.4816 43.9912C66.4636 47.9843 74.6546 46.9142 81.2512 45.4151C94.4144 42.4238 101.886 30.6948 105.216 20.6879C105.793 18.9517 109.444 5.76032 105.132 6.26035C101.276 6.70754 98.423 10.5901 97.1392 13.3466C95.6551 16.5334 97.0386 21.9893 98.8308 24.6975C101.921 29.3675 109.66 30.0928 115.778 28.7545C123.416 27.0838 129.82 21.3331 134.124 16.0068C138.293 10.8468 135.902 9.50535 129.525 12.0107C122.264 14.8639 123.196 25.1124 122.362 30.3378C118.857 52.3131 117.424 73.3323 121.186 94.7615"
        stroke="#E43A3A"
        strokeWidth="2.34893"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Друга крива (наконечник) */}
      <motion.path
        d="M105.616 83.0566C106.958 85.4148 106.889 85.0985 111.647 89.2272C113.779 91.3026 116.615 92.8083 118.886 94.7727C119.127 94.9816 120.74 96.2082 120.875 96.0406C121.12 95.7381 121.194 95.041 121.325 94.7258C122.147 92.7458 123.104 90.7884 124.068 88.8428C126.584 83.768 129.671 78.8455 132.494 73.8622"
        stroke="#E43A3A"
        strokeWidth="2.34893"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.4 }}
      />
    </motion.svg>
  );
}
