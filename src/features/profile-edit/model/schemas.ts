import { z } from "zod";
import { emailRegex, phoneRegex, edrpouRegex } from "@/regex/regex";
const required = "Дане поле обов'язкове до заповнення";
const text = z.string().min(1, required);
const email = text.regex(emailRegex, "Введіть валідний email");
const phone = text.regex(phoneRegex, "Вкажіть правильний номер телефону");
const name = text.min(2, "Має бути не менше 2 символів");
// Preserve the profile API's conversion of JSON numbers and booleans to strings.
function castRequestStrings(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, field]) => [
      key,
      typeof field === "number" || typeof field === "boolean" ? String(field) : field,
    ]),
  );
}
export const agentProfileSchema = z.object({
  email,
  companyName: name,
  legalCompanyName: z
    .string()
    .optional()
    .refine((value) => !!value, required)
    .refine((value) => !value || value.length >= 2, "Має бути не менше 2 символів"),
  phone,
  edrpou: z
    .string()
    .optional()
    .refine((value) => !!value, required)
    .refine(
      (value) => !value || edrpouRegex.test(value.replace(/\D/g, "")),
      "ЄДРПОУ має містити 8–10 цифр",
    ),
  city: name,
  site: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^(https:\/\/|www\.)/.test(value),
      "Посилання має починатися з https:// або www.",
    ),
  taxForm: z
    .string()
    .optional()
    .refine((value) => !!value, "taxForm is a required field"),
});
export const agentProfileRequestSchema = z.preprocess(
  castRequestStrings,
  agentProfileSchema.extend({
    legalCompanyName: name,
    edrpou: text
      .transform((value) => value.replace(/\D/g, ""))
      .pipe(z.string().regex(edrpouRegex, "ЄДРПОУ має містити 8–10 цифр")),
    taxForm: z.string().min(1, "taxForm is a required field"),
    site: agentProfileSchema.shape.site.nullable(),
  }),
);
export const agencyProfileSchema = z.object({
  legalAgencyName: name,
  marketingAgencyName: z.string().optional(),
  login: text
    .min(4, "Логін має містити не менше 4 символів")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Логін може містити лише латинські літери, цифри, крапку, дефіс або нижнє підкреслення",
    ),
  agencyEdrpou: z
    .string()
    .optional()
    .refine((value) => !value || edrpouRegex.test(value), "ЄДРПОУ має містити від 8 до 10 цифр"),
  agencyCity: z.string().optional(),
  agencyLegalAddress: z.string().optional(),
  agencyEmail: email,
  agencyPhone: phone,
  mainOfficeEmail: email,
});
export const agencyProfileRequestSchema = z.preprocess(
  castRequestStrings,
  agencyProfileSchema.extend({
    marketingAgencyName: agencyProfileSchema.shape.marketingAgencyName.nullable(),
    agencyEdrpou: agencyProfileSchema.shape.agencyEdrpou.nullable(),
    agencyCity: agencyProfileSchema.shape.agencyCity.nullable(),
    agencyLegalAddress: agencyProfileSchema.shape.agencyLegalAddress.nullable(),
  }),
);
