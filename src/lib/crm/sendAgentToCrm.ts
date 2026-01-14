import { postToCrm } from './postToCrm'

interface SendAgentToCrmParams {
    token: string

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
                                         token,
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

    // ✅ добавляем companys ТОЛЬКО если есть agencyCrmId
    if (agencyCrmId) {
        payloadItem.companys = [agencyCrmId]
    }

    const { data } = await postToCrm(token, [payloadItem])

    const crmId = data?.dataArray?.[0]
    if (!crmId) {
        throw new Error('CRM did not return agent crmId')
    }

    return String(crmId)
}
