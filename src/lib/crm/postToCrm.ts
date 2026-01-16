import axios from 'axios'

export async function postToCrm(
    token: string,
    payload: any
) {
    const url = `${process.env.CRM_API_URL}contact/set/`

    try {
        return await axios.post(url, payload, {
            headers: {
                token,
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('❌ CRM ERROR STATUS:', error.response?.status)
            console.error('❌ CRM ERROR DATA:', error.response?.data)
            console.error('❌ CRM ERROR HEADERS:', error.response?.headers)
            console.error('❌ CRM REQUEST PAYLOAD:', JSON.stringify(payload, null, 2))
        } else {
            console.error('❌ UNKNOWN ERROR:', error)
        }

        throw error
    }
}
