// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TourHotel } from "@/entities/tour";
import Hotels from "./Hotels";
import HotelsList from "./HotelsList";

const currency = vi.hoisted(() => ({ selected: "EUR" as "EUR" | "UAH" }));
const scrollIntoView = vi.fn();

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock("@/context/CurrencyContext", () => ({
  useCurrency: () => ({
    selected: currency.selected,
    convert: (price: number) => (currency.selected === "EUR" ? price : price * 40),
  }),
}));
vi.mock("./HotelsTitle", () => ({ default: () => <h2>Інформація про готелі</h2> }));
vi.mock("./HotelModalContent", () => ({
  default: ({ title }: { title: string }) => <p>Подробиці: {title}</p>,
}));

function makeHotels(count: number): TourHotel[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Hotel ${index + 1}`,
    stars: 3,
    price: 600,
    shortDescription: [{ _type: "block", children: [{ text: `Опис ${index + 1}` }] }],
    fullDescription: [],
    gallery: [`/hotel-${index + 1}.jpg`],
  }));
}

beforeEach(() => {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1280 });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoView,
  });
  scrollIntoView.mockClear();
  currency.selected = "EUR";
});
afterEach(cleanup);

it("shows two hotels under one heading and opens the selected hotel's details", () => {
  render(<HotelsList hotels={makeHotels(2)} />);

  expect(screen.getAllByRole("article")).toHaveLength(2);
  expect(screen.getAllByRole("heading", { name: "Інформація про готелі" })).toHaveLength(1);
  expect(screen.queryByRole("navigation", { name: "Сторінки готелів" })).toBeNull();

  const detailsButton = screen.getAllByRole("button", { name: "Детальніше" })[1];
  detailsButton.focus();
  fireEvent.click(detailsButton);
  expect(screen.getByRole("dialog", { name: /Hotel 2/ })).toBeTruthy();
  expect(screen.getByText("Подробиці: Hotel 2")).toBeTruthy();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(detailsButton);
});

it("paginates five hotels and recalculates the current page after a resize", () => {
  render(<HotelsList hotels={makeHotels(5)} />);

  expect(screen.getAllByRole("article")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "Наступна сторінка готелів" }));
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Hotel 5 3★" })).toBeTruthy();

  act(() => {
    window.innerWidth = 390;
    fireEvent.resize(window);
  });
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Hotel 2 3★" })).toBeTruthy();
  expect(screen.getAllByRole("button", { name: /^Сторінка готелів \d/ })).toHaveLength(5);
});

it("supports swiping on phones and shows the selected currency", () => {
  window.innerWidth = 390;
  const hotels = makeHotels(2);
  const view = render(<HotelsList hotels={hotels} />);

  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByText("від 600 €")).toBeTruthy();
  const grid = screen.getByRole("article").parentElement;
  if (!grid) throw new Error("Hotel grid is missing");
  fireEvent.touchStart(grid, { touches: [{ clientX: 250, clientY: 100 }] });
  fireEvent.touchEnd(grid, { changedTouches: [{ clientX: 90, clientY: 105 }] });
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  expect(scrollIntoView.mock.contexts[0]).toBe(grid);
  expect(screen.getByRole("heading", { name: "Hotel 2 3★" })).toBeTruthy();

  currency.selected = "UAH";
  view.rerender(<HotelsList hotels={hotels} />);
  expect(screen.getByText("від 24000 ₴")).toBeTruthy();
});

it("scrolls to the new hotel when a page is selected on a phone", () => {
  window.innerWidth = 390;
  render(<HotelsList hotels={makeHotels(2)} />);

  const grid = screen.getByRole("article").parentElement;
  const nextPageButton = screen.getAllByRole("button", { name: /2$/ })[0];
  fireEvent.click(nextPageButton);

  expect(screen.getByRole("article").textContent).toContain("Hotel 2");
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  expect(scrollIntoView.mock.contexts[0]).toBe(grid);
});

it("omits missing stars in the single hotel and hotel card headings", () => {
  const hotel = { ...makeHotels(1)[0], stars: undefined };

  const single = render(<Hotels {...hotel} />);
  expect(screen.getByRole("heading", { name: "Hotel 1" })).toBeTruthy();
  single.unmount();

  render(<HotelsList hotels={[hotel, makeHotels(2)[1]]} />);
  expect(screen.getByRole("heading", { name: "Hotel 1" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Hotel 2 3★" })).toBeTruthy();
});
