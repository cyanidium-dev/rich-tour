import { expect, it } from "vitest";
import { ordersFiltersSchema } from "./ordersFiltersModel";

const empty = {
  search: "",
  agentId: null,
  status: null,
  hasDebt: null,
  period: { from: null, to: null },
};

it("accepts empty and partial filters so each edit applies immediately", () => {
  expect(ordersFiltersSchema.safeParse(empty).success).toBe(true);
  expect(
    ordersFiltersSchema.safeParse({
      ...empty,
      search: "x",
      period: { from: new Date(2026, 0, 1), to: null },
    }).success,
  ).toBe(true);
});

it("rejects invalid debt values and dates without changing the filter contract", () => {
  expect(ordersFiltersSchema.safeParse({ ...empty, hasDebt: "maybe" }).success).toBe(false);
  expect(
    ordersFiltersSchema.safeParse({
      ...empty,
      period: { from: new Date("invalid"), to: null },
    }).success,
  ).toBe(false);
});
