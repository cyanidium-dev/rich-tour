"use client";
import { reviewsList } from "../shared/reviews/mockedData";
import Loader from "@/components/shared/loader/Loader";
import ReviewCard from "@/components/shared/cards/reviewCard/ReviewCard";
import { Suspense } from "react";
import { useReviewsItemsPerPage } from "@/hooks/useReviewsItemsPerPage";
import Pagination from "../shared/pagination/Pagination";

const SECTION_ID = "review-page-reviews";

export default function ReviewsList() {
  if (!reviewsList || !reviewsList.length) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div id={SECTION_ID} className="md:max-w-[66.07%]">
        <Pagination
          items={reviewsList}
          scrollTargetId={SECTION_ID}
          useItemsPerPage={useReviewsItemsPerPage}
          renderItems={(currentItems) => (
            <ul className="flex flex-col gap-y-5">
              {currentItems.map((review, idx) => (
                <li key={idx}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}
        />
      </div>
    </Suspense>
  );
}
