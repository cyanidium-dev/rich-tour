"use client";

import { motion } from "framer-motion";

export default function AnimatedSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="118"
      height="105"
      viewBox="0 0 118 105"
      fill="none"
      className="absolute top-[118px] md:top-[85px] xl:top-10 right-[calc(50%-153px)] xl:right-[calc(50%-469px)] w-[118px] xl:w-[172px] h-auto"
    >
      {/* Основна лінія стріли */}
      <motion.path
        d="M13.2751 18.0821C12.6342 21.2491 18.1463 29.2005 23.2855 31.3446C30.1377 34.2034 30.6114 34.2434 37.6748 35.5709C44.7383 36.8985 52.1448 31.3883 57.1961 26.9702C59.0356 25.3613 62.56 22.4948 63.1497 19.9471C63.4423 18.6829 60.345 19.1239 59.8136 19.3765C54.6857 21.8147 51.4818 28.1121 53.7225 33.798C55.7556 38.9569 61.6863 40.8311 66.6787 41.789C76.6406 43.7004 85.6953 36.1043 91.3506 28.5825C92.3317 27.2775 99.2846 17.1095 96.1841 16.0682C93.4112 15.1369 90.1559 17.5216 88.3489 19.4682C86.2598 21.7187 85.3509 26.9133 85.6513 29.8697C86.1692 34.9678 91.1838 38.2411 95.7965 39.1745C101.555 40.3397 107.857 37.5526 112.588 34.4143C117.171 31.374 116.001 29.3959 110.817 29.3841C104.913 29.3707 102.073 38.5585 99.7355 42.7956C89.9039 60.6149 81.8049 78.3151 77.0989 98.1464"
        stroke="#E43A3A"
        strokeWidth="1.82078"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
      />
      {/* Наконечник — стартує після 2.8s */}
      <motion.path
        d="M70.4826 82.6931C70.5959 85.1929 70.6561 84.8955 72.4906 90.0949C73.2364 92.6199 74.6538 94.8925 75.5319 97.369C75.6253 97.6324 76.3056 99.2451 76.4545 99.1463C76.7232 98.9681 77.0096 98.3901 77.2055 98.1621C78.436 96.7299 79.7499 95.363 81.0649 94.009C84.4948 90.477 88.262 87.2725 91.8702 83.9251"
        stroke="#E43A3A"
        strokeWidth="1.82078"
        strokeLinecap="round"
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        whileInView={{ pathLength: 1, strokeOpacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          delay: 2.8,
        }}
      />
    </svg>
  );
}
