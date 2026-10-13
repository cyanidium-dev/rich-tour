import type { AgentProfile, AgencyProfile } from "@/entities/user";

export type AccountMenuProps =
  | { user: AgentProfile; variant?: "agent" }
  | { user: AgencyProfile; variant: "agency" };
