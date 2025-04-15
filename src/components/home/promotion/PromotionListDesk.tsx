"use client";
import { Suspense } from "react";
import { usePromotionItemsPerPage } from "@/hooks/usePromotionItemsPerPage";
import { toursList } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import Loader from "@/components/shared/loader/Loader";
import Pagination from "@/components/shared/pagination/Pagination";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

const SECTION_ID = "promotion-tours-list";

export default function PromotionListDesk() {
  if (!toursList || !toursList.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="hidden md:block">
        <Pagination
          items={toursList}
          scrollTargetId={SECTION_ID}
          useItemsPerPage={usePromotionItemsPerPage}
          renderItems={(currentItems) => (
            <ul id={SECTION_ID} className="hidden md:flex flex-wrap gap-5">
              {currentItems.map((tour) => (
                <AnimatedWrapper
                  as="li"
                  animation={fadeInAnimation({ y: 30 })}
                  key={tour.id}
                  className="max-w-[210px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px]"
                >
                  <TourCard tour={tour} />
                </AnimatedWrapper>
              ))}
            </ul>
          )}
        />
      </div>
    </Suspense>
  );
}
