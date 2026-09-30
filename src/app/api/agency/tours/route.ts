import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import {getAgentsByAgency} from "@/lib/sanity/users/repository";
import { getCrmOrdersByClientId } from "@/lib/crm/getCrmOrdersByClientId";

type AgencyAgent = {
    _id: string;
    companyName?: string;
    legalCompanyName?: string;
    email?: string;
    crmId?: string | number | null;
};

function getAgentLabel(agent: AgencyAgent) {
    return (
        agent.companyName ||
        agent.legalCompanyName ||
        agent.email ||
        "Агент без назви"
    );
}

export async function GET() {
    const user = await getAuthUser();

    if (!user || user.role !== "agency") {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        );
    }

    try {
        const agents: AgencyAgent[] = (await getAgentsByAgency(user.sub)).sort((left, right) =>
            getAgentLabel(left).localeCompare(getAgentLabel(right))
        );

        const agentsWithCrmId = agents.filter((agent) => agent.crmId);
        const skippedAgents = agents
            .filter((agent) => !agent.crmId)
            .map((agent) => ({
                id: agent._id,
                name: getAgentLabel(agent),
            }));

        const orderGroups = await Promise.all(
            agentsWithCrmId.map(async (agent) => {
                const orders = await getCrmOrdersByClientId(agent.crmId!);
                const agentLabel = getAgentLabel(agent);

                return orders.map((order) => ({
                    ...order,
                    agent: {
                        id: agent._id,
                        name: agentLabel,
                        crmId: agent.crmId,
                    },
                }));
            })
        );

        return NextResponse.json({
            agents: agents.map((agent) => ({
                id: agent._id,
                name: getAgentLabel(agent),
                crmId: agent.crmId ?? null,
            })),
            skippedAgents,
            orders: orderGroups.flat(),
        });
    } catch {
        console.error("Failed to fetch agency orders from CRM");
        return NextResponse.json(
            { error: "FAILED_TO_FETCH_ORDERS" },
            { status: 500 }
        );
    }
}
