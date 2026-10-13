export type { EncryptedUserPayload as EncryptedPayload } from "../../src/shared/lib/user-encryption.ts";
import type { EncryptedUserPayload as EncryptedPayload } from "../../src/shared/lib/user-encryption.ts";

// Fields read by the operational scripts; other profile fields are copied verbatim.
export type UserPayload = {
  email?: string;
  login?: string;
  password?: { plain?: string; hash?: string };
  passwordResetRequired?: boolean;
  crmId?: unknown;
  [key: string]: unknown;
};

export type CrmSync = { lastErrorMessage?: unknown; [key: string]: unknown };
export type UserDocument = UserPayload & {
  _id: string;
  _rev?: string;
  _type: string;
  passwordHash?: string;
  encryptedPayload?: EncryptedPayload;
  identityLookup?: string;
  displayName?: string;
  displayIdentity?: string;
  isApproved?: boolean;
  agency?: unknown;
  crmLinked?: boolean;
  crmSync?: CrmSync;
};
