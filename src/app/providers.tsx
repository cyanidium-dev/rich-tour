"use client";
import { ReactNode } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { MotionConfig } from "framer-motion";
import SplashGate from "@/components/shared/animation/SplashGate";

import {CurrencyProvider} from "@/context/CurrencyContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <SplashGate>
        <I18nProvider locale="uk-UA">
          <div className="flex flex-col min-h-screen">
            <CurrencyProvider>{children}</CurrencyProvider>
          </div>
        </I18nProvider>
      </SplashGate>
    </MotionConfig>
  );
}
