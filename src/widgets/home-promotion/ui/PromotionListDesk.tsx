"use client";
import { Suspense } from "react";
import { usePromotionItemsPerPage } from "@/hooks/usePromotionItemsPerPage";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import { TourCard } from "@/entities/tour/index";
import Loader from "@/components/shared/loader/Loader";
import Pagination from "@/components/shared/pagination/Pagination";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { TourShortInfo } from "@/entities/tour/index";

const SECTION_ID = "promotion-tours-list";

export default function PromotionListDesk({ tours }: { tours: TourShortInfo[] }) {
  if (!tours.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="hidden md:block">
        <Pagination
          items={tours}
          scrollTargetId={SECTION_ID}
          useItemsPerPage={usePromotionItemsPerPage}
          renderItems={(currentItems) => (
            <ul id={SECTION_ID} className="hidden md:flex flex-wrap gap-5">
              {currentItems.map((tour: TourShortInfo) => (
                <AnimatedWrapper
                  as="li"
                  animation={fadeInAnimation({ y: 30 })}
                  key={tour._id}
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
