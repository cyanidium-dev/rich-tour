import { afterEach, expect, it, vi } from "vitest";
import { parseCrmOrders } from "./schema";
import { prepareOrders, sortOrdersByIdDesc } from "./prepareOrders";

afterEach(() => vi.useRealTimers());

it("keeps today's tours active, archived statuses and past tours in the archive, and undated orders in all", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 2, 12));
  const order = (id: number, statusid: string | number, end?: string) => ({
    id,
    statusid,
    customfields: { Datazakinchennyaturu: { value: end } },
  });
  const orders = parseCrmOrders([
    order(1, "47", "2026-10-02"),
    order(2, "47", "2026-10-01"),
    order(3, "42", "2026-10-03"),
    order(4, "48"),
    order(5, "84", "2026-10-03"),
    order(6, "47"),
    order(7, "47", "invalid"),
    order(8, 42, "2026-10-03"),
  ]);
  expect(prepareOrders(orders, "active").map((row) => row.id)).toEqual([1, 8]);
  expect(prepareOrders(orders, "archive").map((row) => row.id)).toEqual([2, 3, 4, 5, 7]);
  expect(prepareOrders(orders, "all").map((row) => row.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});

it("sorts numerically by descending CRM ID without changing the source list", () => {
  const rows = prepareOrders(parseCrmOrders([{ id: "2" }, { id: 100 }, { id: "11" }]), "all");
  expect(sortOrdersByIdDesc(rows).map((row) => row.id)).toEqual([100, "11", "2"]);
  expect(rows.map((row) => row.id)).toEqual(["2", 100, "11"]);
});
