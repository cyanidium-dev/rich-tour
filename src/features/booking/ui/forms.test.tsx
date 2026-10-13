// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axios from "axios";
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: (e: unknown) => !!e && typeof e === "object" && "response" in e,
  },
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
import type { TourDepartures } from "@/entities/tour";
const departures: TourDepartures = {
  "2026-12": [15, 20].map((day) => ({
    day,
    status: [],
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
  selectedCrmNumber: "tour",
  companyName: "Agency",
  email: "test@example.com",
  phone: "+38 (067) 123-45-67",
  initialDate: "20.12.2026",
});
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
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
it("preserves initial date, array additions, deletion and surviving field values", async () => {
  const { container, getByLabelText } = render(<BookingForm {...props()} />);
  expect((getByLabelText("Дата туру") as HTMLSelectElement).value).toBe("20.12.2026");
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
    response: { data: { error: "CRM_BOOKING_FAILED" } },
  });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(p.setErrorText).toHaveBeenCalledWith("CRM_BOOKING_FAILED"));
  const first = vi.mocked(axios.post).mock.calls[0][1] as {
    requestId: string;
  };
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
