// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { parseCrmOrders, transformOrders } from "@/entities/order";
import DetailsModal from "./DetailsModal";

afterEach(cleanup);

it("renders missing details and totals without inventing zero charges", () => {
  const close = vi.fn();
  render(<DetailsModal isPopUpShown setIsPopUpShown={close} comment="Коментар заявки" />);
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getAllByRole("table")).toHaveLength(2);
  expect(within(dialog).getByText("Коментар заявки")).toBeTruthy();
  expect(within(dialog).getByText("Деталізація вартості відсутня")).toBeTruthy();
  expect(within(dialog).getByText("Інформація про туристів відсутня")).toBeTruthy();
  expect(within(dialog).getByText("Комісія агента").parentElement?.textContent).toContain("—");
  expect(dialog.textContent).not.toContain("0 €");
  fireEvent.click(within(dialog).getByRole("button", { name: "Закрити інформацію про заявку" }));
  expect(close).toHaveBeenCalledWith(false);
});

it("formats Ukrainian amounts, preserves an unknown option and displays CRM totals", () => {
  const [order] = transformOrders(
    parseCrmOrders([
      {
        id: 1,
        orderproducts: [
          {
            name: "Турист",
            customfields: {
              Tarif: { value: "1234.567" },
              Strahivkasuma: { value: "0" },
              Platnimistsya: { value: "Так" },
              Platazamistse: { value: "invalid" },
              Zagalnasuma: { value: "999" },
            },
          },
        ],
      },
    ]),
  );
  render(
    <DetailsModal isPopUpShown setIsPopUpShown={() => {}} details={order.details} totalCost={0} />,
  );
  const table = screen.getByRole("table", { name: "Деталізація вартості" });
  const cells = within(within(table).getAllByRole("row")[1]).getAllByRole("cell");
  expect(cells[0].textContent).toBe("1\u00a0234,57 €");
  expect(cells[5].textContent).toBe("— · 0 €");
  expect(cells[6].textContent).toBe("Так · —");
  expect(cells[8].textContent).toBe("999 €");
  expect(screen.getByText("Повна вартість заявки").parentElement?.textContent).toContain("0 €");
});
