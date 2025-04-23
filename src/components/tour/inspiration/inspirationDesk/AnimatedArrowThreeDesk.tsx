"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowThreeDesk() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="212"
      height="231"
      viewBox="0 0 212 231"
      fill="none"
      className="absolute z-20 top-[-10px] right-[-42px] w-[212px] h-[231px]"
    >
      {/* Основна складна лінія */}
      <motion.path
        d="M209.965 66.429C184.282 51.3583 156.288 29.2973 126.967 27.5084C105.074 26.1728 94.7159 37.507 99.7685 57.7391C104.072 74.9721 112.578 91.2868 133.057 97.7226C150.248 103.125 136.928 83.7941 130.943 78.7593C117.884 67.7726 99.0039 57.4096 87.22 69.6218C82.2325 74.7906 72.6998 85.8682 78.9302 94.2682C81.9299 98.3124 90.0095 102.834 80.6569 99.1306C60.3344 91.0843 47.9083 105.135 38.8412 116.774C31.0981 126.713 24.3265 137.484 18.4698 148.605C13.7285 157.608 19.256 164.147 25.4319 173.22"
        stroke="white"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2.6, ease: "easeInOut", delay: 1 }}
      />
      {/* Додатковий маленький хвіст */}
      <motion.path
        d="M31.3624 162.906C29.1615 163.487 27.8325 167.883 27.3659 169.716C27.0169 171.088 26.7699 172.553 26.6194 173.96C26.5685 174.436 26.8066 175.866 26.461 176.156C26.0963 176.463 24.7605 175.409 24.4497 175.236C17.1523 171.188 9.5522 167.853 2.00013 164.403"
        stroke="white"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 3.3 }}
      />
    </svg>
  );
}
