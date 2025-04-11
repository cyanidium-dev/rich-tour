"use client";
import { Suspense } from "react";
import { useReviewsItemsPerPage } from "@/hooks/useReviewsItemsPerPage";
import { reviewsList } from "../shared/reviews/mockedData";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Loader from "@/components/shared/loader/Loader";
import ReviewCard from "@/components/shared/cards/reviewCard/ReviewCard";
import Pagination from "../shared/pagination/Pagination";
import AnimatedListItem from "../shared/animation/AnimatedListItem";

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
            <AnimatedWrapper
              as="ul"
              animation={listVariants({
                staggerChildren: 0.5,
                delayChildren: 0.4,
              })}
              className="flex flex-col gap-y-5"
            >
              {currentItems.map((review, idx) => (
                <AnimatedListItem key={idx}>
                  <ReviewCard review={review} />
                </AnimatedListItem>
              ))}
            </AnimatedWrapper>
          )}
        />
      </div>
    </Suspense>
  );
}
