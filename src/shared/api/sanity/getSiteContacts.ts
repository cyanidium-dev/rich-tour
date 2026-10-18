import "server-only";

import { siteContactsQuery } from "@/lib/sanity/queries";
import type { SiteContacts } from "@/shared/config";
import client from "./client";
import { sanityFetchOptions } from "./cacheOptions";
import { SANITY_CACHE_TAGS } from "./cacheTags";

export function getSiteContacts() {
  return client.fetch<SiteContacts | null>(
    siteContactsQuery,
    {},
    sanityFetchOptions(300, [SANITY_CACHE_TAGS.siteSettings]),
  );
}
