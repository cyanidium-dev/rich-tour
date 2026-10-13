"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="220"
      height="212"
      viewBox="0 0 220 212"
      fill="none"
      className="absolute top-[241px] xl:top-[106px] left-[calc(50%-162px)] xl:left-[calc(50%-481px)] w-[220px] h-auto"
    >
      <motion.path
        d="M17.0158 119.971C19.996 124.383 35.7051 127.093 44.1609 123.532C55.4354 118.785 56.0295 118.274 65.7491 111.51C75.4687 104.745 77.5515 89.6786 78.1966 78.6404C78.4315 74.6205 79.1354 67.1686 76.8235 63.5326C75.6764 61.7285 72.6163 65.8766 72.2993 66.7928C69.2397 75.6338 72.9366 86.6727 82.2051 90.6088C90.6146 94.1801 99.6676 89.3777 106.56 84.6192C120.314 75.1241 121.851 55.7114 119.547 40.3781C119.147 37.7178 115.234 17.8032 110.429 20.2427C106.132 22.4244 105.172 29.0037 105.372 33.3753C105.602 38.4294 110.655 45.4982 114.475 48.5606C121.063 53.8416 130.701 51.7318 137.127 47.3912C145.148 41.9727 149.155 31.3481 150.933 22.1651C152.655 13.2688 148.979 12.3585 142.977 18.4348C136.141 25.3548 143.654 39.3056 145.931 46.9469C155.508 79.0825 166.946 109.045 184.807 137.484"
        stroke="#E43A3A"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.path
        d="M159.01 127.405C162.078 130.16 161.798 129.745 170.025 133.597C173.853 135.637 178.161 136.598 182.084 138.427C182.502 138.622 185.182 139.685 185.238 139.396C185.339 138.875 184.991 137.871 184.95 137.377C184.688 134.277 184.601 131.154 184.529 128.045C184.342 119.936 184.929 111.808 185.165 103.702"
        stroke="#E43A3A"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.2 }}
      />
    </svg>
  );
}
