import axios from 'axios'

export async function postOrderToCrm(
    token: string,
    payload: any
) {
    const url = `${process.env.CRM_API_URL}order/set/`

    try {
        return await axios.post(url, payload, {
            headers: {
                token,
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('❌ CRM ORDER ERROR STATUS:', error.response?.status)
            console.error(
                '❌ CRM ORDER ERROR DATA:',
                JSON.stringify(error.response?.data, null, 2)
            )
            console.error(
                '❌ CRM ORDER REQUEST PAYLOAD:',
                JSON.stringify(payload, null, 2)
            )
        } else {
            console.error('❌ CRM ORDER UNKNOWN ERROR:', error)
        }

        throw error
    }
}
