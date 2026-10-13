import { Suspense } from "react";

import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

import { sanityClient as client, sanityFetchOptions } from "@/shared/api/server";
import { allActiveTourCategoriesQuery, basicToursQuery } from "@/entities/tour/server";
import { TourShortInfo } from "@/entities/tour";
import { TourCategory } from "@/components/tours/TabMenu";

// export const revalidate = 60;

export default async function ToursPage() {
  const [tourCategories, tours] = await Promise.all([
    client
      .withConfig({ useCdn: false })
      .fetch<TourCategory[]>(allActiveTourCategoriesQuery, {}, { cache: "no-store" }),
    client.fetch<TourShortInfo[]>(
      basicToursQuery,
      { categoryId: null },
      sanityFetchOptions(300, ["tours"]),
    ),
  ]);

  return (
    <Suspense fallback={<Loader />}>
      <Tours categories={tourCategories} tours={tours} />
    </Suspense>
  );
}
