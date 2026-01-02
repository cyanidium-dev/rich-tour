import { Suspense } from "react";
import AgentContract from "@/components/agent/agentContract/AgentContract";
import Hero from "@/components/agent/hero/Hero";
import Menu from "@/components/agent/menu/Menu";
// import Telegram from "@/components/agent/telegram/Telegram";
import Loader from "@/components/shared/loader/Loader";

export default function DashboardPage() {
  return (
    <>
      <Hero />
      <AgentContract />
      {/*<Telegram />*/}
      <Suspense fallback={<Loader />}>
        <Menu />
      </Suspense>
    </>
  );
}
