import { expect, it } from "vitest";
import { parseCrmOrders, transformOrders } from "@/entities/order";
import { filterOrders } from "./filterOrders";
import type { OrdersFiltersState } from "./ordersFiltersModel";

const rows = transformOrders(
  parseCrmOrders([
    {
      id: 1,
      externalid: "REQ-1",
      statusname: "Сплачено",
      agent: { id: "a", name: "Alpha" },
      orderproducts: [{ name: "Olena" }],
      customfields: {
        Nazvaturu: { value: "Карпати" },
        Dodatkovidani: { value: "Window seat" },
        Dataturut: { value: "2026-10-01" },
        Datazakinchennyaturu: { value: "2026-10-03" },
        Zalishilosoplatitipozayavtsi: { value: "0" },
      },
    },
    {
      id: 2,
      statusname: "Завдаток",
      agent: { id: "b", name: "Beta" },
      customfields: {
        Dataturut: { value: "2026-10-05" },
        Datazakinchennyaturu: { value: "2026-10-06" },
        Zalishilosoplatitipozayavtsi: { value: "125" },
      },
    },
    { id: 3, customfields: { Zalishilosoplatitipozayavtsi: { value: "-5" } } },
  ]),
);

const filters = (overrides: Partial<OrdersFiltersState> = {}): OrdersFiltersState => ({
  search: "",
  agentId: null,
  status: null,
  hasDebt: null,
  period: { from: null, to: null },
  ...overrides,
});

it("keeps empty and one-character searches unfiltered", () => {
  expect(filterOrders(rows, filters())).toEqual(rows);
  expect(filterOrders(rows, filters({ search: " z " }))).toEqual(rows);
  expect(filterOrders(rows, filters({ search: "absent" }))).toEqual([]);
});

it.each(["req-1", "КАРПАТИ", " Olena ", "ALPHA", "Window"])(
  "searches the existing order fields: %s",
  (search) => {
    expect(filterOrders(rows, filters({ search })).map((row) => row.id)).toEqual([1]);
  },
);

it("combines exact agent and status filters and preserves the existing debt meaning", () => {
  expect(
    filterOrders(rows, filters({ agentId: "b", status: "Завдаток", hasDebt: "так" })).map(
      (row) => row.id,
    ),
  ).toEqual([2]);
  expect(filterOrders(rows, filters({ agentId: "b", status: "Сплачено" }))).toEqual([]);
  expect(filterOrders(rows, filters({ hasDebt: "так" })).map((row) => row.id)).toEqual([2, 3]);
  expect(filterOrders(rows, filters({ hasDebt: "ні" })).map((row) => row.id)).toEqual([1]);
});

it("matches overlapping tour periods inclusively and excludes undated orders only with a date filter", () => {
  const period = (from: Date | null, to: Date | null) => filters({ period: { from, to } });
  expect(
    filterOrders(rows, period(new Date(2026, 9, 3), new Date(2026, 9, 3))).map((row) => row.id),
  ).toEqual([1]);
  expect(filterOrders(rows, period(new Date(2026, 9, 4), null)).map((row) => row.id)).toEqual([2]);
  expect(
    filterOrders(rows, period(null, new Date(2026, 9, 1, 23, 59))).map((row) => row.id),
  ).toEqual([1]);
  expect(filterOrders(rows, filters())).toHaveLength(3);
});
