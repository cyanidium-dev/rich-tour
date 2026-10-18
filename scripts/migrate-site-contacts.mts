import { createClient } from "@sanity/client";

const fields = [
  "address",
  "map",
  "phone_1",
  "phone_2",
  "phone_3",
  "email",
  "working",
  "weekend",
  "instagram",
  "facebook",
] as const;

type ContactField = (typeof fields)[number];
type ContactDocument = { _id: string; [field: string]: unknown };
type SettingsDocument = { _id: string; _rev: string; contacts?: Record<string, unknown> };

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "elggedkx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const contacts = await client.fetch<ContactDocument[]>(
  '*[_type == "contact" && !(_id in path("drafts.**"))]',
);
const settings = await client.fetch<SettingsDocument | null>(
  '*[_id == "siteSettings" && _type == "siteSettings"][0]',
);
const draftSettings = await client.fetch<SettingsDocument | null>(
  '*[_id == "drafts.siteSettings" && _type == "siteSettings"][0]',
);

if (contacts.length !== 1) {
  throw new Error(`Expected one published contact document, found ${contacts.length}`);
}
if (!settings) {
  throw new Error("Published siteSettings document was not found");
}
if (draftSettings) {
  throw new Error("A siteSettings draft exists; review it before migrating published contacts");
}

const source = contacts[0];
const copied = Object.fromEntries(
  fields
    .filter((field: ContactField) => source[field] !== undefined)
    .map((field) => [field, source[field]]),
);
console.log(`Source: ${source._id}; copying ${Object.keys(copied).length} contact fields`);
console.log(
  `Missing optional fields: ${fields.filter((field) => !(field in copied)).join(", ") || "none"}`,
);
if (settings.contacts) {
  const mismatched = fields.filter((field) => settings.contacts?.[field] !== copied[field]);
  if (mismatched.length) {
    throw new Error(
      `siteSettings.contacts already exists with different fields: ${mismatched.join(", ")}`,
    );
  }
  if (settings.contacts._type && settings.contacts._type !== "contacts") {
    throw new Error("siteSettings.contacts has an unexpected _type");
  }
  if (!settings.contacts._type) {
    if (process.argv.includes("--apply")) {
      if (!process.env.SANITY_API_TOKEN) {
        throw new Error("SANITY_API_TOKEN is required to apply the migration");
      }
      await client
        .patch(settings._id)
        .ifRevisionId(settings._rev)
        .set({ contacts: { ...settings.contacts, _type: "contacts" } })
        .commit();
      console.log("Added the contacts object type");
    } else {
      console.log("The contacts object needs _type: contacts; pass --apply to add it");
    }
    process.exit(0);
  }
  console.log("Verified: siteSettings.contacts matches the source document");
  process.exit(0);
}

if (process.argv.includes("--apply")) {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is required to apply the migration");
  }
  await client
    .patch(settings._id)
    .ifRevisionId(settings._rev)
    .set({ contacts: { _type: "contacts", ...copied } })
    .commit();
  console.log("Contacts copied to siteSettings.contacts");
} else {
  console.log("Dry run. Pass --apply to copy the fields.");
}
