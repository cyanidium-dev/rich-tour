import { NextRequest, NextResponse } from "next/server";

import { syncAgentToCrm } from "@/lib/crm/agentSync";

type SanityUserWebhookPayload = {
  _id?: string;
  _type?: string;
  crmLinked?: boolean;
  crmSync?: { status?: string; manualRetryRequestedAt?: string };
};

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-secret");
  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload: SanityUserWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  if (!payload._id || !payload._type) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (payload._type !== "agentUser" || payload.crmLinked) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const status = payload.crmSync?.status;
  if (status && status !== "pending") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const result = await syncAgentToCrm(payload._id);
  return NextResponse.json({ ok: true, result });
}
