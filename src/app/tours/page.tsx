import { Suspense } from "react";

import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

import client from "@/lib/sanity/client";
import {allActiveTourCategoriesQuery, basicToursQuery} from "@/lib/sanity/queries";
import {TourShortInfo} from "@/types/tour";
import {TourCategory} from "@/components/tours/TabMenu";

// export const revalidate = 60;

export default async function ToursPage() {
    const [tourCategories, tours] = await Promise.all([
      client.fetch<TourCategory[]>(allActiveTourCategoriesQuery, {}, {next: {revalidate: 300, tags: ["tour-categories"]}}),
      client.fetch<TourShortInfo[]>(basicToursQuery, {categoryId: null}, {next: {revalidate: 300, tags: ["tours"]}}),
    ]);

  return (
    <Suspense fallback={<Loader />}>
      <Tours categories={tourCategories} tours={tours} />
    </Suspense>
  );
}
