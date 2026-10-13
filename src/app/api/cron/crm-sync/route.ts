import { NextRequest, NextResponse } from "next/server";

import { AgentSyncResult, findAgentsReadyForSync, syncAgentToCrm } from "@/lib/crm/agentSync";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const agents = await findAgentsReadyForSync(20);
  const results: Array<{ agentId: string } & AgentSyncResult> = [];

  for (const agent of agents) {
    results.push({ agentId: agent._id, ...(await syncAgentToCrm(agent._id)) });
  }

  return NextResponse.json({ processed: results.length, results });
}
