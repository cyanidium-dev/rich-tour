import { JWTPayload, SignJWT, jwtVerify } from "jose";

export type AuthUser = {
  sub: string;
  role: "agent" | "agency";
  crmId?: number | string | null;
  email?: string;
  login?: string;
};

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is required");
  return new TextEncoder().encode(value);
}

export async function createSessionToken(user: AuthUser) {
  return new SignJWT(user as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "agent" && payload.role !== "agency")
    ) {
      return null;
    }
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}
