import "server-only";

import crmInstance from "./crmInstance";

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

export async function getCrmToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  if (pendingToken) return pendingToken;

  pendingToken = crmInstance
    .post("token/get/", {
      login: process.env.CRM_LOGIN,
      restapipassword: process.env.CRM_REST_API_PASSWORD,
    })
    .then(({ data }) => {
      const token = data?.dataArray?.token;
      if (!token) throw new Error("CRM token not received");

      cachedToken = {
        value: token,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };
      return token;
    })
    .finally(() => {
      pendingToken = null;
    });

  return pendingToken;
}
