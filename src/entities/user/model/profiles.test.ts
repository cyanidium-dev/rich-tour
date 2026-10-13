import { expect, it } from "vitest";
import { mapAgentProfile, mapAgencyProfile } from "./profiles";
it("projects agent profiles without secrets and normalizes optional site", () => {
  const profile = mapAgentProfile({
    _id: "agent",
    email: "a@test",
    companyName: "A",
    legalCompanyName: "Legal A",
    phone: "123",
    edrpou: "456",
    city: "Київ",
    site: null,
    taxForm: "fop",
    password: { plain: "secret" },
    crmId: 10,
  });
  expect(profile).toEqual({
    _id: "agent",
    email: "a@test",
    companyName: "A",
    legalCompanyName: "Legal A",
    phone: "123",
    edrpou: "456",
    city: "Київ",
    site: undefined,
    taxForm: "fop",
  });
  expect(() => mapAgentProfile({ ...profile, taxForm: "invalid" })).toThrow();
});
it("projects agency profiles without changing display values", () => {
  const profile = mapAgencyProfile({
    _id: "agency",
    legalAgencyName: "Agency",
    login: "login",
    agencyEmail: "a@test",
    agencyPhone: "123",
    mainOfficeEmail: "office@test",
    agencyCity: null,
    password: "secret",
  });
  expect(profile.agencyCity).toBeUndefined();
  expect(profile.legalAgencyName).toBe("Agency");
  expect(profile).not.toHaveProperty("password");
  expect(() => mapAgencyProfile({ ...profile, agencyPhone: 42 })).toThrow();
});

it("opens legacy agent profiles with missing legal details and tax form", () => {
  const profile = mapAgentProfile({
    _id: "agent",
    email: "a@test",
    companyName: "Company",
    legalCompanyName: null,
    phone: "123",
    edrpou: null,
    city: "Київ",
    taxForm: null,
  });
  expect(profile).toMatchObject({ legalCompanyName: "", edrpou: "", taxForm: "" });
  expect(
    mapAgentProfile({
      ...profile,
      legalCompanyName: undefined,
      edrpou: undefined,
      taxForm: undefined,
    }),
  ).toMatchObject({ legalCompanyName: "", edrpou: "", taxForm: "" });
  expect(() => mapAgentProfile({ ...profile, legalCompanyName: 123 })).toThrow();
  expect(() => mapAgentProfile({ ...profile, taxForm: "invalid" })).toThrow();
});
