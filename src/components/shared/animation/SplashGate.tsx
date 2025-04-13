"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LottieSplashScreen = dynamic(() => import("./LottieSpalshScreen"), {
  ssr: false,
});

export default function SplashGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem("splashPlayed");

    if (alreadyPlayed) {
      setShowContent(true);
      return;
    }

    setShowSplash(true);

    const timer = setTimeout(() => {
      sessionStorage.setItem("splashPlayed", "true");
      setShowSplash(false);
      setShowContent(true);
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <LottieSplashScreen visible={showSplash} />

      <div
        style={{
          display: showContent ? "block" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
