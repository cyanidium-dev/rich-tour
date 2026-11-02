// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useState } from "react";
import { CalendarDay } from "react-day-picker";
import DayButton from "./DayButton";
import { DepartureTooltipProvider } from "./DepartureTooltip";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2027-04-01T12:00:00Z"));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function fixture({
  preview = false,
  currency = "EUR" as "EUR" | "USD",
  status = ["available", "guaranteed", "discount", "hot"],
} = {}) {
  const book = vi.fn();
  function CalendarFixture() {
    const [month, setMonth] = useState("May");
    return (
      <DepartureTooltipProvider
        resetKey={month}
        currency={currency}
        convert={(amount) => (currency === "USD" ? amount * 1.115 : amount)}
      >
        {[3, 4].map((day) => (
          <DayButton
            key={day}
            day={new CalendarDay(new Date(2027, 4, day), new Date(2027, 4, 1))}
            modifiers={{}}
            aria-label={`${day} травня`}
            isLogin={false}
            readOnly={preview}
            currency={currency}
            convert={(amount) => (currency === "USD" ? amount * 1.115 : amount)}
            tourDepartures={{
              "2027-05": [
                {
                  day,
                  price: 300,
                  earlyBookingPrice: 250,
                  earlyBookingUntil: "2027-04-30",
                  status,
                  departureId: `date-${day}`,
                  crmNumber: `123${day}`,
                  hotels: [
                    {
                      title: "Tayhan",
                      stars: 3,
                      price: 270,
                      earlyBookingPrice: 211,
                      placementDescription: "Стандарт",
                    },
                    { title: "Інший готель", price: 227 },
                  ],
                },
              ],
            }}
            openBooking={book}
          />
        ))}
        <button onClick={() => setMonth("June")}>Наступний місяць</button>
      </DepartureTooltipProvider>
    );
  }
  render(<CalendarFixture />);
  return {
    book,
    first: screen.getByRole("button", { name: /^3 травня/ }),
    second: screen.getByRole("button", { name: /^4 травня/ }),
  };
}

it("shows separate status explanations and hotel prices on hover, with no booking button", () => {
  const { first, book } = fixture();
  expect(first.textContent).toContain("211€");
  fireEvent.mouseEnter(first);
  const tooltip = screen.getByRole("tooltip");
  expect(within(tooltip).getByText("Гарантований виїзд")).toBeTruthy();
  expect(within(tooltip).getByText("Гарячий тур")).toBeTruthy();
  expect(
    within(tooltip).getByText("Діє знижка раннього бронювання до 30.04.2027 включно"),
  ).toBeTruthy();
  expect(within(tooltip).getByText("Tayhan 3★")).toBeTruthy();
  expect(within(tooltip).getByText("Стандарт")).toBeTruthy();
  expect(within(tooltip).getByText("270€").tagName).toBe("DEL");
  expect(within(tooltip).getByText("211€")).toBeTruthy();
  expect(within(tooltip).getByText("227€")).toBeTruthy();
  expect(within(tooltip).queryByText("300€")).toBeNull();
  expect(within(tooltip).queryByRole("button")).toBeNull();
  expect(document.getElementById(first.getAttribute("aria-describedby")!)).toBeTruthy();
  expect(book).not.toHaveBeenCalled();
});

it("keeps the tooltip open when the pointer moves into it, then closes on leaving", () => {
  const { first } = fixture();
  fireEvent.mouseEnter(first);
  const tooltip = screen.getByRole("tooltip");
  fireEvent.mouseLeave(first);
  fireEvent.mouseEnter(tooltip);
  act(() => vi.advanceTimersByTime(300));
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.mouseLeave(tooltip);
  act(() => vi.advanceTimersByTime(300));
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("keeps hovered details visible when the page emits a scroll event", () => {
  const { first } = fixture();
  fireEvent.mouseEnter(first);
  fireEvent.scroll(document);
  act(() => vi.advanceTimersByTime(600));
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.mouseLeave(first);
  act(() => vi.advanceTimersByTime(300));
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("supports focus, blur, Escape and only one open tooltip", () => {
  const { first, second } = fixture();
  fireEvent.focus(first);
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.blur(first);
  act(() => vi.advanceTimersByTime(300));
  expect(screen.queryByRole("tooltip")).toBeNull();
  fireEvent.mouseEnter(first);
  fireEvent.mouseEnter(second);
  expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  expect(first.getAttribute("aria-describedby")).toBeNull();
  expect(second.getAttribute("aria-describedby")).toBeTruthy();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("dismisses details and immediately books the clicked departure", () => {
  const { first, second, book } = fixture();
  fireEvent.focus(first);
  fireEvent.click(first);
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(book).toHaveBeenCalledWith("03.05.2027", "date-3");
  fireEvent.click(second);
  expect(book).toHaveBeenLastCalledWith("04.05.2027", "date-4");
});

it("shows details in preview while keeping booking disabled", () => {
  const { first, book } = fixture({ preview: true });
  expect(first.hasAttribute("disabled")).toBe(false);
  fireEvent.focus(first);
  expect(screen.getByRole("tooltip")).toBeTruthy();
  fireEvent.click(first);
  expect(book).not.toHaveBeenCalled();
});

it("closes details when navigating to another month", () => {
  const { first } = fixture();
  fireEvent.mouseEnter(first);
  fireEvent.click(screen.getByRole("button", { name: "Наступний місяць" }));
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("uses the same currency conversion in the cell and all tooltip prices", () => {
  const { first } = fixture({ currency: "USD" });
  expect(first.textContent).toContain("236$");
  fireEvent.mouseEnter(first);
  const tooltip = screen.getByRole("tooltip");
  expect(within(tooltip).getByText("236$")).toBeTruthy();
  expect(within(tooltip).getByText("302$")).toBeTruthy();
  expect(within(tooltip).getByText("254$")).toBeTruthy();
});

it.each(["noSeats", "noDeparture"])("never books unavailable dates (%s)", (status) => {
  const { first, book } = fixture({ status: [status, "hot"] });
  fireEvent.click(first);
  expect(book).not.toHaveBeenCalled();
});
