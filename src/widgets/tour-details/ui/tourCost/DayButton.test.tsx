// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalendarDay } from "react-day-picker";
import DayButton from "./DayButton";
import Legend from "./Legend";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

afterEach(cleanup);

const date = new Date(2027, 4, 3);

function renderDay(
  status: string[],
  isLogin = false,
  { price = 211, selected = false }: { price?: number | null; selected?: boolean } = {},
) {
  const openBooking = vi.fn();
  const rendered = render(
    <DayButton
      day={new CalendarDay(date, new Date(2027, 4, 1))}
      modifiers={{ selected }}
      aria-label="3 травня 2027"
      isLogin={isLogin}
      agencyCommission={isLogin ? { type: "percent", value: 10 } : undefined}
      currency="EUR"
      convert={(amount) => amount}
      tourDepartures={{
        "2027-05": [
          { day: 3, price: price ?? undefined, status, crmNumber: "123", departureId: "departure" },
        ],
      }}
      openBooking={openBooking}
    />,
  );
  return { ...rendered, openBooking };
}

it.each([false, true])(
  "shows every label together while retaining availability and booking (agent=%s)",
  (isLogin) => {
    const { container, openBooking } = renderDay(
      ["specialPrice", "tourInRecruitment", "discount", "hot", "guaranteed", "fewSeats"],
      isLogin,
    );
    const button = screen.getByRole("button");
    expect(button.style.borderColor).toBe("rgb(255, 180, 41)");
    expect(button.style.backgroundColor).toBe("rgb(255, 244, 223)");
    expect(button.style.color).toBe("black");
    expect(button.getAttribute("aria-label")).toContain("Діє знижка раннього бронювання");
    expect(button.getAttribute("aria-label")).toContain("Спеціальна ціна - special price");
    expect(button.getAttribute("aria-label")).toContain("Тур в наборі");
    expect(container.querySelectorAll("img")).toHaveLength(5);
    expect(screen.getByTitle("Спеціальна ціна - special price")).toBeTruthy();
    expect(screen.getByTitle("Тур в наборі")).toBeTruthy();
    fireEvent.click(button);
    expect(openBooking).toHaveBeenCalledWith("03.05.2027", "departure");
  },
);

it("keeps sold-out departures unbookable with promotional labels", () => {
  const { openBooking } = renderDay(["specialPrice", "tourInRecruitment", "noSeats"]);
  const button = screen.getByRole("button");
  expect(button.style.borderColor).toBe("rgb(228, 58, 58)");
  expect(button.style.backgroundColor).toBe("rgb(251, 226, 226)");
  fireEvent.click(button);
  expect(openBooking).not.toHaveBeenCalled();
});

it.each([
  ["available", "rgb(115, 169, 28)", "rgb(234, 242, 221)"],
  ["fewSeats", "rgb(255, 180, 41)", "rgb(255, 244, 223)"],
  ["noSeats", "rgb(228, 58, 58)", "rgb(251, 226, 226)"],
  ["onRequest", "rgb(76, 111, 255)", "rgb(228, 233, 255)"],
])("fills %s dates and retains their border with black text", (status, border, background) => {
  renderDay([status]);
  const button = screen.getByRole("button");
  expect(button.style.borderColor).toBe(border);
  expect(button.style.backgroundColor).toBe(background);
  expect(button.style.color).toBe("black");
});

it.each([false, true])("retains the fill on selected dates (agent=%s)", (isLogin) => {
  renderDay(["available", "discount"], isLogin, { selected: true });
  const button = screen.getByRole("button");
  expect(button.style.backgroundColor).toBe("rgb(234, 242, 221)");
  expect(button.style.color).toBe("black");
  expect(screen.getByText("211€")).toBeTruthy();
  if (isLogin) expect(screen.getByText("/ 10%")).toBeTruthy();
});

it.each(["available", "fewSeats", "noSeats", "onRequest"])(
  "leaves %s dates without a price unfilled and unbookable",
  (status) => {
    const { openBooking } = renderDay([status], false, { price: null });
    const button = screen.getByRole("button");
    expect(button.style.backgroundColor).toBe("transparent");
    expect(button.style.borderColor).toBe("transparent");
    expect(button.style.color).toBe("black");
    fireEvent.click(button);
    expect(openBooking).not.toHaveBeenCalled();
  },
);

it("leaves dates with no departure unfilled and unbookable", () => {
  const { openBooking } = renderDay(["noDeparture"]);
  const button = screen.getByRole("button");
  expect(button.style.backgroundColor).toBe("transparent");
  expect(button.style.borderColor).toBe("transparent");
  fireEvent.click(button);
  expect(openBooking).not.toHaveBeenCalled();
});

it("leaves dates with only promotional labels unfilled", () => {
  renderDay(["discount", "hot"]);
  expect(screen.getByRole("button").style.backgroundColor).toBe("transparent");
});

it("describes the new labels in the legend", () => {
  render(<Legend />);
  expect(screen.getByText("Спеціальна ціна - special price")).toBeTruthy();
  expect(screen.getByText("Діє знижка раннього бронювання")).toBeTruthy();
  expect(screen.getByText("Тур в наборі")).toBeTruthy();
});
