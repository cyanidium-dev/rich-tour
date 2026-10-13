import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { getAgencyOrders } from "@/entities/order/server";

export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "agency") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getAgencyOrders(user.sub));
  } catch {
    console.error("Failed to fetch agency orders from CRM");
    return NextResponse.json({ error: "FAILED_TO_FETCH_ORDERS" }, { status: 500 });
  }
}
