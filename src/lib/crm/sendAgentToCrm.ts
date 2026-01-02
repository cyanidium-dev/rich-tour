import axios from "axios";

interface SendAgentToCrmParams {
    token: string;

    externalId: string;        // _id из Sanity (контакт)
    agencyCrmId: string;       // код агенции в CRM

    firstName: string;
    lastName: string;
    middleName?: string;

    phone: string;
    email: string;

    website?: string;
    license?: string;
    country?: string;
    city?: string;

    password: string; // ⚠️ только если CRM требует
}

export async function sendAgentToCrm({
                                         token,
                                         externalId,
                                         agencyCrmId,
                                         firstName,
                                         lastName,
                                         middleName,
                                         phone,
                                         email,
                                         website,
                                         license,
                                         country,
                                         city,
                                         password,
                                     }: SendAgentToCrmParams) {
    const payload = [
        {
            typesex: "person",

            name: firstName,
            namelast: lastName,
            namemiddle: middleName,

            companys: [agencyCrmId],

            externalid: externalId,
            findbyArray: ["externalid"],

            phones: [phone],
            addnewphone: true,

            emails: [email],
            addnewemail: true,

            returnwithoutupdate: false,

            customfields: {
                Vebsait: website,
                Litsenziya: license,
                Krana: country,
                Misto: city,
                Parolsait: password, // ❗ см. комментарий ниже
            },
        },
    ];

    await axios.post(process.env.CRM_ORDER_SET_URL!, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}
