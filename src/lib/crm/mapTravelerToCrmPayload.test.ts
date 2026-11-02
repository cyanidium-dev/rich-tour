import { expect, it } from "vitest";
import { emptyTraveler } from "@/features/booking/model/schemas";
import { CRM_IDENTIFICATION_CODE_FIELD, mapTravelerToCrmPayload } from "./mapTravelerToCrmPayload";

it("maps the leading-zero code to the insured adult's contact", () => {
  const traveler = {
    ...emptyTraveler(),
    birthDate: "01.01.2000",
    insurance: true,
    identificationCode: "0123456781",
  };
  const contact = mapTravelerToCrmPayload(traveler, "request", 1);
  expect(contact.externalid).toBe("request:traveler:1");
  expect(contact.customfields.Identifikatsiiniikod).toBe("0123456781");
  expect(contact.customfields.Strahivka).toBe("Так");
});

it("omits codes for children, uninsured adults and empty fields", () => {
  const traveler = {
    ...emptyTraveler(),
    birthDate: "01.01.2000",
    insurance: true,
    identificationCode: "0123456781",
  };
  for (const changes of [
    { insurance: false },
    { birthDate: `01.01.${new Date().getFullYear() - 5}` },
    { identificationCode: "" },
  ]) {
    expect(
      mapTravelerToCrmPayload({ ...traveler, ...changes }, "request", 0).customfields,
    ).not.toHaveProperty(CRM_IDENTIFICATION_CODE_FIELD);
  }
});
