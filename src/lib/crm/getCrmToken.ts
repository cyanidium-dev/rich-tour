import axios from 'axios'

export async function getCrmToken(): Promise<string> {
    const url = `${process.env.CRM_API_URL}token/get/`

    const { data } = await axios.post(
        url,
        {
            login: process.env.CRM_LOGIN,
            restapipassword: process.env.CRM_REST_API_PASSWORD,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    const token = data?.dataArray?.token

    if (!token) {
        throw new Error('CRM token not received')
    }

    return token
}
