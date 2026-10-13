import type { AgentProfile } from "@/entities/user";
import Hero from "./agent/Hero";
import AgentContract from "./contract/AgentContract";

export default function AgentOverview({ user }: { user: AgentProfile }) {
  const missingProperties: string[] = [];
  if (!user.legalCompanyName) missingProperties.push("Юридичну назву фірми");
  if (!user.edrpou) missingProperties.push("ЄДРПОУ");
  if (!user.taxForm) missingProperties.push("Форму оподактування");

  return (
    <>
      <Hero existProperties={missingProperties} />
      <AgentContract />
    </>
  );
}
