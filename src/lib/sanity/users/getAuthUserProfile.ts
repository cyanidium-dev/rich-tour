import "server-only";
// lib/getAuthAgentProfile.ts
import { getAuthUser } from "./getAuthUser";
import { getAgentProfileById } from "@/entities/user/server";

import { type AgentProfile } from "@/entities/user";

export async function getAuthAgentProfile(): Promise<AgentProfile | null> {
  const auth = await getAuthUser();

  if (!auth || auth.role !== "agent") {
    return null;
  }

  return getAgentProfileById(auth.sub);
}
