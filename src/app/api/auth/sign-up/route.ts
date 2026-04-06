import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import client from "@/lib/sanity/client";

import { sendAgentToCrm } from "@/lib/crm/users/sendAgentToCrm";
// import { updateAgentCrmId } from "@/lib/sanity/users/updateAgentCrmId";

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

    const email = body.email?.trim();
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

    const existingUser = await client.fetch<{ _id: string } | null>(
        `*[_type == "agentUser" && email == $email][0]{ _id }`,
        { email }
    );

    if (existingUser) {
        return NextResponse.json(
            { error: "USER_ALREADY_EXISTS" },
            { status: 409 }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const sanityAgent = await client.create({
        _type: "agentUser",
        email,
        companyName,
        legalCompanyName,
        phone,
        edrpou,
        city,
        taxForm,
        site,
        agencyCrmId,
        isApproved: false,
        password: {
            plain: password,
            hash: passwordHash,
        },
    });

    try {
        const crmId = await sendAgentToCrm({
            externalId: sanityAgent._id,
            fullName: companyName,
            agencyCrmId: agencyCrmId ? Number(agencyCrmId) : undefined,
            phone,
            email,
            website: site,
            license: edrpou,
            city,
            taxForm,
            legalCompanyName,
        });

        await client.patch(sanityAgent._id).set({ crmId }).commit();

        return NextResponse.json(
            {
                success: true,
                sanityId: sanityAgent._id,
                crmId,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("❌ CRM error during signup → rollback", {
            error: error?.message,
        });

        await client.delete(sanityAgent._id);

        return NextResponse.json(
            {
                error: "CRM_REGISTRATION_FAILED",
            },
            { status: 502 }
        );
    }
}
