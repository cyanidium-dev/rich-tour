import { createClient } from "next-sanity";

const client = createClient({
    projectId: "elggedkx",
    dataset: "production",
    apiVersion: "2025-04-26",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

export default client;
