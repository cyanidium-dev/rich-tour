import { NextResponse } from "next/server";
import axios from "axios";

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

    const { _type } = payload;

    if (_type !== "tourOrder") {
        return NextResponse.json({ ok: true });
    }

    try {
        const tokenResponse = await axios.post(
            process.env.CRM_TOKEN_URL!,
            {
                login: process.env.CRM_LOGIN,
                restapipassword: process.env.CRM_REST_API_PASSWORD,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = tokenResponse.data?.token;
        if (!token) {
            throw new Error("CRM token missing");
        }

        const crmPayload = [
            {
                typesex: "person",

                name: payload.firstName,
                namelast: payload.lastName,

                findbyArray: ["phone"],

                phones: payload.phones,
                addnewphone: true,

                returnwithoutupdate: false,

                bdate: payload.birthDate,

                customfields: {
                    Pasport: payload.passportNumber,
                    Datazavershpasp: payload.passportExpiryDate,
                    Mistseposadki: payload.departureCity,
                    Strahivka: payload.insuranceRequired,
                    Platnimistsya: payload.frontSeats,
                    Pasportvigotovlyatsya: payload.passportInProgress,
                },
            },
        ];

        await axios.post(
            process.env.CRM_ORDER_SET_URL!,
            crmPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error(error);
    }

    return NextResponse.json({ ok: true });
}
