import "server-only";
import { getAgentsByAgency } from "@/entities/user/server";
import { getCrmOrdersByClientId } from "./getCrmOrdersByClientId";

type AgencyAgent = {
  _id: string;
  companyName?: string;
  legalCompanyName?: string;
  email?: string;
  crmId?: string | number | null;
};

function getAgentLabel(agent: AgencyAgent) {
  return agent.companyName || agent.legalCompanyName || agent.email || "Агент без назви";
}

export async function getAgencyOrders(agencyId: string) {
  const agents: AgencyAgent[] = (await getAgentsByAgency(agencyId)).sort((left, right) =>
    getAgentLabel(left).localeCompare(getAgentLabel(right)),
  );
  const agentsWithCrmId = agents.filter((agent) => agent.crmId);
  const skippedAgents = agents
    .filter((agent) => !agent.crmId)
    .map((agent) => ({ id: agent._id, name: getAgentLabel(agent) }));

  const orderGroups = await Promise.all(
    agentsWithCrmId.map(async (agent) => {
      const orders = await getCrmOrdersByClientId(agent.crmId!);
      return orders.map((order) => ({
        ...order,
        agent: {
          id: agent._id,
          name: getAgentLabel(agent),
          crmId: agent.crmId,
        },
      }));
    }),
  );

  return {
    agents: agents.map((agent) => ({
      id: agent._id,
      name: getAgentLabel(agent),
      crmId: agent.crmId ?? null,
    })),
    skippedAgents,
    orders: orderGroups.flat(),
  };
}
