import axios from 'axios';

const crmInstance = axios.create({
    baseURL: process.env.CRM_API_URL
});

export default crmInstance;
