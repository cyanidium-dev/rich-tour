import "server-only";
import { getAuthUser } from "./getAuthUser";
import { getAgencyProfileById } from "@/entities/user/server";

import { type AgencyProfile } from "@/entities/user";

export async function getAuthAgencyProfile(): Promise<AgencyProfile | null> {
  const auth = await getAuthUser();

  if (!auth || auth.role !== "agency") {
    return null;
  }

  return getAgencyProfileById(auth.sub);
}
