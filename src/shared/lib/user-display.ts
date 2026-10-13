export type UserDisplayFields = {
  displayName: string;
  displayIdentity: string;
};

type DisplayPayload = {
  companyName?: unknown;
  email?: unknown;
  marketingAgencyName?: unknown;
  legalAgencyName?: unknown;
  login?: unknown;
};

function nonEmptyString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getUserDisplayFields(
  type: "agentUser" | "agencyUser",
  payload: DisplayPayload,
): UserDisplayFields {
  const displayName =
    type === "agentUser"
      ? nonEmptyString(payload.companyName)
      : nonEmptyString(payload.marketingAgencyName) || nonEmptyString(payload.legalAgencyName);
  const displayIdentity = nonEmptyString(
    type === "agentUser" ? payload.email : payload.login,
  ).toLowerCase();

  if (!displayName || !displayIdentity) {
    throw new Error("User display fields are missing");
  }
  return { displayName, displayIdentity };
}
