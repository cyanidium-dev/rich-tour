import { SANITY_CACHE_TAGS } from "@/shared/api/server";

type PathToRevalidate = { path: string; type?: "page" };
export type Invalidation = { tag: string; paths: readonly PathToRevalidate[] };

const tourPaths: readonly PathToRevalidate[] = [
  { path: "/" },
  { path: "/tours" },
  { path: "/search" },
  { path: "/tours/[slug]", type: "page" },
];

const invalidationByType: Record<string, Invalidation> = {
  "tour-basic": { tag: SANITY_CACHE_TAGS.tours, paths: tourPaths },
  "tour-to-date": { tag: SANITY_CACHE_TAGS.tours, paths: tourPaths },
  "tour-category": {
    tag: SANITY_CACHE_TAGS.tourCategories,
    paths: [{ path: "/" }, { path: "/tours" }],
  },
  country: { tag: SANITY_CACHE_TAGS.countries, paths: [{ path: "/" }, { path: "/search" }] },
  faq: { tag: SANITY_CACHE_TAGS.faq, paths: [{ path: "/" }] },
  doc: { tag: SANITY_CACHE_TAGS.documents, paths: [{ path: "/about" }] },
  team: { tag: SANITY_CACHE_TAGS.team, paths: [{ path: "/about" }] },
  review: {
    tag: SANITY_CACHE_TAGS.reviews,
    paths: [{ path: "/" }, { path: "/about" }, { path: "/reviews" }],
  },
  siteSettings: {
    tag: SANITY_CACHE_TAGS.siteSettings,
    paths: [{ path: "/" }, { path: "/contacts" }, { path: "/agent" }],
  },
};

export function getInvalidationForType(documentType: string): Invalidation | undefined {
  return Object.hasOwn(invalidationByType, documentType)
    ? invalidationByType[documentType]
    : undefined;
}
