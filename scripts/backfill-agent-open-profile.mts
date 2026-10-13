import { createClient } from "@sanity/client";
import { decryptPayload } from "./lib/user-crypto.mts";
import type { UserDocument } from "./lib/user-types.mts";

const APPLY_FLAGS = ["--apply", "--confirm-public-agent-profile"];
const shouldApply = APPLY_FLAGS.every((flag) => process.argv.includes(flag));
if (process.argv.some((flag) => APPLY_FLAGS.includes(flag)) && !shouldApply) {
  throw new Error(
    "Both --apply and --confirm-public-agent-profile are required to write documents",
  );
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_USERS_DATASET || "users-production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) {
  throw new Error("SANITY_PROJECT_ID and SANITY_API_TOKEN are required");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  token,
  useCdn: false,
  perspective: "raw" as const,
});

const fieldNames = [
  "email",
  "companyName",
  "legalCompanyName",
  "phone",
  "edrpou",
  "city",
  "site",
  "taxForm",
] as const;
type FieldName = (typeof fieldNames)[number];
type AgentDocument = UserDocument & { _rev: string };

const documents = await client.fetch<AgentDocument[]>('*[_type == "agentUser"] | order(_id asc)');
const changes: Array<{ id: string; revision: string; fields: Record<string, string> }> = [];
let invalid = 0;
let decryptFailures = 0;
let missingEmails = 0;

for (const document of documents) {
  try {
    const payload = decryptPayload(document._id, "agentUser", document.encryptedPayload);
    const fields: Record<string, string> = {};
    for (const name of fieldNames) {
      const value = payload[name];
      if (document[name as FieldName] === undefined && typeof value === "string") {
        fields[name] = value;
      }
    }
    if (!document.email && !fields.email) {
      invalid += 1;
      missingEmails += 1;
      continue;
    }
    if (Object.keys(fields).length) {
      changes.push({ id: document._id, revision: document._rev, fields });
    }
  } catch {
    invalid += 1;
    decryptFailures += 1;
  }
}

console.log(
  JSON.stringify({
    mode: shouldApply ? "apply" : "plan",
    dataset,
    documents: documents.length,
    toUpdate: changes.length,
    unchanged: documents.length - changes.length - invalid,
    invalid,
    decryptFailures,
    missingEmails,
  }),
);
if (invalid)
  throw new Error("Backfill stopped: some agent documents cannot be decrypted or labeled");
if (!shouldApply) {
  console.log("Plan only. No documents were written.");
  process.exit(0);
}

let updated = 0;
for (let index = 0; index < changes.length; index += 6) {
  const batch = changes.slice(index, index + 6);
  const results = await Promise.allSettled(
    batch.map((change) =>
      client.patch(change.id).ifRevisionId(change.revision).setIfMissing(change.fields).commit(),
    ),
  );
  updated += results.filter((result) => result.status === "fulfilled").length;
  if (results.some((result) => result.status === "rejected")) {
    throw new Error(
      "Backfill stopped: a document changed or Sanity rejected a write; rerun the plan",
    );
  }
}
console.log(JSON.stringify({ updated }));
