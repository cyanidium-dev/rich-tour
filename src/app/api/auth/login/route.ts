import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "@/lib/sanity/client";

type LoginBody = {
    email: string;
    password: string;
};

type AgentUser = {
    _id: string;
    email: string;
    password?: {
        plain?: string;
        hash?: string;
    };
    crmId?: number | string;
    isApproved?: boolean;
};

type AgencyUser = {
    _id: string;
    login: string;
    password?: {
        plain?: string;
        hash?: string;
    };
};

function createAuthResponse(
    payload: Record<string, unknown>,
    body: Record<string, unknown>
) {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    const response = NextResponse.json(body);

    response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
}

export async function POST(req: Request) {
    let body: LoginBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
        return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // ───────────── AGENT ─────────────
    const agentUser = await client.fetch<AgentUser | null>(
        `*[_type == "agentUser" && email == $email][0]{
      _id,
      email,
      password {
        hash
      },
      crmId,
      isApproved
    }`,
        { email }
    );

    if (agentUser) {
        if (!agentUser.isApproved) {
            return NextResponse.json(
                {
                    error:
                        "Ваш статус агента має буди схвалений. Зверніться будь ласка до адміністрації сайту",
                },
                { status: 401 }
            );
        }

        const passwordHash = agentUser.password?.hash;

        if (!passwordHash) {
            return NextResponse.json(
                { error: "PASSWORD_NOT_SET" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "INVALID_CREDENTIALS" },
                { status: 401 }
            );
        }

        return createAuthResponse(
            {
                sub: agentUser._id,
                role: "agent",
                email: agentUser.email,
                crmId: agentUser.crmId,
            },
            { role: "agent" }
        );
    }

    // ───────────── AGENCY ─────────────
    const agencyUser = await client.fetch<AgencyUser | null>(
        `*[_type == "agencyUser" && login == $login][0]{
      _id,
      login,
      password {
        plain,
        hash
      }
    }`,
        { login: email }
    );

    if (agencyUser) {
        const passwordHash = agencyUser.password?.hash;

        if (!passwordHash) {
            return NextResponse.json(
                { error: "PASSWORD_NOT_SET" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Невірний email або пароль." },
                { status: 401 }
            );
        }

        return createAuthResponse(
            {
                sub: agencyUser._id,
                role: "agency",
                login: agencyUser.login,
            },
            { role: "agency" }
        );
    }

    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
}
