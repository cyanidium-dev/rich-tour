import "server-only";

import { SignJWT, jwtVerify } from "jose";

export const TOUR_PREVIEW_COOKIE = "tour_preview_session";
const issuer = "rich-tour";
const audience = "tour-preview";

export function isTourDocumentId(value: string): boolean {
  return (
    /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value) &&
    !value.startsWith("drafts.") &&
    !value.startsWith("versions.")
  );
}

function sessionSecret() {
  const value = process.env.PREVIEW_SESSION_SECRET;
  if (!value || value.length < 32)
    throw new Error("PREVIEW_SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}

export async function createTourPreviewSession(id: string, userId: string): Promise<string> {
  return new SignJWT({ docId: id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(sessionSecret());
}

export async function verifyTourPreviewSession(token: string | undefined, id: string) {
  if (!token || !isTourDocumentId(id)) return false;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), { issuer, audience });
    return payload.docId === id && typeof payload.sub === "string";
  } catch {
    return false;
  }
}
