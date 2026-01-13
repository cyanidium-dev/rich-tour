import axios from 'axios'

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
            typesex: 'man',

            name: fullName,

            companys: [agencyCrmId],

            externalid: externalId,
            findbyArray: ['externalid'],

            phones: [phone],
            addnewphone: true,

            emails: [email],
            addnewemail: true,

            returnwithoutupdate: false,

            customfields: {
                Vebsait: website,
                Litsenziya: license,
                Misto: city,
                taxForm: taxForm,
                legalCompanyName: legalCompanyName,
            },
        },
    ]

    await axios.post(process.env.CRM_ORDER_SET_URL!, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
}
