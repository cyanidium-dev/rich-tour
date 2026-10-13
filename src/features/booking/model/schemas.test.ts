import { expect, it } from "vitest";
import { bookingSchema, bookingAgentSchema, emptyTraveler } from "./schemas";
import { bookingRequestSchema } from "./requestSchema";
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
