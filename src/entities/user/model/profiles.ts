import { z } from "zod";
const optional = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);
const emptyWhenMissing = z
  .string()
  .nullish()
  .transform((value) => value ?? "");
export const agentProfileDataSchema = z.object({
  _id: z.string(),
  email: z.string(),
  companyName: z.string(),
  legalCompanyName: emptyWhenMissing,
  phone: z.string(),
  edrpou: emptyWhenMissing,
  city: z.string(),
  site: optional,
  taxForm: z
    .enum(["fop", "tov", "other"])
    .nullish()
    .transform((value) => value ?? ""),
});
export const agencyProfileDataSchema = z.object({
  _id: z.string(),
  legalAgencyName: z.string(),
  marketingAgencyName: optional,
  login: z.string(),
  agencyEdrpou: optional,
  agencyCity: optional,
  agencyLegalAddress: optional,
  agencyEmail: z.string(),
  agencyPhone: z.string(),
  mainOfficeEmail: z.string(),
});
export const mapAgentProfile = (value: unknown) => agentProfileDataSchema.parse(value);
export const mapAgencyProfile = (value: unknown) => agencyProfileDataSchema.parse(value);
