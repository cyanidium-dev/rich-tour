import { redirect } from "next/navigation";
import { getAuthAgencyProfile } from "@/lib/sanity/users/getAuthAgencyProfile";
import { AgencyOverview } from "@/widgets/account-overview";
import { AccountMenu } from "@/widgets/account-menu";

export default async function AgencyDashboardPage() {
  const user = await getAuthAgencyProfile();
  if (!user) redirect("/auth/sign-in");

  return (
    <>
      <AgencyOverview />
      <AccountMenu user={user} variant="agency" />
    </>
  );
}
