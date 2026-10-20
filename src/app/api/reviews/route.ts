import { NextResponse } from "next/server";
import { sanityClient } from "@/shared/api/server";
import { reviewValidation } from "@/schemas/reviewValidation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewValidation.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("Review submission requires SANITY_API_TOKEN");
    return NextResponse.json({ error: "Review submission unavailable" }, { status: 503 });
  }

  try {
    await sanityClient.withConfig({ token, useCdn: false }).create({
      _type: "review",
      name: parsed.data.name.trim(),
      phone: parsed.data.phone,
      text: parsed.data.message,
      verified: false,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Review submission failed:", error);
    return NextResponse.json({ error: "Review submission failed" }, { status: 503 });
  }
}
