"use client";
import OrdersContent from "./OrdersContent";
import ToursContent from "./ToursContent";
import SettingsContent from "./SettingsContent";
import ChangePasswordContent from "./ChangePasswordContent";
import { useSearchParams } from "next/navigation";

export default function MenuContent({ user }: { user: any }) {
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";

  switch (menu) {
    case "orders":
      return <OrdersContent />;
    case "archive":
      return <OrdersContent />;
    case "tours":
      return <ToursContent />;
    case "settings":
      return <SettingsContent user={user} />;
    case "change-password":
      return <ChangePasswordContent />;
    case "sign-out":
      return null;
  }
}
