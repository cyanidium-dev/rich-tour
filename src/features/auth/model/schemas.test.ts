import { describe, expect, it } from "vitest";
import { loginSchema, loginRequestSchema, resetPasswordSchema, signUpSchema } from "./schemas";
import { agentProfileRequestSchema, agencyProfileSchema } from "@/features/profile-edit";
export const agent = {
  email: "agent@example.com",
  companyName: "Company",
  legalCompanyName: "Legal",
  phone: "+38 (067) 123-45-67",
  edrpou: "12345678",
  city: "Kyiv",
  taxForm: "fop",
  site: "",
};
export const agency = {
  legalAgencyName: "Agency",
  login: "agency",
  agencyEmail: "agency@example.com",
  agencyPhone: agent.phone,
  mainOfficeEmail: "office@example.com",
};
describe("stage 4 validation", () => {
  it("preserves agent email and agency login, without imposing client rules on the API", () => {
    expect(loginSchema.safeParse({ email: "agency", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "a b", password: "x" }).success).toBe(false);
    expect(loginRequestSchema.parse({ email: " A B ", password: "x" }).email).toBe("a b");
  });
  it("keeps required and matching-password messages", () => {
    expect(
      resetPasswordSchema.safeParse({ password: "x", repeatPassword: "y" }).error?.issues[0]
        .message,
    ).toBe("Паролі повинні співпадати");
    expect(
      resetPasswordSchema.safeParse({ password: "", repeatPassword: "" }).error?.issues[0].message,
    ).toBe("Дане поле обов'язкове до заповнення");
  });
  it("preserves masked EDRPOU validation, stripping only for profile persistence", () => {
    const value = { ...agent, edrpou: "12 345 678" };
    expect(signUpSchema.safeParse({ ...value, password: "123456" }).success).toBe(true);
    expect(agentProfileRequestSchema.parse(value).edrpou).toBe("12345678");
  });
  it("strips profile unknown fields and keeps optional empty agency fields", () => {
    expect(
      agencyProfileSchema.parse({ ...agency, agencyEdrpou: "", password: "secret" }),
    ).not.toHaveProperty("password");
    expect(agencyProfileSchema.safeParse({ ...agency, agencyEdrpou: "123" }).success).toBe(false);
  });
  it("retains site and phone restrictions", () => {
    expect(
      signUpSchema.safeParse({ ...agent, password: "123456", site: "http://example.com" }).success,
    ).toBe(false);
    expect(
      signUpSchema.safeParse({ ...agent, password: "123456", phone: "0671234567" }).success,
    ).toBe(false);
  });
});
