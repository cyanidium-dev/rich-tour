import type { TourDepartureDay, TourDepartures } from "@/entities/tour/index";

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isAvailable(departure: TourDepartureDay): boolean {
  return (
    departure.price !== undefined &&
    !departure.status.includes("noSeats") &&
    !departure.status.includes("noDeparture")
  );
}

export function getDayData(date: Date, tourDepartures: TourDepartures): TourDepartureDay | null {
  const [month, day] = [dateKey(date).slice(0, 7), date.getDate()];
  const departures = tourDepartures[month]?.filter((departure) => departure.day === day) ?? [];
  return departures.find(isAvailable) ?? departures[0] ?? null;
}

export function isBookableDay(date: Date, tourDepartures: TourDepartures, today: Date): boolean {
  const departure = getDayData(date, tourDepartures);
  return dateKey(date) >= dateKey(today) && departure !== null && isAvailable(departure);
}

export function formatBookingDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}
