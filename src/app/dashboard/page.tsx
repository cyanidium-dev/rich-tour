import AgentContract from "@/components/dashboard/agentContract/AgentContract";
import Hero from "@/components/dashboard/hero/Hero";
import Telegram from "@/components/dashboard/telegram/Telegram";

export default function DashboardPage() {
  return (
    <>
      <Hero />
      <AgentContract />
      <Telegram />
    </>
  );
}
