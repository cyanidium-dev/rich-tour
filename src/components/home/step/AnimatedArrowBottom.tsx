"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowBottom() {
  return (
    <motion.svg
      width="118"
      height="125"
      viewBox="0 0 118 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute right-[43px] bottom-[105px] xl:right-[98px] xl:bottom-[85px]"
    >
      {/* Основна дуга */}
      <motion.path
        d="M78.2998 120.413C82.2393 121.091 85.3767 122.047 88.409 118.642C99.9025 105.734 103.766 87.6443 107.924 71.3424C110.959 59.4451 114.682 46.9042 101.182 40.5268C95.7891 37.9793 77.0697 27.909 73.2024 37.4684C71.5975 41.4354 68.036 49.7382 69.2521 54.098C69.7465 55.8706 73.2299 53.6002 73.6885 53.2877C80.7532 48.4744 86.3162 39.6641 89.9786 32.1236C91.843 28.2849 96.1535 19.8941 93.183 15.6077C90.0532 11.0914 81.0955 10.8371 76.3322 10.8326C54.1354 10.8114 32.1716 25.075 12.5621 33.9355"
        stroke="#E43A3A"
        strokeWidth="1.98939"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Наконечник стрілки */}
      <motion.path
        d="M14.4315 23.3486C13.905 26.4093 13.3784 29.47 12.8519 32.5307C12.6615 33.6371 13.4879 33.4622 14.4445 33.6268C19.7433 34.5384 24.9855 35.4884 30.2115 36.7503"
        stroke="#E43A3A"
        strokeWidth="1.98939"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
