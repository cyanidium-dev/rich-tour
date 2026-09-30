// lib/getAuthAgentProfile.ts
import { getAuthUser } from "./getAuthUser";
import {getAgentById} from "./repository";

export type AgentProfile = {
    _id: string;
    email: string;
    companyName: string;
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    site?: string;
    taxForm: "fop" | "tov" | "other";
};

export async function getAuthAgentProfile(): Promise<AgentProfile | null> {
    const auth = await getAuthUser();

    if (!auth || auth.role !== "agent") {
        return null;
    }

    const agent = await getAgentById(auth.sub);
    if (!agent) return null;

    return {
        _id: agent._id,
        email: agent.email,
        companyName: agent.companyName,
        legalCompanyName: agent.legalCompanyName,
        phone: agent.phone,
        edrpou: agent.edrpou,
        city: agent.city,
        site: agent.site ?? undefined,
        taxForm: agent.taxForm,
    };
}
