import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

type DateRange = { startDate: string; endDate: string };
type BackupItem = {
  id: string;
  title: string;
  temporaryTitle: string;
  originalDateRange: DateRange;
  temporaryDateRange: DateRange;
};

const backup = JSON.parse(
  readFileSync(new URL("./data/tours-infinite-scroll-date-backup.json", import.meta.url), "utf8"),
) as { projectId: string; dataset: string; items: BackupItem[] };

if (
  backup.projectId !== process.env.SANITY_PROJECT_ID ||
  backup.dataset !== process.env.SANITY_DATASET
) {
  throw new Error("Sanity target does not match the date backup");
}
if (!process.env.SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN is required");

const client = createClient({
  projectId: backup.projectId,
  dataset: backup.dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2025-04-26",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const current = await Promise.all(backup.items.map((item) => client.getDocument(item.id)));
const pending = backup.items.filter((item, index) => {
  const document = current[index];
  if (!document) throw new Error(`Missing tour departure: ${item.id}`);

  const dates = document.dateRange as DateRange | undefined;
  const sameDates = (expected: DateRange) =>
    dates?.startDate === expected.startDate && dates?.endDate === expected.endDate;

  if (document.title === item.title && sameDates(item.originalDateRange)) return false;
  if (document.title === item.temporaryTitle && sameDates(item.temporaryDateRange)) return true;
  throw new Error(`Tour departure changed since backup: ${item.id}`);
});

console.log(`${pending.length} tour departures require restoration`);
if (!process.argv.includes("--apply")) {
  console.log("Dry run only. Pass --apply to restore the original dates and titles.");
} else {
  for (const item of pending) {
    const document = current[backup.items.indexOf(item)]!;
    await client
      .patch(item.id)
      .ifRevisionId(document._rev)
      .set({
        title: item.title,
        "dateRange.startDate": item.originalDateRange.startDate,
        "dateRange.endDate": item.originalDateRange.endDate,
      })
      .commit();
    console.log(`Restored ${item.id}`);
  }
}
