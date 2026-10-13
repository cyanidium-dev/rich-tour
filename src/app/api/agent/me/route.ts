import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { getAgentById } from "@/lib/sanity/users/repository";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (user.role !== "agent") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const agent = await getAgentById(user.sub);

  if (!agent) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({
    email: agent.email,
    companyName: agent.companyName,
    legalCompanyName: agent.legalCompanyName,
    phone: agent.phone,
    city: agent.city,
    site: agent.site,
    taxForm: agent.taxForm,
  });
}
