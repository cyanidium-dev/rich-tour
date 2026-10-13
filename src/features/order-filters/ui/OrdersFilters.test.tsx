// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import OrdersFilters, { type OrdersFiltersState } from "./OrdersFilters";

afterEach(cleanup);

it("applies search text immediately, including empty and one-character values", () => {
  const onChange = vi.fn();
  const filters: OrdersFiltersState = {
    search: "",
    agentId: null,
    status: null,
    hasDebt: null,
    period: { from: null, to: null },
  };
  render(<OrdersFilters filters={filters} onChange={onChange} />);
  const search = screen.getByPlaceholderText("Пошук");
  fireEvent.change(search, { target: { value: "a" } });
  expect(onChange).toHaveBeenLastCalledWith({ ...filters, search: "a" });
  fireEvent.change(search, { target: { value: "" } });
  expect(onChange).toHaveBeenLastCalledWith(filters);
});

it("applies and clears a selected status without a submit action", () => {
  const onChange = vi.fn();
  const filters: OrdersFiltersState = {
    search: "",
    agentId: null,
    status: null,
    hasDebt: null,
    period: { from: null, to: null },
  };
  render(<OrdersFilters filters={filters} onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Відкрити статус заявки" }));
  fireEvent.click(screen.getByRole("option", { name: "Нова заявка" }));
  expect(onChange).toHaveBeenLastCalledWith({ ...filters, status: "Нова заявка" });
  fireEvent.click(screen.getByRole("button", { name: "Очистити статус заявки" }));
  expect(onChange).toHaveBeenLastCalledWith(filters);
});
