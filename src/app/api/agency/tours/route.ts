import { NextResponse } from "next/server";
import client from "@/lib/sanity/client";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
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
        const agents = await client.fetch<AgencyAgent[]>(
            `*[_type == "agentUser" && references($agencyId)]{
                _id,
                companyName,
                legalCompanyName,
                email,
                crmId
            } | order(companyName asc)`,
            { agencyId: user.sub }
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
    } catch (error) {
        console.error("Failed to fetch agency orders from CRM:", error);

        return NextResponse.json(
            { error: "FAILED_TO_FETCH_ORDERS" },
            { status: 500 }
        );
    }
}
