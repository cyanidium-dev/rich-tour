import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const secret = req.headers.get("x-sanity-secret");

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    let payload: any;

    try {
        payload = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const { _id, _type } = payload;

    if (!_id || !_type) {
        return NextResponse.json(
            { error: "Invalid payload" },
            { status: 400 }
        );
    }

    if (_type === "agentUser") {
        await handleAgent(payload);
    }

    if (_type === "agencyUser") {
        await handleAgency(payload);
    }

    return NextResponse.json({ ok: true });
}

async function handleAgent(agent: any) {
    console.log({
        type: "agentUser",
        id: agent._id,
        email: agent.email,
        phone: agent.phone,
        firstName: agent.firstName,
        lastName: agent.lastName,
    });
}

async function handleAgency(agency: any) {
    console.log({
        type: "agencyUser",
        id: agency._id,
        legalName: agency.legalAgencyName,
        marketingName: agency.marketingAgencyName,
        phone: agency.agencyPhone,
        email: agency.agencyEmail,
    });
}
