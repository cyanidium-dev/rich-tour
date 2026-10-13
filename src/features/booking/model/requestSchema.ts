import { z } from "zod";
import { bookingSchema, travelerBase, validateTraveler } from "./schemas";
// Preserve extra payload fields and numeric form-value casting.
const castString = (value: unknown) =>
  typeof value === "number" || typeof value === "boolean" ? String(value) : value;
const requestTraveler = travelerBase
  .extend({
    name: z.preprocess(castString, travelerBase.shape.name),
    surname: z.preprocess(castString, travelerBase.shape.surname),
    phone: z.preprocess(castString, travelerBase.shape.phone),
    birthDate: z.preprocess(castString, travelerBase.shape.birthDate),
    boardingCity: z.preprocess(castString, travelerBase.shape.boardingCity),
    passport: z.preprocess(castString, z.string().nullable().optional()),
    passportExpiration: z.preprocess(castString, z.string().nullable().optional()),
    insurance: z.unknown().optional(),
    frontSeats: z.unknown().optional(),
    passportInProgress: z.unknown().optional(),
  })
  .passthrough()
  .superRefine(validateTraveler);
export const bookingRequestSchema = bookingSchema
  .extend({
    requestId: z.custom<string>((value) => !!value),
    tourId: z.custom<string>((value) => !!value),
    companyName: z.unknown().optional(),
    agency: z.unknown().optional(),
    manager: z.unknown().optional(),
    date: z.preprocess(castString, bookingSchema.shape.date),
    email: z.preprocess(castString, bookingSchema.shape.email),
    phone: z.preprocess(castString, bookingSchema.shape.phone),
    travelersQty: z.preprocess(
      (value) => (typeof value === "string" && value.trim() ? Number(value) : value),
      bookingSchema.shape.travelersQty,
    ),
    message: z.preprocess(castString, bookingSchema.shape.message.optional()),
    travelers: z
      .array(requestTraveler, { error: "Має бути хоча б один турист" })
      .min(1, "Має бути хоча б один турист"),
  })
  .passthrough();
