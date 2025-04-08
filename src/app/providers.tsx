"use client";
import { ReactNode } from "react";
import { HeroUIProvider } from "@heroui/react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider className="flex flex-col min-h-screen">
      {children}
    </HeroUIProvider>
  );
}
