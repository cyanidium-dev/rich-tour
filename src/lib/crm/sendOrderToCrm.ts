// import { getCrmToken } from './utils/getCrmToken'
// import { postOrderToCrm } from './postOrderToCrm'
import { postToCrm } from './utils/postToCrm'
import { mapBookingToCrmOrder } from './mapBookingToCrmOrder'

interface SendOrderParams {
    tourId: string | number
    crmTravelerIds: string[]
    date: string
    travelersQty: number
    message?: string
    crmUserId?: number | null;
    name: string;
    email: string;
    phone: string;
}

export async function sendOrderToCrm(params: SendOrderParams) {
    const payload = mapBookingToCrmOrder(params)
    // console.log("order to CRM", JSON.stringify(payload, null, 2));
    const data = await postToCrm(payload, "order/set/")

    const orderId = data?.dataArray?.[0]

    if (!orderId) {
        throw new Error('CRM did not return order id')
    }

    return String(orderId)
}
