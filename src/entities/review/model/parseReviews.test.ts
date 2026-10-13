import { expect, it } from "vitest";
import { parseReviews } from "./parseReviews";
it("retains Sanity review order and displayed values", () => {
  const input = [
    { _id: "b", name: "Б", text: "Другий", _createdAt: "2026-09-30" },
    { _id: "a", name: "А", text: "Перший", _createdAt: "2026-09-29" },
  ];
  expect(parseReviews(input)).toEqual(input.map((review) => ({ ...review, id: review._id })));
  expect(() =>
    parseReviews([{ _id: "b", name: "Б", text: null, _createdAt: "2026-09-30" }]),
  ).toThrow();
});
