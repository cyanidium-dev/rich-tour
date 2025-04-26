import { createClient } from 'next-sanity'

const client = createClient({
    projectId: 'elggedkx', // замените на ваш ID
    dataset: 'production',
    apiVersion: '2025-04-26',
    useCdn: true,
})

export default client;
