import crmInstance from "@/lib/crm/utils/crmInstance";

export async function getCrmToken(): Promise<string> {

    const { data } = await crmInstance.post(
        "token/get/",
        {
            login: process.env.CRM_LOGIN,
            restapipassword: process.env.CRM_REST_API_PASSWORD,
        },
    )
    // console.log(data)
    const token = data?.dataArray?.token

    if (!token) {
        throw new Error('CRM token not received')
    }
    // console.log({token})
    return token
}
