import "server-only";

import {
    createCipheriv,
    createDecipheriv,
    createHmac,
    hkdfSync,
    randomBytes,
} from "node:crypto";

export const USER_PAYLOAD_VERSION = 1 as const;

export type EncryptedUserPayload = {
    _type: "encryptedUserPayload";
    version: typeof USER_PAYLOAD_VERSION;
    iv: string;
    ciphertext: string;
    tag: string;
};

const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const KEY_SALT = Buffer.from("rich-tour/users-production/v1", "utf8");

let cachedKeys: {encryption: Buffer; lookup: Buffer} | undefined;

function readMasterKey() {
    const encoded = process.env.USER_DATA_MASTER_KEY?.trim();

    if (!encoded) {
        throw new Error("USER_DATA_MASTER_KEY is required for encrypted user data");
    }

    const key = Buffer.from(encoded, "base64");
    if (key.length !== KEY_LENGTH) {
        throw new Error("USER_DATA_MASTER_KEY must be a base64-encoded 32-byte key");
    }

    return key;
}

function getKeys() {
    if (cachedKeys) return cachedKeys;

    const master = readMasterKey();
    cachedKeys = {
        encryption: Buffer.from(
            hkdfSync("sha256", master, KEY_SALT, "payload-encryption", KEY_LENGTH)
        ),
        lookup: Buffer.from(
            hkdfSync("sha256", master, KEY_SALT, "identity-lookup", KEY_LENGTH)
        ),
    };

    return cachedKeys;
}

export function normalizeUserIdentity(value: string) {
    return value.trim().toLowerCase();
}

export function getUserIdentityLookup(identity: string) {
    const {lookup} = getKeys();
    return createHmac("sha256", lookup)
        .update(normalizeUserIdentity(identity), "utf8")
        .digest("hex");
}

function publishedId(documentId: string) {
    return documentId.replace(/^drafts\./, "");
}

function getAdditionalData(documentId: string, documentType: string) {
    return Buffer.from(
        `rich-tour-user:${USER_PAYLOAD_VERSION}:${publishedId(documentId)}:${documentType}`,
        "utf8"
    );
}

export function encryptUserPayload<T extends object>(
    documentId: string,
    documentType: "agentUser" | "agencyUser",
    payload: T
): EncryptedUserPayload {
    const {encryption} = getKeys();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv("aes-256-gcm", encryption, iv);
    cipher.setAAD(getAdditionalData(documentId, documentType));

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

export function decryptUserPayload<T extends object>(
    documentId: string,
    documentType: "agentUser" | "agencyUser",
    envelope: EncryptedUserPayload
): T {
    if (envelope.version !== USER_PAYLOAD_VERSION) {
        throw new Error(`Unsupported encrypted user payload version: ${envelope.version}`);
    }

    const {encryption} = getKeys();
    const decipher = createDecipheriv(
        "aes-256-gcm",
        encryption,
        Buffer.from(envelope.iv, "base64")
    );
    decipher.setAAD(getAdditionalData(documentId, documentType));
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));

    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(envelope.ciphertext, "base64")),
        decipher.final(),
    ]).toString("utf8");

    return JSON.parse(plaintext) as T;
}
