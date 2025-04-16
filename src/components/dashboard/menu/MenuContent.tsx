"use client";
import OrdersContent from "./ordersContent/OrdersContent";
import ToursContent from "./ordersContent/ToursContent";
import SettingsContent from "./SettingsContent";
import ChangePasswordContent from "./ChangePasswordContent";
import { useSearchParams } from "next/navigation";

export default function MenuContent() {
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";

  switch (menu) {
    case "orders":
      return <OrdersContent />;
    case "tours":
      return <ToursContent />;
    case "settings":
      return <SettingsContent />;
    case "change-password":
      return <ChangePasswordContent />;
    case "sign-out":
      return <div>redirect</div>;
  }
}
