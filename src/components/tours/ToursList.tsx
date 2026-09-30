"use client";

import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import Pagination from "@/components/shared/pagination/Pagination";
import { useToursItemsPerPage } from "@/hooks/useToursItemsPerPage";
import { TourShortInfo } from "@/types/tour";

const SECTION_ID = "tours-page-tours-list";

export default function ToursList({ tours }: { tours: TourShortInfo[] }) {
  if (!tours.length) {
    return (
      <p className="pt-[80px] pb-[40px] text-center text-black/70 font-semibold text-[22px]">
        В даній категорії немає турів
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-[50px] xl:mt-10">
      <Pagination
        items={tours}
        scrollTargetId={SECTION_ID}
        useItemsPerPage={useToursItemsPerPage}
        className="w-full max-w-[325px] sm:max-w-[440px] md:max-w-[718px] lg:max-w-[974px] xl:max-w-[1120px]"
        renderItems={(currentItems) => (
          <ul id={SECTION_ID} className="flex flex-col sm:flex-row sm:flex-wrap gap-5">
            {currentItems.map((tour: TourShortInfo) => (
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
        )}
      />
    </div>
  );
}
