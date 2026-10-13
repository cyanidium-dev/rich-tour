"use client";
import type { AccountMenuProps } from "../../model/types";

import { useSearchParams } from "next/navigation";
import { OrdersWorkspace as OrdersContent } from "@/widgets/orders-workspace";
import SettingsContent from "./SettingsContent";
import ChangePasswordContent from "./ChangePasswordContent";
import AgencySettingsContent from "@/widgets/account-menu/ui/agency/AgencySettingsContent";

export default function MenuContent(props: AccountMenuProps) {
  const variant = props.variant ?? "agent";
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";
  const isAgency = variant === "agency";
  const ordersApiUrl = isAgency ? "/api/agency/tours" : "/api/agent/tours";

  switch (menu) {
    case "orders":
      return <OrdersContent mode="active" variant={variant} apiUrl={ordersApiUrl} />;
    case "archive":
      return <OrdersContent mode="archive" variant={variant} apiUrl={ordersApiUrl} />;
    case "settings":
      return props.variant === "agency" ? (
        <AgencySettingsContent user={props.user} />
      ) : (
        <SettingsContent user={props.user} />
      );
    case "change-password":
      return <ChangePasswordContent />;
    case "sign-out":
      return null;
    default:
      return null;
  }
}
