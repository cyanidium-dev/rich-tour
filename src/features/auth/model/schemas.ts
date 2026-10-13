import { z } from "zod";
import { emailRegex, phoneRegex, edrpouRegex } from "@/regex/regex";
const required = "Дане поле обов'язкове до заповнення";
const signupRequired = "Обовʼязкове поле";
const email = (message: string) =>
  z.string().min(1, message).regex(emailRegex, "Введіть валідний email");
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, required)
    .refine(
      (value) => emailRegex.test(value) || /^[a-zA-Z0-9._-]{3,}$/.test(value),
      "Введіть валідний email або login",
    ),
  password: z.string().min(1, required),
});
export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});
export const forgotPasswordSchema = z.object({ email: email(required) });
export const resetPasswordSchema = z
  .object({ password: z.string().min(1, required), repeatPassword: z.string().min(1, required) })
  .refine((value) => value.password === value.repeatPassword, {
    message: "Паролі повинні співпадати",
    path: ["repeatPassword"],
  });
export const changePasswordRequestSchema = z.object({ password: z.string().min(1) });
export const signUpSchema = z.object({
  email: email(signupRequired),
  companyName: z
    .string()
    .min(1, signupRequired)
    .min(2, "companyName must be at least 2 characters"),
  legalCompanyName: z
    .string()
    .min(1, signupRequired)
    .min(2, "legalCompanyName must be at least 2 characters"),
  phone: z.string().min(1, signupRequired).regex(phoneRegex, "Некоректний номер"),
  edrpou: z
    .string()
    .min(1, signupRequired)
    .refine((value) => edrpouRegex.test(value.replace(/\D/g, "")), "ЄДРПОУ має містити 8–10 цифр"),
  city: z.string().min(1, signupRequired).min(2, "city must be at least 2 characters"),
  taxForm: z.enum(["fop", "tov", "other"], {
    error: "taxForm must be one of the following values: fop, tov, other",
  }),
  password: z.string().min(1, signupRequired).min(6, "password must be at least 6 characters"),
  site: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^(https:\/\/|www\.)/.test(value),
      "Посилання має починатися з https:// або www.",
    ),
});
export const signUpRequestSchema = signUpSchema.extend({
  site: signUpSchema.shape.site.nullable(),
  agencyCrmId: z.string().nullish(),
});
