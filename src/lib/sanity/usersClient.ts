import "server-only";

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || "elggedkx";
const dataset = process.env.SANITY_USERS_DATASET || "users-production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
    throw new Error("SANITY_API_TOKEN is required for user data access");
}

const usersClient = createClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
    token,
    useCdn: false,
});

export default usersClient;
