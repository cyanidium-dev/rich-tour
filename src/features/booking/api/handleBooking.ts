import { NextResponse } from "next/server";
import "server-only";
import type { ZodIssue } from "zod";
import { bookingRequestSchema } from "../model/requestSchema";
import { BookingRequest } from "@/contracts/booking";
import { sendOrderToCrm } from "@/lib/crm/sendOrderToCrm";
import { sendTravelersToCrm } from "@/lib/crm/sendTravelersToCrm";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { resolveBookingDeparture } from "./resolveBookingDeparture";
import { formatErrorDetails } from "@/shared/lib";

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
  const sensitiveValues = [
    body.email,
    body.phone,
    body.companyName,
    body.message,
    ...body.travelers.flatMap((traveler) => Object.values(traveler)),
    ...Object.entries(process.env)
      .filter(
        ([key]) => !key.startsWith("NEXT_PUBLIC_") && /password|token|secret|key|login/i.test(key),
      )
      .map(([, value]) => value),
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .flatMap((value) => [
      value,
      /^\d{2}\.\d{2}\.\d{4}$/.test(value) ? value.split(".").reverse().join("-") : value,
      /^\+?[\d\s()-]{10,}$/.test(value) ? value.replace(/\D/g, "") : value,
    ]);
  const failure = (error: string, stage: string, cause: unknown, status = 502) =>
    NextResponse.json(
      {
        error,
        requestId: body.requestId,
        details: `Етап: ${stage}\n${formatErrorDetails(cause, sensitiveValues)}`,
      },
      { status },
    );
  let departure;
  try {
    departure = await resolveBookingDeparture(body);
  } catch (error) {
    return failure("Не вдалося перевірити виїзд. Спробуйте ще раз.", "Перевірка виїзду", error);
  }
  if (!departure) {
    return NextResponse.json(
      {
        error:
          "Обраний виїзд недоступний або його дані змінилися. Оновіть сторінку та оберіть дату знову.",
      },
      { status: 400 },
    );
  }
  let stage = "Визначення користувача";
  let crmStarted = false;
  try {
    const auth = await getAuthUser();
    stage = "Створення туристів у CRM (включно з отриманням токена)";
    crmStarted = true;
    const crmTravelerIds = await sendTravelersToCrm(body.travelers, body.requestId);
    stage = "Створення замовлення у CRM (включно з отриманням токена)";
    const firstTraveler = body.travelers[0];
    const crmOrderId = await sendOrderToCrm({
      requestId: body.requestId,
      tourId: departure.crmNumber,
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
  } catch (error) {
    return failure(
      crmStarted ? "CRM_BOOKING_FAILED" : "BOOKING_AUTH_FAILED",
      stage,
      error,
      crmStarted ? 502 : 500,
    );
  }
}
