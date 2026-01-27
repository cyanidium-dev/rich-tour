import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client from "@/lib/sanity/client";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            sub: string;
            role: string;
        };

        if (payload.role !== "agent") {
            return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
        }

        const agent = await client.fetch(
            `*[_type == "agentUser" && _id == $id][0]{
        email,
        companyName,
        legalCompanyName,
        phone,
        city,
        site,
        taxForm
      }`,
            { id: payload.sub }
        );

        if (!agent) {
            return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
        }

        return NextResponse.json(agent);
    } catch {
        return NextResponse.json({ error: "FAILED" }, { status: 500 });
    }
}
