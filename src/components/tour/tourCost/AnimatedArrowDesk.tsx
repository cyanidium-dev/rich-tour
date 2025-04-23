"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowDesk() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="215"
      height="173"
      viewBox="0 0 215 173"
      fill="none"
      className="absolute top-[-49px] left-[-60px] z-20 w-[215px] h-[173px]"
    >
      <motion.path
        d="M184.961 170.874C191.611 141.848 204.231 108.515 197.12 80.0136C191.81 58.7331 177.885 52.2626 160.109 63.1658C144.968 72.4527 131.966 85.4708 131.987 106.938C132.005 124.958 146.435 106.44 149.437 99.2188C155.988 83.4602 160.193 62.3374 145.003 54.7717C138.573 51.5695 125.141 45.8095 119.004 54.2777C116.049 58.3548 114.167 67.42 114.886 57.3867C116.448 35.5852 99.3108 27.9599 85.4839 22.8127C73.676 18.4172 61.3679 15.1981 49 12.957C38.9877 11.1428 34.4136 18.381 27.6184 26.9994"
        stroke="#E43A3A"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.path
        d="M39.2385 29.5532C38.0225 27.6289 33.4304 27.6835 31.5413 27.7899C30.1285 27.8694 28.6564 28.0747 27.2694 28.3542C26.8002 28.4488 25.5085 29.1058 25.1274 28.8636C24.7251 28.608 25.3291 27.0169 25.4001 26.6687C27.0665 18.4916 27.9608 10.2406 28.9799 2.00057"
        stroke="#E43A3A"
        strokeWidth="2.47891"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.3 }}
      />
    </svg>
  );
}
