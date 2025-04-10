"use client";

import { usePathname } from "next/navigation";
import HeaderMob from "./HeaderMob";
import HeaderDesk from "./HeaderDesk";
import AnimatedWrapper from "../animation/AnimatedWrapper";

export default function Header() {
  const pathname = usePathname();

  return (
    <AnimatedWrapper
      key={pathname}
      as="header"
      className="fixed top-0 left-0 z-50 w-dvw bg-white"
    >
      <HeaderMob />
      <HeaderDesk />
    </AnimatedWrapper>
  );
}
