import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client from "@/lib/sanity";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            sub: string;
            role: string;
        };

        if (payload.role !== "agent") {
            return NextResponse.json(
                { error: "FORBIDDEN" },
                { status: 403 }
            );
        }

        const body = await req.json();

        await client
            .patch(payload.sub)
            .set({
                email: body.email,
                companyName: body.companyName,
                legalCompanyName: body.legalCompanyName,
                phone: body.phone,
                city: body.city,
                site: body.site || null,
                taxForm: body.taxForm,
            })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "UPDATE_FAILED" },
            { status: 500 }
        );
    }
}
