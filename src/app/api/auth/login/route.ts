import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "@/lib/sanity";

type LoginBody = {
    email: string;
    password: string;
};

export async function POST(req: Request) {
    let body: LoginBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    // ───────────── AGENT ─────────────
    const agentUser = await client.fetch<{
        _id: string;
        email: string;
        passwordHash: string;
    } | null>(
        `*[_type == "agentUser" && email == $email][0]{
      _id,
      email,
      passwordHash
    }`,
        { email }
    );

    if (agentUser) {
        const isValid = await bcrypt.compare(password, agentUser.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                sub: agentUser._id,
                role: "agent",
                email: agentUser.email,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({ role: "agent" });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    }

    // ───────────── AGENCY ─────────────
    const agencyUser = await client.fetch<{
        _id: string;
        login: string;
        passwordHash: string;
    } | null>(
        `*[_type == "agencyUser" && login == $login][0]{
      _id,
      login,
      passwordHash
    }`,
        { login: email }
    );

    if (agencyUser) {
        const isValid = await bcrypt.compare(password, agencyUser.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                sub: agencyUser._id,
                role: "agency",
                login: agencyUser.login,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({ role: "agency" });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    }

    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
}
