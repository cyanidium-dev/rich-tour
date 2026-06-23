import { NextResponse } from "next/server";
import client from "@/lib/sanity/client";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";

export async function PATCH(req: Request) {
    const user = await getAuthUser();

    if (!user || user.role !== "agency") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();

        await client
            .patch(user.sub)
            .set({
                legalAgencyName: body.legalAgencyName,
                marketingAgencyName: body.marketingAgencyName || null,
                login: body.login,
                agencyEdrpou: body.agencyEdrpou || null,
                agencyCity: body.agencyCity || null,
                agencyLegalAddress: body.agencyLegalAddress || null,
                agencyEmail: body.agencyEmail,
                agencyPhone: body.agencyPhone,
                mainOfficeEmail: body.mainOfficeEmail,
            })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update agency profile:", error);

        return NextResponse.json(
            { error: "UPDATE_FAILED" },
            { status: 500 }
        );
    }
}
