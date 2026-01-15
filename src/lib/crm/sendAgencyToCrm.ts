import { postToCrm } from './postToCrm'
import { getCrmToken } from './getCrmToken'

interface SendAgencyToCrmParams {
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
                                      }: SendAgencyToCrmParams): Promise<string> {
    const token = await getCrmToken()

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

    const { data } = await postToCrm(token, payload)

    const crmId = data?.dataArray?.[0]

    if (!crmId) {
        throw new Error('CRM did not return agency crmId')
    }

    return String(crmId);
}
