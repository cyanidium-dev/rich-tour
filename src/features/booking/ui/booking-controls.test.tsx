// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import BookingForm from "./BookingForm";
import type { TourDepartures } from "@/entities/tour";

const departures: TourDepartures = {
  "2026-12": [15, 20].map((day) => ({
    day,
    status: [],
    crmNumber: "tour",
    departureId: String(day),
  })),
};

afterEach(cleanup);

it("connects the real date and traveler-count controls to the form", async () => {
  const { container } = render(
    <BookingForm
      setIsError={vi.fn()}
      setIsNotificationShown={vi.fn()}
      setIsPopUpShown={vi.fn()}
      setErrorText={vi.fn()}
      tourDepartures={departures}
      selectedCrmNumber="tour"
      initialDate="20.12.2026"
      companyName=""
      email=""
      phone=""
    />,
  );
  const date = screen.getByRole("button", { name: /Дата туру/ });
  expect(date.textContent).toContain("20.12.2026");
  fireEvent.click(date);
  fireEvent.click(await screen.findByRole("option", { name: "15.12.2026" }));
  await waitFor(() => expect(date.textContent).toContain("15.12.2026"));
  const count = screen.getByRole("textbox", { name: "Кількість туристів" });
  fireEvent.input(count, { target: { value: "2" } });
  fireEvent.blur(count);
  await waitFor(() =>
    expect(container.querySelectorAll('[placeholder="Прізвище латиницею"]').length).toBe(2),
  );
});
