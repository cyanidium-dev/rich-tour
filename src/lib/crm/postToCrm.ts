import axios from 'axios'

export async function postToCrm(
    token: string,
    payload: any
) {
    const url = `${process.env.CRM_API_URL}contact/set/`

    return axios.post(url, payload, {
        headers: {
            token: token,
            'Content-Type': 'application/json',
        },
    })
}
