"use client";

import { useEffect, useState } from "react";

export function useToursBatchSize() {
  const [batchSize, setBatchSize] = useState(3);

  useEffect(() => {
    const updateBatchSize = () => setBatchSize(window.innerWidth < 1024 ? 3 : 12);
    updateBatchSize();
    window.addEventListener("resize", updateBatchSize);
    return () => window.removeEventListener("resize", updateBatchSize);
  }, []);

  return batchSize;
}
