"use client";
import { usePathname } from "next/navigation";
import HeaderMob from "./HeaderMob";
import HeaderDesk from "./HeaderDesk";
import AnimatedWrapper from "../animation/AnimatedWrapper";

export default function Header() {
  const pathname = usePathname();
  const isAuthenticated = false;

  return (
    <header className="fixed top-0 left-0 z-50 w-dvw bg-white">
      <AnimatedWrapper key={pathname}>
        <HeaderMob isAuthenticated={isAuthenticated} />
        <HeaderDesk isAuthenticated={isAuthenticated} />
      </AnimatedWrapper>
    </header>
  );
}
