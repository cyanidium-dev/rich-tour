import axios from "axios";

import { getCrmToken } from "@/lib/crm/utils/getCrmToken";

const url = `${process.env.CRM_API_URL}order/get/`;

export async function getAgentOrdersFromCrm(payload: unknown) {
    const token = await getCrmToken();

    try {
        const { data } = await axios.post(url, payload, {
            headers: { token, "Content-Type": "application/json" },
        });
        return data.dataArray;
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
