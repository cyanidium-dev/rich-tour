import AgentInfoFormWithNotifications from "./AgentInfoFormWithNotifications";

export default function AgentInfoSection({ user }: { user: any }) {
    return (
        <AgentInfoFormWithNotifications
            initialData={{
                email: user.email,
                companyName: user.companyName,
                legalCompanyName: user.legalCompanyName,
                phone: user.phone,
                edrpou: user.edrpou,
                city: user.city,
                site: user.site ?? "",
                taxForm: user.taxForm,
            }}
        />
    );
}
