import { describe, expect, it } from "vitest";
import { searchHref, searchSchema } from "./searchModel";

describe("tour search parameters", () => {
  it.each([
    [{ country: null, month: null }, "/search"],
    [{ country: "country-42", month: null }, "/search?country=country-42"],
    [{ country: null, month: "08" }, "/search?month=08"],
    [{ country: "country-42", month: "08" }, "/search?country=country-42&month=08"],
  ])("keeps the existing URL parameters", (values, expected) => {
    expect(searchHref(searchSchema.parse(values))).toBe(expected);
  });

  it("encodes country IDs and rejects invalid months", () => {
    expect(searchHref({ country: "a&b", month: null })).toBe("/search?country=a%26b");
    expect(searchSchema.safeParse({ country: null, month: "13" }).success).toBe(false);
    expect(searchSchema.safeParse({ country: null, month: "" }).success).toBe(false);
  });
});
