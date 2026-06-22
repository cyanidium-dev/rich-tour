import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/sanity/client";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";

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
    const passwordPatch = {
        password: {
            plain: password,
            hash: passwordHash,
        },
    };
    const patch = client.patch(user.sub).set(passwordPatch);

    if (user.role === "agency") {
        patch.unset(["passwordHash"]);
    }

    await patch.commit();

    return NextResponse.json({ success: true });
}
