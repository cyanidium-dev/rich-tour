"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowMob() {
  return (
    <motion.svg
      width="179"
      height="156"
      viewBox="0 0 179 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="md:hidden absolute top-[-72px] left-[136px] w-[170px] h-auto"
    >
      {/* Основна дуга */}
      <motion.path
        d="M1.3377 54.9894C7.05291 48.2429 26.8736 32.9449 38.4509 32.147C57.7684 30.8157 77.3955 33.2047 94.5706 42.1326C126.733 58.8512 158.427 88.3547 158.228 126.729"
        stroke="#E43A3A"
        strokeWidth="1.95456"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      {/* Наконечник — з затримкою та дзеркально по осі X */}
      <motion.path
        d="M177.946 101.059C171.673 109.591 165.4 118.123 159.127 126.655C155.737 131.266 155.673 124.02 154.321 120.854C147.036 103.798 147.725 110.356 139.582 93.682"
        stroke="#E43A3A"
        strokeWidth="1.95456"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          delay: 2.2,
        }}
        transform="scale(-1,1) translate(-318,0)"
      />
    </motion.svg>
  );
}
