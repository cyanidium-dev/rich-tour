// import { reviewsList } from "./mockedData";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Loader from "@/components/shared/loader/Loader";
import { ReviewCard, type Review } from "@/entities/review";
import { Suspense } from "react";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

// import client from "../../../lib/sanity";
// import {lastReviewsQuery} from "@/lib/queries";

export default async function ReviewsListDesk({ items }: { items: Review[] }) {
  // const reviews = await client.fetch(lastReviewsQuery);

  if (!items || !items.length) {
    return null;
  }

  // const croppedReviewsList = reviewsList.slice(0, 3);

  return (
    <Suspense fallback={<Loader />}>
      <AnimatedWrapper
        as="ul"
        animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
        className="hidden lg:flex gap-x-5 mt-10"
      >
        {items.map((review, idx) => (
          <AnimatedListItem key={idx} className="max-w-[325px] xl:max-w-[360px]">
            <ReviewCard review={review} />
          </AnimatedListItem>
        ))}
      </AnimatedWrapper>
    </Suspense>
  );
}
