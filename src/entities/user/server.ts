import "server-only";
import { getAgentById, getAgencyById } from "@/lib/sanity/users/repository";
import { mapAgentProfile, mapAgencyProfile } from "./model/profiles";
export async function getAgentProfileById(id: string) {
  const user = await getAgentById(id);
  return user ? mapAgentProfile(user) : null;
}
export async function getAgencyProfileById(id: string) {
  const user = await getAgencyById(id);
  return user ? mapAgencyProfile(user) : null;
}
export { getAgentsByAgency } from "@/lib/sanity/users/repository";
