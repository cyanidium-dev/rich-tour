import "server-only";

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "elggedkx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  useCdn: process.env.NODE_ENV === "production",
});

export default client;
