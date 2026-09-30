import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {updateAgencyUser, updateAgentUser} from "@/lib/sanity/users/repository";

type Body = {
    password: string;
};

export async function POST(req: Request) {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    let body: Body;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "INVALID_BODY" },
            { status: 400 }
        );
    }

    const { password } = body;

    if (!password) {
        return NextResponse.json(
            { error: "MISSING_PASSWORD" },
            { status: 400 }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nextPassword = {
        password: {
            plain: password,
            hash: passwordHash,
        },
        passwordResetRequired: false,
    };
    const updated = user.role === "agency"
        ? await updateAgencyUser(user.sub, (current) => ({...current, ...nextPassword}))
        : await updateAgentUser(user.sub, (current) => ({...current, ...nextPassword}));

    if (!updated) {
        return NextResponse.json({error: "NOT_FOUND"}, {status: 404});
    }

    return NextResponse.json({ success: true });
}
