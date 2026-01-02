"use client";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";
import SplashGate from "@/components/shared/animation/SplashGate";

import {CurrencyProvider} from "@/context/CurrencyContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SplashGate>
      <HeroUIProvider className="flex flex-col min-h-screen">
          <CurrencyProvider>
              {children}
          </CurrencyProvider>
      </HeroUIProvider>
    </SplashGate>
  );
}
