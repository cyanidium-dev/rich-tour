"use client";

import { usePathname } from "next/navigation";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

export default function FooterAnimation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatedWrapper key={pathname} animation={fadeInAnimation({ y: 30 })}>
      {children}
    </AnimatedWrapper>
  );
}
