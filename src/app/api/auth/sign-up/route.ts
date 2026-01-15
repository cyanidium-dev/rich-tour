import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import client from "@/lib/sanity"

import { getCrmToken } from "@/lib/crm/getCrmToken"
import { sendAgentToCrm } from "@/lib/crm/sendAgentToCrm"
import { updateAgentCrmId } from "@/lib/crm/updateAgentCrmId"

type SignUpBody = {
    email: string
    companyName: string
    legalCompanyName: string
    phone: string
    edrpou: string
    city: string
    taxForm: "fop" | "tov" | "other"
    password: string
    site?: string
    agencyCrmId?: string
}

export async function POST(req: Request) {
    let body: SignUpBody

    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })
    }

    const {
        email,
        companyName,
        legalCompanyName,
        phone,
        edrpou,
        city,
        taxForm,
        password,
        site,
        agencyCrmId,
    } = body

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
        return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 })
    }

    // 🔍 проверка существования
    const existingUser = await client.fetch(
        `*[_type == "agentUser" && email == $email][0]{ _id }`,
        { email }
    )

    if (existingUser) {
        return NextResponse.json(
            { error: "USER_ALREADY_EXISTS" },
            { status: 409 }
        )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // 🧾 1. создаём агента в Sanity
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
        passwordHash,
    })

    try {
        // 🔐 2. CRM
        const token = await getCrmToken()

        const crmId = await sendAgentToCrm({
            token,
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
        })

        // 🧷 3. сохраняем crmId в Sanity
        await updateAgentCrmId(sanityAgent._id, crmId)

        return NextResponse.json(
            {
                success: true,
                sanityId: sanityAgent._id,
                crmId,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("❌ CRM error during signup → rollback", {
            error: error?.message,
        })

        // 🔥 откат
        await client.delete(sanityAgent._id)

        return NextResponse.json(
            {
                error: "CRM_REGISTRATION_FAILED",
            },
            { status: 502 }
        )
    }
}
