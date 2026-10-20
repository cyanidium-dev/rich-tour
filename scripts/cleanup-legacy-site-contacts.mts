import { createClient } from "@sanity/client";

const legacyFields = ["workSchedule", "address", "phones", "email", "facebook", "instagram"];
const currentFields = new Set([
  "eurMarkupUah",
  "usdMarkupUah",
  "agentContract",
  "touristContract",
  "telegram",
  "contacts",
]);

type SettingsDocument = {
  _id: string;
  _rev: string;
  contacts?: { address?: string; phone_1?: string; email?: string; working?: string };
  [key: string]: unknown;
};

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "elggedkx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const documents = await client.fetch<SettingsDocument[]>(
  '*[_id in ["siteSettings", "drafts.siteSettings"] && _type == "siteSettings"]',
);
if (!documents.some((document) => document._id === "siteSettings")) {
  throw new Error("Published siteSettings document was not found");
}

for (const document of documents) {
  const obsolete = legacyFields.filter((field) => Object.hasOwn(document, field));
  const unexpected = Object.keys(document).filter(
    (field) => !field.startsWith("_") && !currentFields.has(field) && !legacyFields.includes(field),
  );
  console.log(`${document._id}: legacy fields = ${obsolete.join(", ") || "none"}`);
  if (unexpected.length) {
    throw new Error(`Unexpected fields in ${document._id}: ${unexpected.join(", ")}`);
  }
  if (!obsolete.length) continue;
  if (
    !document.contacts?.address ||
    !document.contacts.phone_1 ||
    !document.contacts.email ||
    !document.contacts.working
  ) {
    throw new Error(`${document._id} has incomplete new contacts; refusing to remove old fields`);
  }
  if (process.argv.includes("--apply")) {
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error("SANITY_API_TOKEN is required to apply the cleanup");
    }
    await client.patch(document._id).ifRevisionId(document._rev).unset(obsolete).commit();
    console.log(`${document._id}: removed ${obsolete.length} legacy fields`);
  }
}

if (!process.argv.includes("--apply")) {
  console.log("Dry run. Pass --apply to remove the listed legacy fields.");
}
