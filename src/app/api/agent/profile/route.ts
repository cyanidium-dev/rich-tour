import { NextResponse } from "next/server";
import { ValidationError } from "yup";

import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {identityExists, updateAgentUser} from "@/lib/sanity/users/repository";
import { agentInfoValidation } from "@/schemas/agentInfoFormValidation";

export async function PATCH(req: Request) {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    if (user.role !== "agent") {
        return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    try {
        const body = await agentInfoValidation().validate(await req.json(), {
            abortEarly: false,
            stripUnknown: true,
        });
        const email = body.email.trim().toLowerCase();
        const duplicate = await identityExists("agentUser", email, user.sub);
        if (duplicate) {
            return NextResponse.json({error: "EMAIL_ALREADY_EXISTS"}, {status: 409});
        }

        const updated = await updateAgentUser(user.sub, (current) => ({
            ...current,
            email,
            companyName: body.companyName,
            legalCompanyName: body.legalCompanyName,
            phone: body.phone,
            edrpou: body.edrpou,
            city: body.city,
            site: body.site || null,
            taxForm: body.taxForm as "fop" | "tov" | "other",
        }));
        if (!updated) {
            return NextResponse.json({error: "NOT_FOUND"}, {status: 404});
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({error: "VALIDATION_FAILED"}, {status: 400});
        }
        return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
    }
}
