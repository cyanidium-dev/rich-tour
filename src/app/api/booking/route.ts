import { NextResponse } from "next/server";
import { ValidationError } from "yup";

import { BookingRequest } from "@/contracts/booking";
import { sendOrderToCrm } from "@/lib/crm/sendOrderToCrm";
import { sendTravelersToCrm } from "@/lib/crm/sendTravelersToCrm";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { bookingValidation } from "@/schemas/bookingFormValidation";

export async function POST(req: Request) {
    let rawBody: unknown;
    try {
        rawBody = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const candidate = rawBody as Partial<BookingRequest>;
    if (!candidate.requestId || !candidate.tourId) {
        return NextResponse.json({ error: "MISSING_BOOKING_IDENTIFIERS" }, { status: 400 });
    }

    let body: BookingRequest;
    try {
        const validated = await bookingValidation().validate(candidate, {
            abortEarly: false,
        });
        body = {
            ...candidate,
            ...validated,
            requestId: candidate.requestId,
            tourId: candidate.tourId,
        } as BookingRequest;
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: "VALIDATION_FAILED", fields: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const auth = await getAuthUser();

    try {
        const crmTravelerIds = await sendTravelersToCrm(
            body.travelers,
            body.requestId
        );
        const firstTraveler = body.travelers[0];
        const crmOrderId = await sendOrderToCrm({
            requestId: body.requestId,
            tourId: body.tourId,
            crmTravelerIds,
            date: body.date,
            travelersQty: body.travelersQty,
            message: body.message,
            name: body.companyName || `${firstTraveler.name} ${firstTraveler.surname}`,
            email: body.email,
            phone: body.phone,
            crmUserId: auth?.crmId ? Number(auth.crmId) : null,
        });

        return NextResponse.json({ status: "ok", crmOrderId });
    } catch {
        return NextResponse.json(
            { error: "CRM_BOOKING_FAILED" },
            { status: 502 }
        );
    }
}
