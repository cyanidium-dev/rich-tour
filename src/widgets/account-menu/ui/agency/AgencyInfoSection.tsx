import type { AgencyProfile } from "@/entities/user";
import AgencyInfoFormWithNotifications from "./AgencyInfoFormWithNotifications";

export default function AgencyInfoSection({ user }: { user: AgencyProfile }) {
  return (
    <AgencyInfoFormWithNotifications
      initialData={{
        legalAgencyName: user.legalAgencyName,
        marketingAgencyName: user.marketingAgencyName ?? "",
        login: user.login,
        agencyEdrpou: user.agencyEdrpou ?? "",
        agencyCity: user.agencyCity ?? "",
        agencyLegalAddress: user.agencyLegalAddress ?? "",
        agencyEmail: user.agencyEmail,
        agencyPhone: user.agencyPhone,
        mainOfficeEmail: user.mainOfficeEmail,
      }}
    />
  );
}
