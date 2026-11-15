import { expect, it } from "vitest";
import { getBookingDepartureOptions, isBookableDeparture } from "./bookingDepartures";

const now = new Date("2026-11-15T12:00:00Z");
const departure = { crmNumber: "101", price: 100, status: ["available"], departureId: "first" };

it("lists all bookable departures chronologically and keeps IDs for same-day departures", () => {
  expect(
    getBookingDepartureOptions(
      {
        "2027-01": [{ ...departure, day: 2, departureId: "later", crmNumber: "303" }],
        "2026-12": [
          { ...departure, day: 20, departureId: "second", crmNumber: "202" },
          { ...departure, day: 15 },
          { ...departure, day: 15, departureId: "same-date", crmNumber: "404" },
        ],
      },
      now,
    ),
  ).toEqual([
    { key: "first", label: "15.12.2026", startDate: "2026-12-15", crmNumber: "101" },
    { key: "same-date", label: "15.12.2026", startDate: "2026-12-15", crmNumber: "404" },
    { key: "second", label: "20.12.2026", startDate: "2026-12-20", crmNumber: "202" },
    { key: "later", label: "02.01.2027", startDate: "2027-01-02", crmNumber: "303" },
  ]);
});

it("excludes past, full, cancelled, unpriced and CRM-less departures", () => {
  expect(
    getBookingDepartureOptions(
      {
        "2026-11": [
          { ...departure, day: 14 },
          { ...departure, day: 16, status: ["noSeats", "hot"] },
          { ...departure, day: 17, status: ["noDeparture"] },
          { ...departure, day: 18, price: undefined },
          { ...departure, day: 19, crmNumber: "" },
          { ...departure, day: 20, departureId: "" },
          { ...departure, day: 21, price: 0, status: ["onRequest"] },
        ],
      },
      now,
    ).map((option) => option.label),
  ).toEqual(["21.11.2026"]);
});

it("uses the Kyiv date across midnight", () => {
  const midnight = new Date("2026-11-15T22:00:00Z");
  expect(isBookableDeparture({ ...departure, startDate: "2026-11-15" }, midnight)).toBe(false);
  expect(isBookableDeparture({ ...departure, startDate: "2026-11-16" }, midnight)).toBe(true);
});
