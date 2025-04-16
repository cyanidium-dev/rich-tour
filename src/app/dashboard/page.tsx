import { Suspense } from "react";
import AgentContract from "@/components/dashboard/agentContract/AgentContract";
import Hero from "@/components/dashboard/hero/Hero";
import Menu from "@/components/dashboard/menu/Menu";
import Telegram from "@/components/dashboard/telegram/Telegram";
import Loader from "@/components/shared/loader/Loader";

export default function DashboardPage() {
  return (
    <>
      <Hero />
      <AgentContract />
      <Telegram />
      <Suspense fallback={<Loader />}>
        <Menu />
      </Suspense>
    </>
  );
}
