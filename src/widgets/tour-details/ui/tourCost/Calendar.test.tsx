// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { Tour } from "@/entities/tour";
import Calendar from "./Calendar";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  params: new URLSearchParams(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation,
  usePathname: () => "/tours/u-ritmi-greckogo-lita-olimpiiska-riv-yera",
  useSearchParams: () => navigation.params,
}));
vi.mock("@/context/CurrencyContext", () => ({
  useCurrency: () => ({ selected: "EUR", convert: (amount: number) => amount }),
}));
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/shared/booking/BookingWithButton", () => ({
  default: ({ forceOpen }: { forceOpen?: boolean }) =>
    forceOpen ? <div role="dialog">Бронювання</div> : null,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2027-05-01T12:00:00Z"));
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const tour: Tour = {
  id: "63dcaa31-d573-4e2d-a0ee-282a5fc783bd",
  crmNumber: "00000",
  slug: "u-ritmi-greckogo-lita-olimpiiska-riv-yera",
  title: "Моє літо в Греції 04.06",
  description: "",
  duration: 7,
  earlyBooking: false,
  heroImages: {},
  costImages: {},
  benefits: { list: [] },
  program: { url: "", list: [] },
  points: [],
  includedInCost: [],
  notIncludedInCost: [],
  inspiration: [],
  selectedDepartureId: "63dcaa31-d573-4e2d-a0ee-282a5fc783bd",
  tourDepartures: {
    "2027-06": [
      {
        day: 4,
        price: 389,
        hotels: [{ title: "The Silk Design Hotel ***", stars: 3, price: 389 }],
        status: ["available", "guaranteed", "hot", "discount", "specialPrice", "tourInRecruitment"],
        crmNumber: "00000",
        departureId: "63dcaa31-d573-4e2d-a0ee-282a5fc783bd",
      },
    ],
  },
};

it("opens the June 4 departure details after navigating the real calendar", () => {
  render(
    <Calendar
      tour={tour}
      isLogin={false}
      companyName={undefined}
      email={undefined}
      phone={undefined}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /наступного місяця/i }));
  act(() => vi.advanceTimersByTime(500));
  const button = screen.getByRole("button", { name: /4-е Червня.*389/i });
  expect(button.hasAttribute("disabled")).toBe(false);
  fireEvent.mouseEnter(button);
  const tooltip = screen.getByRole("tooltip");
  expect(within(tooltip).getByText("Гарантований виїзд")).toBeTruthy();
  expect(within(tooltip).getByText("The Silk Design Hotel *** 3★")).toBeTruthy();
  expect(within(tooltip).getByText("389€")).toBeTruthy();
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.click(button);
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(screen.getByRole("dialog")).toBeTruthy();
});

it("allows hovering and booking June 4 in the trailing days of the May calendar", () => {
  render(
    <Calendar
      tour={tour}
      isLogin={false}
      companyName={undefined}
      email={undefined}
      phone={undefined}
    />,
  );
  const button = screen.getByRole("button", { name: /4-е Червня.*389/i });
  expect(button.closest("[data-outside]")?.getAttribute("data-outside")).toBe("true");
  expect(button.hasAttribute("disabled")).toBe(false);
  fireEvent.mouseEnter(button);
  expect(within(screen.getByRole("tooltip")).getByText("389€")).toBeTruthy();
  fireEvent.click(button);
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(screen.getByRole("dialog")).toBeTruthy();
});

it.each(["noSeats", "noDeparture"])(
  "keeps unavailable adjacent-month departures disabled (%s)",
  (status) => {
    const unavailable = {
      ...tour,
      tourDepartures: { "2027-06": [{ ...tour.tourDepartures["2027-06"][0], status: [status] }] },
    };
    render(
      <Calendar
        tour={unavailable}
        isLogin={false}
        companyName={undefined}
        email={undefined}
        phone={undefined}
      />,
    );
    const button = screen.getByRole("button", { name: /4-е Червня.*389/i });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(screen.queryByRole("dialog")).toBeNull();
  },
);
