import type { TourDepartureDay } from "@/entities/tour";

const kyivDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Kyiv" });

function isPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isDate(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Presentation only: never replace the departure's original booking price. */
export function getDeparturePricing(departure: TourDepartureDay, now = new Date()) {
  const until = departure.earlyBookingUntil;
  const inTime = isDate(until) && kyivDay.format(now) <= until;
  const discount = departure.status.includes("discount");
  const hasEarlyPrice =
    departure.earlyBookingPrice != null ||
    departure.hotels?.some((hotel) => hotel.earlyBookingPrice != null);
  const showDiscount = discount && (inTime || (!until && !hasEarlyPrice));
  const hotels = (departure.hotels ?? []).filter((hotel) => isPrice(hotel.price));
  const options = (
    hotels.length
      ? hotels
      : [
          {
            title: "Вартість туру",
            price: departure.price,
            earlyBookingPrice: departure.earlyBookingPrice,
            stars: undefined,
            placementDescription: undefined,
          },
        ]
  ).flatMap((option) => {
    if (!isPrice(option.price)) return [];
    const early =
      discount &&
      inTime &&
      isPrice(option.earlyBookingPrice) &&
      option.earlyBookingPrice < option.price
        ? option.earlyBookingPrice
        : undefined;
    return [
      {
        ...option,
        price: early ?? option.price,
        regularPrice: option.price,
        discounted: early !== undefined,
      },
    ];
  });

  return {
    price: options.length ? Math.min(...options.map((option) => option.price)) : undefined,
    status: departure.status.filter((status) => status !== "discount" || showDiscount),
    earlyBookingUntil: showDiscount && isDate(until) ? until : undefined,
    options,
  };
}

export type DeparturePricing = ReturnType<typeof getDeparturePricing>;

export function formatCalendarPrice(
  price: number,
  currency: "EUR" | "USD",
  convert: (price: number) => number,
) {
  return `${Math.ceil(convert(price))}${currency === "EUR" ? "€" : "$"}`;
}
