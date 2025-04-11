"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowMob() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="147"
      height="202"
      viewBox="0 0 147 202"
      fill="none"
      className="lg:hidden absolute top-[223px] left-[calc(50%-72px)]"
    >
      {/* Перша крива */}
      <motion.path
        d="M145.719 170.611C135.624 173.998 105.938 177.959 93.9468 172.451C73.9391 163.26 56.07 150.325 44.9275 132.434C24.0615 98.9307 12.0636 53.3924 37.4834 16.6139"
        stroke="white"
        strokeWidth="1.94501"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Друга крива */}
      <motion.path
        d="M1.08105 30.6016C12.9019 25.8005 24.7228 20.9994 36.5437 16.1983C42.9327 13.6034 38.2322 20.603 37.4905 24.3791C33.4952 44.7219 37.1234 38.0449 34.229 58.4863"
        stroke="white"
        strokeWidth="1.94501"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.6 }}
      />
    </motion.svg>
  );
}
