import { describe, expect, it } from "vitest";
import type { TourDepartureDay } from "@/entities/tour";
import { formatCalendarPrice, getDeparturePricing } from "./calendarPricing";

const departure: TourDepartureDay = {
  day: 31,
  price: 300,
  earlyBookingPrice: 250,
  earlyBookingUntil: "2026-10-27",
  status: ["available", "guaranteed", "discount", "hot"],
  departureId: "date-1",
  crmNumber: "123",
};
const before = new Date("2026-10-26T12:00:00Z");

describe("calendar presentation prices", () => {
  it("uses the early price through the last second of the deadline in Kyiv", () => {
    const result = getDeparturePricing(departure, new Date("2026-10-27T21:59:59Z"));
    expect(result.price).toBe(250);
    expect(result.status).toContain("discount");
    expect(result.earlyBookingUntil).toBe("2026-10-27");
    expect(result.options[0]).toMatchObject({ price: 250, regularPrice: 300, discounted: true });
  });

  it("returns to regular prices at midnight in Kyiv and hides the expired badge", () => {
    const result = getDeparturePricing(departure, new Date("2026-10-27T22:00:00Z"));
    expect(result.price).toBe(300);
    expect(result.status).toEqual(["available", "guaranteed", "hot"]);
    expect(result.options[0].discounted).toBe(false);
  });

  it("never applies a stored early price when the flag is disabled", () => {
    expect(getDeparturePricing({ ...departure, status: ["available"] }, before).price).toBe(300);
  });

  it.each([undefined, "", "2026-02-30", "not-a-date"])(
    "does not apply an early price without a valid deadline (%s)",
    (earlyBookingUntil) => {
      const result = getDeparturePricing({ ...departure, earlyBookingUntil }, before);
      expect(result.price).toBe(300);
      expect(result.status).not.toContain("discount");
    },
  );

  it.each([-1, NaN, Infinity, 300, 350])(
    "ignores invalid or non-discounted early prices (%s)",
    (earlyBookingPrice) => {
      expect(getDeparturePricing({ ...departure, earlyBookingPrice }, before).price).toBe(300);
    },
  );

  it("preserves a manually set label without fabricating a discounted price", () => {
    const result = getDeparturePricing(
      { ...departure, earlyBookingPrice: undefined, earlyBookingUntil: undefined },
      before,
    );
    expect(result.status).toContain("discount");
    expect(result.price).toBe(300);
    expect(result.options[0].discounted).toBe(false);
  });

  it("takes the smallest effective hotel price and never mixes in the departure price", () => {
    const source = {
      ...departure,
      earlyBookingPrice: 10,
      hotels: [
        {
          title: "Tayhan",
          stars: 3,
          price: 270,
          earlyBookingPrice: 211,
          placementDescription: "Стандарт",
        },
        { title: "Hotel 4", price: 227 },
      ],
    };
    const snapshot = structuredClone(source);
    const result = getDeparturePricing(source, before);
    expect(result.price).toBe(211);
    expect(result.options).toHaveLength(2);
    expect(result.options[0]).toMatchObject({
      title: "Tayhan",
      stars: 3,
      placementDescription: "Стандарт",
      discounted: true,
    });
    expect(result.options[1]).toMatchObject({ price: 227, discounted: false });
    expect(source).toEqual(snapshot);
    expect(getDeparturePricing(source, new Date("2026-10-28T12:00:00Z")).price).toBe(227);
  });

  it("supports zero prices and unpriced drafts", () => {
    expect(getDeparturePricing({ ...departure, earlyBookingPrice: 0 }, before).price).toBe(0);
    expect(getDeparturePricing({ ...departure, price: undefined }, before).options).toEqual([]);
    expect(
      getDeparturePricing({ ...departure, hotels: [{ title: "Free", price: 0 }] }, before).price,
    ).toBe(0);
  });

  it("converts and rounds each displayed price exactly once", () => {
    expect(formatCalendarPrice(211, "EUR", (amount) => amount)).toBe("211€");
    expect(formatCalendarPrice(211, "USD", (amount) => amount * 1.115)).toBe("236$");
    expect(formatCalendarPrice(0, "USD", (amount) => amount * 1.115)).toBe("0$");
  });
});
