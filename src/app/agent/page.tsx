import { getAuthAgentProfile } from "@/lib/sanity/users/getAuthUserProfile";
import AgentContract from "@/components/agent/agentContract/AgentContract";
import Hero from "@/components/agent/hero/Hero";
import Menu from "@/components/agent/menu/Menu";

const getExistProperties = user => {
    const result: string[] = [];
    if(!user.legalCompanyName) {
        result.push("Юридичну назву фірми");
    }
    if(!user.edrpou) {
        result.push("ЄДРПОУ");
    }
    if(!user.taxForm) {
        result.push("Форму оподактування");
    }
    return result;
}

export default async function DashboardPage() {
    const user = await getAuthAgentProfile();

    if (!user) {
        return null;
    }
    const existProperties = getExistProperties(user);
    return (
        <>
            <Hero existProperties={existProperties} />
            <AgentContract />
            <Menu user={user} />
        </>
    );
}
