import { getCrmToken, postToCrm } from "@/shared/api/crm-server";
import { TravelerInfo } from "@/contracts/booking";
import { mapTravelerToCrmPayload } from "./mapTravelerToCrmPayload";

export async function sendTravelersToCrm(
  travelers: TravelerInfo[],
  requestId: string,
): Promise<string[]> {
  const payload = travelers.map((traveler, index) =>
    mapTravelerToCrmPayload(traveler, requestId, index),
  );

  const data = await postToCrm(payload, "contact/set/");

  const crmIds: string[] | undefined = data?.dataArray;

  if (!crmIds || crmIds.length !== travelers.length) {
    throw new Error("CRM did not return correct travelers crmIds");
  }

  return crmIds.map(String);
}
