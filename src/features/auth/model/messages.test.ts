import { expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
  signUpRequestSchema,
} from "./schemas";
import {
  agentProfileSchema,
  agentProfileRequestSchema,
  agencyProfileSchema,
  agencyProfileRequestSchema,
} from "@/features/profile-edit";

const agent = {
  email: "agent@example.com",
  companyName: "Company",
  legalCompanyName: "Legal",
  phone: "+38 (067) 123-45-67",
  edrpou: "12345678",
  city: "Kyiv",
  taxForm: "fop",
  site: "",
};
const agency = {
  legalAgencyName: "Agency",
  login: "agency",
  agencyEmail: "agency@example.com",
  agencyPhone: agent.phone,
  mainOfficeEmail: "office@example.com",
};

it("preserves the original Ukrainian validation messages", () => {
  const cases = [
    [loginSchema, { email: "", password: "x" }, "Дане поле обов'язкове до заповнення"],
    [loginSchema, { email: "bad login", password: "x" }, "Введіть валідний email або login"],
    [forgotPasswordSchema, { email: "invalid" }, "Введіть валідний email"],
    [resetPasswordSchema, { password: "x", repeatPassword: "y" }, "Паролі повинні співпадати"],
    [signUpSchema, { ...agent, email: "", password: "123456" }, "Обовʼязкове поле"],
    [signUpSchema, { ...agent, phone: "invalid", password: "123456" }, "Некоректний номер"],
    [signUpSchema, { ...agent, edrpou: "123", password: "123456" }, "ЄДРПОУ має містити 8–10 цифр"],
    [
      signUpSchema,
      { ...agent, site: "http://example.com", password: "123456" },
      "Посилання має починатися з https:// або www.",
    ],
    [agentProfileSchema, { ...agent, companyName: "x" }, "Має бути не менше 2 символів"],
    [agentProfileSchema, { ...agent, phone: "invalid" }, "Вкажіть правильний номер телефону"],
    [agencyProfileSchema, { ...agency, login: "abc" }, "Логін має містити не менше 4 символів"],
    [
      agencyProfileSchema,
      { ...agency, login: "bad login" },
      "Логін може містити лише латинські літери, цифри, крапку, дефіс або нижнє підкреслення",
    ],
    [
      agencyProfileSchema,
      { ...agency, agencyEdrpou: "123" },
      "ЄДРПОУ має містити від 8 до 10 цифр",
    ],
  ] as const;
  for (const [schema, value, expected] of cases) {
    const parsed = schema.safeParse(value);
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0].message).toBe(expected);
  }
});

it("accepts null in optional request fields", () => {
  expect(signUpRequestSchema.safeParse({ ...agent, password: "123456", site: null }).success).toBe(
    true,
  );
  expect(agentProfileRequestSchema.parse({ ...agent, site: null }).site).toBeNull();
  const parsed = agencyProfileRequestSchema.parse({
    ...agency,
    marketingAgencyName: null,
    agencyEdrpou: null,
    agencyCity: null,
    agencyLegalAddress: null,
    untrusted: "ignored",
  });
  expect(parsed.agencyEdrpou).toBeNull();
  expect(parsed).not.toHaveProperty("untrusted");
});

it("preserves primitive-to-string casting at the profile API boundary", () => {
  expect(agentProfileRequestSchema.parse({ ...agent, edrpou: 12345678 }).edrpou).toBe("12345678");
  expect(
    agencyProfileRequestSchema.parse({ ...agency, agencyCity: 123, marketingAgencyName: true }),
  ).toMatchObject({
    agencyCity: "123",
    marketingAgencyName: "true",
  });
  expect(agentProfileRequestSchema.safeParse({ ...agent, email: true }).success).toBe(false);
});
