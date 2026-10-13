import { z } from "zod";
const reviewSchema = z
  .object({ _id: z.string(), name: z.string(), text: z.string(), _createdAt: z.string() })
  .passthrough();
export const parseReviews = (value: unknown) =>
  z
    .array(reviewSchema)
    .parse(value)
    .map((review) => ({ ...review, id: review._id }));
