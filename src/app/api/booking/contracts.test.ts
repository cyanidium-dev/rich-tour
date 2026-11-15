import { afterEach, beforeEach, expect, it, vi } from "vitest";
const { fetchDeparture } = vi.hoisted(() => ({ fetchDeparture: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/crm/sendTravelersToCrm", () => ({ sendTravelersToCrm: vi.fn() }));
vi.mock("@/lib/crm/sendOrderToCrm", () => ({ sendOrderToCrm: vi.fn() }));
vi.mock("@/lib/sanity/users/getAuthUser", () => ({ getAuthUser: vi.fn() }));
vi.mock("@/shared/api/server", () => ({ sanityClient: { fetch: fetchDeparture } }));
import { POST } from "./route";
import { sendTravelersToCrm } from "@/lib/crm/sendTravelersToCrm";
import { sendOrderToCrm } from "@/lib/crm/sendOrderToCrm";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { emptyTraveler } from "@/features/booking";
const body = () => ({
  requestId: "request",
  tourId: "tour",
  date: "15.12.2026",
  travelersQty: 1,
  email: "test@example.com",
  phone: "+38 (067) 123-45-67",
  travelers: [
    {
      ...emptyTraveler(),
      name: "Anna",
      surname: "Smith",
      phone: "+38 (067) 123-45-67",
      birthDate: "01.01.2000",
      boardingCity: "Kyiv",
      passportInProgress: true,
    },
  ],
});
const request = (value: unknown) =>
  new Request("http://localhost/api/booking", { method: "POST", body: JSON.stringify(value) });
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-15T12:00:00Z"));
  vi.resetAllMocks();
  fetchDeparture.mockResolvedValue({
    _id: "departure",
    crmNumber: "tour",
    startDate: "2026-12-15",
    price: 100,
  });
});
afterEach(() => vi.useRealTimers());
it("preserves JSON, identifier and validation error responses without CRM calls", async () => {
  const invalid = await POST(new Request("http://localhost", { method: "POST", body: "{" }));
  expect(invalid.status).toBe(400);
  expect(await invalid.json()).toEqual({ error: "INVALID_BODY" });
  const missing = await POST(request({}));
  expect(missing.status).toBe(400);
  expect(await missing.json()).toEqual({ error: "MISSING_BOOKING_IDENTIFIERS" });
  const failed = await POST(request({ ...body(), date: "" }));
  expect(failed.status).toBe(400);
  expect(await failed.json()).toEqual({
    error: "VALIDATION_FAILED",
    fields: ["Оберіть дату виїзду"],
  });
  expect(sendTravelersToCrm).not.toHaveBeenCalled();
  expect(getAuthUser).not.toHaveBeenCalled();
});
it("preserves required-field error text for incomplete requests", async () => {
  const response = await POST(request({ requestId: "request", tourId: "tour" }));
  expect(await response.json()).toEqual({
    error: "VALIDATION_FAILED",
    fields: [
      "Оберіть дату виїзду",
      "Вкажіть кількість туристів",
      "Дане поле обов'язкове до заповнення",
      "Дане поле обов'язкове до заповнення",
      "Має бути хоча б один турист",
    ],
  });
});
it("preserves the previous validation message order for multiple invalid traveler fields", async () => {
  const invalid = {
    ...body(),
    date: "",
    travelersQty: null,
    email: "",
    phone: "",
    message: "x".repeat(201),
    travelers: [
      {
        ...body().travelers[0],
        name: "",
        surname: "",
        phone: "",
        birthDate: "",
        boardingCity: "",
        passport: "",
        passportExpiration: "",
        passportInProgress: false,
      },
    ],
  };
  const response = await POST(request(invalid));
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({
    error: "VALIDATION_FAILED",
    fields: [
      "Оберіть дату виїзду",
      "Вкажіть кількість туристів",
      "Введіть валідний email",
      "Дане поле обов'язкове до заповнення",
      "Вкажіть правильний номер телефону",
      "Вкажіть правильний номер телефону",
      "Після +38 має бути цифра 0",
      "Дане поле обов'язкове до заповнення",
      "Повинно містити не більше 200 символів",
      "Прізвище повинне бути латиницею",
      "Вкажіть прізвище",
      "Ім’я повинне бути латиницею",
      "Вкажіть ім’я",
      "Вкажіть дату закінчення дії паспорта",
      "Паспорт має бути дійсний щонайменше 6 місяців",
      "Вкажіть номер паспорта",
      "Формат паспорта: AA123456",
      "Вкажіть дату народження",
      "Дата народження некоректна",
      "Вкажіть місто посадки",
    ],
  });
});
it("preserves traveler-before-order sequence, auth mapping and success contract", async () => {
  vi.mocked(getAuthUser).mockResolvedValue({ sub: "agent", role: "agent", crmId: "42" });
  vi.mocked(sendTravelersToCrm).mockResolvedValue(["1"]);
  vi.mocked(sendOrderToCrm).mockResolvedValue("7");
  const response = await POST(request(body()));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok", crmOrderId: "7" });
  expect(sendTravelersToCrm).toHaveBeenCalledWith(
    body().travelers.map(({ identificationCode: _identificationCode, ...traveler }) => traveler),
    "request",
  );
  expect(sendOrderToCrm).toHaveBeenCalledWith(
    expect.objectContaining({
      requestId: "request",
      crmTravelerIds: ["1"],
      crmUserId: 42,
      name: "Anna Smith",
      tourId: "tour",
    }),
  );
  expect(vi.mocked(sendTravelersToCrm).mock.invocationCallOrder[0]).toBeLessThan(
    vi.mocked(sendOrderToCrm).mock.invocationCallOrder[0],
  );
});

it("uses the verified departure CRM number for the order", async () => {
  fetchDeparture.mockResolvedValue({
    _id: "chosen",
    crmNumber: "300",
    startDate: "2026-12-20",
    price: 100,
  });
  vi.mocked(sendTravelersToCrm).mockResolvedValue(["1"]);
  const value = { ...body(), departureId: "chosen", tourId: "300", date: "20.12.2026" };
  expect((await POST(request(value))).status).toBe(200);
  expect(fetchDeparture).toHaveBeenCalledWith(
    expect.any(String),
    {
      departureId: "chosen",
      crmNumber: "300",
      startDate: "2026-12-20",
    },
    { cache: "no-store", perspective: "published" },
  );
  expect(sendOrderToCrm).toHaveBeenCalledWith(
    expect.objectContaining({ tourId: "300", date: "20.12.2026" }),
  );
});

it("rejects unavailable or mismatched departures before creating CRM contacts", async () => {
  fetchDeparture.mockResolvedValue(null);
  expect((await POST(request(body()))).status).toBe(400);
  expect(getAuthUser).not.toHaveBeenCalled();
  expect(sendTravelersToCrm).not.toHaveBeenCalled();
  expect(sendOrderToCrm).not.toHaveBeenCalled();
});

it("does not create CRM contacts when the departure check fails", async () => {
  fetchDeparture.mockRejectedValue(new Error("Sanity unavailable"));
  expect((await POST(request(body()))).status).toBe(502);
  expect(sendTravelersToCrm).not.toHaveBeenCalled();
  expect(sendOrderToCrm).not.toHaveBeenCalled();
});

it("validates older clients using their CRM number and date", async () => {
  expect((await POST(request(body()))).status).toBe(200);
  expect(fetchDeparture).toHaveBeenCalledWith(
    expect.any(String),
    {
      departureId: null,
      crmNumber: "tour",
      startDate: "2026-12-15",
    },
    expect.objectContaining({ cache: "no-store" }),
  );
});

it("rejects a departure once its date passes in Kyiv", async () => {
  vi.setSystemTime(new Date("2026-11-15T22:00:00Z"));
  fetchDeparture.mockResolvedValue({
    _id: "departure",
    crmNumber: "tour",
    startDate: "2026-11-15",
    price: 100,
  });
  expect((await POST(request({ ...body(), date: "15.11.2026" }))).status).toBe(400);
  expect(sendTravelersToCrm).not.toHaveBeenCalled();
});

it.each([
  { crmNumber: "other" },
  { startDate: "2026-12-20" },
  { startDate: "2026-11-14" },
  { availability: "noSeats" },
  { availability: "noDeparture" },
  { price: null },
  { price: undefined },
  { _id: "another-departure" },
])("rejects a stale or inconsistent departure: %j", async (change) => {
  fetchDeparture.mockResolvedValue({
    _id: "departure",
    crmNumber: "tour",
    startDate: "2026-12-15",
    price: 100,
    ...change,
  });
  expect((await POST(request({ ...body(), departureId: "departure" }))).status).toBe(400);
  expect(sendTravelersToCrm).not.toHaveBeenCalled();
  expect(sendOrderToCrm).not.toHaveBeenCalled();
});
it("preserves CRM failures and does not create an order after a traveler failure", async () => {
  vi.mocked(sendTravelersToCrm).mockRejectedValue(new Error("CRM"));
  const response = await POST(request(body()));
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: "CRM_BOOKING_FAILED" });
  expect(sendOrderToCrm).not.toHaveBeenCalled();
  vi.mocked(sendTravelersToCrm).mockResolvedValue(["1"]);
  vi.mocked(sendOrderToCrm).mockRejectedValue(new Error("order"));
  expect((await POST(request(body()))).status).toBe(502);
});

it.each(["", "1759013770"])(
  "rejects the insured adult code '%s' before auth or CRM calls",
  async (identificationCode) => {
    const value = body();
    value.travelers[0] = { ...value.travelers[0], insurance: true, identificationCode };
    const response = await POST(request(value));
    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error.error).toBe("VALIDATION_FAILED");
    expect(error.fields).toContain(
      "Вкажіть ідентифікаційний код хоча б одного повнолітнього туриста зі страховкою",
    );
    if (identificationCode)
      expect(error.fields).toContain(
        "Перевірте ідентифікаційний код: контрольна цифра не збігається",
      );
    expect(getAuthUser).not.toHaveBeenCalled();
    expect(sendTravelersToCrm).not.toHaveBeenCalled();
    expect(sendOrderToCrm).not.toHaveBeenCalled();
  },
);

it("preserves an adult's code and excludes ineligible codes before sending contacts", async () => {
  vi.mocked(sendTravelersToCrm).mockResolvedValue(["1", "2", "3"]);
  vi.mocked(sendOrderToCrm).mockResolvedValue("7");
  const value = body();
  value.travelersQty = 3;
  value.travelers[0] = { ...value.travelers[0], insurance: true, identificationCode: "0123456781" };
  value.travelers.push(
    {
      ...value.travelers[0],
      birthDate: `01.01.${new Date().getFullYear() - 5}`,
      identificationCode: "invalid",
    },
    { ...value.travelers[0], insurance: false, identificationCode: "invalid" },
  );
  const response = await POST(request(value));
  expect(response.status).toBe(200);
  const travelers = vi.mocked(sendTravelersToCrm).mock.calls[0][0];
  expect(travelers[0].identificationCode).toBe("0123456781");
  expect(travelers[1]).not.toHaveProperty("identificationCode");
  expect(travelers[2]).not.toHaveProperty("identificationCode");
  expect(sendOrderToCrm).toHaveBeenCalledWith(
    expect.objectContaining({ crmTravelerIds: ["1", "2", "3"] }),
  );
});
