"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { listItemVariants } from "@/components/shared/animation/animationVariants";

interface BenefitItemProps {
  benefit: { value: string; description: string; image: string };
}

export default function BenefitItem({ benefit }: BenefitItemProps) {
  const { value, description, image } = benefit;

  const number = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, number, {
        duration: 5,
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [inView, count, number]);

  return (
    <motion.li
      ref={ref}
      variants={listItemVariants}
      className="min-h-full sm:w-[calc(33%-13.3px)] md:w-[calc(33%-10.6px)] xl:w-[calc(33%-13.3px)] pt-6 xl:pt-[30px] rounded-[12px] bg-main text-white"
    >
      <p className="mb-2 text-64semi sm:text-52semi md:text-32semi xl:text-64semi text-center">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </p>
      <p className="mb-6 lg:mb-[52px] xl:mb-8 text-16semi sm:text-12semi xl:text-16semi text-center">
        {description}
      </p>
      <div className="relative w-full h-[128px] rounded-[12px] overflow-hidden">
        <Image
          src={image || ""}
          alt="background"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute top-0 left-0 object-cover"
        />
      </div>
    </motion.li>
  );
}
