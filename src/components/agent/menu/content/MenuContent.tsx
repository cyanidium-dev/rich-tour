"use client";

import { useSearchParams } from "next/navigation";
import OrdersContent from "./OrdersContent";
import ToursContent from "./ToursContent";
import SettingsContent from "./SettingsContent";
import ChangePasswordContent from "./ChangePasswordContent";
import AgencySettingsContent from "@/components/agency/menu/content/AgencySettingsContent";

export default function MenuContent({
  user,
  variant = "agent",
}: {
  user: any;
  variant?: "agent" | "agency";
}) {
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";
  const isAgency = variant === "agency";
  const ordersApiUrl = isAgency ? "/api/agency/tours" : "/api/agent/tours";

  switch (menu) {
    case "orders":
      return (
        <OrdersContent
          mode="active"
          variant={variant}
          apiUrl={ordersApiUrl}
        />
      );
    case "archive":
      return (
        <OrdersContent
          mode="archive"
          variant={variant}
          apiUrl={ordersApiUrl}
        />
      );
    case "tours":
      return <ToursContent />;
    case "settings":
      return isAgency ? (
        <AgencySettingsContent user={user} />
      ) : (
        <SettingsContent user={user} />
      );
    case "change-password":
      return <ChangePasswordContent />;
    case "sign-out":
      return null;
    default:
      return null;
  }
}
