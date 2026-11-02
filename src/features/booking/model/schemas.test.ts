import { expect, it } from "vitest";
import { bookingSchema, bookingAgentSchema, emptyTraveler } from "./schemas";
import { bookingRequestSchema } from "./requestSchema";
import {
  insuranceCodeChecksumError,
  insuranceCodeFormatError,
  insuranceCodeRequired,
} from "./insurance";
export const validBooking = () => ({
  date: "15.12.2026",
  travelersQty: 1,
  companyName: "",
  email: "test@example.com",
  phone: "+38 (067) 123-45-67",
  message: "",
  travelers: [
    {
      ...emptyTraveler(),
      name: "Anna",
      surname: "Smith",
      phone: "+38 (067) 123-45-67",
      birthDate: "01.01.2000",
      boardingCity: "Kyiv",
      passport: "AA123456",
      passportExpiration: "01.01.2030",
    },
  ],
});
it("validates conditional passport fields and existing date rules", () => {
  const v = validBooking();
  expect(bookingSchema.safeParse(v).success).toBe(true);
  v.travelers[0].passport = "bad";
  expect(bookingSchema.safeParse(v).success).toBe(false);
  v.travelers[0].passportInProgress = true;
  v.travelers[0].passportExpiration = "";
  expect(bookingSchema.safeParse(v).success).toBe(true);
  v.travelers[0].birthDate = "01.01.2099";
  expect(bookingSchema.safeParse(v).success).toBe(false);
});
it("keeps the agent variant's required passport and optional date", () => {
  const v = { ...validBooking(), agency: "Agency", manager: "Manager", date: "" };
  v.travelers[0].passport = "other passport";
  expect(bookingAgentSchema.safeParse(v).success).toBe(true);
  v.travelers[0].passportInProgress = true;
  v.travelers[0].passport = "";
  expect(bookingAgentSchema.safeParse(v).success).toBe(false);
});
it("keeps quantity, contact, message and server numeric coercion rules", () => {
  const v = validBooking();
  for (const qty of [null, 0, -1, 1.5])
    expect(bookingSchema.safeParse({ ...v, travelersQty: qty }).success).toBe(false);
  expect(bookingSchema.safeParse({ ...v, message: "x".repeat(201) }).success).toBe(false);
  expect(bookingSchema.safeParse({ ...v, phone: "+38 (167) 123-45-67" }).success).toBe(false);
  const result = bookingRequestSchema.parse({
    ...v,
    requestId: "request",
    tourId: "tour",
    travelersQty: "1",
    extra: "retained",
  });
  expect(result.travelersQty).toBe(1);
  expect(result.extra).toBe("retained");
});

it("requires one valid insured adult code across browser, agent and server schemas", () => {
  const v = {
    ...validBooking(),
    agency: "Agency",
    manager: "Manager",
    requestId: "request",
    tourId: "tour",
  };
  v.travelers[0].insurance = true;
  v.travelers.push({ ...v.travelers[0] });
  for (const schema of [bookingSchema, bookingAgentSchema, bookingRequestSchema]) {
    const missing = schema.safeParse(v);
    expect(missing.success).toBe(false);
    if (!missing.success)
      expect(missing.error.issues).toContainEqual(
        expect.objectContaining({
          path: ["travelers", "root"],
          message: insuranceCodeRequired,
        }),
      );
  }
  v.travelers[1].identificationCode = "0123456781";
  for (const schema of [bookingSchema, bookingAgentSchema, bookingRequestSchema])
    expect(schema.safeParse(v).success).toBe(true);
  v.travelers[0].identificationCode = "1759013770";
  for (const schema of [bookingSchema, bookingAgentSchema, bookingRequestSchema]) {
    const result = schema.safeParse(v);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ["travelers", 0, "identificationCode"],
          message: insuranceCodeChecksumError,
        }),
      );
  }
});

it("rejects invalid code lengths, letters and numeric JSON values", () => {
  const v = validBooking();
  v.travelers[0].insurance = true;
  for (const identificationCode of ["123456789", "12345678901", "123456789a", 1234567899]) {
    const travelers = [{ ...v.travelers[0], identificationCode }];
    const result = bookingRequestSchema.safeParse({
      ...v,
      travelers,
      requestId: "request",
      tourId: "tour",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.message)).toContain(insuranceCodeFormatError);
  }
});

it("allows child-only insurance and strips ineligible codes from server data", () => {
  const v = validBooking();
  v.travelers[0].insurance = true;
  const now = new Date();
  v.travelers[0].birthDate = `01.01.${now.getFullYear() - 5}`;
  v.travelers[0].identificationCode = "invalid";
  v.travelers.push({ ...v.travelers[0], insurance: false, birthDate: "01.01.2000" });
  expect(bookingSchema.safeParse(v).success).toBe(true);
  const parsed = bookingRequestSchema.parse({ ...v, requestId: "request", tourId: "tour" });
  for (const traveler of parsed.travelers)
    expect(traveler).not.toHaveProperty("identificationCode");
});
