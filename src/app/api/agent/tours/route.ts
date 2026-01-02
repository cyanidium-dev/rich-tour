import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "agent") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    const crmTokenRes = await axios.post(
        process.env.CRM_TOKEN_URL!,
        {
            login: process.env.CRM_LOGIN,
            restapipassword: process.env.CRM_REST_API_PASSWORD,
        }
    );

    const token = crmTokenRes.data?.token;

    if (!token) {
        return NextResponse.json(
            { error: "CRM_AUTH_FAILED" },
            { status: 500 }
        );
    }

    const toursRes = await axios.post(
        process.env.CRM_ORDER_SET_URL!,
        {
            agentExternalId: user.sub,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const tours = toursRes.data?.orders || [];

    return NextResponse.json({ tours });
}
