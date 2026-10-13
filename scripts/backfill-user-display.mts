import { createClient } from "@sanity/client";
import { getUserDisplayFields } from "../src/shared/lib/user-display.ts";
import { decryptPayload } from "./lib/user-crypto.mts";
import type { UserDocument } from "./lib/user-types.mts";

const APPLY_FLAGS = ["--apply", "--confirm-public-labels"];
const shouldApply = APPLY_FLAGS.every((flag) => process.argv.includes(flag));
if (process.argv.some((flag) => APPLY_FLAGS.includes(flag)) && !shouldApply) {
  throw new Error("Both --apply and --confirm-public-labels are required to write documents");
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

type BackfillDocument = Pick<
  UserDocument,
  "_id" | "_type" | "encryptedPayload" | "displayName" | "displayIdentity"
> & { _rev: string };

const documents = await client.fetch<BackfillDocument[]>(
  '*[_type in ["agentUser", "agencyUser"]] | order(_id asc){_id, _rev, _type, encryptedPayload, displayName, displayIdentity}',
);
const changes: Array<{
  id: string;
  revision: string;
  displayName: string;
  displayIdentity: string;
}> = [];
let invalid = 0;

for (const document of documents) {
  try {
    if (document._type !== "agentUser" && document._type !== "agencyUser") {
      invalid += 1;
      continue;
    }
    const payload = decryptPayload(document._id, document._type, document.encryptedPayload);
    const fields = getUserDisplayFields(document._type, payload);
    if (
      document.displayName !== fields.displayName ||
      document.displayIdentity !== fields.displayIdentity
    ) {
      changes.push({ id: document._id, revision: document._rev, ...fields });
    }
  } catch {
    invalid += 1;
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
  }),
);
if (invalid > 0) throw new Error("Backfill stopped: some user documents cannot be labeled");
if (!shouldApply) {
  console.log("Plan only. No documents were written.");
  process.exit(0);
}

let updated = 0;
for (const change of changes) {
  await client
    .patch(change.id)
    .ifRevisionId(change.revision)
    .set({ displayName: change.displayName, displayIdentity: change.displayIdentity })
    .commit();
  updated += 1;
}
console.log(JSON.stringify({ updated }));
