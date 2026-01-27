import axios from 'axios';

import {getCrmToken} from "@/lib/crm/utils/getCrmToken";

const url = `${process.env.CRM_API_URL}order/get/`;

export async function getAgentOrdersFromCrm(
    payload: any
) {
    const token = await getCrmToken();

    try {
        const {data} = await axios.post(url, payload, {
            headers: {
                token,
                'Content-Type': 'application/json',
            },
        });
        return data.dataArray;
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
