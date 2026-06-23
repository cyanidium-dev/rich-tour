import { redirect } from "next/navigation";
import AgencyHero from "@/components/agency/hero/Hero";
import Menu from "@/components/agent/menu/Menu";
import { getAuthAgencyProfile } from "@/lib/sanity/users/getAuthAgencyProfile";

export default async function AgencyDashboardPage() {
    const user = await getAuthAgencyProfile();

    if (!user) {
        redirect("/auth/sign-in");
    }

    return (
        <>
            <AgencyHero />
            <Menu user={user} variant="agency" />
        </>
    );
}
