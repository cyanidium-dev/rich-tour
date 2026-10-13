import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/crm/sendTravelersToCrm", () => ({ sendTravelersToCrm: vi.fn() }));
vi.mock("@/lib/crm/sendOrderToCrm", () => ({ sendOrderToCrm: vi.fn() }));
vi.mock("@/lib/sanity/users/getAuthUser", () => ({ getAuthUser: vi.fn() }));
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
beforeEach(() => vi.resetAllMocks());
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
  expect(sendTravelersToCrm).toHaveBeenCalledWith(body().travelers, "request");
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
