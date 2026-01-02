import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/sanity";

type LoginBody = {
    email?: string; // тут может быть login агенции ИЛИ email агента
    password?: string;
};

type SuccessResponse = {
    role: "agency" | "agent";
    userId: string;
    redirectTo: "/agency" | "/agent";
};

type ErrorResponse = {
    error: "MISSING_CREDENTIALS" | "INVALID_CREDENTIALS" | "USER_NOT_FOUND";
};

export async function POST(req: Request) {
    let body: LoginBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json<ErrorResponse>(
            { error: "MISSING_CREDENTIALS" },
            { status: 400 }
        );
    }

    const identifier = (body.email ?? "").trim();
    const password = body.password ?? "";

    if (!identifier || !password) {
        return NextResponse.json<ErrorResponse>(
            { error: "MISSING_CREDENTIALS" },
            { status: 400 }
        );
    }

    // 1) Пробуем агенцию по login
    const agencyUser = await client.fetch<{
        _id: string;
        login: string;
        passwordHash?: string;
    } | null>(
        `*[_type == "agencyUser" && login == $login][0]{
      _id,
      login,
      passwordHash
    }`,
        { login: identifier }
    );

    if (agencyUser?.passwordHash) {
        const ok = await bcrypt.compare(password, agencyUser.passwordHash);

        if (!ok) {
            // безопаснее возвращать одинаковую ошибку
            return NextResponse.json<ErrorResponse>(
                { error: "INVALID_CREDENTIALS" },
                { status: 401 }
            );
        }

        return NextResponse.json<SuccessResponse>({
            role: "agency",
            userId: agencyUser._id,
            redirectTo: "/agency",
        });
    }

    // 2) Пробуем агента по email
    const agentUser = await client.fetch<{
        _id: string;
        email: string;
        passwordHash?: string;
    } | null>(
        `*[_type == "agentUser" && email == $email][0]{
      _id,
      email,
      passwordHash
    }`,
        { email: identifier }
    );

    if (agentUser?.passwordHash) {
        const ok = await bcrypt.compare(password, agentUser.passwordHash);

        if (!ok) {
            return NextResponse.json<ErrorResponse>(
                { error: "INVALID_CREDENTIALS" },
                { status: 401 }
            );
        }

        return NextResponse.json<SuccessResponse>({
            role: "agent",
            userId: agentUser._id,
            redirectTo: "/agent",
        });
    }

    return NextResponse.json<ErrorResponse>(
        { error: "USER_NOT_FOUND" },
        { status: 404 }
    );
}
