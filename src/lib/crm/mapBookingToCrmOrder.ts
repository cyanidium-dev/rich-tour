import { generateUuid } from '@/lib/utils/generateUuid'
import { toCrmDate } from '@/lib/crm/utils/helpers'

interface MapBookingParams {
    tourId: number | string
    crmTravelerIds: string[]
    date: string
    travelersQty: number
    message?: string
    crmUserId?: number | null;
    name: string;
    email: string;
    phone: string;
}

export function mapBookingToCrmOrder({
                                         tourId,
                                         crmTravelerIds,
                                         date,
                                         travelersQty,
                                         message,
                                         crmUserId,
                                         name,
                                        email,
                                        phone,
                                     }: MapBookingParams) {
    const order: any = {
        externalid: generateUuid(),
        witheditevents: true,
        workflowid: '5',
        statusid: '35',
        parentid: Number(tourId),
        sourceid: crmUserId ? 2 : 1,
        client: {
            name,
            emails: [email],
            phones: [phone],
        },

        ordercontacts: crmTravelerIds.map((id) => ({
            id: Number(id),
        })),

        customfields: {
            Vibranadata: toCrmDate(date),
            Kilkistturistiv: travelersQty,
            Dodatkovidani: message || '',
        },
    };

    // ✅ Добавляем только для авторизованного агента
    if (crmUserId) {
        order.client = {
            userid: crmUserId,
        }
    }

    return [order]
}
