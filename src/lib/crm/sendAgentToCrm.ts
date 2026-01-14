import { postToCrm } from './postToCrm'

interface SendAgentToCrmParams {
    token: string

    externalId: string

    fullName: string
    agencyCrmId: number

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
                                     }: SendAgentToCrmParams) {
    const payload = [
        {
            externalid: externalId,
            typesex: 'man',
            name: fullName,

            companys: [agencyCrmId],

            emails: [email],
            phones: [phone],

            customfields: {
                Vebsait: website,
                Litsenziya: license,
                Misto: city,
                taxForm: taxForm,
                legalCompanyName: legalCompanyName,
            },
        },
    ]

    await postToCrm(token, payload)
}
