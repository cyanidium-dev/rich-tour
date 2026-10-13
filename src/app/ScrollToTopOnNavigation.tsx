"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnNavigation() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const historyNavigationUrl = useRef<string | null>(null);

  useLayoutEffect(() => {
    const handlePopState = () => {
      historyNavigationUrl.current = window.location.href;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    const isHistoryNavigation = historyNavigationUrl.current === window.location.href;
    historyNavigationUrl.current = null;

    if (isHistoryNavigation || window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
