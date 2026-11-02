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
    Zagalnasumapozayavtsi: { value: "123" },
    zagalsumabezkomisi: { value: "110.70" },
    zagalnasumapokomisi: { value: "12.30" },
  },
  agent: { id: "agent", name: "Test agent", crmId: "42" },
});

it.each([
  ["active", ["#10", "#2"]],
  ["archive", ["#30", "#20"]],
  ["all", ["#30", "#20", "#10", "#2"]],
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
  const cells = within(rows[0]).getAllByRole("cell");
  expect(cells[4].textContent).toBe("123 €");
  expect(cells[5].textContent).toBe("110.7 €");
  expect(within(table).getByRole("columnheader", { name: "Повна вартість заявки" })).toBeTruthy();
  expect(
    within(table).getByRole("columnheader", { name: "Вартість без комісії агента" }),
  ).toBeTruthy();
  expect(within(table).queryByRole("columnheader", { name: "Комісія" })).toBeNull();
  fireEvent.click(rows[0]);
  expect(screen.getByRole("dialog").textContent).toContain(`Details ${expected[0].slice(1)}`);
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
  expect(cells.textContent).toContain("#10");
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
  expect(screen.queryByText("#10")).toBeNull();
  expect(screen.getByText("#2")).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Fixture search"), { target: { value: "" } });
  const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  expect(rows.map((row) => within(row).getAllByRole("cell")[0].textContent)).toEqual(["#10", "#2"]);
});

it("keeps the retry action for transport or response-validation failures", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(axios.get)
    .mockResolvedValueOnce({ data: { orders: [{ id: {} }] } })
    .mockResolvedValueOnce({ data: { orders: [order(2, "47", "2099-01-03")] } });
  render(<OrdersContent />);
  fireEvent.click(await screen.findByRole("button", { name: "Повторити" }));
  expect(await screen.findByText("#2")).toBeTruthy();
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

it.each(["agent", "agency"] as const)(
  "shows actual price details and replaces them when selecting another %s order",
  async (variant) => {
    const first = order(10, "47", "2099-01-03");
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        orders: [
          {
            ...first,
            customfields: { ...first.customfields, Tipharchuvannya: { value: "HB" } },
            orderproducts: [
              {
                name: "Олена",
                customfields: {
                  Pasport: { value: "AA123456" },
                  Tarif: { value: "90" },
                  Kotedzh: { value: "TWIN" },
                  Prozhya: { value: "5" },
                  Harya: { value: "2" },
                  Kondits: { value: "0" },
                  Strahivka: { value: "Так" },
                  Strahivkasuma: { value: "10" },
                  Platnimistsya: { value: "Ні" },
                  Platazamistse: { value: "0" },
                  Turzbir: { value: "16" },
                  Zagalnasuma: { value: "123" },
                  Komisiya: { value: "12.30" },
                  dosplatibezkomisi: { value: "110.70" },
                },
              },
            ],
          },
          {
            ...order(2, "47", "2099-01-03"),
            customfields: {
              ...order(2, "47", "2099-01-03").customfields,
              Zagalnasumapozayavtsi: { value: "75" },
              zagalsumabezkomisi: { value: "75" },
              zagalnasumapokomisi: { value: "0" },
            },
            orderproducts: [{ name: "Іван" }],
          },
        ],
      },
    });
    render(<OrdersContent variant={variant} />);
    const table = await screen.findByRole("table");
    fireEvent.click(within(table).getByText("#10"));
    let dialog = screen.getByRole("dialog", { name: "Інформація про заявку" });
    expect(
      within(dialog).getByRole("table", { name: "Інформація про туристів" }).textContent,
    ).toContain("AA123456");
    const costTable = within(dialog).getByRole("table", { name: "Деталізація вартості" });
    const priceRow = within(costTable).getAllByRole("row")[1];
    expect(
      within(priceRow)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual([
      "90 €",
      "TWIN",
      "5 €",
      "2 €",
      "0 €",
      "Так · 10 €",
      "Ні · 0 €",
      "16 €",
      "123 €",
      "12,3 €",
      "110,7 €",
    ]);
    expect(within(dialog).getByText("Тип харчування: HB")).toBeTruthy();
    expect(within(dialog).getByText("Комісія агента").parentElement?.textContent).toContain(
      "12,3 €",
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Закрити інформацію про заявку" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(within(table).getByText("#2"));
    dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByText("Олена")).toBeNull();
    expect(within(dialog).queryByText("TWIN")).toBeNull();
    expect(within(dialog).getByText("Тип харчування: —")).toBeTruthy();
    const legacyRow = within(
      within(dialog).getByRole("table", { name: "Деталізація вартості" }),
    ).getAllByRole("row")[1];
    expect(within(legacyRow).getByRole("rowheader").textContent).toBe("Іван");
    expect(
      within(legacyRow)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(Array(11).fill("—"));
    expect(within(dialog).getByText("Повна вартість заявки").parentElement?.textContent).toContain(
      "75 €",
    );
    expect(within(dialog).getByText("Комісія агента").parentElement?.textContent).toContain("0 €");
  },
);
