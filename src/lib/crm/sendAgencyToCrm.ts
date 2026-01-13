import axios from 'axios'

interface SendAgencyToCrmParams {
    token: string

    externalId: string // _id из Sanity

    legalAgencyName: string
    marketingAgencyName?: string

    phone: string
    email: string

    login: string
    edrpou: string
    city: string
    legalAddress: string
    mainOfficeEmail: string
}

export async function sendAgencyToCrm({
                                          token,
                                          externalId,

                                          legalAgencyName,
                                          marketingAgencyName,

                                          phone,
                                          email,

                                          login,
                                          edrpou,
                                          city,
                                          legalAddress,
                                          mainOfficeEmail,
                                      }: SendAgencyToCrmParams) {
    const payload = [
        {
            typesex: 'company',

            companyname: legalAgencyName,

            externalid: externalId,
            findbyArray: ['externalid'],

            phones: [phone],
            addnewphone: true,

            emails: [email],
            addnewemail: true,

            returnwithoutupdate: false,

            customfields: {
                Marketingovanazvaagentsi: marketingAgencyName,
                Loginsait: login,
                DRPOUagentsi: edrpou,
                Mistorestratsi: city,
                adresarestratsi: legalAddress,
                Emailgolovnogoofisu: mainOfficeEmail,
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

