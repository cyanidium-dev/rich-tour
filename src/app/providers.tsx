"use client";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import SplashGate from "@/components/shared/animation/SplashGate";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SplashGate>
      <HeroUIProvider className="flex flex-col min-h-screen">
        {children}
      </HeroUIProvider>
    </SplashGate>
  );
}
