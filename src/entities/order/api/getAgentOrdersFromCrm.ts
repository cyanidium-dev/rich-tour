import "server-only";
import { parseCrmOrdersResponse } from "../model/schema";
import axios from "axios";
import { getCrmToken } from "@/shared/api/crm-server";
const url = `${process.env.CRM_API_URL}order/get/`;
export async function getAgentOrdersFromCrm(payload: unknown) {
  const token = await getCrmToken();
  try {
    const { data } = await axios.post<unknown>(url, payload, {
      headers: { token, "Content-Type": "application/json" },
    });
    return parseCrmOrdersResponse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("CRM order request failed", {
        status: error.response?.status,
      });
    } else {
      console.error("Unknown CRM order request error");
    }
    throw error;
  }
}
