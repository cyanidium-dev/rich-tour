import "server-only";

export function sanityFetchOptions(revalidate: number, tags: string[]) {
  return process.env.NODE_ENV === "development"
    ? { cache: "no-store" as const }
    : { next: { revalidate, tags } };
}
