import {isAxiosError} from "axios";

import crmInstance from "@/lib/crm/utils/crmInstance";
import {getCrmToken} from "@/lib/crm/utils/getCrmToken";

export async function postToCrm(
    payload: any,
    url: string,
) {
    const token = await getCrmToken();
    try {
        const {data} = await crmInstance.post(url, payload, {
            headers: {
                token,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error('❌ CRM ERROR STATUS:', error.response?.status)
            console.error('❌ CRM ERROR DATA:', error.response?.data)
            console.error('❌ CRM ERROR HEADERS:', error.response?.headers)
            console.error('❌ CRM REQUEST PAYLOAD:', JSON.stringify(payload, null, 2))
        } else {
            console.error('❌ UNKNOWN ERROR:', error)
        }

        throw error
    }
}
