import { describe, expect, it } from "vitest";
import { getUserDisplayFields } from "./user-display";

describe("public user labels", () => {
  it("uses the agent company and normalized email", () => {
    expect(
      getUserDisplayFields("agentUser", {
        companyName: "  Travel Company  ",
        email: "  Agent@Example.COM  ",
      }),
    ).toEqual({ displayName: "Travel Company", displayIdentity: "agent@example.com" });
  });

  it("uses the marketing agency name, then the legal name", () => {
    expect(
      getUserDisplayFields("agencyUser", {
        marketingAgencyName: "  Travel Brand  ",
        legalAgencyName: "Legal Agency",
        login: "  Agency.LOGIN  ",
      }),
    ).toEqual({ displayName: "Travel Brand", displayIdentity: "agency.login" });
    expect(
      getUserDisplayFields("agencyUser", {
        marketingAgencyName: "  ",
        legalAgencyName: "  Legal Agency  ",
        login: "agency",
      }),
    ).toEqual({ displayName: "Legal Agency", displayIdentity: "agency" });
  });

  it("rejects records that cannot have a meaningful list label", () => {
    expect(() => getUserDisplayFields("agentUser", { companyName: "", email: "a@b.c" })).toThrow();
    expect(() => getUserDisplayFields("agencyUser", { legalAgencyName: "Agency" })).toThrow();
  });
});
