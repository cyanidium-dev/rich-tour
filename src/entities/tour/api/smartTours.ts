import "server-only";

import { sanityClient, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import type { TourShortInfo } from "../model/types";
import { allBasicSMARTToursQuery, hasBasicSMARTToursQuery } from "./queries";

export function getTodayInKyiv(date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function hasSmartTours(): Promise<boolean> {
  try {
    return await sanityClient.fetch<boolean>(
      hasBasicSMARTToursQuery,
      { today: getTodayInKyiv() },
      sanityFetchOptions(300, [SANITY_CACHE_TAGS.tours]),
    );
  } catch (error) {
    console.error("Failed to check SMART tour availability", error);
    return false;
  }
}

export function getSmartTours(): Promise<TourShortInfo[]> {
  return sanityClient.fetch<TourShortInfo[]>(
    allBasicSMARTToursQuery,
    { today: getTodayInKyiv() },
    sanityFetchOptions(300, [SANITY_CACHE_TAGS.tours]),
  );
}
