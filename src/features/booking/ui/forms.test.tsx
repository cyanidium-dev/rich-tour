// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axios, { AxiosError } from "axios";
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});
vi.mock("@/components/shared/animation/AnimatedWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
// Native controls exercise RHF and the passenger array independently of HeroUI's layout runtime.
vi.mock("./BookingFields", () => ({
  BookingDateSelect: ({
    options,
    value,
    onChange,
  }: {
    options: {
      key: string;
      label: string;
    }[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <select aria-label="Дата туру" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" />
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  ),
  BookingTravelerCount: ({
    value,
    onChange,
  }: {
    value?: number;
    onChange: (v?: number) => void;
  }) => (
    <input
      aria-label="Кількість туристів"
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    />
  ),
  BookingCheckbox: ({
    isSelected,
    onChange,
    children,
  }: {
    isSelected: boolean;
    onChange: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <label>
      <input type="checkbox" checked={isSelected} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  ),
}));
import BookingForm from "./BookingForm";
import BookingAgentForm from "./BookingAgentForm";
import Booking from "@/components/shared/booking/Booking";
import BookingWithButton from "@/components/shared/booking/BookingWithButton";
import type { Tour, TourDepartures } from "@/entities/tour";
import {
  insuranceCodeChecksumError,
  insuranceCodeNotice,
  insuranceCodeRequired,
} from "../model/insurance";
const departures: TourDepartures = {
  "2026-12": [15, 20].map((day) => ({
    day,
    status: [],
    price: 100,
    crmNumber: "tour",
    departureId: String(day),
  })),
};
const callbacks = () => ({
  setIsError: vi.fn(),
  setIsNotificationShown: vi.fn(),
  setIsPopUpShown: vi.fn(),
  setErrorText: vi.fn(),
});
const props = () => ({
  ...callbacks(),
  tourDepartures: departures,
  initialDepartureId: "20",
  companyName: "Agency",
  email: "test@example.com",
  phone: "+38 (067) 123-45-67",
  initialDate: "20.12.2026",
});
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-15T12:00:00Z"));
});
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.useRealTimers();
});
function change(container: HTMLElement, name: string, value: string, masked = false) {
  const input = container.querySelector(`[name="${name}"]`)!;
  (masked ? fireEvent.input : fireEvent.change)(input, { target: { value } });
}
function fillTraveler(container: HTMLElement, agent = false) {
  fireEvent.focus(container.querySelector('[name="travelers.0.surname"]')!);
  change(container, "travelers.0.surname", "Smith");
  change(container, "travelers.0.name", "Anna");
  change(container, "travelers.0.phone", "+38 (067) 123-45-67", true);
  change(container, "travelers.0.birthDate", "01.01.2000", true);
  change(container, "travelers.0.boardingCity", "Kyiv");
  if (agent) {
    change(container, "travelers.0.passport", "other passport");
    expect(
      (container.querySelector('[name="travelers.0.passport"]') as HTMLInputElement).value,
    ).toBe("other passport");
    change(container, "travelers.0.passportExpiration", "01.01.2030", true);
  } else fireEvent.click(container.querySelectorAll('input[type="checkbox"]')[2]);
}

const bookingTour: Tour = {
  id: "first",
  selectedDepartureId: "first",
  crmNumber: "101",
  title: "Tour",
  slug: "tour",
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
  tourDepartures: {
    "2026-12": [
      { day: 15, price: 100, status: [], departureId: "first", crmNumber: "101" },
      { day: 20, price: 200, status: [], departureId: "second", crmNumber: "202" },
      { day: 25, price: 300, status: [], departureId: "third", crmNumber: "303" },
      { day: 26, price: 300, status: ["noSeats"], departureId: "full", crmNumber: "404" },
    ],
  },
};

it("restores the clicked calendar date when reopening the same departure after changing the form date", () => {
  const p = {
    tour: bookingTour,
    initialDate: "20.12.2026",
    forceOpen: true,
    onForceOpenHandled: vi.fn(),
    companyName: "",
    email: "",
    phone: "",
  };
  const { getByLabelText, rerender } = render(<BookingWithButton {...p} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("second");
  rerender(<BookingWithButton {...p} forceOpen={false} />);
  fireEvent.change(getByLabelText("Дата туру"), { target: { value: "third" } });
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("third");
  rerender(<BookingWithButton {...p} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("second");
});

it("preselects the exact departure when switching between departures on the same date", () => {
  const tour = {
    ...bookingTour,
    tourDepartures: {
      "2026-12": [
        bookingTour.tourDepartures["2026-12"][0],
        { day: 15, price: 200, status: [], departureId: "same-day", crmNumber: "202" },
      ],
    },
  };
  const p = {
    tour,
    isPopUpShown: true,
    setIsPopUpShown: vi.fn(),
    initialDate: "15.12.2026",
    companyName: "",
    email: "",
    phone: "",
  };
  const { getByLabelText, rerender } = render(<Booking {...p} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("first");
  rerender(
    <Booking {...p} tour={{ ...tour, selectedDepartureId: "same-day", crmNumber: "202" }} />,
  );
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("same-day");
});

it("shows all dates from the booking modal and submits the selected departure instead of the page departure", async () => {
  const { container, getByLabelText } = render(
    <Booking
      tour={bookingTour}
      isPopUpShown
      setIsPopUpShown={vi.fn()}
      initialDate="20.12.2026"
      companyName="Agency"
      email="test@example.com"
      phone="+38 (067) 123-45-67"
    />,
  );
  const date = getByLabelText("Дата туру") as HTMLSelectElement;
  expect(date.value).toBe("second");
  expect(Array.from(date.options).map((option) => option.text)).toEqual([
    "",
    "15.12.2026",
    "20.12.2026",
    "25.12.2026",
  ]);
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container);
  fireEvent.change(date, { target: { value: "third" } });
  expect((container.querySelector('[name="travelers.0.name"]') as HTMLInputElement).value).toBe(
    "Anna",
  );
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(vi.mocked(axios.post).mock.calls[0][1]).toEqual(
    expect.objectContaining({
      date: "25.12.2026",
      tourId: "303",
      departureId: "third",
    }),
  );
});

it("preselects the page departure for a normal booking button and falls back when unavailable", () => {
  const p = props();
  const { getByLabelText, unmount } = render(<BookingForm {...p} initialDate={undefined} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("20");
  unmount();
  const fallback = render(
    <BookingForm {...p} initialDate={undefined} initialDepartureId="missing" />,
  );
  expect((fallback.getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("15");
});

it("does not submit a booking when there are no available departures", async () => {
  const { container, getByLabelText, getByRole } = render(
    <BookingForm {...props()} tourDepartures={{}} />,
  );
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(getByRole("alert").textContent).toBe("Оберіть дату виїзду"));
  expect(axios.post).not.toHaveBeenCalled();
});
it("preserves initial date, array additions, deletion and surviving field values", async () => {
  const { container, getByLabelText } = render(<BookingForm {...props()} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("20");
  change(container, "travelers.0.surname", "Smith");
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "3" } });
  expect(container.querySelectorAll('[placeholder="Прізвище латиницею"]').length).toBe(3);
  change(container, "travelers.2.surname", "Last");
  fireEvent.click(container.querySelectorAll('button[aria-label="icon button"]')[1]);
  expect(container.querySelectorAll('[placeholder="Прізвище латиницею"]').length).toBe(2);
  expect((container.querySelector('[name="travelers.1.surname"]') as HTMLInputElement).value).toBe(
    "Last",
  );
  expect((getByLabelText("Кількість туристів") as HTMLInputElement).value).toBe("2");
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  expect(container.querySelectorAll('[placeholder="Прізвище латиницею"]').length).toBe(1);
  expect((container.querySelector('[name="travelers.0.surname"]') as HTMLInputElement).value).toBe(
    "Smith",
  );
});
it("clears and disables passports only for the active variant", async () => {
  const { container, getByLabelText } = render(<BookingForm {...props()} />);
  fireEvent.focus(container.querySelector('[name="travelers.0.surname"]')!);
  change(container, "travelers.0.passport", "ab123456", true);
  change(container, "travelers.0.passportExpiration", "01.01.2030", true);
  expect((container.querySelector('[name="travelers.0.passport"]') as HTMLInputElement).value).toBe(
    "AB123456",
  );
  fireEvent.click(getByLabelText("Паспорт виготовляється"));
  for (const name of ["passport", "passportExpiration"]) {
    const input = container.querySelector(`[name="travelers.0.${name}"]`) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.value).toBe("");
  }
});
it("keeps requestId after errors, blocks duplicate requests and rotates after success", async () => {
  const p = props();
  const { container, getByLabelText } = render(<BookingForm {...p} />);
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container); // select the passport-in-progress checkbox explicitly
  if (!(getByLabelText("Паспорт виготовляється") as HTMLInputElement).checked)
    fireEvent.click(getByLabelText("Паспорт виготовляється"));
  vi.mocked(axios.post).mockRejectedValueOnce({
    isAxiosError: true,
    response: {
      status: 502,
      data: {
        error: "CRM_BOOKING_FAILED",
        details: 'Етап: Створення замовлення у CRM\n{"message":"Client does not exist"}',
      },
    },
  });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() =>
    expect(p.setErrorText).toHaveBeenCalledWith(
      expect.stringContaining(
        'Етап: Створення замовлення у CRM\n{"message":"Client does not exist"}',
      ),
    ),
  );
  expect(p.setErrorText).toHaveBeenCalledWith(expect.stringContaining("HTTP сайту: 502"));
  const first = vi.mocked(axios.post).mock.calls[0][1] as {
    requestId: string;
  };
  expect(p.setErrorText).toHaveBeenCalledWith(expect.stringContaining(first.requestId));
  let finish!: (value: unknown) => void;
  vi.mocked(axios.post).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fireEvent.submit(container.querySelector("form")!);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
  expect(vi.mocked(axios.post).mock.calls[1][1]).toEqual(
    expect.objectContaining({ requestId: first.requestId, tourId: "tour", date: "20.12.2026" }),
  );
  finish({ data: { status: "ok" } });
  await waitFor(() =>
    expect((container.querySelector('[name="travelers.0.name"]') as HTMLInputElement).value).toBe(
      "",
    ),
  );
  expect(p.setIsPopUpShown).toHaveBeenCalledWith(false);
  expect(p.setIsNotificationShown).toHaveBeenCalledWith(true);
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container);
  if (!(getByLabelText("Паспорт виготовляється") as HTMLInputElement).checked)
    fireEvent.click(getByLabelText("Паспорт виготовляється"));
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(3));
  expect(
    (
      vi.mocked(axios.post).mock.calls[2][1] as {
        requestId: string;
      }
    ).requestId,
  ).not.toBe(first.requestId);
});
it.each([
  [new AxiosError("Network Error", "ERR_NETWORK"), ["Network Error", "ERR_NETWORK"]],
  [new TypeError("crypto.randomUUID is not a function"), ["crypto.randomUUID is not a function"]],
  [
    {
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: "VALIDATION_FAILED", fields: ["Перевірте паспорт", "Перевірте дату"] },
      },
    },
    ["VALIDATION_FAILED", "Перевірте паспорт", "Перевірте дату", "HTTP сайту: 400"],
  ],
])(
  "shows diagnostic details for browser, network and validation failures: %j",
  async (error, texts) => {
    const p = props();
    const { container, getByLabelText } = render(<BookingForm {...p} />);
    fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
    fillTraveler(container);
    if (!(getByLabelText("Паспорт виготовляється") as HTMLInputElement).checked)
      fireEvent.click(getByLabelText("Паспорт виготовляється"));
    vi.mocked(axios.post).mockRejectedValueOnce(error);
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => expect(p.setErrorText).toHaveBeenCalled());
    for (const text of texts) {
      expect(p.setErrorText).toHaveBeenCalledWith(expect.stringContaining(text));
    }
    expect(
      (container.querySelector('[name="travelers.0.surname"]') as HTMLInputElement).value,
    ).toBe("Smith");
  },
);

it("retains the agent's local submission and empty-submission errors", async () => {
  const p = callbacks();
  const { container, getByLabelText } = render(
    <BookingAgentForm {...p} tourDepartures={departures} />,
  );
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(container.querySelectorAll("p.text-red").length).toBeGreaterThan(0));
  expect(axios.post).not.toHaveBeenCalled();
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container, true);
  change(container, "agency", "Agency");
  change(container, "manager", "Manager");
  change(container, "email", "test@example.com");
  change(container, "phone", "+38 (067) 123-45-67", true);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(p.setIsNotificationShown).toHaveBeenCalledWith(true));
  expect(axios.post).not.toHaveBeenCalled();
  expect(p.setIsPopUpShown).toHaveBeenCalledWith(false);
});

it.each([false, true])(
  "shows and clears eligible codes, retaining collapsed values (agent: %s)",
  async (agent) => {
    const view = render(
      agent ? (
        <BookingAgentForm {...callbacks()} tourDepartures={departures} />
      ) : (
        <BookingForm {...props()} />
      ),
    );
    const { container, getByLabelText, queryByLabelText, queryByText } = view;
    fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "2" } });
    fireEvent.focus(container.querySelector('[name="travelers.0.surname"]')!);
    fireEvent.click(getByLabelText("Страховка"));
    expect(queryByLabelText("Ідентифікаційний код")).toBeNull();
    change(container, "travelers.0.birthDate", "01.01.2000", true);
    expect(getByLabelText("Ідентифікаційний код")).toBeTruthy();
    expect(queryByText(insuranceCodeNotice)).toBeTruthy();
    change(container, "travelers.0.identificationCode", "0123456781", true);
    fireEvent.focus(container.querySelector('[name="travelers.1.surname"]')!);
    expect(queryByLabelText("Ідентифікаційний код")).toBeNull();
    fireEvent.focus(container.querySelector('[name="travelers.0.surname"]')!);
    expect((getByLabelText("Ідентифікаційний код") as HTMLInputElement).value).toBe("0123456781");
    fireEvent.click(getByLabelText("Страховка"));
    await waitFor(() => expect(queryByLabelText("Ідентифікаційний код")).toBeNull());
    fireEvent.click(getByLabelText("Страховка"));
    expect((getByLabelText("Ідентифікаційний код") as HTMLInputElement).value).toBe("");
    change(container, "travelers.0.identificationCode", "0123456781", true);
    change(container, "travelers.0.birthDate", `01.01.${new Date().getFullYear() - 5}`, true);
    await waitFor(() => expect(queryByLabelText("Ідентифікаційний код")).toBeNull());
    expect(queryByText(insuranceCodeNotice)).toBeNull();
    change(container, "travelers.0.birthDate", "01.01.2000", true);
    expect((getByLabelText("Ідентифікаційний код") as HTMLInputElement).value).toBe("");
    change(container, "travelers.0.identificationCode", "0123456781", true);
    change(container, "travelers.0.birthDate", "31.02.2000", true);
    await waitFor(() => expect(queryByLabelText("Ідентифікаційний код")).toBeNull());
    change(container, "travelers.0.birthDate", "01.01.2000", true);
    expect((getByLabelText("Ідентифікаційний код") as HTMLInputElement).value).toBe("");
  },
);

it("blocks missing and invalid codes, then submits a corrected leading-zero code", async () => {
  const { container, getByLabelText, getByRole, queryByRole, getByText } = render(
    <BookingForm {...props()} />,
  );
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container);
  fireEvent.click(getByLabelText("Страховка"));
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(getByRole("alert").textContent).toBe(insuranceCodeRequired));
  expect(axios.post).not.toHaveBeenCalled();
  change(container, "travelers.0.identificationCode", "1759013770", true);
  fireEvent.blur(getByLabelText("Ідентифікаційний код"));
  await waitFor(() => expect(getByText(insuranceCodeChecksumError)).toBeTruthy());
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(getByRole("alert").textContent).toBe(insuranceCodeRequired));
  expect(axios.post).not.toHaveBeenCalled();
  change(container, "travelers.0.identificationCode", "0123456781", true);
  await waitFor(() => expect(queryByRole("alert")).toBeNull());
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(vi.mocked(axios.post).mock.calls[0][1]).toEqual(
    expect.objectContaining({
      travelers: [expect.objectContaining({ identificationCode: "0123456781" })],
    }),
  );
});

it("revalidates the whole group when a code is edited, a traveler is removed or insurance changes", async () => {
  const { container, getByLabelText, getByRole, queryByRole, getAllByText } = render(
    <BookingForm {...props()} />,
  );
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "3" } });
  for (const index of [0, 1]) {
    fireEvent.focus(container.querySelector(`[name="travelers.${index}.surname"]`)!);
    change(container, `travelers.${index}.birthDate`, "01.01.2000", true);
    fireEvent.click(getByLabelText("Страховка"));
  }
  fireEvent.focus(container.querySelector('[name="travelers.2.surname"]')!);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(getByRole("alert").textContent).toBe(insuranceCodeRequired));
  expect(getAllByText(insuranceCodeNotice)).toHaveLength(1);
  fireEvent.focus(container.querySelector('[name="travelers.1.surname"]')!);
  change(container, "travelers.1.identificationCode", "0123456781", true);
  await waitFor(() => expect(queryByRole("alert")).toBeNull());
  fireEvent.click(container.querySelectorAll('button[aria-label="icon button"]')[1]);
  await waitFor(() => expect(getByRole("alert").textContent).toBe(insuranceCodeRequired));
  fireEvent.focus(container.querySelector('[name="travelers.0.surname"]')!);
  fireEvent.click(getByLabelText("Страховка"));
  await waitFor(() => expect(queryByRole("alert")).toBeNull());
  expect(axios.post).not.toHaveBeenCalled();
});

it("submits child-only insurance without an identification code", async () => {
  const { container, getByLabelText, queryByLabelText, queryByText } = render(
    <BookingForm {...props()} />,
  );
  fireEvent.change(getByLabelText("Кількість туристів"), { target: { value: "1" } });
  fillTraveler(container);
  change(container, "travelers.0.birthDate", `01.01.${new Date().getFullYear() - 5}`, true);
  fireEvent.click(getByLabelText("Страховка"));
  expect(queryByLabelText("Ідентифікаційний код")).toBeNull();
  expect(queryByText(insuranceCodeNotice)).toBeNull();
  vi.mocked(axios.post).mockResolvedValue({ data: {} });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
});
