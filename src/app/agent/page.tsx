import { getAuthAgentProfile } from "@/lib/sanity/users/getAuthUserProfile";
import AgentContract from "@/components/agent/agentContract/AgentContract";
import Hero from "@/components/agent/hero/Hero";
import Menu from "@/components/agent/menu/Menu";

export default async function DashboardPage() {
    const user = await getAuthAgentProfile();

    if (!user) {
        return null;
    }
    console.log(user)
    return (
        <>
            <Hero />
            <AgentContract />
            <Menu user={user} />
        </>
    );
}
