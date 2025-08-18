import { Suspense } from "react";
import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

import client from "@/lib/sanity";
import {allActiveTourCategoriesQuery} from "@/lib/queries";

export default async function ToursPage() {
    const tourCategories = await client.fetch(allActiveTourCategoriesQuery);
  return (
    <Suspense fallback={<Loader />}>
      <Tours categories={tourCategories} />
    </Suspense>
  );
}
