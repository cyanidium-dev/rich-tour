"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      width="290"
      height="161"
      viewBox="0 0 290 161"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block absolute -z-10 left-[calc(50%-145px)] top-[-82px] w-[290px] h-auto"
    >
      {/* Основна дуга */}
      <motion.path
        d="M3.15629 159.058C3.15629 123.021 -4.14415 80.2888 15.8348 48.5889C30.752 24.9202 53.3173 21.0505 75.694 38.7163C94.7536 53.7633 109.428 72.6337 102.194 97.952C96.1221 119.204 81.2011 93.4604 79.2274 84.1303C74.9204 63.7702 75.8484 37.7163 100.635 32.8966C111.126 30.8567 132.731 27.6918 138.879 39.3398C141.839 44.9479 141.554 56.1503 143.867 44.1202C148.894 17.9799 176.552 13.616 198.53 11.2808C217.299 9.28662 236.406 8.81538 255.272 9.51413C270.544 10.0798 274.815 19.8544 281.876 31.8574"
        stroke="#E43A3A"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Наконечник стрілки (у прямому напрямку) */}
      <motion.path
        d="M264 31.7301C266.427 29.7888 273.134 31.0941 275.865 31.7301C277.908 32.2058 279.995 32.8457 281.932 33.5503C282.588 33.7887 284.259 34.9128 284.899 34.7301C285.574 34.5373 285.223 32.4972 285.236 32.0672C285.539 21.9707 286.997 11.9957 288.269 2"
        stroke="#E43A3A"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.8 }}
      />
    </motion.svg>
  );
}
