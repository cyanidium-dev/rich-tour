import { getCrmToken } from './getCrmToken'
import { postToCrm } from './postToCrm'
import {TravelerInfo} from "@/components/shared/forms/BookingForm";
import { mapTravelerToCrmPayload } from './mapTravelerToCrmPayload'

export async function sendTravelersToCrm(
    travelers: TravelerInfo[]
): Promise<string[]> {
    const token = await getCrmToken()

    const payload = travelers.map(mapTravelerToCrmPayload)

    const { data } = await postToCrm(token, payload)

    const crmIds: string[] | undefined = data?.dataArray

    if (!crmIds || crmIds.length !== travelers.length) {
        throw new Error('CRM did not return correct travelers crmIds')
    }

    return crmIds.map(String)
}
