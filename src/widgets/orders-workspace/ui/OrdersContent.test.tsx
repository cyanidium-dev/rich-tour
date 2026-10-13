// @vitest-environment jsdom
import React, { type ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axios from "axios";
import type { OrderTableRow } from "@/entities/order";
import type { OrdersFiltersState } from "@/features/order-filters";
vi.mock("axios", () => ({ default: { get: vi.fn(), isAxiosError: vi.fn(() => false) } }));
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/shared/loader/Loader", () => ({ default: () => <p>Loading</p> }));
vi.mock("@/features/order-filters", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/order-filters")>()),
  OrdersFilters: ({
    filters,
    onChange,
  }: {
    filters: OrdersFiltersState;
    onChange: (filters: OrdersFiltersState) => void;
  }) => (
    <input
      aria-label="Fixture search"
      value={filters.search}
      onChange={(event) => onChange({ ...filters, search: event.target.value })}
    />
  ),
}));
vi.mock("./DetailsModal", () => ({
  default: ({ isPopUpShown, comment }: { isPopUpShown: boolean; comment?: string }) =>
    isPopUpShown ? <div role="dialog">{comment}</div> : null,
}));
vi.mock("@/components/shared/backdrop/Backdrop", () => ({ default: () => null }));
vi.mock("@/components/shared/pagination/Pagination", () => ({
  default: ({
    items,
    renderItems,
  }: {
    items: OrderTableRow[];
    renderItems: (items: OrderTableRow[]) => ReactNode;
  }) => renderItems(items),
}));
import OrdersContent from "./OrdersContent";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.mocked(axios.isAxiosError).mockReturnValue(false);
});

const order = (id: number, statusid: string, end: string) => ({
  id,
  externalid: `REQ-${id}`,
  statusid,
  customfields: {
    Nazvaturu: { value: `Tour ${id}` },
    Dataturut: { value: "2099-01-01" },
    Datazakinchennyaturu: { value: end },
    Dodatkovidani: { value: `Details ${id}` },
    zagalsumabezkomisi: { value: "123" },
  },
  agent: { id: "agent", name: "Test agent", crmId: "42" },
});

it.each([
  ["active", ["REQ-10", "REQ-2"]],
  ["archive", ["REQ-30", "REQ-20"]],
  ["all", ["REQ-30", "REQ-20", "REQ-10", "REQ-2"]],
] as const)("retains the %s account list and descending order", async (mode, expected) => {
  vi.mocked(axios.get).mockResolvedValue({
    data: {
      orders: [
        order(2, "47", "2099-01-03"),
        order(20, "42", "2099-01-03"),
        order(10, "47", "2099-01-03"),
        order(30, "47", "2000-01-03"),
      ],
    },
  });
  render(<OrdersContent mode={mode} />);
  const table = await screen.findByRole("table");
  const rows = within(table).getAllByRole("row").slice(1);
  expect(rows.map((row) => within(row).getAllByRole("cell")[0].textContent)).toEqual(expected);
  expect(rows[0].textContent).toContain("123 €");
  fireEvent.click(rows[0]);
  expect(screen.getByRole("dialog").textContent).toBe(`Details ${expected[0].slice(4)}`);
  expect(axios.get).toHaveBeenCalledWith("/api/agent/tours", { withCredentials: true });
});

it("retains agency names, skipped-agent notice and displayed values", async () => {
  vi.mocked(axios.get).mockResolvedValue({
    data: {
      orders: [order(10, "47", "2099-01-03")],
      agents: [{ id: "agent", name: "Test agent" }],
      skippedAgents: [{ id: "unlinked", name: "Unlinked agent" }],
    },
  });
  render(<OrdersContent variant="agency" apiUrl="/api/agency/tours" />);
  const table = await screen.findByRole("table");
  const cells = within(table).getAllByRole("row")[1];
  expect(within(cells).getAllByRole("cell")[0].textContent).toBe("Test agent");
  expect(cells.textContent).toContain("REQ-10");
  expect(cells.textContent).toContain("Повна оплата");
  expect(screen.getByText(/Unlinked agent/)).toBeTruthy();
  expect(axios.get).toHaveBeenCalledWith("/api/agency/tours", { withCredentials: true });
});

it("applies search immediately to prepared orders and restores the descending list on clearing", async () => {
  vi.mocked(axios.get).mockResolvedValue({
    data: { orders: [order(2, "47", "2099-01-03"), order(10, "47", "2099-01-03")] },
  });
  render(<OrdersContent />);
  await screen.findByRole("table");
  fireEvent.change(screen.getByLabelText("Fixture search"), { target: { value: "Tour 2" } });
  expect(screen.queryByText("REQ-10")).toBeNull();
  expect(screen.getByText("REQ-2")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Fixture search"), { target: { value: "" } });
  const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  expect(rows.map((row) => within(row).getAllByRole("cell")[0].textContent)).toEqual([
    "REQ-10",
    "REQ-2",
  ]);
});

it("keeps the retry action for transport or response-validation failures", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.get)
    .mockResolvedValueOnce({ data: { orders: [{ id: {} }] } })
    .mockResolvedValueOnce({ data: { orders: [order(2, "47", "2099-01-03")] } });
  render(<OrdersContent />);
  fireEvent.click(await screen.findByRole("button", { name: "Повторити" }));
  expect(await screen.findByText("REQ-2")).toBeTruthy();
  expect(axios.get).toHaveBeenCalledTimes(2);
});

it("keeps the missing CRM identity message without offering a transport retry", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.isAxiosError).mockReturnValue(true);
  vi.mocked(axios.get).mockRejectedValueOnce({ response: { data: { error: "CRM_ID_MISSING" } } });
  render(<OrdersContent />);
  expect(await screen.findByText("Ваш профіль ще не прив'язаний до OneBox OS.")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Повторити" })).toBeNull();
  expect(screen.queryByRole("table")).toBeNull();
});
