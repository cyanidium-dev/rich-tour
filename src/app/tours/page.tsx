import { Suspense } from "react";

import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

import { sanityClient as client, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import { allActiveTourCategoriesQuery, basicToursQuery } from "@/entities/tour/server";
import { TourShortInfo } from "@/entities/tour";
import { TourCategory } from "@/components/tours/TabMenu";

export default async function ToursPage() {
  const [tourCategories, tours] = await Promise.all([
    client.fetch<TourCategory[]>(
      allActiveTourCategoriesQuery,
      {},
      sanityFetchOptions(300, [SANITY_CACHE_TAGS.tourCategories]),
    ),
    client.fetch<TourShortInfo[]>(
      basicToursQuery,
      { categoryId: null },
      sanityFetchOptions(300, [SANITY_CACHE_TAGS.tours]),
    ),
  ]);

  return (
    <Suspense fallback={<Loader />}>
      <Tours categories={tourCategories} tours={tours} />
    </Suspense>
  );
}
