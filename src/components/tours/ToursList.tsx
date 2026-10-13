"use client";

import { useEffect, useRef, useState } from "react";

import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import { TourCard } from "@/entities/tour";
import { useToursBatchSize } from "@/hooks/useToursBatchSize";
import { TourShortInfo } from "@/entities/tour";

export default function ToursList({ tours }: { tours: TourShortInfo[] }) {
  const itemsPerBatch = useToursBatchSize();
  const [loadedBatches, setLoadedBatches] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const visibleCount = loadedBatches * itemsPerBatch;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= tours.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setLoadedBatches((count) => count + 1);
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, tours.length]);

  if (!tours.length) {
    return (
      <p className="pt-[80px] pb-[40px] text-center text-black/70 font-semibold text-[22px]">
        В даній категорії немає турів
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-[50px] xl:mt-10">
      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-5 w-full max-w-[325px] sm:max-w-[440px] md:max-w-[718px] lg:max-w-[974px] xl:max-w-[1120px]">
        {tours.slice(0, visibleCount).map((tour) => (
          <AnimatedWrapper
            as="li"
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            key={tour._id}
            className="max-w-[325px] sm:max-w-[210px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px]"
          >
            <TourCard tour={tour} />
          </AnimatedWrapper>
        ))}
      </ul>
      {visibleCount < tours.length && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-px w-full" />
      )}
    </div>
  );
}
