import { postToCrm } from './utils/postToCrm'
import { mapBookingToCrmOrder } from './mapBookingToCrmOrder'

interface SendOrderParams {
    requestId: string
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
    const data = await postToCrm(payload, "order/set/")

    const orderId = data?.dataArray?.[0]

    if (!orderId) {
        throw new Error('CRM did not return order id')
    }

    return String(orderId)
}
