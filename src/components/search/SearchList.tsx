"use client";
import { Suspense } from "react";
import { useToursItemsPerPage } from "@/hooks/useToursItemsPerPage";
import { toursList } from "../home/promotion/mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import TourCard from "@/components/shared/cards/tourCard/TourCard";
import Loader from "@/components/shared/loader/Loader";
import Pagination from "@/components/shared/pagination/Pagination";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";

const SECTION_ID = "search-page-search-list";

export default function SearchList() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col items-center justify-center mt-[70px] xl:mt-[82px]">
        <Pagination
          items={toursList}
          scrollTargetId={SECTION_ID}
          useItemsPerPage={useToursItemsPerPage}
          className="w-full max-w-[325px] sm:max-w-[440px] md:max-w-[718px] lg:max-w-[974px] xl:max-w-[1120px]"
          renderItems={(currentItems) => (
            <ul
              id={SECTION_ID}
              className="flex flex-col sm:flex-row sm:flex-wrap flex-wrap gap-5"
            >
              {currentItems.map((tour) => (
                <AnimatedWrapper
                  as="li"
                  animation={fadeInAnimation({ y: 30, delay: 0.4 })}
                  key={tour.id}
                  className="max-w-[325px] sm:max-w-[210px] md:max-w-[226px] lg:max-w-[228px] xl:max-w-[265px]"
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
