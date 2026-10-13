import { redirect } from "next/navigation";
import { getAuthAgentProfile } from "@/lib/sanity/users/getAuthUserProfile";
import { AgentOverview } from "@/widgets/account-overview/server";
import { AccountMenu } from "@/widgets/account-menu";

export default async function DashboardPage() {
  const user = await getAuthAgentProfile();
  if (!user) redirect("/auth/sign-in");

  return (
    <>
      <AgentOverview user={user} />
      <AccountMenu user={user} />
    </>
  );
}
