import { postToCrm } from '../utils/postToCrm'

interface SendAgentToCrmParams {
    externalId: string
    fullName: string

    agencyCrmId?: number

    phone: string
    email: string

    website?: string
    license?: string
    city?: string
    taxForm?: string
    legalCompanyName?: string
}

export async function sendAgentToCrm({
                                         externalId,
                                         fullName,
                                         agencyCrmId,
                                         phone,
                                         email,
                                         website,
                                         license,
                                         city,
                                         taxForm,
                                         legalCompanyName,
                                     }: SendAgentToCrmParams): Promise<string> {
    const payloadItem: any = {
        externalid: externalId,
        typesex: 'man',
        name: fullName,

        findbyArray: ['externalid'],

        emails: [email],
        phones: [phone],

        customfields: {
            Vebsait: website,
            Litsenziya: license,
            Misto: city,
            taxForm,
            legalCompanyName,
        },
    }

    if (agencyCrmId) {
        payloadItem.companys = [agencyCrmId]
    }

    const  data = await postToCrm([payloadItem], "contact/set/")

    const crmId = data?.dataArray?.[0];
    if (!crmId) {
        throw new Error('CRM did not return agent crmId')
    }

    return String(crmId)
}
