import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { ValidationError } from "yup";

import { syncAgentToCrm } from "@/lib/crm/agentSync";
import {createAgentUser, identityExists} from "@/lib/sanity/users/repository";
import { signUpValidation } from "@/schemas/signUpFormValidation";

type SignUpBody = {
    email: string;
    companyName: string;
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    taxForm: "fop" | "tov" | "other";
    password: string;
    site?: string;
    agencyCrmId?: string;
};

export async function POST(req: Request) {
    let body: SignUpBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    try {
        await signUpValidation().validate(body, { abortEarly: false });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: "VALIDATION_FAILED" }, { status: 400 });
        }
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const companyName = body.companyName?.trim();
    const legalCompanyName = body.legalCompanyName?.trim();
    const phone = body.phone?.trim();
    const edrpou = body.edrpou?.trim();
    const city = body.city?.trim();
    const taxForm = body.taxForm;
    const password = body.password;
    const site = body.site?.trim() || undefined;
    const agencyCrmId = body.agencyCrmId?.trim() || undefined;

    if (
        !email ||
        !companyName ||
        !legalCompanyName ||
        !phone ||
        !edrpou ||
        !city ||
        !taxForm ||
        !password
    ) {
        return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    const existingUser = await identityExists("agentUser", email);

    if (existingUser) {
        return NextResponse.json(
            { error: "USER_ALREADY_EXISTS" },
            { status: 409 }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const documentId = `agent.${randomUUID()}`;
    let sanityAgent;

    try {
        sanityAgent = await createAgentUser(
            documentId,
            {
                email,
                companyName,
                legalCompanyName,
                phone,
                edrpou,
                city,
                taxForm,
                site,
                agencyCrmId,
                password: {
                    plain: password,
                    hash: passwordHash,
                },
            },
            {
                isApproved: false,
                crmSync: {
                    status: "pending",
                    attempts: 0,
                    nextRetryAt: new Date().toISOString(),
                },
            }
        );
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            error.statusCode === 409
        ) {
            return NextResponse.json({ error: "USER_ALREADY_EXISTS" }, { status: 409 });
        }
        throw error;
    }

    const syncResult = await syncAgentToCrm(sanityAgent._id);

    return NextResponse.json(
        {
            success: true,
            crmSync: syncResult.status,
        },
        { status: syncResult.status === "synced" ? 201 : 202 }
    );
}
