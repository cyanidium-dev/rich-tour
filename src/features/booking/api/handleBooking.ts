import { NextResponse } from "next/server";
import "server-only";
import type { ZodIssue } from "zod";
import { bookingRequestSchema } from "../model/requestSchema";
import { BookingRequest } from "@/contracts/booking";
import { sendOrderToCrm } from "@/lib/crm/sendOrderToCrm";
import { sendTravelersToCrm } from "@/lib/crm/sendTravelersToCrm";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";

// Preserve the original order: nested phone errors before contact errors,
// then grouped the remaining traveler fields in this order.
function issueOrder(issue: ZodIssue): number {
  const [field, index, travelerField] = issue.path;
  if (field === "date") return 0;
  if (field === "travelersQty") return 1;
  if (field === "email") return 2;
  if (field === "travelers" && travelerField === "phone") return 3;
  if (field === "phone") return 4;
  if (field === "message") return 5;
  if (field === "travelers" && typeof index === "number") {
    const travelerOrder: Record<string, number> = {
      surname: 0,
      name: 1,
      passportExpiration: 2,
      passport: 3,
      birthDate: 4,
      boardingCity: 5,
    };
    return 6 + index * 7 + (travelerOrder[String(travelerField)] ?? 6);
  }
  if (field === "travelers") return 10000;
  return 10001;
}

function bookingValidationFields(issues: ZodIssue[]) {
  return [...issues]
    .sort((left, right) => issueOrder(left) - issueOrder(right))
    .map((issue) => issue.message);
}

export async function POST(req: Request) {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  const candidate = rawBody as Partial<BookingRequest>;
  if (!candidate.requestId || !candidate.tourId) {
    return NextResponse.json({ error: "MISSING_BOOKING_IDENTIFIERS" }, { status: 400 });
  }
  const result = bookingRequestSchema.safeParse(candidate);
  if (!result.success) {
    return NextResponse.json(
      { error: "VALIDATION_FAILED", fields: bookingValidationFields(result.error.issues) },
      { status: 400 },
    );
  }
  const body = result.data as BookingRequest;
  const auth = await getAuthUser();
  try {
    const crmTravelerIds = await sendTravelersToCrm(body.travelers, body.requestId);
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
    return NextResponse.json({ error: "CRM_BOOKING_FAILED" }, { status: 502 });
  }
}
