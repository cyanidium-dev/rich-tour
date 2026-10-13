import type { z } from "zod";
import type { agentProfileDataSchema, agencyProfileDataSchema } from "./profiles";

export type AgentProfile = z.output<typeof agentProfileDataSchema>;
export type AgencyProfile = z.output<typeof agencyProfileDataSchema>;
