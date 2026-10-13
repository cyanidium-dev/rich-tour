import { z } from "zod";
import {
  latinNameRegex,
  phoneRegex,
  emailRegex,
  isValidBirthDate,
  isValidPassportExpirationDate,
} from "@/regex/regex";
const required = (message: string) => z.string({ error: message }).min(1, message);
export const travelerBase = z.object({
  name: z
    .string({ error: "Вкажіть ім’я" })
    .regex(latinNameRegex, "Ім’я повинне бути латиницею")
    .min(1, "Вкажіть ім’я"),
  surname: z
    .string({ error: "Вкажіть прізвище" })
    .regex(latinNameRegex, "Прізвище повинне бути латиницею")
    .min(1, "Вкажіть прізвище"),
  phone: z.string().regex(phoneRegex, "Вкажіть правильний номер телефону").nullable().optional(),
  passport: z.string(),
  birthDate: z.string({ error: "Вкажіть дату народження" }),
  passportExpiration: z.string(),
  boardingCity: required("Вкажіть місто посадки"),
  insurance: z.boolean(),
  frontSeats: z.boolean(),
  passportInProgress: z.boolean(),
});
export function validateTraveler(
  v: Omit<
    z.infer<typeof travelerBase>,
    "insurance" | "frontSeats" | "passportInProgress" | "passport" | "passportExpiration"
  > & {
    passportInProgress?: unknown;
    passport?: string | null;
    passportExpiration?: string | null;
  },
  ctx: z.RefinementCtx,
) {
  const issue = (path: string, message: string) =>
    ctx.addIssue({ code: "custom", path: [path], message });
  if (!v.birthDate) issue("birthDate", "Вкажіть дату народження");
  if (!isValidBirthDate(v.birthDate)) issue("birthDate", "Дата народження некоректна");
  if (v.passportInProgress === false) {
    if (!v.passport) issue("passport", "Вкажіть номер паспорта");
    if (!/^[A-Z]{2}[0-9]{6}$/.test(v.passport ?? ""))
      issue("passport", "Формат паспорта: AA123456");
    if (!v.passportExpiration) issue("passportExpiration", "Вкажіть дату закінчення дії паспорта");
    if (!isValidPassportExpirationDate(v.passportExpiration ?? undefined))
      issue("passportExpiration", "Паспорт має бути дійсний щонайменше 6 місяців");
  }
}
export const travelerSchema = travelerBase.superRefine(validateTraveler);
const agentTravelerSchema = travelerBase.extend({
  passport: required("Вкажіть номер паспорта"),
  birthDate: required("Вкажіть дату народження"),
  passportExpiration: required("Вкажіть дату закінчення дії паспорта"),
});
const common = {
  date: z.string(),
  travelersQty: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Вкажіть кількість туристів"
          : "Кількість туристів повинна бути числом",
    })
    .nullable()
    .superRefine((v, ctx) => {
      if (v === null) ctx.addIssue({ code: "custom", message: "Вкажіть кількість туристів" });
    })
    .refine(
      (v) => v === null || Number.isInteger(v),
      "Кількість туристів повинна бути цілим числом",
    )
    .refine((v) => v === null || v > 0, "Кількість туристів повинна бути додатньою"),
  companyName: z.string().optional(),
  agency: z.string().optional(),
  manager: z.string().optional(),
  email: z
    .string({ error: "Дане поле обов'язкове до заповнення" })
    .regex(emailRegex, "Введіть валідний email")
    .min(1, "Дане поле обов'язкове до заповнення"),
  phone: z
    .string({ error: "Дане поле обов'язкове до заповнення" })
    .regex(phoneRegex, "Вкажіть правильний номер телефону")
    .refine((v) => v.length >= 6 && v[5] === "0", "Після +38 має бути цифра 0")
    .min(1, "Дане поле обов'язкове до заповнення"),
  message: z.string().max(200, "Повинно містити не більше 200 символів"),
};
export const bookingSchema = z.object({
  ...common,
  date: required("Оберіть дату виїзду"),
  travelers: z
    .array(travelerSchema, { error: "Має бути хоча б один турист" })
    .min(1, "Має бути хоча б один турист"),
});
export const bookingAgentSchema = z.object({
  ...common,
  agency: z
    .string()
    .optional()
    .refine((v) => !!v, "Дане поле обов'язкове до заповнення"),
  manager: z
    .string()
    .optional()
    .refine((v) => !!v, "Дане поле обов'язкове до заповнення"),
  travelers: z
    .array(agentTravelerSchema, { error: "Має бути хоча б один турист" })
    .min(1, "Має бути хоча б один турист"),
});
export type BookingValues = z.infer<typeof bookingSchema>;
export type TravelerInfo = z.infer<typeof travelerBase>;
export const emptyTraveler = (): TravelerInfo => ({
  name: "",
  surname: "",
  phone: "",
  passport: "",
  birthDate: "",
  passportExpiration: "",
  boardingCity: "",
  insurance: false,
  frontSeats: false,
  passportInProgress: false,
});
