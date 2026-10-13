import { expect, it } from "vitest";
import { parseCrmOrdersResponse, parseOrdersResponse } from "./schema";

it("preserves the empty-list fallback of CRM and account APIs", () => {
  for (const value of [undefined, null, {}, "", []]) {
    expect(parseCrmOrdersResponse({ dataArray: value })).toEqual([]);
    expect(parseOrdersResponse({ orders: value })).toEqual({
      orders: [],
      agents: [],
      skippedAgents: [],
    });
  }
  expect(parseCrmOrdersResponse({})).toEqual([]);
  expect(parseOrdersResponse({})).toEqual({ orders: [], agents: [], skippedAgents: [] });
});

it("validates agent lists while retaining order and the existing identifier conversion", () => {
  expect(
    parseOrdersResponse({
      orders: [{ id: 2 }, { id: "1" }],
      agents: [
        { id: 2, name: "Б" },
        { id: "1", name: "А" },
      ],
      skippedAgents: [{ id: "missing", name: "Без CRM" }],
    }),
  ).toMatchObject({
    orders: [{ id: 2 }, { id: "1" }],
    agents: [
      { id: "2", name: "Б" },
      { id: "1", name: "А" },
    ],
    skippedAgents: [{ id: "missing", name: "Без CRM" }],
  });
  expect(() => parseOrdersResponse({ agents: [null] })).toThrow();
  expect(() => parseOrdersResponse({ skippedAgents: [{ id: "missing" }] })).toThrow();
  expect(() => parseCrmOrdersResponse({ dataArray: [{ id: 1, orderproducts: {} }] })).toThrow();
});
