import "server-only";
import { sanityClient, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import { allReviewsQuery, lastReviewsQuery } from "./api/queries";
import { parseReviews } from "./model/parseReviews";
export async function getReviews(last = false) {
  return parseReviews(
    await sanityClient.fetch<unknown>(
      last ? lastReviewsQuery : allReviewsQuery,
      {},
      sanityFetchOptions(300, [SANITY_CACHE_TAGS.reviews]),
    ),
  );
}
