import "server-only";
import { loginRequestSchema } from "../model/schemas";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AuthUser, createSessionToken } from "@/lib/auth/session";
import { getAgencyByLogin, getAgentByEmail } from "@/lib/sanity/users/repository";

async function createAuthResponse(
  payload: AuthUser,
  body: Record<string, unknown>,
  rememberMe: boolean,
) {
  const token = await createSessionToken(payload);

  const response = NextResponse.json(body);

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  });

  return response;
}

export async function handleLogin(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }
  const { email, password, rememberMe = false } = parsed.data;

  // ───────────── AGENT ─────────────
  const agentUser = await getAgentByEmail(email);

  if (agentUser) {
    if (!agentUser.isApproved) {
      return NextResponse.json(
        {
          error:
            "Ваш статус агента має буди схвалений. Зверніться будь ласка до адміністрації сайту",
        },
        { status: 401 },
      );
    }

    const passwordHash = agentUser.password?.hash;

    if (!passwordHash) {
      return NextResponse.json({ error: "PASSWORD_NOT_SET" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    return createAuthResponse(
      {
        sub: agentUser._id,
        role: "agent",
        email: agentUser.email,
        crmId: agentUser.crmId,
      },
      { role: "agent" },
      rememberMe,
    );
  }

  // ───────────── AGENCY ─────────────
  const agencyUser = await getAgencyByLogin(email);

  if (agencyUser) {
    const passwordHash = agencyUser.password?.hash;

    if (!passwordHash) {
      return NextResponse.json({ error: "PASSWORD_NOT_SET" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Невірний email або пароль." }, { status: 401 });
    }

    return createAuthResponse(
      {
        sub: agencyUser._id,
        role: "agency",
        login: agencyUser.login,
      },
      { role: "agency" },
      rememberMe,
    );
  }

  return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
}
