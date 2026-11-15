import "server-only";
import { sanityClient } from "@/shared/api/server";
import { bookingDepartureQuery } from "@/entities/tour/server";
import { isBookableDeparture } from "@/entities/tour";

interface BookingDeparture {
  _id: string;
  crmNumber: string;
  startDate: string;
  price?: number;
  availability?: string;
}

export async function resolveBookingDeparture(booking: {
  departureId?: string;
  tourId: string;
  date: string;
}) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(booking.date)) return null;
  const startDate = booking.date.split(".").reverse().join("-");
  // Older open tabs send CRM number and date without a departure ID.
  const departure = await sanityClient.fetch<BookingDeparture | null>(
    bookingDepartureQuery,
    { departureId: booking.departureId ?? null, crmNumber: String(booking.tourId), startDate },
    { cache: "no-store", perspective: "published" },
  );
  if (
    !departure ||
    (booking.departureId && departure._id !== booking.departureId) ||
    departure.crmNumber !== String(booking.tourId) ||
    departure.startDate !== startDate ||
    !isBookableDeparture({ ...departure, status: [departure.availability ?? "available"] })
  )
    return null;
  return departure;
}
