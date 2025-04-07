"use client";
import { Suspense } from "react";
import { usePromotionItemsPerPage } from "@/hooks/usePromotionItemsPerPage";
import { toursList } from "./mockedData";
import TourCard from "@/components/shared/tourCard/TourCard";
import Loader from "@/components/shared/loader/Loader";
import Pagination from "@/components/shared/pagination/Pagination";

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
                <li key={tour.id}>
                  <TourCard tour={tour} />
                </li>
              ))}
            </ul>
          )}
        />
      </div>
    </Suspense>
  );
}
