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

    const { _id, _type } = payload;

    if (!_id || _type !== "tour") {
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
                externalid: payload.externalId,
                witheditevents: true,
                workflowid: "6",
                statusid: "43",
                client: {
                    externalid: payload.clientCrmId,
                    findbyArray: ["externalid"],
                },
                customfields: {
                    Nazvaturu: payload.title,
                    Tarif: payload.tariff,
                    TSinadlyaagentu: payload.agentPrice,
                    Komisiyaagenta: payload.agentCommissionValue,
                    Tipkomisidlyaagenta: payload.agentCommissionType,
                    aktsiya: payload.promo,
                    Garantovaniivizd: payload.guaranteedDeparture,
                    Garyachiitur: payload.hotTour,
                    Diznizhka: payload.discountActive,
                    Nayavnistmists: payload.availablePlaces,
                    Slug: payload.slug,
                    Dataturut: payload.startDate,
                    Datazakinchennyaturu: payload.endDate,
                    Programaturu: payload.programPdf,
                    Zobrazhennya1: payload.gallery,
                    Perevagituru: payload.advantages,
                    Marshrutturu: payload.route,
                    Dodatkovidani: payload.additionalConditions,
                    SCHovhoditvvartistturu: payload.included,
                    SCHonevhoditvvartistturu: payload.notIncluded,
                    Goteleks1: payload.hotel1,
                    Goteleks2: payload.hotel2,
                    Goteleks3: payload.hotel3,
                    Goteleks4: payload.hotel4,
                    Goteleks5: payload.hotel5,
                    Goteleks6: payload.hotel6,
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
