import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ReviewCard from "../ui/ReviewCard";
import { parseReviews } from "./parseReviews";
it("renders review names, dates and text in source order", () => {
  const reviews = parseReviews([
    { _id: "b", name: "Другий", text: "Чудовий тур", _createdAt: "2026-09-30" },
    { _id: "a", name: "Перший", text: "Дякую", _createdAt: "2026-09-29" },
  ]);
  const html = renderToStaticMarkup(
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>,
  );
  expect(html.indexOf("Другий")).toBeLessThan(html.indexOf("Перший"));
  expect(html).toContain("Чудовий тур");
  expect(html).toContain("Дякую");
  expect(html).toContain("30.09.26");
});
