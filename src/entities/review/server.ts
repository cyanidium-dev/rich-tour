import "server-only";
import { sanityClient } from "@/shared/api/server";
import { allReviewsQuery, lastReviewsQuery } from "./api/queries";
import { parseReviews } from "./model/parseReviews";
export async function getReviews(last = false) {
  return parseReviews(await sanityClient.fetch<unknown>(last ? lastReviewsQuery : allReviewsQuery));
}
