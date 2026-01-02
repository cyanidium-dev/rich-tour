import axios from "axios";

export async function getCrmToken(): Promise<string> {
    const { data } = await axios.post(
        process.env.CRM_TOKEN_URL!,
        {
            login: process.env.CRM_LOGIN,
            restapipassword: process.env.CRM_REST_API_PASSWORD,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!data?.token) {
        throw new Error("CRM token not received");
    }

    return data.token;
}
