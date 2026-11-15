import type { TourDepartures } from "../model/types";

const kyivDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Kyiv",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export interface BookingDepartureOption {
  key: string;
  label: string;
  startDate: string;
  crmNumber: string;
}

export function isBookableDeparture(
  departure: { startDate: string; crmNumber: string; price?: number; status: string[] },
  now = new Date(),
): boolean {
  const today = kyivDateFormatter.format(now);
  return (
    departure.startDate >= today &&
    !!departure.crmNumber.trim() &&
    typeof departure.price === "number" &&
    Number.isFinite(departure.price) &&
    departure.price >= 0 &&
    !departure.status.includes("noSeats") &&
    !departure.status.includes("noDeparture")
  );
}

export function getBookingDepartureOptions(
  departures: TourDepartures,
  now = new Date(),
): BookingDepartureOption[] {
  return Object.entries(departures)
    .flatMap(([month, days]) =>
      days.flatMap((departure) => {
        const startDate = `${month}-${String(departure.day).padStart(2, "0")}`;
        if (!departure.departureId || !isBookableDeparture({ ...departure, startDate }, now))
          return [];
        return [
          {
            key: departure.departureId,
            label: startDate.split("-").reverse().join("."),
            startDate,
            crmNumber: departure.crmNumber,
          },
        ];
      }),
    )
    .sort((left, right) => left.startDate.localeCompare(right.startDate));
}
