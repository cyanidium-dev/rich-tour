"use client";

import { motion } from "framer-motion";

export default function AnimatedArrow() {
  return (
    <motion.svg
      width="185"
      height="164"
      viewBox="0 0 185 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[140px] sm:w-[161px] h-auto mt-10 sm:mt-20 ml-[13%]"
    >
      {/* Перша основна дуга */}
      <motion.path
        d="M163.579 135.064C164.595 130.103 155.985 117.622 147.938 114.244C137.21 109.739 136.468 109.675 125.402 107.569C114.337 105.463 102.71 114.072 94.7781 120.979C91.8895 123.494 86.3558 127.973 85.4226 131.964C84.9596 133.944 89.8152 133.264 90.6489 132.87C98.6941 129.067 103.738 119.209 100.246 110.29C97.0783 102.198 87.7904 99.2398 79.9698 97.7208C64.3644 94.6898 50.1467 106.562 41.257 118.33C39.7147 120.372 28.782 136.282 33.6374 137.925C37.9797 139.395 43.09 135.669 45.9288 132.625C49.2108 129.105 50.6537 120.967 50.1935 116.333C49.3999 108.342 41.5527 103.194 34.3271 101.714C25.3072 99.8678 15.4193 104.213 7.99427 109.115C0.800998 113.863 2.62822 116.968 10.7522 117.005C20.0042 117.047 24.4879 102.657 28.1668 96.0254C43.6384 68.1341 56.3941 40.4232 63.84 9.3603"
        stroke="#E43A3A"
        strokeWidth="2.85353"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.6 }}
      />

      {/* Наконечник стріли — анімація починається з протилежного боку */}
      <motion.path
        d="M74.1541 33.6025C73.9854 29.6843 73.89 30.1502 71.0335 21.9952C69.8736 18.0354 67.6604 14.4687 66.2931 10.5844C66.1476 10.1713 65.0872 7.64151 64.8535 7.79574C64.4318 8.07411 63.9808 8.97887 63.673 9.33547C61.7394 11.5757 59.6754 13.7131 57.6098 15.8306C52.2219 21.3536 46.3066 26.3623 40.6398 31.5956"
        stroke="#E43A3A"
        strokeWidth="2.85353"
        strokeLinecap="round"
        initial={{
          pathLength: 0,
          strokeOpacity: 0,
          transform: "scale(-1, 1) translate(-318, 0)",
        }} // Початок з протилежного напрямку
        whileInView={{
          pathLength: 1,
          strokeOpacity: 1,
          transform: "scale(1, 1) translate(0, 0)",
        }} // Завершення з нормальним напрямком
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 2.2 }}
      />
    </motion.svg>
  );
}
