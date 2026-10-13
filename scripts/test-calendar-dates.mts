import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import { TZDate } from "react-day-picker";

const source = await readFile(
  new URL("../src/widgets/tour-details/ui/tourCost/calendarDates.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
type CalendarModule = typeof import("../src/widgets/tour-details/ui/tourCost/calendarDates.ts");
const { getDayData, isBookableDay, formatBookingDate } = (await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
)) as CalendarModule;

const departures: Parameters<CalendarModule["getDayData"]>[1] = {
  "2026-10": [
    {
      crmNumber: "test",
      day: 27,
      price: 100,
      status: ["available", "guaranteed"],
      departureId: "open",
    },
    { crmNumber: "test", day: 28, price: 200, status: ["noSeats"], departureId: "full" },
    { crmNumber: "test", day: 29, price: 300, status: ["noDeparture"], departureId: "cancelled" },
    { crmNumber: "test", day: 30, status: ["onRequest"], departureId: "unpriced" },
    { crmNumber: "test", day: 31, price: 400, status: ["noSeats"], departureId: "full-first" },
    {
      crmNumber: "test",
      day: 31,
      price: 500,
      status: ["fewSeats", "hot"],
      departureId: "open-second",
    },
  ],
  "2026-11": [
    { crmNumber: "test", day: 1, price: 0, status: ["onRequest"], departureId: "zero-price" },
  ],
};

for (const zone of ["Europe/Kyiv", "Europe/Berlin", "Pacific/Honolulu", "Asia/Tokyo"]) {
  test(`calendar dates in ${zone}`, () => {
    const date = (month: number, day: number) => new TZDate(2026, month - 1, day, zone);
    const today = date(10, 27);
    assert.equal(isBookableDay(date(10, 26), departures, today), false);
    assert.equal(isBookableDay(date(10, 27), departures, today), true);
    assert.equal(isBookableDay(date(10, 28), departures, today), false);
    assert.equal(isBookableDay(date(10, 29), departures, today), false);
    assert.equal(isBookableDay(date(10, 30), departures, today), false);
    assert.equal(getDayData(date(10, 31), departures)?.departureId, "open-second");
    assert.equal(isBookableDay(date(10, 31), departures, today), true);
    assert.equal(getDayData(date(11, 1), departures)?.departureId, "zero-price");
    assert.equal(isBookableDay(date(11, 1), departures, today), true);
    assert.equal(formatBookingDate(date(10, 31)), "31.10.2026");
    assert.equal(formatBookingDate(date(11, 1)), "01.11.2026");
    assert.equal(formatBookingDate(date(10, 25)), "25.10.2026");
    assert.equal(formatBookingDate(date(3, 29)), "29.03.2026");
  });
}
