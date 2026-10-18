import { createClient } from "@sanity/client";
import {
  canRemoveLegacyGallery,
  planTourImageMigration,
  type TourImageDocument,
} from "./lib/tour-image-migration.mts";

// Run with node --env-file=.env.local. --apply copies images from legacy gallery.
// Run --cleanup to audit, then --cleanup --apply --confirm-remove-legacy-gallery
// to remove legacy gallery from published documents and drafts.

const apply = process.argv.includes("--apply");
const cleanup = process.argv.includes("--cleanup");
if (apply && !process.env.SANITY_API_TOKEN) {
  throw new Error("SANITY_API_TOKEN is required to apply changes");
}
if (apply && cleanup && !process.argv.includes("--confirm-remove-legacy-gallery")) {
  throw new Error("Legacy cleanup requires --confirm-remove-legacy-gallery");
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "elggedkx",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const documents = await client.fetch<TourImageDocument[]>(
  `*[_type == "tour-to-date"]{
    _id, _rev, gallery,
    heroMainImage, heroLeftImage, heroRightImage, benefitsImage,
    costShortImage, costTallImage
  }`,
);

const byLength = new Map<string, number>();
for (const document of documents) {
  const category = String(document.gallery?.filter((image) => image.asset?._ref).length ?? 0);
  byLength.set(category, (byLength.get(category) ?? 0) + 1);
}
console.log(
  JSON.stringify({
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    mode: cleanup ? "cleanup" : "migrate",
    documents: documents.length,
    published: documents.filter(({ _id }) => !_id.startsWith("drafts.")).length,
    drafts: documents.filter(({ _id }) => _id.startsWith("drafts.")).length,
    galleryLengths: Object.fromEntries(byLength),
  }),
);

let changed = 0;
let skipped = 0;
if (apply && cleanup) {
  const unsafe = documents.filter(
    (document) => document.gallery && !canRemoveLegacyGallery(document),
  );
  if (unsafe.length) {
    throw new Error(`Legacy cleanup stopped: ${unsafe.length} documents have unmapped images`);
  }
}
for (const document of documents) {
  if (cleanup) {
    if (!document.gallery) continue;
    if (!canRemoveLegacyGallery(document)) {
      skipped += 1;
      console.log(`SKIP ${document._id}: some legacy images are not in their new fields`);
      continue;
    }
    changed += 1;
    if (apply) {
      await client.patch(document._id).ifRevisionId(document._rev).unset(["gallery"]).commit();
    }
    continue;
  }

  const fields = planTourImageMigration(document);
  if (!Object.keys(fields).length) continue;
  changed += 1;
  console.log(`${document._id}: ${Object.keys(fields).join(", ")}`);
  if (apply) {
    await client.patch(document._id).ifRevisionId(document._rev).set(fields).commit();
  }
}

console.log(`${apply ? "Updated" : "Would update"}: ${changed}; skipped: ${skipped}`);
if (!apply) console.log("Dry run only. Pass --apply to write changes.");
