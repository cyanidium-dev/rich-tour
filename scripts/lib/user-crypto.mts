import type { EncryptedPayload, UserPayload } from "./user-types.mts";
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from "node:crypto";

export const USER_PAYLOAD_VERSION = 1;
const KEY_LENGTH = 32;
const KEY_SALT = Buffer.from("rich-tour/users-production/v1", "utf8");

function readMasterKey() {
  const encoded = process.env.USER_DATA_MASTER_KEY?.trim();
  if (!encoded) throw new Error("USER_DATA_MASTER_KEY is required");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error("USER_DATA_MASTER_KEY must be a base64-encoded 32-byte key");
  }
  return key;
}

const masterKey = readMasterKey();
const encryptionKey = Buffer.from(
  hkdfSync("sha256", masterKey, KEY_SALT, "payload-encryption", KEY_LENGTH),
);
const lookupKey = Buffer.from(
  hkdfSync("sha256", masterKey, KEY_SALT, "identity-lookup", KEY_LENGTH),
);

export const normalizeIdentity = (value: string) => value.trim().toLowerCase();
export const getIdentityLookup = (identity: string) =>
  createHmac("sha256", lookupKey).update(normalizeIdentity(identity), "utf8").digest("hex");

const publishedId = (documentId: string) => documentId.replace(/^drafts\./, "");
const getAad = (documentId: string, documentType: string) =>
  Buffer.from(
    `rich-tour-user:${USER_PAYLOAD_VERSION}:${publishedId(documentId)}:${documentType}`,
    "utf8",
  );

export function encryptPayload(
  documentId: string,
  documentType: string,
  payload: UserPayload,
): EncryptedPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv);
  cipher.setAAD(getAad(documentId, documentType));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return {
    _type: "encryptedUserPayload",
    version: USER_PAYLOAD_VERSION,
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptPayload(
  documentId: string,
  documentType: string,
  envelope: EncryptedPayload | undefined,
): UserPayload {
  if (envelope?.version !== USER_PAYLOAD_VERSION) {
    throw new Error("Unsupported encrypted user payload version");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey,
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAAD(getAad(documentId, documentType));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8"),
  ) as UserPayload;
}
