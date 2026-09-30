import { NextResponse } from "next/server";
import { ValidationError } from "yup";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {identityExists, updateAgencyUser} from "@/lib/sanity/users/repository";
import { agencyInfoValidation } from "@/schemas/agencyInfoFormValidation";

export async function PATCH(req: Request) {
    const user = await getAuthUser();

    if (!user || user.role !== "agency") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    try {
        const body = await agencyInfoValidation().validate(await req.json(), {
            abortEarly: false,
            stripUnknown: true,
        });
        const login = body.login.trim().toLowerCase();
        const duplicate = await identityExists("agencyUser", login, user.sub);
        if (duplicate) {
            return NextResponse.json({error: "LOGIN_ALREADY_EXISTS"}, {status: 409});
        }

        const updated = await updateAgencyUser(user.sub, (current) => ({
                ...current,
                legalAgencyName: body.legalAgencyName,
                marketingAgencyName: body.marketingAgencyName || null,
                login,
                agencyEdrpou: body.agencyEdrpou || null,
                agencyCity: body.agencyCity || null,
                agencyLegalAddress: body.agencyLegalAddress || null,
                agencyEmail: body.agencyEmail,
                agencyPhone: body.agencyPhone,
                mainOfficeEmail: body.mainOfficeEmail,
            }));
        if (!updated) {
            return NextResponse.json({error: "NOT_FOUND"}, {status: 404});
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({error: "VALIDATION_FAILED"}, {status: 400});
        }
        console.error("Failed to update agency profile");
        return NextResponse.json(
            { error: "UPDATE_FAILED" },
            { status: 500 }
        );
    }
}
