import { reviewsList } from "./mockedData";
import Loader from "@/components/shared/loader/Loader";
import ReviewCard from "@/components/shared/cards/reviewCard/ReviewCard";
import { Suspense } from "react";

export default function ReviewsListDesk() {
  if (!reviewsList || !reviewsList.length) {
    return null;
  }

  const croppedReviewsList = reviewsList.slice(0, 3);

  return (
    <Suspense fallback={<Loader />}>
      <ul className="hidden lg:flex gap-x-5 mt-10">
        {croppedReviewsList.map((review, idx) => (
          <li key={idx}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </Suspense>
  );
}
