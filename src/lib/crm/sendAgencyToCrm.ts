import { postToCrm } from './postToCrm'

interface SendAgencyToCrmParams {
    token: string

    externalId: string

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
            externalid: externalId,
            typesex: 'company',
            companyname: legalAgencyName,

            findbyArray: ['externalid'],

            emails: [email],
            phones: [phone],

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

    await postToCrm(token, payload)
}
