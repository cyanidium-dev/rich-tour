import "server-only";

import { isAxiosError } from "axios";

import crmInstance from "./crmInstance";
import { getCrmToken } from "./getCrmToken";

export async function postToCrm(payload: unknown, url: string) {
  const token = await getCrmToken();

  try {
    const { data } = await crmInstance.post(url, payload, {
      headers: { token },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("CRM request failed", {
        status: error.response?.status,
        endpoint: url,
      });
    } else {
      console.error("Unknown CRM request error", { endpoint: url });
    }
    throw error;
  }
}
