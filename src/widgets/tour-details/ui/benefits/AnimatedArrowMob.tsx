"use client";

import { motion } from "framer-motion";

export default function AnimatedArrowMob() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="252"
      height="144"
      viewBox="0 0 252 144"
      fill="none"
      className="md:hidden absolute right-6 bottom-[-142px] w-[252px] h-[144px]"
    >
      <motion.path
        d="M245.588 79.3097C239.344 104.596 163.291 154.353 151.98 112.567C148.566 99.9563 154.218 83.2576 160.894 72.4904C165.911 64.3974 177.249 68.6439 176.94 77.9246C176.016 105.653 136.537 103.642 142.403 78.0912C143.535 73.1629 147.518 70.4569 142.03 68.8143C128.918 64.89 116.286 59.3868 103.801 53.8364C75.8717 41.4196 48.082 29.4542 19.5685 18.4553"
        stroke="#E43A3A"
        strokeWidth="2.00274"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true, amount: 0.8 }}
      />
      <motion.path
        d="M28.3458 46.7793C24.834 37.8591 21.3222 28.939 17.8104 20.0189C15.9123 15.1977 21.4944 18.6436 24.572 19.1343C41.1518 21.7776 35.7953 19.143 52.4968 20.9446"
        stroke="#E43A3A"
        strokeWidth="1.76939"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 1.8 }}
        viewport={{ once: true, amount: 0.8 }}
      />
    </motion.svg>
  );
}
